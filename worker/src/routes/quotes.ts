// Quote Requests Route Handlers (Public Submission & Admin Management)
import type { Env, QuoteRequestRecord } from '../types';
import { requireAuth, checkRateLimit } from '../auth/middleware';
import { errorResponse, successResponse, parseAllowedOrigins } from '../utils/response';
import { isValidEmail, isValidPhone, sanitizeString } from '../utils/validator';

/**
 * Public: Submit a Quote Request
 */
export async function handleSubmitQuote(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);

  // Rate limiting (15 quotes per 5 minutes per IP)
  if (!checkRateLimit(request, 15, 300)) {
    return errorResponse('Too many quote requests. Please wait a few minutes.', 429, request, allowedOrigins);
  }

  try {
    const body: any = await request.json();
    const name = sanitizeString(body?.name);
    const company = sanitizeString(body?.company) || null;
    const email = sanitizeString(body?.email)?.toLowerCase();
    const phone = sanitizeString(body?.phone);
    const service = sanitizeString(body?.service);
    const origin = sanitizeString(body?.origin);
    const destination = sanitizeString(body?.destination);
    const cargo_weight = sanitizeString(body?.cargoWeight || body?.cargo_weight) || null;
    const cargo_details = sanitizeString(body?.cargoDetails || body?.cargo_details) || null;

    if (!name) return errorResponse('Contact name is required', 400, request, allowedOrigins);
    if (!email || !isValidEmail(email)) return errorResponse('A valid email address is required', 400, request, allowedOrigins);
    if (!phone || !isValidPhone(phone)) return errorResponse('A valid phone number is required (at least 10 digits)', 400, request, allowedOrigins);
    if (!service) return errorResponse('Service selection is required', 400, request, allowedOrigins);
    if (!origin) return errorResponse('Origin location is required', 400, request, allowedOrigins);
    if (!destination) return errorResponse('Destination location is required', 400, request, allowedOrigins);

    const id = crypto.randomUUID();
    const nowIso = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO quote_requests (id, name, company, email, phone, service, origin, destination, cargo_weight, cargo_details, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', ?, ?)`
    ).bind(
      id, name, company, email, phone, service, origin, destination, cargo_weight, cargo_details, nowIso, nowIso
    ).run();

    return successResponse(
      {
        id,
        message: 'Your quote request has been received. Our logistics specialist will connect with you shortly.',
      },
      201,
      request,
      allowedOrigins
    );
  } catch (err: any) {
    return errorResponse('Failed to submit quote request: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
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
