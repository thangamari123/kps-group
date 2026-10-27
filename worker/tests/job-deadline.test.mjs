// Job application deadline: the shared rule (lib/job-deadline.ts) and its enforcement in the Worker routes.
// Run from the worker folder:  npm test
//
// Definition under test: a job is open THROUGH its closing date and closes when that date ends in India Standard
// Time (UTC+05:30). Firestore is stubbed; no network is used.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kps-deadline-'));

async function bundle(entry, name) {
  const outfile = path.join(tmp, name);
  await build({ entryPoints: [path.join(here, entry)], bundle: true, format: 'esm', platform: 'neutral', target: 'es2022', outfile, logLevel: 'silent' });
  return import(pathToFileURL(outfile).href);
}
const rule = await bundle('../../lib/job-deadline.ts', 'rule.mjs');
const worker = (await bundle('../src/index.ts', 'worker.mjs')).default;

// IST instants
const ist = (y, m, d, hh = 0, mm = 0, ss = 0, ms = 0) => Date.UTC(y, m - 1, d, hh, mm, ss, ms) - 330 * 60_000;

// ---------------------------------------------------------------- the rule
const FORMS = {
  'date only': '2026-10-31',
  'admin form value (ISO at 00:00 UTC)': '2026-10-31T00:00:00.000Z',
  'Date object': new Date('2026-10-31T00:00:00.000Z'),
  'Firestore Timestamp (toDate)': { toDate: () => new Date('2026-10-31T00:00:00.000Z') },
  'Firestore Timestamp (seconds)': { seconds: Date.parse('2026-10-31T00:00:00.000Z') / 1000 },
};
for (const [label, deadline] of Object.entries(FORMS)) {
  test(`deadline stored as ${label}: closing date is 2026-10-31 and the job is open through the whole day (IST)`, () => {
    assert.equal(rule.getDeadlineDate(deadline), '2026-10-31');
    assert.equal(rule.isDeadlinePassed(deadline, ist(2026, 10, 30, 23, 59, 59, 999)), false, 'day before');
    assert.equal(rule.isDeadlinePassed(deadline, ist(2026, 10, 31, 0, 0, 0, 0)), false, 'first moment of the closing date');
    assert.equal(rule.isDeadlinePassed(deadline, ist(2026, 10, 31, 12)), false, 'midday on the closing date');
    assert.equal(rule.isDeadlinePassed(deadline, ist(2026, 10, 31, 23, 59, 59, 999)), false, 'last millisecond of the closing date');
    assert.equal(rule.isDeadlinePassed(deadline, ist(2026, 11, 1, 0, 0, 0, 0)), true, 'first moment after the closing date');
    assert.equal(rule.isDeadlinePassed(deadline, ist(2026, 11, 20)), true, 'weeks later');
  });
}

test('cutoff instant is 18:30 UTC on the closing date', () => {
  assert.equal(new Date(rule.getDeadlineCutoffMs('2026-10-31')).toISOString(), '2026-10-31T18:30:00.000Z');
  assert.equal(new Date(rule.getDeadlineCutoffMs('2026-12-31')).toISOString(), '2026-12-31T18:30:00.000Z'); // year rollover
  assert.equal(rule.isDeadlinePassed('2026-12-31', ist(2027, 1, 1)), true);
  assert.equal(rule.isDeadlinePassed('2028-02-29', ist(2028, 2, 29, 23, 59)), false); // leap day
  assert.equal(rule.isDeadlinePassed('2028-02-29', ist(2028, 3, 1)), true);
});

test('no deadline, empty or unusable values never expire a job', () => {
  for (const d of [undefined, null, '', '   ', 'soon', '2026-02-30', '2026-13-01', {}, [], true]) {
    assert.equal(rule.getDeadlineDate(d), null, String(JSON.stringify(d)));
    assert.equal(rule.isDeadlinePassed(d, ist(2099, 1, 1)), false);
  }
});

test('active = published AND not past the closing date', () => {
  const now = ist(2026, 10, 30, 10);
  const open = (status, deadline) => rule.isJobOpenForApplications({ status, deadline }, now);
  assert.equal(open('published', '2026-10-31'), true);
  assert.equal(open('published', '2026-10-30'), true, 'closing date is today: still open');
  assert.equal(open('published', '2026-10-29'), false, 'closed yesterday');
  assert.equal(open('published', undefined), true);
  assert.equal(open('draft', '2026-12-01'), false);
  assert.equal(open('closed', '2026-12-01'), false);
  assert.equal(open('archived', undefined), false);
  assert.equal(rule.isJobOpenForApplications(null, now), false);
});

test('effective status: published past its date is "expired"; stored statuses are otherwise returned as is', () => {
  const now = ist(2026, 10, 30, 10);
  assert.equal(rule.getEffectiveJobStatus({ status: 'published', deadline: '2026-10-29' }, now), 'expired');
  assert.equal(rule.getEffectiveJobStatus({ status: 'published', deadline: '2026-10-30' }, now), 'published');
  assert.equal(rule.getEffectiveJobStatus({ status: 'draft', deadline: '2026-10-01' }, now), 'draft');
  assert.equal(rule.getEffectiveJobStatus({ status: 'closed', deadline: '2026-10-01' }, now), 'closed');
});

// ---------------------------------------------------------------- the Worker routes
const realNow = Date.now;
let puts;
let fetchLog;
let jobs; // id -> Firestore REST fields | 'forbidden'

const str = (v) => ({ stringValue: v });
const jobDoc = (over = {}) => ({ fields: { title: str('Customs Executive'), status: str('published'), ...over } });

globalThis.fetch = async (url, init = {}) => {
  const u = String(url);
  fetchLog.push(`${init.method || 'GET'} ${u}`);
  const jobMatch = /\/documents\/jobs\/([^/?]+)$/.exec(u);
  if (jobMatch) {
    const job = jobs[decodeURIComponent(jobMatch[1])];
    if (!job || job === 'forbidden') return new Response('{}', { status: job ? 403 : 404 });
    return new Response(JSON.stringify(job), { status: 200 });
  }
  if (u.endsWith(':runQuery')) return new Response(JSON.stringify([{ readTime: 'x' }]), { status: 200 }); // no duplicate
  if (/\/documents\/applications\?documentId=/.test(u)) return new Response(JSON.stringify({ name: 'projects/p/databases/(default)/documents/applications/app_1' }), { status: 200 });
  throw new Error('unexpected fetch ' + u);
};

const bucket = { put: async (key) => { puts.push(key); }, delete: async () => {} };
let ip = 0;
const env = () => ({ ENVIRONMENT: 'production', FIREBASE_PROJECT_ID: 'p', ALLOWED_ORIGINS: '', RESUMES_BUCKET: bucket });

function resumeForm(extra = {}) {
  const fd = new FormData();
  fd.set('resume', new File([new Uint8Array(200)], 'cv.pdf', { type: 'application/pdf' }));
  for (const [k, v] of Object.entries(extra)) fd.set(k, v);
  return fd;
}
async function call(route, form) {
  const res = await worker.fetch(new Request(`https://api.test${route}`, { method: 'POST', headers: { 'CF-Connecting-IP': `10.3.0.${++ip}` }, body: form }), env(), {});
  return { status: res.status, json: await res.json() };
}
const upload = (jobId) => call('/api/careers/resume/upload', resumeForm({ job_id: jobId, candidate_name: 'Asha', candidate_email: 'a@b.co' }));
const apply = (jobId) => call('/api/careers/applications', resumeForm({ job_id: jobId, candidate_name: 'Asha', email: 'asha@example.com', phone: '9876543210' }));
const setup = (nowMs, jobTable) => { Date.now = () => nowMs; puts = []; fetchLog = []; jobs = jobTable; };
const teardown = () => { Date.now = realNow; };

for (const [name, run] of [['resume upload', upload], ['application submission', apply]]) {
  test(`${name}: job past its closing date is rejected, nothing is stored`, async () => {
    setup(ist(2026, 11, 1, 0, 0, 1), { j1: jobDoc({ deadline: str('2026-10-31T00:00:00.000Z') }) });
    try {
      const { status, json } = await run('j1');
      assert.equal(status, 400);
      assert.equal(json.success, false);
      assert.match(json.error, /deadline for this position has passed/);
      assert.equal(puts.length, 0, 'no file may be written to R2');
      assert.ok(!fetchLog.some((l) => l.startsWith('POST') && l.includes('/applications?')), 'no application document may be created');
    } finally { teardown(); }
  });

  test(`${name}: job is still accepted on its closing date, up to the last millisecond`, async () => {
    setup(ist(2026, 10, 31, 23, 59, 59, 999), { j1: jobDoc({ deadline: str('2026-10-31T00:00:00.000Z') }) });
    try {
      const { status } = await run('j1');
      assert.equal(status, 201);
      assert.equal(puts.length, 1);
    } finally { teardown(); }
  });

  test(`${name}: job with no closing date is accepted`, async () => {
    setup(ist(2030, 1, 1), { j1: jobDoc() });
    try {
      assert.equal((await run('j1')).status, 201);
    } finally { teardown(); }
  });

  test(`${name}: closed / draft / archived / deleted jobs (not readable or not published) are rejected`, async () => {
    setup(ist(2026, 10, 1), {
      closed: jobDoc({ status: str('closed') }),
      hidden: 'forbidden', // public Firestore rules hide drafts and archived jobs: REST answers 403
    });
    try {
      for (const id of ['closed', 'hidden', 'missing']) {
        const { status, json } = await run(id);
        assert.equal(status, 400, id);
        assert.equal(json.success, false);
      }
      assert.equal(puts.length, 0);
    } finally { teardown(); }
  });

  test(`${name}: general (non job-specific) applications are not affected`, async () => {
    setup(ist(2026, 10, 1), {});
    try {
      assert.equal((await run('general')).status, 201);
      assert.ok(!fetchLog.some((l) => l.includes('/documents/jobs/')), 'no job lookup for a general application');
    } finally { teardown(); }
  });
}
