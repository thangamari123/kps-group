// Contact Messages Route Handlers (Public & Admin)
import type { Env, ContactMessageRecord } from '../types';
import { requireAuth, checkRateLimit } from '../auth/middleware';
import { errorResponse, successResponse, parseAllowedOrigins } from '../utils/response';
import { isValidEmail } from '../utils/validator';
import { isAppsScriptConfigured, saveContactToSheet } from '../utils/appsScript';
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

// Values of the "Service Required" dropdown on the Contact Us form, mapped to the label stored in the sheet.
const SERVICE_LABELS: Record<string, string> = {
  'customs-clearance': 'Customs Brokerage',
  transportation: 'First/Last Mile Transport',
  'express-delivery': 'Express Delivery',
  'project-logistics': 'Project Logistics',
  ftwz: 'Free Trade & Warehousing Zone (FTWZ)',
  'general-logistics': 'End-To-End Logistics',
};

/**
 * Public: Submit a Contact Message
 *
 * - Validates and sanitizes every field server-side; rate limited per IP, with a honeypot and minimum fill time.
 * - The submission id is a hash of the enquiry content; a repeat of an enquiry already saved moments ago is
 *   answered with the same success instead of writing a second row.
 * - When the Apps Script is configured, success is returned only after it answers {"success": true}.
 *   If it fails, the visitor gets an error and can retry; nothing is reported as saved.
 * - Without the Apps Script configuration it falls back to the legacy D1 table, if that binding exists.
 */
export async function handleSubmitContact(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const fail = (message: string, status: number) => errorResponse(message, status, request, allowedOrigins);

  if (!checkRateLimit(request, 5, 600)) {
    return fail('Too many messages submitted. Please wait a few minutes and try again.', 429);
  }

  const parsed = await readJsonBody(request);
  if ('error' in parsed) return fail(parsed.error, parsed.status);
  const body = parsed.body;

  const thanks = 'Thank you for contacting KPS. Your message has been received.';

  // Pretend it worked so bots don't adapt.
  if (looksLikeBot(body)) return successResponse({ id: 'ok', message: thanks }, 201, request, allowedOrigins);

  const name = cleanText(body.name, 100);
  const email = cleanText(body.email, 254).toLowerCase();
  const company = cleanText(body.companyName ?? body.company_name, 150);
  const serviceKey = cleanText(body.serviceRequired ?? body.service_required, 50);
  const message = cleanMultiline(body.message, 2000);
  const phoneParts = parsePhone(body);

  if (!isPlausibleName(name)) return fail('Please enter your name.', 400);
  if (!isValidEmail(email)) return fail('Please enter a valid email address.', 400);
  if ('error' in phoneParts) return fail(phoneParts.error, 400);
  const { countryCode, phone } = phoneParts;
  const service = SERVICE_LABELS[serviceKey];
  if (!service) return fail('Please select a service.', 400);
  if (message.length < 5) return fail('Please tell us about your requirements.', 400);

  const fingerprint = [email, countryCode + phone, serviceKey, message.toLowerCase().replace(/\s+/g, ' ')].join('|');
  const id = `KPS-${(await sha256Hex(fingerprint)).slice(0, 20).toUpperCase()}`;
  const nowIso = new Date().toISOString();
  const useSheet = isAppsScriptConfigured(env);

  try {
    if (useSheet) {
      if (!wasRecentlySaved(id)) {
        const saved = await saveContactToSheet(env, { name, email, countryCode, phone, company, service, message });
        if (!saved.ok) return fail(SAVE_FAILED, 502);
        markSaved(id);
      }
    } else if (!env.DB) {
      console.error('Contact form: neither APPS_SCRIPT_URL nor a D1 binding is configured.');
      return fail(SAVE_FAILED, 503);
    }

    // Legacy admin-panel table: best effort once the sheet has confirmed the row; the only store without a sheet.
    if (env.DB) {
      try {
        await env.DB.prepare(
          `INSERT OR IGNORE INTO contact_messages (id, name, email, phone, company_name, service_required, message, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'New', ?, ?)`
        ).bind(id, name, email, `${countryCode} ${phone}`, company || null, service, message, nowIso, nowIso).run();
      } catch (dbErr: any) {
        if (!useSheet) throw dbErr;
        console.error('Contact saved to sheet but D1 mirror failed:', dbErr?.message || dbErr);
      }
    }

    return successResponse({ id, message: thanks }, 201, request, allowedOrigins);
  } catch (err: any) {
    console.error('Contact submission failed:', err?.message || err);
    return fail(SAVE_FAILED, 500);
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
