// Request a Quote -> Google Sheets tests (also checks that Contact Us still passes through untouched).
// Run from the worker folder:  npm test
//
// fetch is routed into a VM that holds QuoteRequests.gs next to a stand-in for the existing Contact Us doPost,
// with an in-memory spreadsheet, so the quote path is tested end to end without network or Google credentials.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
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
const QUOTE_HEADERS = ['Submission ID', 'Timestamp', 'Enquiry Type', 'Status', 'Name', 'Email', 'Country Code', 'Phone', 'Company', 'Service Required', 'Cargo Weight / Volume', 'Origin', 'Destination', 'Cargo Specifications'];

function createSheetsApp({ withQuoteHandler = true } = {}) {
  const tabs = new Map(); // name -> grid
  const makeSheet = (grid) => ({
    getLastRow: () => grid.length,
    setFrozenRows() {},
    getRange(r, c, nr = 1, nc = 1) {
      return {
        getValues: () => Array.from({ length: nr }, (_, i) => Array.from({ length: nc }, (_, j) => (grid[r - 1 + i] || [])[c - 1 + j] ?? '')),
        getValue: () => (grid[r - 1] || [])[c - 1] ?? '',
        setValues(vals) {
          vals.forEach((row, i) => row.forEach((v, j) => { (grid[r - 1 + i] ||= [])[c - 1 + j] = v; }));
          return this;
        },
        setNumberFormat() { return this; },
        setFontWeight() { return this; },
      };
    },
  });
  const ss = {
    getSheetByName: (n) => (tabs.has(n) ? makeSheet(tabs.get(n)) : null),
    insertSheet: (n) => { tabs.set(n, []); return makeSheet(tabs.get(n)); },
  };
  const contactRows = [];
  const sandbox = {
    console,
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => null }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) },
    SpreadsheetApp: { getActiveSpreadsheet: () => ss, flush() {} },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (text) => ({ text, setMimeType() { return this; } }) },
    contactRows,
  };
  vm.createContext(sandbox);
  if (withQuoteHandler) vm.runInContext(fs.readFileSync(path.join(here, '../apps-script/QuoteRequests.gs'), 'utf8'), sandbox);
  // Stand-in for the existing deployed script: stores a Contact Us row and answers {"success": true}.
  vm.runInContext(`
    function doPost(e) {
      ${withQuoteHandler ? 'var quoteReply = routeQuoteRequest_(e); if (quoteReply) return quoteReply;' : ''}
      contactRows.push(JSON.parse(e.postData.contents));
      return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
    }`, sandbox);
  return { tabs, contactRows, doPost: (body) => sandbox.doPost({ postData: { contents: body } }).text };
}

let app;
let behavior; // 'normal' | 'http500' | 'html' | 'network' | 'failure-json'
let calls;
function reset(opts) {
  app = createSheetsApp(opts);
  behavior = 'normal';
  calls = [];
}

globalThis.fetch = async (url, init) => {
  assert.equal(String(url), SCRIPT_URL);
  calls.push(JSON.parse(init.body));
  if (behavior === 'network') throw new TypeError('fetch failed');
  if (behavior === 'http500') return new Response('boom', { status: 500 });
  if (behavior === 'html') return new Response('<html>Sign in</html>', { status: 200 });
  if (behavior === 'failure-json') return new Response(JSON.stringify({ success: false, error: 'Sheet not found' }), { status: 200 });
  return new Response(app.doPost(init.body), { status: 200 });
};

let ipCounter = 0;
let refCounter = 0; // distinct enquiries per test, because the Worker remembers recent ones
const env = () => ({ ENVIRONMENT: 'production', APPS_SCRIPT_URL: SCRIPT_URL });

const quoteBody = (over = {}) => ({
  name: 'Ravi Kumar',
  email: 'Ravi@Example.com',
  countryCode: '+91',
  phone: '9876543210',
  company: 'Kumar Traders',
  service: 'Containerized Cargo (FCL / LCL)',
  cargoWeight: '2 x 40ft containers',
  origin: 'Chennai',
  destination: 'Dubai',
  cargoDetails: `Textile rolls, palletised. Ref ${++refCounter}`,
  website: '',
  elapsedMs: 9000,
  ...over,
});

async function post(route, body, e = env(), ip = `10.1.0.${++ipCounter}`) {
  const res = await worker.fetch(
    new Request(`https://api.test${route}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
    e,
    {}
  );
  return { status: res.status, json: await res.json() };
}
const quote = (body, e, ip) => post('/api/quotes', body, e, ip);
const quoteRows = () => (app.tabs.get('Quote Requests') || []).slice(1);

test('quote with every field is saved to the Quote Requests tab and reported as success', async () => {
  reset();
  const body = quoteBody();
  const { status, json } = await quote(body);
  assert.equal(status, 201);
  assert.equal(json.success, true);
  assert.match(json.data.id, /^QTE-[0-9A-F]{20}$/);

  assert.deepEqual(app.tabs.get('Quote Requests')[0], QUOTE_HEADERS);
  assert.equal(quoteRows().length, 1);
  const [id, ts, type, st, name, email, code, phone, company, service, weight, origin, dest, details] = quoteRows()[0];
  assert.equal(id, json.data.id);
  assert.ok(!isNaN(new Date(ts).getTime()));
  assert.equal(type, 'Quote Request');
  assert.equal(st, 'New');
  assert.equal(name, 'Ravi Kumar');
  assert.equal(email, 'ravi@example.com');
  assert.equal(code, '+91');
  assert.equal(phone, '9876543210');
  assert.equal(company, 'Kumar Traders');
  assert.equal(service, 'Containerized Cargo (FCL / LCL)');
  assert.equal(weight, '2 x 40ft containers');
  assert.equal(origin, 'Chennai');
  assert.equal(dest, 'Dubai');
  assert.equal(details, body.cargoDetails);
  assert.equal(app.contactRows.length, 0, 'a quote must not land in the Contact Us store');
});

test('optional fields (company, weight, cargo specifications) may be empty', async () => {
  reset();
  const { status } = await quote(quoteBody({ company: '', cargoWeight: '', cargoDetails: '' }));
  assert.equal(status, 201);
  const row = quoteRows()[0];
  assert.deepEqual([row[8], row[10], row[13]], ['', '', '']);
});

test('duplicate quote (double click / retry) stores one row and still succeeds with the same id', async () => {
  reset();
  const body = quoteBody();
  const a = await quote(body);
  const b = await quote(body);
  assert.equal(b.status, 201);
  assert.equal(b.json.data.id, a.json.data.id);
  assert.equal(quoteRows().length, 1);
  assert.equal(calls.length, 1);
});

test('the Apps Script also ignores a submission id it already stored (Worker restarted / other instance)', async () => {
  reset();
  const payload = JSON.stringify({ enquiryType: 'Quote Request', submissionId: 'QTE-0123456789ABCDEF0123', timestamp: new Date().toISOString(), status: 'New', name: 'Ravi Kumar', email: 'r@example.com', countryCode: '+91', phone: '9876543210', company: '', service: 'Customs Brokerage', cargoWeight: '', origin: 'A1', destination: 'B1', cargoDetails: '' });
  assert.equal(JSON.parse(app.doPost(payload)).duplicate, false);
  assert.equal(JSON.parse(app.doPost(payload)).duplicate, true);
  assert.equal(quoteRows().length, 1);
});

test('spreadsheet formulas in quote fields are neutralised', async () => {
  reset();
  await quote(quoteBody({ company: '=HYPERLINK("http://evil","x")', cargoDetails: '@SUM(1+1) heavy machinery' }));
  assert.ok(quoteRows()[0][8].startsWith("'="));
  assert.ok(quoteRows()[0][13].startsWith("'@"));
});

test('HTML in quote fields is stripped and long text truncated', async () => {
  reset();
  await quote(quoteBody({ company: '<b>Kumar</b> <script>x</script>Traders', cargoDetails: 'y'.repeat(3000) }));
  assert.equal(quoteRows()[0][8], 'Kumar xTraders');
  assert.ok(quoteRows()[0][13].length <= 1000);
});

const invalid = {
  'missing name': { name: '' },
  'invalid email': { email: 'nope' },
  'missing country code': { countryCode: '' },
  'Indian number not starting 6-9': { phone: '1234567890' },
  'short phone': { phone: '12345' },
  'unknown service': { service: 'Teleportation' },
  'missing service': { service: '' },
  'missing origin': { origin: '' },
  'missing destination': { destination: '' },
  'destination equals origin': { origin: 'Dubai', destination: ' dubai ' },
};
for (const [label, over] of Object.entries(invalid)) {
  test(`invalid quote is rejected: ${label}`, async () => {
    reset();
    const { status, json } = await quote(quoteBody(over));
    assert.equal(status, 400, JSON.stringify(json));
    assert.equal(json.success, false);
    assert.equal(calls.length, 0);
  });
}

test('malformed and oversized bodies are rejected', async () => {
  reset();
  assert.equal((await quote('{bad')).status, 400);
  assert.equal((await quote('[]')).status, 400);
  assert.equal((await quote({ ...quoteBody(), cargoDetails: 'x'.repeat(20000) })).status, 413);
  assert.equal(calls.length, 0);
});

test('honeypot and instant submissions get a fake success and are never stored', async () => {
  reset();
  assert.equal((await quote(quoteBody({ website: 'http://bot.example' }))).status, 201);
  assert.equal((await quote(quoteBody({ elapsedMs: 50 }))).status, 201);
  assert.equal(calls.length, 0);
});

test('per-IP rate limit returns 429 after 5 quotes', async () => {
  reset();
  const ip = '198.51.100.9';
  for (let i = 0; i < 5; i++) assert.equal((await quote(quoteBody(), env(), ip)).status, 201);
  assert.equal((await quote(quoteBody(), env(), ip)).status, 429);
  assert.equal(quoteRows().length, 5);
});

for (const mode of ['http500', 'html', 'network', 'failure-json']) {
  test(`endpoint failure (${mode}) returns an error and stores nothing`, async () => {
    reset();
    behavior = mode;
    const { status, json } = await quote(quoteBody());
    assert.equal(status, 502);
    assert.equal(json.success, false);
    assert.ok(!JSON.stringify(json).includes('script.google.com'));
    assert.equal(quoteRows().length, 0);
  });
}

test('a failed quote can be retried and then saves exactly once', async () => {
  reset();
  const body = quoteBody();
  behavior = 'network';
  assert.equal((await quote(body)).status, 502);
  behavior = 'normal';
  assert.equal((await quote(body)).status, 201);
  assert.equal(quoteRows().length, 1);
});

test('a script that has NOT been updated for quotes (bare {"success":true}) is never mistaken for a save', async () => {
  reset({ withQuoteHandler: false });
  const { status, json } = await quote(quoteBody());
  assert.equal(status, 502);
  assert.equal(json.success, false);
});

test('not configured and no database: clear error, never a false success', async () => {
  reset();
  assert.equal((await quote(quoteBody(), { ENVIRONMENT: 'production' })).status, 503);
});

test('legacy D1 mode (no Apps Script configured) still saves quotes', async () => {
  reset();
  const inserted = [];
  const DB = { prepare: () => ({ bind: (...a) => ({ run: async () => inserted.push(a) }) }) };
  assert.equal((await quote(quoteBody(), { ENVIRONMENT: 'production', DB })).status, 201);
  assert.equal(inserted.length, 1);
  assert.equal(inserted[0][4], '+91 9876543210');
});

// ---- Contact Us regression: unchanged payload, unchanged store
test('Contact Us still works: same flat payload reaches the existing script path, not the quote tab', async () => {
  reset();
  const { status, json } = await post('/api/contact', {
    name: 'Asha Menon', email: 'asha@example.com', countryCode: '+91', phone: '9876543210', companyName: 'Menon Exports',
    serviceRequired: 'customs-clearance', message: `Need clearance for two containers ${++refCounter}`, website: '', elapsedMs: 9000,
  });
  assert.equal(status, 201);
  assert.equal(json.success, true);
  assert.deepEqual(Object.keys(calls[0]).sort(), ['company', 'countryCode', 'email', 'message', 'name', 'phone', 'service'].sort());
  assert.equal(app.contactRows.length, 1);
  assert.equal(app.contactRows[0].service, 'Customs Brokerage');
  assert.equal(app.tabs.has('Quote Requests'), false);
});

test('Contact Us works even when the script has no quote handler', async () => {
  reset({ withQuoteHandler: false });
  const { status } = await post('/api/contact', {
    name: 'Asha Menon', email: 'asha@example.com', countryCode: '+91', phone: '9876543210', companyName: '',
    serviceRequired: 'ftwz', message: `FTWZ enquiry ${++refCounter}`, website: '', elapsedMs: 9000,
  });
  assert.equal(status, 201);
  assert.equal(app.contactRows.length, 1);
});

// ---- Sheet schema: header order, value order, existing data
const SCHEMA = [
  ['Submission ID', 'submissionId'], ['Timestamp', 'timestamp'], ['Enquiry Type', 'enquiryType'], ['Status', 'status'],
  ['Name', 'name'], ['Email', 'email'], ['Country Code', 'countryCode'], ['Phone', 'phone'], ['Company', 'company'],
  ['Service Required', 'service'], ['Cargo Weight / Volume', 'cargoWeight'], ['Origin', 'origin'],
  ['Destination', 'destination'], ['Cargo Specifications', 'cargoDetails'],
];
const scriptPayload = () => ({
  enquiryType: 'Quote Request', submissionId: 'QTE-0123456789ABCDEF0123', timestamp: '2026-10-22T10:00:00.000Z', status: 'New',
  name: 'Name Sentinel', email: 'email@sentinel.example', countryCode: '+91', phone: '9876543210', company: 'Company Sentinel',
  service: 'Service Sentinel', cargoWeight: 'Weight Sentinel', origin: 'Origin Sentinel', destination: 'Destination Sentinel',
  cargoDetails: 'Specs Sentinel',
});

test('schema: new tab gets exactly the 14 expected headers, and every value lands under its own header', async () => {
  reset();
  const payload = scriptPayload();
  assert.equal(JSON.parse(app.doPost(JSON.stringify(payload))).success, true);
  const [header, row] = app.tabs.get('Quote Requests');
  assert.deepEqual(header, SCHEMA.map(([h]) => h));
  assert.equal(row.length, SCHEMA.length);
  SCHEMA.forEach(([h, key], i) => assert.equal(row[i], payload[key], `column ${i + 1} "${h}" must hold ${key}`));
});

test('schema: the Worker sends every field the sheet needs, under the names the script reads', async () => {
  reset();
  await quote(quoteBody());
  assert.deepEqual(Object.keys(calls[0]).sort(), SCHEMA.map(([, k]) => k).sort());
});

test('existing tab with the right headers and records: records untouched, new row appended below, headers not rewritten', async () => {
  reset();
  const existing = [
    SCHEMA.map(([h]) => h),
    ['QTE-AAAAAAAAAAAAAAAAAAAA', '2026-09-01T00:00:00.000Z', 'Quote Request', 'Contacted', 'Old One', 'one@x.co', '+91', '9000000001', '', 'Customs Brokerage', '', 'A1', 'B1', 'first'],
    ['QTE-BBBBBBBBBBBBBBBBBBBB', '2026-09-02T00:00:00.000Z', 'Quote Request', 'New', 'Old Two', 'two@x.co', '+44', '7000000002', 'Co', 'Express Delivery', '1t', 'A2', 'B2', 'second'],
  ];
  const snapshot = JSON.parse(JSON.stringify(existing));
  app.tabs.set('Quote Requests', existing);
  const res = await quote(quoteBody());
  assert.equal(res.status, 201);
  const grid = app.tabs.get('Quote Requests');
  assert.deepEqual(grid.slice(0, 3), snapshot, 'existing header and records must be unchanged');
  assert.equal(grid.length, 4);
  assert.equal(grid[3][0], res.json.data.id);
  assert.equal(grid[3][2], 'Quote Request');
});

test('existing tab headers are matched case-insensitively and ignoring stray spaces', async () => {
  reset();
  app.tabs.set('Quote Requests', [SCHEMA.map(([h]) => ` ${h.toUpperCase()} `)]);
  assert.equal((await quote(quoteBody())).status, 201);
  assert.equal(app.tabs.get('Quote Requests').length, 2);
});

test('existing tab with headers in a different order: refuses to write, changes nothing, Worker reports an error', async () => {
  reset();
  const swapped = SCHEMA.map(([h]) => h);
  [swapped[4], swapped[5]] = [swapped[5], swapped[4]]; // Email before Name
  const existing = [swapped, ['QTE-AAAAAAAAAAAAAAAAAAAA', 't', 'Quote Request', 'New', 'x@y.co', 'Old', '+91', '9', '', 's', '', 'a', 'b', 'c']];
  const snapshot = JSON.parse(JSON.stringify(existing));
  app.tabs.set('Quote Requests', existing);

  const direct = JSON.parse(app.doPost(JSON.stringify(scriptPayload())));
  assert.equal(direct.success, false);
  assert.match(direct.message, /header mismatch in column 5/);

  const res = await quote(quoteBody());
  assert.equal(res.status, 502);
  assert.equal(res.json.success, false);
  assert.deepEqual(app.tabs.get('Quote Requests'), snapshot, 'nothing may be added, cleared or overwritten');
});

test('existing tab with a different number of columns or a missing header cell is also refused', async () => {
  reset();
  const short = SCHEMA.map(([h]) => h).slice(0, 10);
  app.tabs.set('Quote Requests', [short]);
  const direct = JSON.parse(app.doPost(JSON.stringify(scriptPayload())));
  assert.equal(direct.success, false);
  assert.match(direct.message, /header mismatch in column 11/);
  assert.deepEqual(app.tabs.get('Quote Requests'), [short]);
});
