/**
 * Centralized API Base URL and Endpoint Resolution for KPS Logistics
 * 
 * Production Cloudflare Worker: https://kps-backend-api.kpsandfairway.workers.dev
 * Local Development Worker:     http://localhost:8787
 */

export const PRODUCTION_API_URL = 'https://kps-backend-api.kpsandfairway.workers.dev';
export const LOCAL_DEV_API_URL = 'http://localhost:8787';

export function isLocalEnvironment(): boolean {
  if (typeof window !== 'undefined') {
    const h = window.location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0' || h.endsWith('.local');
  }
  return process.env.NODE_ENV === 'development';
}

/**
 * Resolves the single, canonical base URL for the backend API.
 * Handles comma-separated values, surrounding whitespace, and trailing slashes safely.
 */
export function getApiBaseUrl(): string {
  const isLocal = isLocalEnvironment();

  const rawEnv = process.env.NEXT_PUBLIC_API_URL;
  if (rawEnv && typeof rawEnv === 'string') {
    // If comma-separated (e.g. "http://localhost:8787 , https://kps-backend-api..."):
    const candidates = rawEnv
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0 && (item.startsWith('http://') || item.startsWith('https://')));

    if (candidates.length > 1) {
      if (isLocal) {
        const localMatch = candidates.find((u) => u.includes('localhost') || u.includes('127.0.0.1'));
        if (localMatch) return localMatch.replace(/\/+$/, '');
      } else {
        const prodMatch = candidates.find((u) => !u.includes('localhost') && !u.includes('127.0.0.1'));
        if (prodMatch) return prodMatch.replace(/\/+$/, '');
      }
    }

    if (candidates.length > 0) {
      const single = candidates[0].replace(/\/+$/, '');
      // Guard against using localhost in production
      if (!isLocal && (single.includes('localhost') || single.includes('127.0.0.1'))) {
        return PRODUCTION_API_URL;
      }
      return single;
    }
  }

  // Fallback if env variable is missing or empty
  return isLocal ? LOCAL_DEV_API_URL : PRODUCTION_API_URL;
}

/**
 * Safely constructs an absolute endpoint URL using the native URL constructor.
 * Ensures an absolute path is joined with the resolved base URL, preventing accidental concatenation.
 */
export function buildApiUrl(
  pathOrUrl: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  const baseUrl = getApiBaseUrl();

  let targetUrl: URL;

  // Handle accidental double-url or comma-separated string passed as path
  let cleanPath = (pathOrUrl || '').trim();

  // If two URLs were concatenated (e.g. "http://localhost:8787/https://kps..." or "http://localhost:8787https://kps...")
  const lastHttpIdx = cleanPath.lastIndexOf('http://');
  const lastHttpsIdx = cleanPath.lastIndexOf('https://');
  const lastProtocolIdx = Math.max(lastHttpIdx, lastHttpsIdx);
  if (lastProtocolIdx > 0) {
    cleanPath = cleanPath.substring(lastProtocolIdx);
  }

  if (cleanPath.includes(',')) {
    const parts = cleanPath.split(',').map((p) => p.trim()).filter(Boolean);
    cleanPath = parts[parts.length - 1] || '';
  }

  // Check if cleanPath is already an absolute URL
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    try {
      targetUrl = new URL(cleanPath);
      // If absolute URL pointed to an unintended host (e.g. localhost in prod), rewire origin
      const currentBase = new URL(baseUrl);
      if (targetUrl.hostname === 'localhost' || targetUrl.hostname === '127.0.0.1') {
        if (currentBase.hostname !== 'localhost' && currentBase.hostname !== '127.0.0.1') {
          targetUrl = new URL(targetUrl.pathname + targetUrl.search, baseUrl);
        }
      }
    } catch {
      targetUrl = new URL('/', baseUrl);
    }
  } else {
    // Relative path: ensure leading slash
    const normalized = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    targetUrl = new URL(normalized, baseUrl);
  }

  // Append query parameters safely
  if (params) {
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== null) {
        targetUrl.searchParams.set(key, String(val));
      }
    }
  }

  return targetUrl.toString();
}
