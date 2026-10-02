// WebCrypto PBKDF2 Password Hashing & Verification for Cloudflare Workers
// Standard: PBKDF2 with SHA-256, 100,000 iterations, 16-byte random salt

const ITERATIONS = 100000;
const KEY_LEN = 32; // 256 bits
const SALT_LEN = 16; // 128 bits

function bufToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

function hexToBuf(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    KEY_LEN * 8
  );

  const saltHex = bufToHex(salt.buffer);
  const hashHex = bufToHex(derivedBits);

  return `pbkdf2_sha256$${ITERATIONS}$${saltHex}$${hashHex}`;
}

function constantTimeEquals(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const parts = storedHash.split('$');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2_sha256') {
      return false;
    }

    const iterations = parseInt(parts[1], 10);
    const salt = hexToBuf(parts[2]);
    const originalHash = hexToBuf(parts[3]);

    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt as any,
        iterations: iterations,
        hash: 'SHA-256',
      },
      passwordKey,
      KEY_LEN * 8
    );

    const derivedBytes = new Uint8Array(derivedBits);
    return constantTimeEquals(originalHash, derivedBytes);
  } catch {
    return false;
  }
}
