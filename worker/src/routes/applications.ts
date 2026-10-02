// Applications Route Handlers: Public Application & Admin Management
import type { Env, ApplicationRecord } from '../types';
import { requireAuth, checkRateLimit } from '../auth/middleware';
import { errorResponse, successResponse, parseAllowedOrigins, getCorsHeaders } from '../utils/response';
import { isValidEmail, isValidPhone, validatePdfFile, sanitizeString } from '../utils/validator';

/**
 * Public: Submit a Job Application with PDF Resume to Cloudflare R2 & D1
 */
export async function handleSubmitApplication(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);

  // Rate limiting (10 submissions per 5 minutes per IP)
  if (!checkRateLimit(request, 10, 300)) {
    return errorResponse('Too many submissions. Please wait a few minutes and try again.', 429, request, allowedOrigins);
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return errorResponse('Content-Type must be multipart/form-data', 400, request, allowedOrigins);
    }

    const formData = await request.formData();
    const name = sanitizeString(formData.get('name'));
    const email = sanitizeString(formData.get('email'))?.toLowerCase();
    const phone = sanitizeString(formData.get('phone'));
    const location = sanitizeString(formData.get('location')) || null;
    const experience = sanitizeString(formData.get('experience')) || null;
    const current_company = sanitizeString(formData.get('current_company')) || null;
    const cover_letter = sanitizeString(formData.get('cover_letter')) || null;
    const job_id = sanitizeString(formData.get('job_id')) || null;
    const job_slug = sanitizeString(formData.get('job_slug')) || null;

    // Validate text inputs
    if (!name) return errorResponse('Full name is required', 400, request, allowedOrigins);
    if (!email || !isValidEmail(email)) return errorResponse('A valid email address is required', 400, request, allowedOrigins);
    if (!phone || !isValidPhone(phone)) return errorResponse('A valid phone number is required (at least 10 digits)', 400, request, allowedOrigins);

    // Resolve Job ID if job_slug was provided instead
    let targetJobId = job_id;
    if (!targetJobId && job_slug) {
      const jobRow = await env.DB.prepare('SELECT id FROM jobs WHERE slug = ?').bind(job_slug).first<{ id: string }>();
      if (jobRow) {
        targetJobId = jobRow.id;
      }
    }

    // Validate Resume File
    const resumeFile = formData.get('resume') as File | null;
    if (!resumeFile || typeof resumeFile === 'string') {
      return errorResponse('Resume PDF file is required', 400, request, allowedOrigins);
    }

    const fileValidation = await validatePdfFile(resumeFile);
    if (!fileValidation.valid) {
      return errorResponse(fileValidation.error || 'Invalid PDF file', 400, request, allowedOrigins);
    }

    // Generate unique R2 key
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const fileId = crypto.randomUUID();
    const sanitizedFilename = resumeFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const r2Key = `resumes/${year}/${month}/${fileId}-${sanitizedFilename}`;

    // Upload to R2 Bucket
    const fileArrayBuffer = await resumeFile.arrayBuffer();
    await env.RESUMES_BUCKET.put(r2Key, fileArrayBuffer, {
      httpMetadata: {
        contentType: 'application/pdf',
      },
      customMetadata: {
        candidateName: name,
        candidateEmail: email,
        jobId: targetJobId || 'general',
        uploadedAt: now.toISOString(),
      },
    });

    // Save Application record in D1
    const applicationId = crypto.randomUUID();
    const nowIso = now.toISOString();

    await env.DB.prepare(
      `INSERT INTO applications (id, job_id, name, email, phone, location, experience, current_company, cover_letter, resume_key, resume_name, resume_size, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', ?, ?)`
    ).bind(
      applicationId,
      targetJobId,
      name,
      email,
      phone,
      location,
      experience,
      current_company,
      cover_letter,
      r2Key,
      resumeFile.name,
      resumeFile.size,
      nowIso,
      nowIso
    ).run();

    return successResponse(
      {
        id: applicationId,
        message: 'Application submitted successfully. Our HR team will review your profile.',
      },
      201,
      request,
      allowedOrigins
    );
  } catch (err: any) {
    return errorResponse('Application submission failed: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

/**
 * Admin: List Applications with filters, search, and pagination
 */
export async function handleGetAdminApplications(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.trim() || '';
    const status = url.searchParams.get('status')?.trim() || '';
    const jobId = url.searchParams.get('job_id')?.trim() || '';

    let query = `
      SELECT a.*, j.title as job_title, j.slug as job_slug
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      query += ` AND (a.name LIKE ? OR a.email LIKE ? OR a.phone LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    if (status && status !== 'all') {
      query += ` AND a.status = ?`;
      params.push(status);
    }

    if (jobId && jobId !== 'all') {
      query += ` AND a.job_id = ?`;
      params.push(jobId);
    }

    query += ` ORDER BY a.created_at DESC`;

    const stmt = env.DB.prepare(query);
    const boundStmt = params.length > 0 ? stmt.bind(...params) : stmt;
    const { results } = await boundStmt.all();

    return successResponse(results || [], 200, request, allowedOrigins);
  } catch (err: any) {
    return errorResponse('Failed to fetch applications: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

/**
 * Admin: Get single application details
 */
export async function handleGetAdminApplicationById(request: Request, env: Env, id: string): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    const app = await env.DB.prepare(
      `SELECT a.*, j.title as job_title, j.slug as job_slug, j.department as job_department
       FROM applications a
       LEFT JOIN jobs j ON a.job_id = j.id
       WHERE a.id = ?`
    ).bind(id).first<ApplicationRecord>();

    if (!app) {
      return errorResponse('Application not found', 404, request, allowedOrigins);
    }

    return successResponse(app, 200, request, allowedOrigins);
  } catch (err: any) {
    return errorResponse('Failed to fetch application: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

/**
 * Admin: Update application status
 */
export async function handleUpdateApplication(request: Request, env: Env, id: string): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    const existing = await env.DB.prepare('SELECT id FROM applications WHERE id = ?').bind(id).first();
    if (!existing) {
      return errorResponse('Application not found', 404, request, allowedOrigins);
    }

    const body: any = await request.json();
    const validStatuses = ['New', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
    const status = body?.status;

    if (!status || !validStatuses.includes(status)) {
      return errorResponse(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400, request, allowedOrigins);
    }

    const nowIso = new Date().toISOString();
    await env.DB.prepare(
      'UPDATE applications SET status = ?, updated_at = ? WHERE id = ?'
    ).bind(status, nowIso, id).run();

    const updated = await env.DB.prepare(
      `SELECT a.*, j.title as job_title
       FROM applications a
       LEFT JOIN jobs j ON a.job_id = j.id
       WHERE a.id = ?`
    ).bind(id).first();

    return successResponse(updated, 200, request, allowedOrigins);
  } catch (err: any) {
    return errorResponse('Failed to update application: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

/**
 * Admin: Secure authenticated streaming of resume PDF from R2
 */
export async function handleGetResumePdf(request: Request, env: Env, id: string): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    const app = await env.DB.prepare(
      'SELECT id, name, resume_key, resume_name FROM applications WHERE id = ?'
    ).bind(id).first<any>();

    if (!app || !app.resume_key) {
      return errorResponse('Application or resume file reference not found', 404, request, allowedOrigins);
    }

    // Retrieve object from R2
    const object = await env.RESUMES_BUCKET.get(app.resume_key);
    if (!object) {
      return errorResponse('Resume file not found in R2 storage', 404, request, allowedOrigins);
    }

    const url = new URL(request.url);
    const isDownload = url.searchParams.get('download') === '1';
    const dispositionType = isDownload ? 'attachment' : 'inline';
    const safeFilename = encodeURIComponent(app.resume_name || `${app.name}_Resume.pdf`);

    const headers = getCorsHeaders(request, allowedOrigins);
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `${dispositionType}; filename="${safeFilename}"`);
    headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    return new Response(object.body, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    return errorResponse('Failed to retrieve resume: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}
