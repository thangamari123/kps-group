// Import of the original (static) awards into the admin-managed awards collection.
//
// The public site used to list awards from data/awards.js with images in public/images. This module maps those
// entries to award records and plans an idempotent import: every legacy award gets a deterministic document id,
// so running the import again (or from two browsers) can never create a duplicate. The local image files are not
// touched; the record just points at the same "/images/..." path.
import type { AwardItem } from './cms-types';

export interface LegacyAward {
  id: number | string;
  title: string;
  year: number | string;
  /** Display date, e.g. "15th October 2026, Chennai" */
  date?: string;
  organization?: string;
  category?: string;
  description?: string;
  /** Local image path, e.g. "/images/kangaroo-logistics.webp" */
  image: string;
}

export type AwardDraft = Omit<AwardItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;

export interface ImportCandidate {
  id: string;
  data: AwardDraft;
  legacy: LegacyAward;
}

export interface ImportPlan {
  toCreate: ImportCandidate[];
  skipped: { legacy: LegacyAward; reason: 'already-imported' | 'matching-award-exists' }[];
}

/** Deterministic Firestore document id for a legacy award (the idempotency key). */
export function legacyAwardDocId(id: number | string): string {
  return `legacy-award-${id}`;
}

const normalize = (value: unknown) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

export function legacyAwardToDraft(legacy: LegacyAward, sortOrder: number): AwardDraft {
  const draft: AwardDraft = {
    title: legacy.title,
    organization: legacy.organization || '',
    year: legacy.year,
    category: legacy.category || '',
    description: legacy.description || '',
    imageUrl: legacy.image,
    altText: legacy.title,
    featured: false,
    status: 'published',
    sortOrder,
  };
  if (legacy.date) draft.date = legacy.date;
  return draft;
}

/**
 * Decides which legacy awards still have to be created.
 * - Skipped when its deterministic id already exists (already imported, possibly edited since).
 * - Skipped when an award with the same title and year exists (e.g. entered by hand earlier).
 * New records keep the original list order and are placed after any existing awards.
 */
export function planLegacyAwardImport(
  legacy: LegacyAward[],
  existing: Pick<AwardItem, 'id' | 'title' | 'year' | 'sortOrder'>[]
): ImportPlan {
  const existingIds = new Set(existing.map((a) => a.id));
  const existingKeys = new Set(existing.map((a) => `${normalize(a.title)}|${normalize(a.year)}`));
  const base = existing.reduce((max, a) => (Number.isFinite(Number(a.sortOrder)) ? Math.max(max, Number(a.sortOrder)) : max), 0);

  const plan: ImportPlan = { toCreate: [], skipped: [] };
  for (const award of legacy) {
    const id = legacyAwardDocId(award.id);
    if (existingIds.has(id)) {
      plan.skipped.push({ legacy: award, reason: 'already-imported' });
    } else if (existingKeys.has(`${normalize(award.title)}|${normalize(award.year)}`)) {
      plan.skipped.push({ legacy: award, reason: 'matching-award-exists' });
    } else {
      plan.toCreate.push({ id, data: legacyAwardToDraft(award, base + plan.toCreate.length + 1), legacy: award });
    }
  }
  return plan;
}
