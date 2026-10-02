// Session Management for KPS Admin Panel
import type { Env, AdminUser, SessionRecord } from '../types';

export const SESSION_COOKIE_NAME = 'kps_admin_session';
export const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

/**
 * Extracts a cookie value by name from the Cookie header
 */
export function getCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

/**
 * Creates a Set-Cookie header string for the session token
 */
export function createSessionCookie(token: string, maxAge = SESSION_TTL_SECONDS, isSecure = true): string {
  const flags = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ];
  if (isSecure) {
    flags.push('Secure');
  }
  return flags.join('; ');
}

/**
 * Creates a Set-Cookie header string that clears the session cookie
 */
export function createClearSessionCookie(isSecure = true): string {
  const flags = [
    `${SESSION_COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ];
  if (isSecure) {
    flags.push('Secure');
  }
  return flags.join('; ');
}

/**
 * Generates a collision-resistant 256-bit cryptographically secure session ID
 */
export function generateSessionId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let str = '';
  for (let i = 0; i < bytes.length; i++) {
    str += bytes[i].toString(16).padStart(2, '0');
  }
  return str;
}

/**
 * Stores a new session in D1
 */
export async function createSession(
  env: Env,
  adminId: string,
  request: Request
): Promise<{ token: string; expiresAt: string }> {
  const token = generateSessionId();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_SECONDS * 1000).toISOString();
  const createdAt = now.toISOString();
  const ipAddress = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || null;
  const userAgent = request.headers.get('User-Agent') || null;

  await env.DB.prepare(
    `INSERT INTO sessions (id, admin_id, expires_at, created_at, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(token, adminId, expiresAt, createdAt, ipAddress, userAgent).run();

  return { token, expiresAt };
}

/**
 * Validates a session token and returns the associated admin user, or null if invalid/expired.
 */
export async function validateSession(
  env: Env,
  token: string
): Promise<{ admin: AdminUser; session: SessionRecord } | null> {
  const nowIso = new Date().toISOString();

  const row = await env.DB.prepare(
    `SELECT 
        s.id as session_id, s.admin_id, s.expires_at, s.created_at as session_created_at,
        a.id as admin_id, a.email, a.name, a.role, a.created_at as admin_created_at, a.updated_at as admin_updated_at
     FROM sessions s
     JOIN admins a ON s.admin_id = a.id
     WHERE s.id = ? AND s.expires_at > ?`
  ).bind(token, nowIso).first<any>();

  if (!row) {
    return null;
  }

  return {
    admin: {
      id: row.admin_id,
      email: row.email,
      name: row.name,
      role: row.role,
      created_at: row.admin_created_at,
      updated_at: row.admin_updated_at,
    },
    session: {
      id: row.session_id,
      admin_id: row.admin_id,
      expires_at: row.expires_at,
      created_at: row.session_created_at,
    },
  };
}

/**
 * Invalidates (deletes) a session from D1
 */
export async function invalidateSession(env: Env, token: string): Promise<void> {
  await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(token).run();
}

/**
 * Cleans up expired sessions in D1
 */
export async function cleanExpiredSessions(env: Env): Promise<void> {
  const nowIso = new Date().toISOString();
  await env.DB.prepare('DELETE FROM sessions WHERE expires_at <= ?').bind(nowIso).run();
}
