// Job application deadline rules, shared by the public Careers pages, the admin panel and the Cloudflare Worker
// (the Worker imports this file, so keep it free of browser, React and Firebase imports).
//
// Definition: a job is open THROUGH its closing date and closes when that date ends in the business timezone.
// The admin picks a calendar date; it is stored as before (an ISO string at 00:00 UTC of that date, e.g.
// "2026-10-31T00:00:00.000Z", or a plain "2026-10-31"). Applications are accepted until 23:59:59.999 IST on that
// date and rejected from 00:00 IST on the next day.
//
// The business timezone is India Standard Time (Asia/Kolkata): a fixed UTC+05:30 offset with no daylight saving.
// firestore.rules mirrors this rule (cutoff = closing date 00:00 UTC + 18h30m); change both together.

export const BUSINESS_TIMEZONE = 'Asia/Kolkata';
export const BUSINESS_UTC_OFFSET_MINUTES = 330;

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

function isRealDate(y: number, m: number, d: number): boolean {
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/**
 * The closing calendar date ("YYYY-MM-DD", in the business timezone) from whatever a job record stores:
 * a date string, an ISO timestamp string, a Date, epoch milliseconds, or a Firestore Timestamp.
 * Returns null when there is no (valid) deadline, which means the job never expires on its own.
 */
export function getDeadlineDate(deadline: unknown): string | null {
  if (deadline === null || deadline === undefined || deadline === '') return null;

  let ms: number;
  if (typeof deadline === 'string') {
    const text = deadline.trim();
    const dateOnly = DATE_ONLY.exec(text);
    if (dateOnly) return isRealDate(+dateOnly[1], +dateOnly[2], +dateOnly[3]) ? text : null;
    ms = Date.parse(text);
  } else if (deadline instanceof Date) {
    ms = deadline.getTime();
  } else if (typeof deadline === 'number') {
    ms = deadline;
  } else if (typeof (deadline as any).toDate === 'function') {
    ms = (deadline as any).toDate().getTime(); // Firestore Timestamp
  } else if (typeof (deadline as any).seconds === 'number') {
    ms = (deadline as any).seconds * 1000;
  } else {
    return null;
  }

  if (!Number.isFinite(ms)) return null;
  return new Date(ms + BUSINESS_UTC_OFFSET_MINUTES * 60_000).toISOString().slice(0, 10);
}

/** Epoch milliseconds at which applications close (the start of the day after the closing date), or null. */
export function getDeadlineCutoffMs(deadline: unknown): number | null {
  const date = getDeadlineDate(deadline);
  if (!date) return null;
  const [y, m, d] = date.split('-').map(Number);
  return Date.UTC(y, m - 1, d + 1) - BUSINESS_UTC_OFFSET_MINUTES * 60_000;
}

export function isDeadlinePassed(deadline: unknown, now: number = Date.now()): boolean {
  const cutoff = getDeadlineCutoffMs(deadline);
  return cutoff !== null && now >= cutoff;
}

/** Job statuses an admin can set that mean "accepting applications" (legacy records may use "active"). */
function isEnabledStatus(status: unknown): boolean {
  return status === 'published' || status === 'active';
}

/** Active = enabled by the admin (published) AND its closing date has not passed. */
export function isJobOpenForApplications(
  job: { status?: unknown; deadline?: unknown } | null | undefined,
  now: number = Date.now()
): boolean {
  return !!job && isEnabledStatus(job.status) && !isDeadlinePassed(job.deadline, now);
}

/**
 * The status to show/act on: a published job whose closing date has passed is "expired".
 * The stored status is never modified; this is derived every time jobs are read.
 */
export function getEffectiveJobStatus(
  job: { status?: unknown; deadline?: unknown },
  now: number = Date.now()
): string {
  if (isEnabledStatus(job.status) && isDeadlinePassed(job.deadline, now)) return 'expired';
  return String(job.status ?? '');
}
