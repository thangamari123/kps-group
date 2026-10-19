// Quote Requests Route Handlers (Public Submission & Admin Management)
import type { Env, QuoteRequestRecord } from '../types';
import { requireAuth, checkRateLimit } from '../auth/middleware';
import { errorResponse, successResponse, parseAllowedOrigins } from '../utils/response';
import { isValidEmail } from '../utils/validator';
import { isAppsScriptConfigured, saveQuoteToSheet } from '../utils/appsScript';
import {
  SAVE_FAILED,
  cleanText,
  cleanMultiline,
  isPlausibleName,
  looksLikeBot,
  markSaved,
  parsePhone,
  readJsonBody,
  sha256Hex,
  wasRecentlySaved,
} from '../utils/enquiry';

// Options of the "Service Required" dropdown in the Request a Quote popup.
const QUOTE_SERVICES = new Set([
  'Containerized Cargo (FCL / LCL)',
  'Multimodal Freight Forwarding',
  'Customs Brokerage',
  'Project Cargo & Heavy Lift',
  'Over Dimensional Cargo (ODC)',
  'FTWZ Solutions',
  'Industrial Warehousing',
  'First & Last Mile Transportation',
]);

/**
 * Public: Submit a Quote Request
 *
 * Same safeguards as the Contact Us form (validation, per-IP rate limit, honeypot, content-hash submission id so a
 * repeat is not stored twice). With the Apps Script configured the quote is saved as an enquiry of type
 * "Quote Request" and success is returned only when the script echoes the type and submission id back.
 * Without it, the legacy D1 table is used if bound.
 */
export async function handleSubmitQuote(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const fail = (message: string, status: number) => errorResponse(message, status, request, allowedOrigins);

  if (!checkRateLimit(request, 5, 600)) {
    return fail('Too many quote requests. Please wait a few minutes and try again.', 429);
  }

  const parsed = await readJsonBody(request);
  if ('error' in parsed) return fail(parsed.error, parsed.status);
  const body = parsed.body;

  const thanks = 'Your quote request has been received. Our logistics specialist will connect with you shortly.';

  // Pretend it worked so bots don't adapt.
  if (looksLikeBot(body)) return successResponse({ id: 'ok', message: thanks }, 201, request, allowedOrigins);

  const name = cleanText(body.name, 100);
  const email = cleanText(body.email, 254).toLowerCase();
  const company = cleanText(body.company, 150);
  const service = cleanText(body.service, 80);
  const origin = cleanText(body.origin, 150);
  const destination = cleanText(body.destination, 150);
  const cargoWeight = cleanText(body.cargoWeight ?? body.cargo_weight, 80);
  const cargoDetails = cleanMultiline(body.cargoDetails ?? body.cargo_details, 1000);
  const phoneParts = parsePhone(body);

  if (!isPlausibleName(name)) return fail('Please enter your full name.', 400);
  if (!isValidEmail(email)) return fail('Please enter a valid email address.', 400);
  if ('error' in phoneParts) return fail(phoneParts.error, 400);
  const { countryCode, phone } = phoneParts;
  if (!QUOTE_SERVICES.has(service)) return fail('Please select a service.', 400);
  if (origin.length < 2) return fail('Please enter the origin location.', 400);
  if (destination.length < 2) return fail('Please enter the destination location.', 400);
  if (origin.toLowerCase() === destination.toLowerCase()) {
    return fail('Destination cannot be identical to the origin location.', 400);
  }

  const fingerprint = [
    'quote',
    email,
    countryCode + phone,
    service,
    origin.toLowerCase(),
    destination.toLowerCase(),
    cargoWeight.toLowerCase(),
    cargoDetails.toLowerCase().replace(/\s+/g, ' '),
  ].join('|');
  const id = `QTE-${(await sha256Hex(fingerprint)).slice(0, 20).toUpperCase()}`;
  const nowIso = new Date().toISOString();
  const useSheet = isAppsScriptConfigured(env);

  try {
    if (useSheet) {
      if (!wasRecentlySaved(id)) {
        const saved = await saveQuoteToSheet(env, {
          enquiryType: 'Quote Request',
          submissionId: id,
          timestamp: nowIso,
          status: 'New',
          name,
          email,
          countryCode,
          phone,
          company,
          service,
          cargoWeight,
          origin,
          destination,
          cargoDetails,
        });
        if (!saved.ok) return fail(SAVE_FAILED, 502);
        markSaved(id);
      }
    } else if (!env.DB) {
      console.error('Quote form: neither APPS_SCRIPT_URL nor a D1 binding is configured.');
      return fail(SAVE_FAILED, 503);
    }

    // Legacy admin-panel table: best effort once the sheet has confirmed the row; the only store without a sheet.
    if (env.DB) {
      try {
        await env.DB.prepare(
          `INSERT OR IGNORE INTO quote_requests (id, name, company, email, phone, service, origin, destination, cargo_weight, cargo_details, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', ?, ?)`
        ).bind(
          id, name, company || null, email, `${countryCode} ${phone}`, service, origin, destination,
          cargoWeight || null, cargoDetails || null, nowIso, nowIso
        ).run();
      } catch (dbErr: any) {
        if (!useSheet) throw dbErr;
        console.error('Quote saved to sheet but D1 mirror failed:', dbErr?.message || dbErr);
      }
    }

    return successResponse({ id, message: thanks }, 201, request, allowedOrigins);
  } catch (err: any) {
    console.error('Quote submission failed:', err?.message || err);
    return fail(SAVE_FAILED, 500);
  }
}

/**
 * Admin: List Quote Requests with search & filters
 */
export async function handleGetAdminQuotes(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.trim() || '';
    const status = url.searchParams.get('status')?.trim() || '';
    const service = url.searchParams.get('service')?.trim() || '';

    let query = `SELECT * FROM quote_requests WHERE 1=1`;
    const params: any[] = [];

    if (search) {
      query += ` AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ? OR origin LIKE ? OR destination LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s, s, s);
    }

    if (status && status !== 'all') {
      query += ` AND status = ?`;
      params.push(status);
    }

    if (service && service !== 'all') {
      query += ` AND service = ?`;
      params.push(service);
    }

    query += ` ORDER BY created_at DESC`;

    const stmt = env.DB.prepare(query);
    const boundStmt = params.length > 0 ? stmt.bind(...params) : stmt;
    const { results } = await boundStmt.all();

    return successResponse(results || [], 200, request, allowedOrigins);
  } catch (err: any) {
    return errorResponse('Failed to fetch quote requests: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

/**
 * Admin: Get single Quote Request details
 */
export async function handleGetAdminQuoteById(request: Request, env: Env, id: string): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    const quote = await env.DB.prepare('SELECT * FROM quote_requests WHERE id = ?').bind(id).first<QuoteRequestRecord>();
    if (!quote) {
      return errorResponse('Quote request not found', 404, request, allowedOrigins);
    }

    return successResponse(quote, 200, request, allowedOrigins);
  } catch (err: any) {
    return errorResponse('Failed to fetch quote details: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

/**
 * Admin: Update Quote Request status
 */
export async function handleUpdateQuote(request: Request, env: Env, id: string): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    const existing = await env.DB.prepare('SELECT id FROM quote_requests WHERE id = ?').bind(id).first();
    if (!existing) {
      return errorResponse('Quote request not found', 404, request, allowedOrigins);
    }

    const body: any = await request.json();
    const validStatuses = ['New', 'Contacted', 'In Progress', 'Quoted', 'Closed'];
    const status = body?.status;

    if (!status || !validStatuses.includes(status)) {
      return errorResponse(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400, request, allowedOrigins);
    }

    const nowIso = new Date().toISOString();
    await env.DB.prepare('UPDATE quote_requests SET status = ?, updated_at = ? WHERE id = ?').bind(status, nowIso, id).run();

    const updated = await env.DB.prepare('SELECT * FROM quote_requests WHERE id = ?').bind(id).first();
    return successResponse(updated, 200, request, allowedOrigins);
  } catch (err: any) {
    return errorResponse('Failed to update quote request: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

/**
 * Admin: Delete Quote Request
 */
export async function handleDeleteQuote(request: Request, env: Env, id: string): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    const existing = await env.DB.prepare('SELECT id FROM quote_requests WHERE id = ?').bind(id).first();
    if (!existing) {
      return errorResponse('Quote request not found', 404, request, allowedOrigins);
    }

    await env.DB.prepare('DELETE FROM quote_requests WHERE id = ?').bind(id).run();
    return successResponse({ message: 'Quote request deleted successfully', id }, 200, request, allowedOrigins);
  } catch (err: any) {
    return errorResponse('Failed to delete quote request: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}
