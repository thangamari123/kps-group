// Webinar Registration Route Handler (Public submit only)
//
// Registrations are written to Firestore (collection: webinar_registrations) through the REST API,
// the same way public job applications are. Reading, updating and exporting registrations is done
// by authorized admins directly against Firestore, which the security rules restrict to active admins.
import type { Env } from '../types';
import { checkRateLimit } from '../auth/middleware';
import { errorResponse, successResponse, parseAllowedOrigins } from '../utils/response';
import { isValidEmail, isValidPhone, sanitizeString } from '../utils/validator';
import { createFirestoreDoc, getFirestoreDoc } from '../utils/firestore';

const MAX_BODY_BYTES = 4 * 1024;
const MIN_FILL_MS = 1000; // humans (even with autofill) take longer than this to open and submit the form
const ID_PATTERN = /^[A-Za-z0-9_-]{1,100}$/;

/** Strip tags and control characters, collapse whitespace. */
function cleanText(input: unknown, maxLength: number): string {
  return sanitizeString(input)
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Public: Register for a webinar announced in the announcement bar.
 *
 * - Rate limited per IP, with a honeypot field and a minimum fill time as basic spam protection.
 * - The webinar is looked up from the (active, public) announcement; its name is never taken from the client.
 * - The document id is derived from announcement + email, so a repeat registration is rejected by
 *   Firestore itself (create fails with 409) instead of relying on a racy read-then-write check.
 */
export async function handleSubmitWebinarRegistration(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const projectId = env.FIREBASE_PROJECT_ID || 'kps-website-hr-panel';

  if (!checkRateLimit(request, 5, 600)) {
    return errorResponse('Too many registration attempts. Please wait a few minutes and try again.', 429, request, allowedOrigins);
  }

  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return errorResponse('Request is too large.', 413, request, allowedOrigins);
  }

  let body: any;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return errorResponse('Request is too large.', 413, request, allowedOrigins);
    }
    body = JSON.parse(raw);
  } catch {
    return errorResponse('Invalid request body.', 400, request, allowedOrigins);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return errorResponse('Invalid request body.', 400, request, allowedOrigins);
  }

  // Spam protection: bots fill the hidden field or submit instantly. Pretend it worked so they don't adapt.
  const elapsedMs = Number(body.elapsedMs);
  if ((typeof body.website === 'string' && body.website.trim() !== '') || (Number.isFinite(elapsedMs) && elapsedMs < MIN_FILL_MS)) {
    return successResponse({ id: 'ok', message: 'Thank you for registering.' }, 201, request, allowedOrigins);
  }

  const fullName = cleanText(body.fullName, 100);
  const email = cleanText(body.email, 254).toLowerCase();
  const phoneRaw = cleanText(body.phone, 25);
  const announcementId = typeof body.announcementId === 'string' ? body.announcementId.trim() : '';

  if (fullName.length < 2 || !/\p{L}/u.test(fullName) || /https?:\/\/|www\./i.test(fullName)) {
    return errorResponse('Please enter your full name.', 400, request, allowedOrigins);
  }
  if (!isValidEmail(email)) {
    return errorResponse('Please enter a valid email address.', 400, request, allowedOrigins);
  }
  if (!/^\+?[0-9\s().-]{7,25}$/.test(phoneRaw) || !isValidPhone(phoneRaw)) {
    return errorResponse('Please enter a valid contact number (10 to 15 digits).', 400, request, allowedOrigins);
  }
  if (!ID_PATTERN.test(announcementId)) {
    return errorResponse('This webinar registration is not available.', 400, request, allowedOrigins);
  }
  const phone = (phoneRaw.startsWith('+') ? '+' : '') + phoneRaw.replace(/\D/g, '');

  try {
    // Public Firestore rules only expose active announcements, so inactive ones come back as null.
    const announcement = await getFirestoreDoc(projectId, 'announcements', announcementId);
    if (!announcement || announcement.status !== 'active' || announcement.ctaAction !== 'register') {
      return errorResponse('Registration for this webinar is closed or no longer available.', 404, request, allowedOrigins);
    }
    const webinarName = cleanText(announcement.webinarTitle || announcement.text, 200);
    if (!webinarName) {
      return errorResponse('Registration for this webinar is closed or no longer available.', 404, request, allowedOrigins);
    }

    const id = `wr_${announcementId}_${(await sha256Hex(email)).slice(0, 32)}`;
    const now = new Date();

    try {
      await createFirestoreDoc(projectId, 'webinar_registrations', id, {
        fullName,
        email,
        phone,
        webinarName,
        announcementId,
        source: 'announcement-bar',
        status: 'New',
        createdAt: now,
        updatedAt: now,
      });
    } catch (writeErr: any) {
      const message = String(writeErr?.message || '');
      if (message.includes('(409)')) {
        return errorResponse('You have already registered for this webinar with this email address.', 409, request, allowedOrigins);
      }
      throw writeErr;
    }

    return successResponse(
      {
        id,
        webinarName,
        message: 'Thank you for registering. We will contact you with the webinar details.',
      },
      201,
      request,
      allowedOrigins
    );
  } catch (err: any) {
    // Never echo upstream error text (it can include document paths); log it for the operator instead.
    console.error('Webinar registration failed:', err?.message || err);
    return errorResponse('We could not complete your registration right now. Please try again shortly.', 500, request, allowedOrigins);
  }
}
