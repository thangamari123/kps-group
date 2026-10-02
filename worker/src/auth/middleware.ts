// Authentication Middleware and Rate Limiter
import type { Env, AdminUser, SessionRecord } from '../types';
import { getCookie, validateSession, SESSION_COOKIE_NAME } from './session';
import { errorResponse, parseAllowedOrigins } from '../utils/response';

export interface AuthContext {
  admin: AdminUser;
  session: SessionRecord;
}

/**
 * Middleware that ensures the incoming request is authenticated with a valid Admin session.
 * Checks HTTP cookie first, then Authorization Bearer header as fallback.
 */
export async function requireAuth(
  request: Request,
  env: Env
): Promise<AuthContext | Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);

  // 1. Check session cookie
  let token = getCookie(request, SESSION_COOKIE_NAME);

  // 2. Fallback to Authorization: Bearer <token>
  if (!token) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) {
    return errorResponse('Authentication required. Please log in.', 401, request, allowedOrigins);
  }

  const authData = await validateSession(env, token);
  if (!authData) {
    return errorResponse('Session invalid or expired. Please log in again.', 401, request, allowedOrigins);
  }

  return authData;
}

// In-memory sliding window rate limiter for worker instance
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
