// Shared helpers for public enquiry forms (Contact Us, Request a Quote) that are stored in Google Sheets
import { sanitizeString } from './validator';

export const MAX_BODY_BYTES = 8 * 1024;
export const MIN_FILL_MS = 1500; // humans (even with autofill) take longer than this to fill in a form
export const SAVE_FAILED = 'We could not save your enquiry right now. Please try again shortly or call us directly.';

/** Strip tags and control characters, collapse whitespace. */
export function cleanText(input: unknown, maxLength: number): string {
  return sanitizeString(input)
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/** Like cleanText but keeps line breaks (for free-text fields). */
export function cleanMultiline(input: unknown, maxLength: number): string {
  return sanitizeString(input)
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLength);
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Reads a size-limited JSON object body. Returns an error status/message instead of throwing. */
export async function readJsonBody(request: Request): Promise<{ body: any } | { error: string; status: number }> {
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY_BYTES) {
    return { error: 'Request is too large.', status: 413 };
  }
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return { error: 'Request is too large.', status: 413 };
    const body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'Invalid request body.', status: 400 };
    return { body };
  } catch {
    return { error: 'Invalid request body.', status: 400 };
  }
}

/** Bots fill the hidden honeypot field or submit instantly. */
export function looksLikeBot(body: any): boolean {
  const elapsedMs = Number(body.elapsedMs);
  return (typeof body.website === 'string' && body.website.trim() !== '') || (Number.isFinite(elapsedMs) && elapsedMs < MIN_FILL_MS);
}

/**
 * Country code + national number. Returns an error message, or the cleaned values.
 * Older clients sent one "+91 9876543210" string, which is split here.
 */
export function parsePhone(body: any): { error: string } | { countryCode: string; phone: string } {
  let countryCode = cleanText(body.countryCode, 6);
  let phoneRaw = cleanText(body.phone, 25);
  if (!countryCode) {
    const split = /^(\+\d{1,3})[\s-]*(.+)$/.exec(phoneRaw);
    if (split) {
      countryCode = split[1];
      phoneRaw = split[2];
    }
  }
  const phone = phoneRaw.replace(/\D/g, '');
  if (!/^\+\d{1,4}$/.test(countryCode)) return { error: 'Please select a valid country code.' };
  if (!/^[0-9\s().-]{7,25}$/.test(phoneRaw) || phone.length < 7 || countryCode.length - 1 + phone.length > 15) {
    return { error: 'Please enter a valid phone number.' };
  }
  if (countryCode === '+91' && !/^[6-9]\d{9}$/.test(phone)) return { error: 'Please enter a valid 10-digit mobile number.' };
  return { countryCode, phone };
}

export function isPlausibleName(name: string): boolean {
  return name.length >= 2 && /\p{L}/u.test(name) && !/https?:\/\/|www\./i.test(name);
}

// Enquiries saved to the sheet recently by this Worker instance (id -> expiry). The Apps Script does not
// de-duplicate, so a double-click or retry within the window is answered with success without a second row.
const RECENT_WINDOW_MS = 10 * 60 * 1000;
const recentlySaved = new Map<string, number>();
export function wasRecentlySaved(id: string): boolean {
  const now = Date.now();
  for (const [key, expires] of recentlySaved) if (expires < now) recentlySaved.delete(key);
  return recentlySaved.has(id);
}
export function markSaved(id: string): void {
  recentlySaved.set(id, Date.now() + RECENT_WINDOW_MS);
}
