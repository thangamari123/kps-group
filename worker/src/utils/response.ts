// Response and CORS Utilities for Cloudflare Worker

export interface CorsConfig {
  allowedOrigins: string[];
}

export function parseAllowedOrigins(originsEnv?: string): string[] {
  const defaults = [
    'https://www.kpsgroups.net',
    'https://kpsgroups.net',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
  ];

  if (!originsEnv) return defaults;

  const parsed = originsEnv
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  return Array.from(new Set([...defaults, ...parsed]));
}

export function getCorsHeaders(request: Request, allowedOrigins: string[]): Headers {
  const origin = request.headers.get('Origin');
  const headers = new Headers();

  if (origin && allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Credentials', 'true');
  } else if (!origin) {
    // If no origin header (e.g. server-to-server or direct curl), allow
    headers.set('Access-Control-Allow-Origin', allowedOrigins[0] || 'https://www.kpsgroups.net');
    headers.set('Access-Control-Allow-Credentials', 'true');
  } else {
    // Reject unknown origin by setting first allowed origin without credentials or omit
    headers.set('Access-Control-Allow-Origin', allowedOrigins[0]);
  }

  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Setup-Secret, Accept');
  headers.set('Access-Control-Max-Age', '86400');
  headers.set('Vary', 'Origin');

  return headers;
}

export function handleOptions(request: Request, allowedOrigins: string[]): Response {
  const headers = getCorsHeaders(request, allowedOrigins);
  return new Response(null, {
    status: 204,
    headers,
  });
}

export function jsonResponse(
  data: any,
  status = 200,
  request?: Request,
  allowedOrigins?: string[],
  additionalHeaders?: Record<string, string>
): Response {
  const origins = allowedOrigins || parseAllowedOrigins();
  const headers = request ? getCorsHeaders(request, origins) : new Headers();

  headers.set('Content-Type', 'application/json; charset=utf-8');

  if (additionalHeaders) {
    for (const [key, value] of Object.entries(additionalHeaders)) {
      headers.set(key, value);
    }
  }

  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
}

export function errorResponse(
  message: string,
  status = 400,
  request?: Request,
  allowedOrigins?: string[],
  errors?: any
): Response {
  return jsonResponse(
    {
      success: false,
      error: message,
      ...(errors ? { errors } : {}),
    },
    status,
    request,
    allowedOrigins
  );
}

export function successResponse(
  data: any,
  status = 200,
  request?: Request,
  allowedOrigins?: string[],
  additionalHeaders?: Record<string, string>
): Response {
  return jsonResponse(
    {
      success: true,
      data,
    },
    status,
    request,
    allowedOrigins,
    additionalHeaders
  );
}
