// Import of the original static awards (data/awards.js) into the admin-managed awards collection.
// Run from the worker folder:  npm test
//
// Covers the mapping (every award keeps its own image and metadata), that every referenced local image file exists,
// and that planning the import again never creates a duplicate.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(here, '../../public');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kps-awards-'));

async function bundle(entry, name) {
  const outfile = path.join(tmp, name);
  await build({ entryPoints: [path.join(here, entry)], bundle: true, format: 'esm', platform: 'neutral', target: 'es2022', outfile, logLevel: 'silent' });
  return import(pathToFileURL(outfile).href);
}
const { planLegacyAwardImport, legacyAwardDocId, legacyAwardToDraft } = await bundle('../../lib/awards-import.ts', 'import.mjs');
const { awardsData } = await bundle('../../data/awards.js', 'data.mjs');

/** Applies a plan to an in-memory collection, like createManyIfAbsent does (skips ids that exist). */
function apply(store, plan) {
  let created = 0;
  for (const c of plan.toCreate) {
    if (store.has(c.id)) continue;
    store.set(c.id, { id: c.id, ...c.data });
    created++;
  }
  return created;
}
const existingOf = (store) => [...store.values()];

test('the 7 existing awards are discovered with unique ids and distinct images', () => {
  assert.equal(awardsData.length, 7);
  assert.equal(new Set(awardsData.map((a) => a.id)).size, 7);
  assert.equal(new Set(awardsData.map((a) => a.image)).size, 7);
});

test('every local award image file exists on disk and is not empty (nothing is moved or deleted)', () => {
  for (const award of awardsData) {
    const file = path.join(publicDir, award.image);
    assert.ok(award.image.startsWith('/images/'), `${award.title}: ${award.image}`);
    assert.ok(fs.existsSync(file), `missing image file for "${award.title}": ${file}`);
    assert.ok(fs.statSync(file).size > 1000, `suspiciously small image: ${file}`);
  }
});

test('planning on an empty collection creates one record per award, with the right image and metadata, in the original order', () => {
  const plan = planLegacyAwardImport(awardsData, []);
  assert.equal(plan.toCreate.length, 7);
  assert.equal(plan.skipped.length, 0);

  plan.toCreate.forEach((candidate, index) => {
    const legacy = awardsData[index];
    assert.equal(candidate.id, `legacy-award-${legacy.id}`);
    assert.equal(candidate.id, legacyAwardDocId(legacy.id));
    assert.deepEqual(candidate.data, {
      title: legacy.title,
      organization: legacy.organization,
      year: legacy.year,
      category: legacy.category,
      description: legacy.description,
      date: legacy.date,
      imageUrl: legacy.image, // the same local file: no copy, no re-upload
      altText: legacy.title,
      featured: false,
      status: 'published',
      sortOrder: index + 1,
    });
  });
});

test('every award keeps ITS image: the image belongs to the same award as before', () => {
  const plan = planLegacyAwardImport(awardsData, []);
  const byLegacyId = new Map(awardsData.map((a) => [`legacy-award-${a.id}`, a]));
  for (const c of plan.toCreate) {
    const legacy = byLegacyId.get(c.id);
    assert.equal(c.data.imageUrl, legacy.image);
    assert.equal(c.data.title, legacy.title);
  }
  // spot check two awards whose titles name their image
  const kangaro = plan.toCreate.find((c) => /Kangaro/.test(c.data.title));
  assert.equal(kangaro.data.imageUrl, '/images/kangaroo-logistics.webp');
  const softlink = plan.toCreate.find((c) => /Softlink/.test(c.data.title));
  assert.equal(softlink.data.imageUrl, '/images/softlink-logistics.webp');
});

test('running the import again creates nothing (idempotent), even after the admin edited an imported award', () => {
  const store = new Map();
  assert.equal(apply(store, planLegacyAwardImport(awardsData, existingOf(store))), 7);

  // admin edits a title and unpublishes another one
  const first = store.get('legacy-award-7');
  store.set(first.id, { ...first, title: 'Renamed by admin' });
  const second = store.get('legacy-award-6');
  store.set(second.id, { ...second, status: 'draft' });

  const again = planLegacyAwardImport(awardsData, existingOf(store));
  assert.equal(again.toCreate.length, 0);
  assert.equal(again.skipped.length, 7);
  assert.ok(again.skipped.every((s) => s.reason === 'already-imported'));
  assert.equal(apply(store, again), 0);
  assert.equal(store.size, 7);
  assert.equal(store.get('legacy-award-7').title, 'Renamed by admin', 'an edited record is never overwritten by a re-import');
});

test('a partially imported collection only gets the missing awards', () => {
  const store = new Map();
  const full = planLegacyAwardImport(awardsData, []);
  store.set(full.toCreate[0].id, { id: full.toCreate[0].id, ...full.toCreate[0].data });
  const plan = planLegacyAwardImport(awardsData, existingOf(store));
  assert.equal(plan.toCreate.length, 6);
  assert.equal(plan.skipped.length, 1);
  assert.equal(apply(store, plan), 6);
  assert.equal(store.size, 7);
});

test('an award that was entered by hand earlier (same title and year, any capitalisation) is not duplicated', () => {
  const legacy = awardsData[2];
  const manual = [{ id: 'abc123', title: legacy.title.toUpperCase() + '  ', year: Number(legacy.year), sortOrder: 3 }];
  const plan = planLegacyAwardImport(awardsData, manual);
  assert.equal(plan.toCreate.length, 6);
  assert.equal(plan.skipped.find((s) => s.reason === 'matching-award-exists').legacy.id, legacy.id);
});

test('imported awards are placed after existing ones, keeping their original relative order', () => {
  const plan = planLegacyAwardImport(awardsData, [{ id: 'x', title: 'Unrelated award', year: 2020, sortOrder: 5 }]);
  assert.deepEqual(plan.toCreate.map((c) => c.data.sortOrder), [6, 7, 8, 9, 10, 11, 12]);
});

test('the draft omits the date when the original had none and never carries undefined values', () => {
  const draft = legacyAwardToDraft({ id: 99, title: 'T', year: '2024', image: '/images/x.webp' }, 1);
  assert.equal('date' in draft, false);
  assert.ok(Object.values(draft).every((v) => v !== undefined));
});
