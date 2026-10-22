// Apps Script entry point (Code.gs + QuoteRequests.gs, exactly as pasted into the project) driven through the Worker.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const scriptDir = path.join(here, '../apps-script');
const outfile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'kps-worker-')), 'worker.mjs');
await build({ entryPoints: [path.join(here, '../src/index.ts')], bundle: true, format: 'esm', platform: 'neutral', target: 'es2022', outfile, logLevel: 'silent' });
const worker = (await import(pathToFileURL(outfile).href)).default;

const SCRIPT_URL = 'https://script.google.com/macros/s/TEST_DEPLOYMENT/exec';
const HEADERS = ['Submission ID', 'Timestamp', 'Enquiry Type', 'Status', 'Name', 'Email', 'Country Code', 'Phone', 'Company', 'Service Required', 'Cargo Weight / Volume', 'Origin', 'Destination', 'Cargo Specifications'];

function loadProject(fileOrder) {
  const tabs = new Map();
  const makeSheet = (grid) => ({
    getLastRow: () => grid.length,
    setFrozenRows() {},
    getRange(r, c, nr = 1, nc = 1) {
      return {
        getValues: () => Array.from({ length: nr }, (_, i) => Array.from({ length: nc }, (_, j) => (grid[r - 1 + i] || [])[c - 1 + j] ?? '')),
        getValue: () => (grid[r - 1] || [])[c - 1] ?? '',
        setValues(vals) { vals.forEach((row, i) => row.forEach((v, j) => { (grid[r - 1 + i] ||= [])[c - 1 + j] = v; })); return this; },
        setNumberFormat() { return this; },
        setFontWeight() { return this; },
      };
    },
  });
  const ss = {
    getSheetByName: (n) => (tabs.has(n) ? makeSheet(tabs.get(n)) : null),
    insertSheet: (n) => { tabs.set(n, []); return makeSheet(tabs.get(n)); },
  };
  const sandbox = {
    console,
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => null }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) },
    SpreadsheetApp: { getActiveSpreadsheet: () => ss, flush() {} },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (text) => ({ text, setMimeType() { return this; } }) },
  };
  vm.createContext(sandbox);
  for (const file of fileOrder) vm.runInContext(fs.readFileSync(path.join(scriptDir, file), 'utf8'), sandbox, { filename: file });
  return { tabs, post: (body) => sandbox.doPost({ postData: { contents: body } }).text, get: () => sandbox.doGet().text };
}

let project;
let calls;
globalThis.fetch = async (url, init) => {
  assert.equal(String(url), SCRIPT_URL);
  calls.push(JSON.parse(init.body));
  return new Response(project.post(init.body), { status: 200 });
};
const reset = (order = ['Code.gs', 'QuoteRequests.gs']) => { project = loadProject(order); calls = []; };

let ip = 0;
const quoteBody = () => ({
  name: 'Ravi Kumar', email: 'ravi@example.com', countryCode: '+91', phone: '9876543210', company: 'Kumar Traders',
  service: 'Containerized Cargo (FCL / LCL)', origin: 'Chennai', destination: 'Dubai', cargoWeight: '2 x 40ft',
  cargoDetails: `Entry point test ${Math.random()}`, website: '', elapsedMs: 9000,
});
const submit = async (body) => {
  const res = await worker.fetch(new Request('https://api.test/api/quotes', { method: 'POST', headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': `10.2.0.${++ip}` }, body: JSON.stringify(body) }), { ENVIRONMENT: 'production', APPS_SCRIPT_URL: SCRIPT_URL }, {});
  return { status: res.status, json: await res.json() };
};

test('project files define exactly one doPost and one doGet, and no old Contact Us sheet handler', () => {
  const files = fs.readdirSync(scriptDir).filter((f) => f.endsWith('.gs'));
  assert.deepEqual(files.sort(), ['Code.gs', 'QuoteRequests.gs']);
  const all = files.map((f) => fs.readFileSync(path.join(scriptDir, f), 'utf8')).join('\n');
  assert.equal((all.match(/^\s*function\s+doPost\s*\(/gm) || []).length, 1);
  assert.equal((all.match(/^\s*function\s+doGet\s*\(/gm) || []).length, 1);
  assert.equal((all.match(/^\s*function\s+routeQuoteRequest_\s*\(/gm) || []).length, 1);
  assert.ok(!/Missing required field/.test(all), 'old Contact Us validation must not be restored');
});

for (const order of [['Code.gs', 'QuoteRequests.gs'], ['QuoteRequests.gs', 'Code.gs']]) {
  test(`quote via Worker -> doPost is saved to the Quote Requests tab and confirmed (file order ${order.join(', ')})`, async () => {
    reset(order);
    const body = quoteBody();
    const { status, json } = await submit(body);
    assert.equal(status, 201);
    assert.equal(json.success, true);
    const [header, row] = project.tabs.get('Quote Requests');
    assert.deepEqual(header, HEADERS);
    assert.equal(row[0], json.data.id);
    assert.equal(row[2], 'Quote Request');
    assert.equal(row[3], 'New');
    assert.equal(row[4], 'Ravi Kumar');
    assert.equal(row[13], body.cargoDetails);
  });
}

test('response contract: success, enquiryType and submissionId are echoed exactly as the Worker requires', async () => {
  reset();
  const { json } = await submit(quoteBody());
  const sent = calls[0];
  const reply = JSON.parse(project.post(JSON.stringify(sent))); // the same submission again
  assert.equal(reply.success, true);
  assert.equal(reply.enquiryType, 'Quote Request');
  assert.equal(reply.submissionId, sent.submissionId);
  assert.equal(reply.submissionId, json.data.id);
  assert.equal(reply.duplicate, true);
  assert.equal(project.tabs.get('Quote Requests').length, 2);
});

test('anything that is not a quote is refused and writes nothing (old Contact Us payload, junk, empty)', () => {
  reset();
  const contact = JSON.stringify({ name: 'Asha', email: 'a@b.co', countryCode: '+91', phone: '9876543210', company: '', service: 'Customs Brokerage', message: 'hello there' });
  for (const body of [contact, 'not json', '', '{}', '[]', '{"enquiryType":"Contact Us"}']) {
    const reply = JSON.parse(project.post(body));
    assert.equal(reply.success, false, body);
    assert.equal(reply.error, 'unsupported_request', body);
  }
  assert.equal(project.tabs.size, 0, 'no tab may be created or written');
});

test('invalid quote is rejected by the quote handler, not by the entry point', () => {
  reset();
  const reply = JSON.parse(project.post('{"enquiryType":"Quote Request"}'));
  assert.deepEqual(reply, { success: false, error: 'invalid' });
  assert.equal(project.tabs.size, 0);
});

test('doGet health check answers valid JSON and touches nothing', () => {
  reset();
  assert.deepEqual(JSON.parse(project.get()), { success: true, message: 'KPS Contact API is running' });
  assert.equal(project.tabs.size, 0);
});
