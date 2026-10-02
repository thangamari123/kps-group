// Authentication Routes: Login, Logout, Current User, First Admin Setup
import type { Env } from '../types';
import { hashPassword, verifyPassword } from '../auth/password';
import { createSession, invalidateSession, createSessionCookie, createClearSessionCookie, getCookie, SESSION_COOKIE_NAME } from '../auth/session';
import { requireAuth, checkRateLimit } from '../auth/middleware';
import { errorResponse, successResponse, parseAllowedOrigins } from '../utils/response';
import { isValidEmail, sanitizeString } from '../utils/validator';

export async function handleLogin(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);

  // Rate limiting for login attempts (10 per minute per IP)
  if (!checkRateLimit(request, 10, 60)) {
    return errorResponse('Too many login attempts. Please wait a minute and try again.', 429, request, allowedOrigins);
  }

  try {
    const body: any = await request.json();
    const email = sanitizeString(body?.email)?.toLowerCase();
    const password = body?.password;

    if (!email || !isValidEmail(email)) {
      return errorResponse('A valid email address is required', 400, request, allowedOrigins);
    }
    if (!password || typeof password !== 'string') {
      return errorResponse('Password is required', 400, request, allowedOrigins);
    }

    // Look up admin in D1
    const admin = await env.DB.prepare(
      'SELECT id, email, password_hash, name, role, created_at, updated_at FROM admins WHERE email = ?'
    ).bind(email).first<any>();

    if (!admin || !admin.password_hash) {
      return errorResponse('Invalid email or password', 401, request, allowedOrigins);
    }

    // Verify password hash
    const isValid = await verifyPassword(password, admin.password_hash);
    if (!isValid) {
      return errorResponse('Invalid email or password', 401, request, allowedOrigins);
    }

    // Create session in D1
    const isProduction = env.ENVIRONMENT !== 'development';
    const { token } = await createSession(env, admin.id, request);
    const cookieHeader = createSessionCookie(token, undefined, isProduction);

    return successResponse(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      200,
      request,
      allowedOrigins,
      { 'Set-Cookie': cookieHeader }
    );
  } catch (err: any) {
    return errorResponse('Login failed: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

export async function handleLogout(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const isProduction = env.ENVIRONMENT !== 'development';

  let token = getCookie(request, SESSION_COOKIE_NAME);
  if (!token) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  if (token) {
    await invalidateSession(env, token);
  }

  const clearCookie = createClearSessionCookie(isProduction);
  return successResponse({ message: 'Logged out successfully' }, 200, request, allowedOrigins, {
    'Set-Cookie': clearCookie,
  });
}

export async function handleMe(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  return successResponse(
    {
      id: auth.admin.id,
      email: auth.admin.email,
      name: auth.admin.name,
      role: auth.admin.role,
      created_at: auth.admin.created_at,
    },
    200,
    request,
    allowedOrigins
  );
}

/**
 * One-time setup endpoint for creating the first admin or adding an admin via SETUP_SECRET.
 */
export async function handleSetupAdmin(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);

  try {
    const headerSecret = request.headers.get('X-Setup-Secret');
    const configuredSecret = env.SETUP_SECRET || 'kps-admin-initial-setup-secret-2026';

    // Count existing admins
    const countRow = await env.DB.prepare('SELECT COUNT(*) as count FROM admins').first<{ count: number }>();
    const adminCount = countRow?.count ?? 0;

    // Only allow if no admins exist OR if correct X-Setup-Secret is provided
    if (adminCount > 0 && headerSecret !== configuredSecret) {
      return errorResponse('Admin setup is already initialized. Provide valid X-Setup-Secret.', 403, request, allowedOrigins);
    }

    const body: any = await request.json();
    const email = sanitizeString(body?.email)?.toLowerCase();
    const password = body?.password;
    const name = sanitizeString(body?.name) || 'KPS Administrator';

    if (!email || !isValidEmail(email)) {
      return errorResponse('A valid email address is required', 400, request, allowedOrigins);
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return errorResponse('Password must be at least 8 characters long', 400, request, allowedOrigins);
    }

    // Check if email already exists
    const existing = await env.DB.prepare('SELECT id FROM admins WHERE email = ?').bind(email).first();
    if (existing) {
      return errorResponse('An admin with this email already exists', 409, request, allowedOrigins);
    }

    const passwordHash = await hashPassword(password);
    const adminId = crypto.randomUUID();
    const nowIso = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO admins (id, email, password_hash, name, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'admin', ?, ?)`
    ).bind(adminId, email, passwordHash, name, nowIso, nowIso).run();

    return successResponse(
      {
        message: 'Admin account created successfully',
        id: adminId,
        email,
        name,
      },
      201,
      request,
      allowedOrigins
    );
  } catch (err: any) {
    return errorResponse('Setup failed: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}
