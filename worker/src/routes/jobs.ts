// Jobs Route Handlers (Public & Admin)
import type { Env, JobRecord } from '../types';
import { requireAuth } from '../auth/middleware';
import { errorResponse, successResponse, parseAllowedOrigins } from '../utils/response';
import { generateSlug, isValidSlug, sanitizeString } from '../utils/validator';

/**
 * Public: Get all published jobs
 */
export async function handleGetPublicJobs(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);

  try {
    const { results } = await env.DB.prepare(
      `SELECT id, title, slug, department, location, employment_type, experience, salary, description, deadline, created_at
       FROM jobs
       WHERE status = 'published'
       ORDER BY created_at DESC`
    ).all<JobRecord>();

    return successResponse(results || [], 200, request, allowedOrigins);
  } catch (err: any) {
    return errorResponse('Failed to fetch jobs: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

/**
 * Public: Get single published job by slug
 */
export async function handleGetPublicJobBySlug(request: Request, env: Env, slug: string): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);

  try {
    const job = await env.DB.prepare(
      `SELECT id, title, slug, department, location, employment_type, experience, salary, description, responsibilities, requirements, benefits, deadline, status, created_at
       FROM jobs
       WHERE slug = ? AND status = 'published'`
    ).bind(slug).first<JobRecord>();

    if (!job) {
      return errorResponse('Job posting not found or is no longer active', 404, request, allowedOrigins);
    }

    return successResponse(job, 200, request, allowedOrigins);
  } catch (err: any) {
    return errorResponse('Failed to fetch job details: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

/**
 * Admin: List all jobs with filters and search
 */
export async function handleGetAdminJobs(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.trim() || '';
    const status = url.searchParams.get('status')?.trim() || '';
    const department = url.searchParams.get('department')?.trim() || '';

    let query = `
      SELECT j.*, 
        (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as application_count,
        (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id AND a.status = 'New') as new_application_count
      FROM jobs j
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      query += ` AND (j.title LIKE ? OR j.location LIKE ? OR j.department LIKE ?)`;
      const searchWild = `%${search}%`;
      params.push(searchWild, searchWild, searchWild);
    }

    if (status && status !== 'all') {
      query += ` AND j.status = ?`;
      params.push(status);
    }

    if (department && department !== 'all') {
      query += ` AND j.department = ?`;
      params.push(department);
    }

    query += ` ORDER BY j.created_at DESC`;

    const stmt = env.DB.prepare(query);
    const boundStmt = params.length > 0 ? stmt.bind(...params) : stmt;
    const { results } = await boundStmt.all();

    return successResponse(results || [], 200, request, allowedOrigins);
  } catch (err: any) {
    return errorResponse('Failed to fetch admin jobs: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

/**
 * Admin: Create a new job
 */
export async function handleCreateJob(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    const body: any = await request.json();
    const title = sanitizeString(body?.title);
    const department = sanitizeString(body?.department) || null;
    const location = sanitizeString(body?.location);
    const employment_type = sanitizeString(body?.employment_type) || 'Full-time';
    const experience = sanitizeString(body?.experience) || null;
    const salary = sanitizeString(body?.salary) || null;
    const description = sanitizeString(body?.description);
    const responsibilities = typeof body?.responsibilities === 'string' ? body.responsibilities.trim() : null;
    const requirements = typeof body?.requirements === 'string' ? body.requirements.trim() : null;
    const benefits = typeof body?.benefits === 'string' ? body.benefits.trim() : null;
    const deadline = sanitizeString(body?.deadline) || null;
    const status = ['draft', 'published', 'closed'].includes(body?.status) ? body.status : 'draft';

    let slug = sanitizeString(body?.slug);
    if (!slug) {
      slug = generateSlug(title);
    } else {
      slug = generateSlug(slug);
    }

    if (!title) return errorResponse('Job title is required', 400, request, allowedOrigins);
    if (!location) return errorResponse('Location is required', 400, request, allowedOrigins);
    if (!description) return errorResponse('Job description is required', 400, request, allowedOrigins);
    if (!slug) return errorResponse('A valid slug could not be generated', 400, request, allowedOrigins);

    // Check slug uniqueness
    const existing = await env.DB.prepare('SELECT id FROM jobs WHERE slug = ?').bind(slug).first();
    if (existing) {
      // Append random 4-char suffix to slug to avoid conflict if auto-generated
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const id = crypto.randomUUID();
    const nowIso = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO jobs (id, title, slug, department, location, employment_type, experience, salary, description, responsibilities, requirements, benefits, deadline, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id, title, slug, department, location, employment_type, experience, salary, description, responsibilities, requirements, benefits, deadline, status, nowIso, nowIso
    ).run();

    const createdJob = await env.DB.prepare('SELECT * FROM jobs WHERE id = ?').bind(id).first<JobRecord>();
    return successResponse(createdJob, 201, request, allowedOrigins);
  } catch (err: any) {
    return errorResponse('Failed to create job: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

/**
 * Admin: Update an existing job
 */
export async function handleUpdateJob(request: Request, env: Env, id: string): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    const existing = await env.DB.prepare('SELECT * FROM jobs WHERE id = ?').bind(id).first<JobRecord>();
    if (!existing) {
      return errorResponse('Job not found', 404, request, allowedOrigins);
    }

    const body: any = await request.json();
    const title = body.title !== undefined ? sanitizeString(body.title) : existing.title;
    const department = body.department !== undefined ? sanitizeString(body.department) : existing.department;
    const location = body.location !== undefined ? sanitizeString(body.location) : existing.location;
    const employment_type = body.employment_type !== undefined ? sanitizeString(body.employment_type) : existing.employment_type;
    const experience = body.experience !== undefined ? sanitizeString(body.experience) : existing.experience;
    const salary = body.salary !== undefined ? sanitizeString(body.salary) : existing.salary;
    const description = body.description !== undefined ? sanitizeString(body.description) : existing.description;
    const responsibilities = body.responsibilities !== undefined ? (typeof body.responsibilities === 'string' ? body.responsibilities.trim() : null) : existing.responsibilities;
    const requirements = body.requirements !== undefined ? (typeof body.requirements === 'string' ? body.requirements.trim() : null) : existing.requirements;
    const benefits = body.benefits !== undefined ? (typeof body.benefits === 'string' ? body.benefits.trim() : null) : existing.benefits;
    const deadline = body.deadline !== undefined ? sanitizeString(body.deadline) : existing.deadline;
    const status = body.status !== undefined && ['draft', 'published', 'closed'].includes(body.status) ? body.status : existing.status;

    let slug = existing.slug;
    if (body.slug && body.slug !== existing.slug) {
      slug = generateSlug(body.slug);
      // Check if new slug is taken by another job
      const slugCheck = await env.DB.prepare('SELECT id FROM jobs WHERE slug = ? AND id != ?').bind(slug, id).first();
      if (slugCheck) {
        return errorResponse('Slug is already in use by another job', 409, request, allowedOrigins);
      }
    }

    const nowIso = new Date().toISOString();

    await env.DB.prepare(
      `UPDATE jobs SET
        title = ?, slug = ?, department = ?, location = ?, employment_type = ?,
        experience = ?, salary = ?, description = ?, responsibilities = ?,
        requirements = ?, benefits = ?, deadline = ?, status = ?, updated_at = ?
       WHERE id = ?`
    ).bind(
      title, slug, department, location, employment_type,
      experience, salary, description, responsibilities,
      requirements, benefits, deadline, status, nowIso, id
    ).run();

    const updatedJob = await env.DB.prepare('SELECT * FROM jobs WHERE id = ?').bind(id).first<JobRecord>();
    return successResponse(updatedJob, 200, request, allowedOrigins);
  } catch (err: any) {
    return errorResponse('Failed to update job: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

/**
 * Admin: Delete a job
 */
export async function handleDeleteJob(request: Request, env: Env, id: string): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    const existing = await env.DB.prepare('SELECT id FROM jobs WHERE id = ?').bind(id).first();
    if (!existing) {
      return errorResponse('Job not found', 404, request, allowedOrigins);
    }

    await env.DB.prepare('DELETE FROM jobs WHERE id = ?').bind(id).run();
    return successResponse({ message: 'Job deleted successfully', id }, 200, request, allowedOrigins);
  } catch (err: any) {
    return errorResponse('Failed to delete job: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}
