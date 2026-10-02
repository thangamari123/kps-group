// Contact Messages Route Handlers (Public & Admin)
import type { Env, ContactMessageRecord } from '../types';
import { requireAuth, checkRateLimit } from '../auth/middleware';
import { errorResponse, successResponse, parseAllowedOrigins } from '../utils/response';
import { isValidEmail, isValidPhone, sanitizeString } from '../utils/validator';

/**
 * Public: Submit a Contact Message
 */
export async function handleSubmitContact(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);

  // Rate limiting (15 messages per 5 minutes per IP)
  if (!checkRateLimit(request, 15, 300)) {
    return errorResponse('Too many messages submitted. Please wait a few minutes.', 429, request, allowedOrigins);
  }

  try {
    const body: any = await request.json();
    const name = sanitizeString(body?.name);
    const email = sanitizeString(body?.email)?.toLowerCase();
    const phone = sanitizeString(body?.phone);
    const company_name = sanitizeString(body?.companyName || body?.company_name) || null;
    const service_required = sanitizeString(body?.serviceRequired || body?.service_required) || null;
    const message = sanitizeString(body?.message);

    if (!name) return errorResponse('Name is required', 400, request, allowedOrigins);
    if (!email || !isValidEmail(email)) return errorResponse('A valid email address is required', 400, request, allowedOrigins);
    if (!phone || !isValidPhone(phone)) return errorResponse('A valid phone number is required (at least 10 digits)', 400, request, allowedOrigins);
    if (!message) return errorResponse('Message content is required', 400, request, allowedOrigins);

    const id = crypto.randomUUID();
    const nowIso = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO contact_messages (id, name, email, phone, company_name, service_required, message, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'New', ?, ?)`
    ).bind(
      id, name, email, phone, company_name, service_required, message, nowIso, nowIso
    ).run();

    return successResponse(
      {
        id,
        message: 'Thank you for contacting KPS. Your message has been received.',
      },
      201,
      request,
      allowedOrigins
    );
  } catch (err: any) {
    return errorResponse('Failed to submit message: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

/**
 * Admin: List Contact Messages
 */
export async function handleGetAdminContacts(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.trim() || '';
    const status = url.searchParams.get('status')?.trim() || '';

    let query = `SELECT * FROM contact_messages WHERE 1=1`;
    const params: any[] = [];

    if (search) {
      query += ` AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR company_name LIKE ? OR message LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s, s);
    }

    if (status && status !== 'all') {
      query += ` AND status = ?`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC`;

    const stmt = env.DB.prepare(query);
    const boundStmt = params.length > 0 ? stmt.bind(...params) : stmt;
    const { results } = await boundStmt.all();

    return successResponse(results || [], 200, request, allowedOrigins);
  } catch (err: any) {
    return errorResponse('Failed to fetch contact messages: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

/**
 * Admin: Get single Contact Message details
 */
export async function handleGetAdminContactById(request: Request, env: Env, id: string): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    const contact = await env.DB.prepare('SELECT * FROM contact_messages WHERE id = ?').bind(id).first<ContactMessageRecord>();
    if (!contact) {
      return errorResponse('Contact message not found', 404, request, allowedOrigins);
    }

    // Auto-mark New as Read when opened by admin
    if (contact.status === 'New') {
      const nowIso = new Date().toISOString();
      await env.DB.prepare("UPDATE contact_messages SET status = 'Read', updated_at = ? WHERE id = ?").bind(nowIso, id).run();
      contact.status = 'Read';
    }

    return successResponse(contact, 200, request, allowedOrigins);
  } catch (err: any) {
    return errorResponse('Failed to fetch message details: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

/**
 * Admin: Update Contact Message status
 */
export async function handleUpdateContact(request: Request, env: Env, id: string): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    const existing = await env.DB.prepare('SELECT id FROM contact_messages WHERE id = ?').bind(id).first();
    if (!existing) {
      return errorResponse('Contact message not found', 404, request, allowedOrigins);
    }

    const body: any = await request.json();
    const validStatuses = ['New', 'Read', 'Replied', 'Closed'];
    const status = body?.status;

    if (!status || !validStatuses.includes(status)) {
      return errorResponse(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400, request, allowedOrigins);
    }

    const nowIso = new Date().toISOString();
    await env.DB.prepare('UPDATE contact_messages SET status = ?, updated_at = ? WHERE id = ?').bind(status, nowIso, id).run();

    const updated = await env.DB.prepare('SELECT * FROM contact_messages WHERE id = ?').bind(id).first();
    return successResponse(updated, 200, request, allowedOrigins);
  } catch (err: any) {
    return errorResponse('Failed to update contact message: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

/**
 * Admin: Delete Contact Message
 */
export async function handleDeleteContact(request: Request, env: Env, id: string): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    const existing = await env.DB.prepare('SELECT id FROM contact_messages WHERE id = ?').bind(id).first();
    if (!existing) {
      return errorResponse('Contact message not found', 404, request, allowedOrigins);
    }

    await env.DB.prepare('DELETE FROM contact_messages WHERE id = ?').bind(id).run();
    return successResponse({ message: 'Contact message deleted successfully', id }, 200, request, allowedOrigins);
  } catch (err: any) {
    return errorResponse('Failed to delete contact message: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}
