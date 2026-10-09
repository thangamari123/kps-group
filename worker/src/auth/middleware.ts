// Authentication Middleware: Firebase Token Verification & Firestore Admin Authorization
import type { Env, AdminUser } from '../types';
import { verifyFirebaseIdToken, type FirebaseTokenPayload } from './firebase';
import { errorResponse, parseAllowedOrigins } from '../utils/response';
import { getFirestoreDoc } from '../utils/firestore';

export interface AuthContext {
  admin: AdminUser;
  firebaseUser: FirebaseTokenPayload;
}

/**
 * Middleware that ensures incoming admin requests are:
 * 1. Cryptographically verified with a valid Firebase ID Token
 * 2. Authorized against Firestore (/admins/{uid}) with role === "admin" and isActive === true
 */
export async function requireAuth(
  request: Request,
  env: Env
): Promise<AuthContext | Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);

  // 1. Extract Bearer token from Authorization header or URL token param
  let token: string | null = null;
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // Fallback to ?token= query parameter (e.g. for direct authenticated resume downloads)
  if (!token) {
    try {
      const url = new URL(request.url);
      token = url.searchParams.get('token');
    } catch {
      // Invalid URL
    }
  }

  if (!token) {
    return errorResponse('Authentication required. Please sign in.', 401, request, allowedOrigins);
  }

  // 2. Determine Firebase Project ID
  const projectId = env.FIREBASE_PROJECT_ID || 'kps-website-hr-panel';

  // 3. Cryptographically verify Firebase ID Token
  let firebaseUser: FirebaseTokenPayload;
  try {
    firebaseUser = await verifyFirebaseIdToken(token, projectId);
  } catch (err: any) {
    console.warn('Firebase ID Token verification failed:', err?.message || err);
    return errorResponse(
      `Authentication failed: ${err?.message || 'Invalid or expired Firebase ID token'}`,
      401,
      request,
      allowedOrigins
    );
  }

  // 4. Verify admin authorization against Cloud Firestore (/admins/{uid})
  try {
    const firebaseUid = firebaseUser.sub;
    const adminDoc = await getFirestoreDoc(projectId, 'admins', firebaseUid, token);

    // Verify admin document existence in Firestore (/admins/{uid})
    if (!adminDoc) {
      console.warn(`Admin authorization rejected for UID: ${firebaseUid} (no record in /admins/${firebaseUid})`);
      return errorResponse(
        'Forbidden: You do not have administrator privileges.',
        403,
        request,
        allowedOrigins
      );
    }

    // Verify active status and role
    const isActive = adminDoc.isActive !== false;
    const rawRole = typeof adminDoc.role === 'string' ? adminDoc.role.toLowerCase().trim() : 'admin';
    const isRoleAllowed = rawRole === 'admin' || rawRole === 'super_admin';

    if (!isActive || !isRoleAllowed) {
      console.warn(`Admin authorization rejected for UID: ${firebaseUid} (role=${rawRole}, isActive=${isActive})`);
      return errorResponse(
        'Forbidden: You do not have active administrator privileges.',
        403,
        request,
        allowedOrigins
      );
    }

    const derivedName =
      adminDoc?.name ||
      firebaseUser.name ||
      (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Administrator');

    const admin: AdminUser = {
      id: firebaseUid,
      firebase_uid: firebaseUid,
      email: adminDoc?.email || firebaseUser.email || '',
      name: derivedName,
      role: adminDoc?.role || 'admin',
      created_at: adminDoc?.createdAt || new Date().toISOString(),
      updated_at: adminDoc?.updatedAt || new Date().toISOString(),
    };

    return {
      admin,
      firebaseUser,
    };
  } catch (dbErr: any) {
    console.error('Error checking admin authorization in Firestore:', dbErr);
    return errorResponse(
      'Server error checking administrative permissions',
      500,
      request,
      allowedOrigins
    );
  }
}

// In-memory sliding window rate limiter per client IP for worker instance
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Basic in-memory rate limiter per client IP
 */
export function checkRateLimit(
  request: Request,
  maxRequests = 30,
  windowSeconds = 60
): boolean {
  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '127.0.0.1';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}
