// Contact Us -> Google Sheets (Apps Script Web App) tests.
// Run from the worker folder:  npm test
//
// The Worker is bundled with esbuild and called directly; fetch is stubbed with a fake of the deployed
// Apps Script contract (flat JSON in, {"success": true} out). No network or Google account is needed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const outfile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'kps-worker-')), 'worker.mjs');
await build({
  entryPoints: [path.join(here, '../src/index.ts')],
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  outfile,
  logLevel: 'silent',
});
const worker = (await import(pathToFileURL(outfile).href)).default;

const SCRIPT_URL = 'https://script.google.com/macros/s/TEST_DEPLOYMENT/exec';
let rows; // rows the fake sheet received
let behavior; // 'normal' | 'http500' | 'html' | 'network' | 'failure-json' | 'timeout'

function reset() {
  rows = [];
  behavior = 'normal';
}

globalThis.fetch = async (url, init) => {
  assert.equal(String(url), SCRIPT_URL, 'Worker must only call the configured Apps Script URL');
  assert.equal(init.method, 'POST');
  if (behavior === 'network') throw new TypeError('fetch failed');
  if (behavior === 'timeout') throw new DOMException('The operation timed out', 'TimeoutError');
  if (behavior === 'http500') return new Response('boom', { status: 500 });
  if (behavior === 'html') return new Response('<html>Sign in - Google Accounts</html>', { status: 200 });
  if (behavior === 'failure-json') return new Response(JSON.stringify({ success: false, error: 'Sheet not found' }), { status: 200 });
  rows.push(JSON.parse(init.body));
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

let ipCounter = 0;
let msgCounter = 0; // each test gets a distinct enquiry, because the Worker remembers recent ones
const sheetEnv = () => ({ ENVIRONMENT: 'production', APPS_SCRIPT_URL: SCRIPT_URL });

const validBody = (over = {}) => ({
  name: 'Asha Menon',
  email: 'Asha@Example.com',
  countryCode: '+91',
  phone: '9876543210',
  companyName: 'Menon Exports',
  serviceRequired: 'customs-clearance',
  message: `Need customs clearance for 2 containers from Chennai. Ref ${++msgCounter}`,
  website: '',
  elapsedMs: 9000,
  ...over,
});

async function submit(body, env = sheetEnv(), ip = `10.0.0.${++ipCounter}`) {
  const res = await worker.fetch(
    new Request('https://api.test/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
    env,
    {}
  );
  return { status: res.status, json: await res.json() };
}

// ---- success
test('successful submission is sent with the mapped fields and reported as success only after the script confirms', async () => {
  reset();
  const { status, json } = await submit(validBody());
  assert.equal(status, 201);
  assert.equal(json.success, true);
  assert.match(json.data.id, /^KPS-[0-9A-F]{20}$/);
  assert.deepEqual(rows, [{
    name: 'Asha Menon',
    email: 'asha@example.com',
    countryCode: '+91',
    phone: '9876543210',
    company: 'Menon Exports',
    service: 'Customs Brokerage',
    message: rows[0].message,
  }]);
  assert.match(rows[0].message, /^Need customs clearance for 2 containers from Chennai\. Ref [0-9]+$/);
});

test('legacy single-string phone ("+971 501234567") is split into code and number', async () => {
  reset();
  assert.equal((await submit(validBody({ countryCode: undefined, phone: '+971 501234567' }))).status, 201);
  assert.equal(rows[0].countryCode, '+971');
  assert.equal(rows[0].phone, '501234567');
});

test('company is optional', async () => {
  reset();
  assert.equal((await submit(validBody({ companyName: '' }))).status, 201);
  assert.equal(rows[0].company, '');
});

test('repeating the same enquiry (double click / retry) writes one row and still succeeds with the same id', async () => {
  reset();
  const body = validBody();
  const first = await submit(body);
  const second = await submit(body);
  assert.equal(second.status, 201);
  assert.equal(second.json.data.id, first.json.data.id);
  assert.equal(rows.length, 1);
});

test('different enquiries from the same person are stored separately', async () => {
  reset();
  await submit(validBody());
  await submit(validBody({ message: 'A different shipment from Mumbai to Dubai.' }));
  assert.equal(rows.length, 2);
});

test('input is sanitized: HTML stripped, whitespace collapsed, oversized text truncated', async () => {
  reset();
  const { status } = await submit(validBody({
    name: '  <b>Asha</b>   <script>alert(1)</script>Menon ',
    message: 'Line one\r\n\r\n\r\n\r\nLine two <img src=x onerror=alert(1)>' + 'x'.repeat(5000),
  }));
  assert.equal(status, 201);
  assert.equal(rows[0].name, 'Asha alert(1)Menon');
  assert.ok(!rows[0].message.includes('<'));
  assert.ok(rows[0].message.startsWith('Line one\n\nLine two'));
  assert.ok(rows[0].message.length <= 2000);
});

// ---- invalid input (rejected before anything is sent to Google)
const invalidCases = {
  'missing name': { name: '' },
  'name with a URL': { name: 'visit http://spam.example' },
  'invalid email': { email: 'not-an-email' },
  'missing country code': { countryCode: '', phone: '9876543210' },
  'junk country code': { countryCode: '91; DROP' },
  'short phone': { countryCode: '+44', phone: '123' },
  'letters in phone': { countryCode: '+44', phone: 'abcdefghij' },
  'too many digits': { countryCode: '+44', phone: '1234567890123456' },
  'Indian number not starting 6-9': { countryCode: '+91', phone: '1234567890' },
  'unknown service': { serviceRequired: 'hack-the-planet' },
  'missing service': { serviceRequired: '' },
  'empty message': { message: '' },
  'too-short message': { message: 'hi' },
  'message that is only markup': { message: '<script></script>' },
};
for (const [label, over] of Object.entries(invalidCases)) {
  test(`invalid input is rejected: ${label}`, async () => {
    reset();
    const { status, json } = await submit(validBody(over));
    assert.equal(status, 400, JSON.stringify(json));
    assert.equal(json.success, false);
    assert.equal(rows.length, 0);
  });
}

test('malformed, non-object and oversized bodies are rejected', async () => {
  reset();
  assert.equal((await submit('{not json')).status, 400);
  assert.equal((await submit('[]')).status, 400);
  assert.equal((await submit('"str"')).status, 400);
  assert.equal((await submit({ ...validBody(), message: 'x'.repeat(20000) })).status, 413);
  assert.equal(rows.length, 0);
});

test('honeypot and instant submissions get a fake success and are never stored', async () => {
  reset();
  assert.equal((await submit(validBody({ website: 'http://bot.example' }))).status, 201);
  assert.equal((await submit(validBody({ elapsedMs: 100 }))).status, 201);
  assert.equal(rows.length, 0);
});

test('per-IP rate limit returns 429 after 5 submissions in the window', async () => {
  reset();
  const ip = '203.0.113.7';
  for (let i = 0; i < 5; i++) {
    assert.equal((await submit(validBody({ message: `Enquiry number ${i} about freight` }), sheetEnv(), ip)).status, 201);
  }
  assert.equal((await submit(validBody({ message: 'Enquiry number 6 about freight' }), sheetEnv(), ip)).status, 429);
  assert.equal(rows.length, 5);
});

// ---- endpoint failures: success must never be reported when the row was not confirmed
for (const mode of ['http500', 'html', 'network', 'timeout', 'failure-json']) {
  test(`endpoint failure (${mode}) returns an error, not success`, async () => {
    reset();
    behavior = mode;
    const { status, json } = await submit(validBody());
    assert.equal(status, 502);
    assert.equal(json.success, false);
    assert.ok(!JSON.stringify(json).includes('script.google.com'));
    assert.ok(!JSON.stringify(json).includes('Sheet not found'));
    assert.equal(rows.length, 0);
  });
}

test('a failed attempt can be retried immediately and then saves exactly once', async () => {
  reset();
  const body = validBody();
  behavior = 'network';
  assert.equal((await submit(body)).status, 502);
  behavior = 'normal';
  assert.equal((await submit(body)).status, 201);
  assert.equal(rows.length, 1);
});

test('Apps Script URLs outside script.google.com are refused (no request is made)', async () => {
  reset();
  const { status } = await submit(validBody(), { ...sheetEnv(), APPS_SCRIPT_URL: 'https://evil.example/exec' });
  assert.equal(status, 502);
  assert.equal(rows.length, 0);
});

test('not configured and no database: clear error, never a false success', async () => {
  reset();
  const { status, json } = await submit(validBody(), { ENVIRONMENT: 'production' });
  assert.equal(status, 503);
  assert.equal(json.success, false);
});

test('legacy D1 mode (no Apps Script configured) still saves and succeeds', async () => {
  reset();
  const inserted = [];
  const DB = { prepare: () => ({ bind: (...args) => ({ run: async () => inserted.push(args) }) }) };
  const { status } = await submit(validBody(), { ENVIRONMENT: 'production', DB });
  assert.equal(status, 201);
  assert.equal(inserted.length, 1);
  assert.equal(inserted[0][3], '+91 9876543210');
});

test('a D1 mirror failure after the sheet saved does not fail the request', async () => {
  reset();
  const DB = { prepare: () => ({ bind: () => ({ run: async () => { throw new Error('d1 down'); } }) }) };
  const { status } = await submit(validBody(), { ...sheetEnv(), DB });
  assert.equal(status, 201);
  assert.equal(rows.length, 1);
});
