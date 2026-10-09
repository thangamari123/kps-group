// Firebase ID Token Cryptographic Verification for Cloudflare Workers
// Implements RS256 JWT signature verification using Google Public JWKs and Web Crypto API

export interface FirebaseTokenPayload {
  name?: string;
  picture?: string;
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string; // Firebase UID
  iat: number;
  exp: number;
  email?: string;
  email_verified?: boolean;
  firebase: {
    identities: Record<string, any>;
    sign_in_provider: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface GoogleJwkKey {
  kty: string;
  alg: string;
  use: string;
  kid: string;
  n: string;
  e: string;
}

interface GoogleJwksResponse {
  keys: GoogleJwkKey[];
}

interface CachedJwks {
  keys: GoogleJwkKey[];
  expiresAt: number;
}

// In-memory cache for Google public JWKs
let jwksCache: CachedJwks | null = null;

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function base64UrlDecodeToString(str: string): string {
  const bytes = base64UrlDecode(str);
  return new TextDecoder().decode(bytes);
}

/**
 * Fetch Google's public JWK certificates for Firebase ID Token verification.
 * Automatically respects Cache-Control headers to minimize network latency.
 */
async function getGoogleJwks(): Promise<GoogleJwkKey[]> {
  const now = Date.now();
  if (jwksCache && jwksCache.expiresAt > now) {
    return jwksCache.keys;
  }

  const res = await fetch(
    'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch Google public keys: HTTP ${res.status}`);
  }

  const cacheControl = res.headers.get('cache-control') || '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAgeSeconds = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 3600;

  const data = (await res.json()) as GoogleJwksResponse;
  if (!data?.keys || !Array.isArray(data.keys)) {
    throw new Error('Invalid JWKS response format from Google');
  }

  jwksCache = {
    keys: data.keys,
    expiresAt: now + maxAgeSeconds * 1000,
  };

  return data.keys;
}

/**
 * Cryptographically verify a Firebase ID Token using Google's public JWKs and Web Crypto.
 * Validates:
 * 1. RS256 algorithm and valid signature
 * 2. Issuer (https://securetoken.google.com/<projectId>)
 * 3. Audience (<projectId>)
 * 4. Expiration, Issued-at, and Auth-time claims
 * 5. Non-empty subject (Firebase UID)
 */
export async function verifyFirebaseIdToken(
  token: string,
  projectId: string
): Promise<FirebaseTokenPayload> {
  if (!token || typeof token !== 'string') {
    throw new Error('No authentication token provided');
  }

  const cleanToken = token.trim();
  const parts = cleanToken.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format (expected 3 segments)');
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  // 1. Decode and validate header
  let header: { alg?: string; kid?: string; typ?: string };
  try {
    header = JSON.parse(base64UrlDecodeToString(headerB64));
  } catch {
    throw new Error('Failed to parse JWT header');
  }

  if (header.alg !== 'RS256') {
    throw new Error(`Invalid token algorithm. Expected RS256, got ${header.alg || 'unknown'}`);
  }
  if (!header.kid) {
    throw new Error('JWT header missing key ID (kid)');
  }

  // 2. Fetch Google Public Keys and find matching key
  let keys = await getGoogleJwks();
  let keyData = keys.find((k) => k.kid === header.kid);

  // If not found in cache, clear cache and re-fetch once (in case Google rotated keys)
  if (!keyData) {
    jwksCache = null;
    keys = await getGoogleJwks();
    keyData = keys.find((k) => k.kid === header.kid);
  }

  if (!keyData) {
    throw new Error(`Public key for kid "${header.kid}" not found in Google certificates`);
  }

  // 3. Import public key into Web Crypto
  let cryptoKey: CryptoKey;
  try {
    cryptoKey = await crypto.subtle.importKey(
      'jwk',
      {
        kty: keyData.kty,
        n: keyData.n,
        e: keyData.e,
        alg: 'RS256',
        ext: true,
      },
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: { name: 'SHA-256' },
      },
      false,
      ['verify']
    );
  } catch (err: any) {
    throw new Error(`Failed to import Google public key: ${err?.message || 'Crypto error'}`);
  }

  // 4. Verify signature over header.payload
  const signedData = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signature = base64UrlDecode(signatureB64);

  const isValid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    signature,
    signedData
  );

  if (!isValid) {
    throw new Error('Firebase ID token signature verification failed');
  }

  // 5. Parse and validate payload
  let payload: FirebaseTokenPayload;
  try {
    payload = JSON.parse(base64UrlDecodeToString(payloadB64));
  } catch {
    throw new Error('Failed to parse JWT payload');
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const clockSkewSeconds = 60; // 1 minute clock skew tolerance

  // Check issuer
  const expectedIssuer = `https://securetoken.google.com/${projectId}`;
  if (payload.iss !== expectedIssuer) {
    throw new Error(`Invalid token issuer. Expected "${expectedIssuer}", got "${payload.iss}"`);
  }

  // Check audience
  if (payload.aud !== projectId) {
    throw new Error(`Invalid token audience. Expected "${projectId}", got "${payload.aud}"`);
  }

  // Check expiration
  if (!payload.exp || payload.exp <= (nowSeconds - clockSkewSeconds)) {
    throw new Error('Firebase ID token has expired');
  }

  // Check issued-at
  if (!payload.iat || payload.iat > (nowSeconds + clockSkewSeconds)) {
    throw new Error('Firebase ID token issued-at timestamp is in the future');
  }

  // Check auth_time
  if (!payload.auth_time || payload.auth_time > (nowSeconds + clockSkewSeconds)) {
    throw new Error('Firebase ID token auth_time is in the future');
  }

  // Check subject (Firebase UID)
  if (!payload.sub || typeof payload.sub !== 'string' || payload.sub.trim().length === 0) {
    throw new Error('Firebase ID token subject (UID) is empty');
  }

  return payload;
}
