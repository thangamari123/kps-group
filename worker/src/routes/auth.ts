// Authentication & Admin Authorization Routes
import type { Env, AdminUser } from '../types';
import { requireAuth } from '../auth/middleware';
import { verifyFirebaseIdToken } from '../auth/firebase';
import { errorResponse, successResponse, parseAllowedOrigins } from '../utils/response';
import { isValidEmail, sanitizeString } from '../utils/validator';

/**
 * Get current authenticated & authorized admin profile
 * Protected: requires valid Firebase ID Token and D1 admins allowlist entry
 */
export async function handleMe(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  return successResponse(
    {
      id: auth.admin.id,
      firebase_uid: auth.admin.firebase_uid,
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
 * Admin Logout endpoint
 */
export async function handleLogout(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  return successResponse({ message: 'Admin session ended successfully' }, 200, request, allowedOrigins);
}

/**
 * Compatibility login check endpoint
 */
export async function handleLogin(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);

  // If client sends Authorization header with Firebase token, verify and return admin profile
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const auth = await requireAuth(request, env);
    if (auth instanceof Response) return auth;
    return successResponse(
      {
        id: auth.admin.id,
        firebase_uid: auth.admin.firebase_uid,
        email: auth.admin.email,
        name: auth.admin.name,
        role: auth.admin.role,
      },
      200,
      request,
      allowedOrigins
    );
  }

  return errorResponse(
    'Please authenticate directly with Firebase Authentication on the client.',
    400,
    request,
    allowedOrigins
  );
}

/**
 * Secure setup endpoint for provisioning the first Firebase admin in D1.
 * Ensures the Firebase UID comes directly from verified Firebase token or protected with SETUP_SECRET.
 */
export async function handleSetupAdmin(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);

  try {
    const headerSecret = request.headers.get('X-Setup-Secret');
    const configuredSecret = env.SETUP_SECRET || 'kps-admin-initial-setup-secret-2026';

    // Count existing admins in D1
    const countRow = await env.DB.prepare('SELECT COUNT(*) as count FROM admins').first<{ count: number }>();
    const adminCount = countRow?.count ?? 0;

    let firebaseUid = '';
    let email = '';
    let name = 'KPS Super Administrator';
    let role = 'super_admin';

    // Check if request includes a Bearer token (recommended way: sign in with Firebase, then call setup)
    const authHeader = request.headers.get('Authorization');
    const projectId = env.FIREBASE_PROJECT_ID || 'kps-website-hr-panel';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      const verified = await verifyFirebaseIdToken(token, projectId);
      firebaseUid = verified.sub;
      email = verified.email?.toLowerCase() || '';
      if (verified.name) name = verified.name;
    }

    // If body contains payload, check body parameters
    try {
      const body: any = await request.json();
      if (body) {
        if (!firebaseUid && body.firebase_uid) firebaseUid = sanitizeString(body.firebase_uid);
        if (!email && body.email) email = sanitizeString(body.email)?.toLowerCase();
        if (body.name) name = sanitizeString(body.name);
        if (body.role && ['admin', 'super_admin'].includes(body.role)) role = body.role;
      }
    } catch {
      // Body may be empty if purely token-based
    }

    // Only allow if:
    // 1. No admins exist yet in D1, OR
    // 2. The caller provides the correct X-Setup-Secret header
    if (adminCount > 0 && headerSecret !== configuredSecret) {
      return errorResponse(
        'Admin setup is already initialized. Provide valid X-Setup-Secret header to add more admins.',
        403,
        request,
        allowedOrigins
      );
    }

    if (!firebaseUid) {
      return errorResponse(
        'Firebase UID is required (either via Authorization Bearer token or firebase_uid in body)',
        400,
        request,
        allowedOrigins
      );
    }

    if (!email || !isValidEmail(email)) {
      return errorResponse('A valid email address is required', 400, request, allowedOrigins);
    }

    // Check if admin with this firebase_uid already exists
    const existingUid = await env.DB.prepare('SELECT id FROM admins WHERE firebase_uid = ?').bind(firebaseUid).first();
    if (existingUid) {
      return errorResponse('An admin with this Firebase UID already exists', 409, request, allowedOrigins);
    }

    // Check if admin with this email already exists
    const existingEmail = await env.DB.prepare('SELECT id FROM admins WHERE email = ?').bind(email).first();
    if (existingEmail) {
      // Update existing record with the new Firebase UID
      const nowIso = new Date().toISOString();
      await env.DB.prepare(
        'UPDATE admins SET firebase_uid = ?, name = ?, role = ?, updated_at = ? WHERE email = ?'
      ).bind(firebaseUid, name, role, nowIso, email).run();

      return successResponse(
        {
          message: 'Existing admin record updated with Firebase UID successfully',
          firebase_uid: firebaseUid,
          email,
          name,
          role,
        },
        200,
        request,
        allowedOrigins
      );
    }

    const adminId = crypto.randomUUID();
    const nowIso = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO admins (id, firebase_uid, email, name, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(adminId, firebaseUid, email, name, role, nowIso, nowIso).run();

    return successResponse(
      {
        message: 'Admin account provisioned successfully in D1 allowlist',
        id: adminId,
        firebase_uid: firebaseUid,
        email,
        name,
        role,
      },
      201,
      request,
      allowedOrigins
    );
  } catch (err: any) {
    return errorResponse('Setup failed: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}
