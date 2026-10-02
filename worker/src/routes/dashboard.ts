// Admin Dashboard KPI Stats and Recent Activity Aggregation
import type { Env, DashboardStats } from '../types';
import { requireAuth } from '../auth/middleware';
import { errorResponse, successResponse, parseAllowedOrigins } from '../utils/response';

export async function handleGetDashboardStats(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    // 1. Total & Active Jobs
    const jobsTotal = await env.DB.prepare('SELECT COUNT(*) as c FROM jobs').first<{ c: number }>();
    const jobsActive = await env.DB.prepare("SELECT COUNT(*) as c FROM jobs WHERE status = 'published'").first<{ c: number }>();

    // 2. Applications (Total & New)
    const appsTotal = await env.DB.prepare('SELECT COUNT(*) as c FROM applications').first<{ c: number }>();
    const appsNew = await env.DB.prepare("SELECT COUNT(*) as c FROM applications WHERE status = 'New'").first<{ c: number }>();

    // 3. Quotes (Total & New)
    const quotesTotal = await env.DB.prepare('SELECT COUNT(*) as c FROM quote_requests').first<{ c: number }>();
    const quotesNew = await env.DB.prepare("SELECT COUNT(*) as c FROM quote_requests WHERE status = 'New'").first<{ c: number }>();

    // 4. Contacts (Total & New)
    const contactsTotal = await env.DB.prepare('SELECT COUNT(*) as c FROM contact_messages').first<{ c: number }>();
    const contactsNew = await env.DB.prepare("SELECT COUNT(*) as c FROM contact_messages WHERE status = 'New'").first<{ c: number }>();

    // 5. Recent Activity Lists
    const { results: recentApplications } = await env.DB.prepare(`
      SELECT a.id, a.name, a.email, a.phone, a.status, a.created_at, j.title as job_title
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      ORDER BY a.created_at DESC
      LIMIT 5
    `).all();

    const { results: recentQuotes } = await env.DB.prepare(`
      SELECT id, name, company, email, phone, service, origin, destination, status, created_at
      FROM quote_requests
      ORDER BY created_at DESC
      LIMIT 5
    `).all();

    const { results: recentContacts } = await env.DB.prepare(`
      SELECT id, name, email, phone, company_name, service_required, message, status, created_at
      FROM contact_messages
      ORDER BY created_at DESC
      LIMIT 5
    `).all();

    const stats: DashboardStats = {
      totalJobs: jobsTotal?.c ?? 0,
      activeJobs: jobsActive?.c ?? 0,
      totalApplications: appsTotal?.c ?? 0,
      newApplications: appsNew?.c ?? 0,
      totalQuotes: quotesTotal?.c ?? 0,
      newQuotes: quotesNew?.c ?? 0,
      totalContacts: contactsTotal?.c ?? 0,
      newContacts: contactsNew?.c ?? 0,
    };

    return successResponse(
      {
        stats,
        recentApplications: recentApplications || [],
        recentQuotes: recentQuotes || [],
        recentContacts: recentContacts || [],
      },
      200,
      request,
      allowedOrigins
    );
  } catch (err: any) {
    return errorResponse('Failed to load dashboard data: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}
