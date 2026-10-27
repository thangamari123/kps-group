// Admin award image upload to R2 through the existing Worker media routes (awards/images prefix).
// Run from the worker folder:  npm test
//
// The Worker code under test is real: Firebase-token verification, the admin check, upload validation, delivery and
// deletion. What is simulated: the R2 bucket (an in-memory object store) and Google/Firestore (stubbed fetch). A real
// RS256 token is minted with a locally generated key. This verifies the contract the admin page relies on; it does
// not touch a live Cloudflare R2 bucket.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const outfile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'kps-media-')), 'worker.mjs');
await build({ entryPoints: [path.join(here, '../src/index.ts')], bundle: true, format: 'esm', platform: 'neutral', target: 'es2022', outfile, logLevel: 'silent' });
const worker = (await import(pathToFileURL(outfile).href)).default;

const PROJECT = 'test-project';
const b64url = (input) => Buffer.from(input).toString('base64url');

// ---- a real signing key + the matching JWKS the Worker will "download from Google"
const signingKey = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
const otherKey = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
const publicJwk = { ...(await crypto.subtle.exportKey('jwk', signingKey.publicKey)), kid: 'test-kid', alg: 'RS256', use: 'sig' };

async function mintToken(uid, key = signingKey.privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', kid: 'test-kid', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({ iss: `https://securetoken.google.com/${PROJECT}`, aud: PROJECT, sub: uid, user_id: uid, iat: now - 5, auth_time: now - 5, exp: now + 3600, email: `${uid}@kps.test`, firebase: { identities: {}, sign_in_provider: 'password' } }));
  const signature = Buffer.from(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${header}.${payload}`))).toString('base64url');
  return `${header}.${payload}.${signature}`;
}

globalThis.fetch = async (url) => {
  const u = String(url);
  if (u.startsWith('https://www.googleapis.com/service_accounts/v1/jwk/securetoken')) {
    return new Response(JSON.stringify({ keys: [publicJwk] }), { status: 200, headers: { 'cache-control': 'max-age=3600' } });
  }
  if (u.includes('/documents/admins/admin-uid')) {
    return new Response(JSON.stringify({ name: 'projects/p/databases/(default)/documents/admins/admin-uid', fields: { role: { stringValue: 'admin' }, isActive: { booleanValue: true }, email: { stringValue: 'admin@kps.test' } } }), { status: 200 });
  }
  if (u.includes('/documents/admins/')) return new Response('{}', { status: 404 }); // not an admin
  throw new Error(`unexpected fetch ${u}`);
};

// ---- simulated R2 bucket
const objects = new Map();
const bucket = {
  async put(key, body, options = {}) {
    const bytes = body instanceof ArrayBuffer ? new Uint8Array(body) : new Uint8Array(await new Response(body).arrayBuffer());
    objects.set(key, { bytes, httpMetadata: options.httpMetadata || {}, customMetadata: options.customMetadata || {} });
  },
  async get(key) {
    const o = objects.get(key);
    if (!o) return null;
    return { body: new Response(o.bytes).body, size: o.bytes.length, httpEtag: '"etag"', httpMetadata: o.httpMetadata, customMetadata: o.customMetadata, writeHttpMetadata(h) { if (o.httpMetadata.cacheControl) h.set('Cache-Control', o.httpMetadata.cacheControl); } };
  },
  async head(key) {
    const o = objects.get(key);
    return o ? { size: o.bytes.length, httpEtag: '"etag"', httpMetadata: o.httpMetadata, writeHttpMetadata() {} } : null;
  },
  async delete(key) { objects.delete(key); },
};
const env = () => ({ ENVIRONMENT: 'production', FIREBASE_PROJECT_ID: PROJECT, ALLOWED_ORIGINS: '', MEDIA_BUCKET: bucket });

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, ...Array.from({ length: 300 }, (_, i) => i % 251)]);

async function call(method, route, { token, body, json } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (json) headers['Content-Type'] = 'application/json';
  const res = await worker.fetch(new Request(`https://api.test${route}`, { method, headers, body: json ? JSON.stringify(json) : body }), env(), {});
  return res;
}
const uploadForm = (file, prefix = 'awards/images') => {
  const fd = new FormData();
  fd.set('file', file);
  fd.set('prefix', prefix);
  return fd;
};

test('upload requires a valid admin: no token, a token signed by another key, and a non-admin account are all refused', async () => {
  objects.clear();
  const png = new File([PNG], 'award.png', { type: 'image/png' });
  assert.equal((await call('POST', '/api/admin/media/upload', { body: uploadForm(png) })).status, 401);
  assert.equal((await call('POST', '/api/admin/media/upload', { token: await mintToken('admin-uid', otherKey.privateKey), body: uploadForm(png) })).status, 401);
  assert.equal((await call('POST', '/api/admin/media/upload', { token: await mintToken('someone-else'), body: uploadForm(png) })).status, 403);
  assert.equal(objects.size, 0, 'nothing may be stored for a refused request');
});

test('an admin upload under awards/images is stored in R2 with its type and a long-lived cache header', async () => {
  objects.clear();
  const token = await mintToken('admin-uid');
  const res = await call('POST', '/api/admin/media/upload', { token, body: uploadForm(new File([PNG], 'Best Performer Award.PNG', { type: 'image/png' })) });
  assert.equal(res.status, 201);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.match(json.key, /^awards\/images\/[0-9a-f]{12}-best_performer_award\.png$/);
  assert.equal(json.url, `/api/media/${json.key}`);
  assert.equal(json.contentType, 'image/png');
  assert.equal(json.size, PNG.length);

  const stored = objects.get(json.key);
  assert.ok(stored, 'object exists in the bucket under the returned key');
  assert.deepEqual([...stored.bytes], [...PNG], 'stored bytes are identical to the upload');
  assert.equal(stored.httpMetadata.contentType, 'image/png');
  assert.match(stored.httpMetadata.cacheControl, /immutable/);
});

test('the saved image reference loads publicly through /api/media/<key> with the right bytes and headers', async () => {
  objects.clear();
  const token = await mintToken('admin-uid');
  const { key, url } = await (await call('POST', '/api/admin/media/upload', { token, body: uploadForm(new File([PNG], 'a.webp', { type: 'image/webp' })) })).json();

  const get = await call('GET', url); // public: no token
  assert.equal(get.status, 200);
  assert.equal(get.headers.get('content-type'), 'image/webp');
  assert.match(get.headers.get('cache-control'), /immutable/);
  assert.deepEqual([...new Uint8Array(await get.arrayBuffer())], [...PNG]);

  const head = await call('HEAD', `/api/media/${key}`);
  assert.equal(head.status, 200);
  assert.equal(Number(head.headers.get('content-length')), PNG.length);

  assert.equal((await call('GET', '/api/media/awards/images/does-not-exist.webp')).status, 404);
});

test('upload validation: non-image files and files over 20MB are rejected and not stored', async () => {
  objects.clear();
  const token = await mintToken('admin-uid');
  const pdf = await call('POST', '/api/admin/media/upload', { token, body: uploadForm(new File([new Uint8Array(500)], 'doc.pdf', { type: 'application/pdf' })) });
  assert.equal(pdf.status, 400);
  const exe = await call('POST', '/api/admin/media/upload', { token, body: uploadForm(new File([new Uint8Array(500)], 'virus.exe', { type: 'application/octet-stream' })) });
  assert.equal(exe.status, 400);
  const huge = await call('POST', '/api/admin/media/upload', { token, body: uploadForm(new File([new Uint8Array(20 * 1024 * 1024 + 1)], 'huge.png', { type: 'image/png' })) });
  assert.equal(huge.status, 400);
  assert.match((await huge.json()).error, /exceeds maximum limit of 20MB/);
  assert.equal(objects.size, 0);
});

test('deleting a stored image removes it from R2; a request without admin rights cannot', async () => {
  objects.clear();
  const token = await mintToken('admin-uid');
  const { key, url } = await (await call('POST', '/api/admin/media/upload', { token, body: uploadForm(new File([PNG], 'a.png', { type: 'image/png' })) })).json();

  assert.equal((await call('POST', '/api/admin/media/delete', { json: { key } })).status, 401);
  assert.equal((await call('POST', '/api/admin/media/delete', { token: await mintToken('someone-else'), json: { key } })).status, 403);
  assert.ok(objects.has(key), 'still stored after refused deletes');

  const del = await call('POST', '/api/admin/media/delete', { token, json: { key } });
  assert.equal(del.status, 200);
  assert.equal((await del.json()).deletedKey, key);
  assert.equal(objects.has(key), false);
  assert.equal((await call('GET', url)).status, 404);
});

test('replacing an image uploads a new object under a new key; the old one stays until it is deleted explicitly', async () => {
  objects.clear();
  const token = await mintToken('admin-uid');
  const first = await (await call('POST', '/api/admin/media/upload', { token, body: uploadForm(new File([PNG], 'same-name.png', { type: 'image/png' })) })).json();
  const second = await (await call('POST', '/api/admin/media/upload', { token, body: uploadForm(new File([PNG], 'same-name.png', { type: 'image/png' })) })).json();
  assert.notEqual(first.key, second.key, 'even the same file name never overwrites an existing object');
  assert.equal(objects.size, 2);
});
