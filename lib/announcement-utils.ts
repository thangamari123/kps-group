// Shared helpers for the site-wide Announcement Bar (admin form + public renderer)
import type { AnnouncementSpeed } from './cms-types';

export const ANNOUNCEMENT_TEXT_MAX = 200;
export const ANNOUNCEMENT_SHORT_MAX = 40;
export const DEFAULT_ANNOUNCEMENT_LABEL = 'Announcement';
export const DEFAULT_CTA_TEXT = 'Learn more';
export const DEFAULT_REGISTER_CTA_TEXT = 'Register Now';

/** Window event that opens the webinar registration popup: detail = { announcementId, webinarName } */
export const OPEN_WEBINAR_REGISTRATION_EVENT = 'open-webinar-registration';

export const ANNOUNCEMENT_SPEEDS: { value: AnnouncementSpeed; label: string; pxPerSecond: number }[] = [
  { value: 'slow', label: 'Slow', pxPerSecond: 40 },
  { value: 'medium', label: 'Medium', pxPerSecond: 80 },
  { value: 'fast', label: 'Fast', pxPerSecond: 140 },
];

export function getSpeedPxPerSecond(speed?: string): number {
  return (ANNOUNCEMENT_SPEEDS.find((s) => s.value === speed) || ANNOUNCEMENT_SPEEDS[1]).pxPerSecond;
}

/**
 * Returns a trimmed, safe link or null if it is empty/unsafe.
 * Allowed: site-relative paths (/about-us), http(s) URLs, mailto: and tel:.
 */
export function normalizeAnnouncementLink(raw?: string | null): string | null {
  const value = (raw || '').trim();
  if (!value) return null;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  if (/^(mailto|tel):\S+$/i.test(value)) return value;
  try {
    const url = new URL(value);
    if (url.protocol === 'http:' || url.protocol === 'https:') return value;
  } catch {
    /* fall through */
  }
  return null;
}

export function isExternalLink(href: string): boolean {
  return !href.startsWith('/');
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-10-25" -> "Oct 25, 2026" (or "Oct 25" without the year). No timezone conversion; '' if invalid. */
export function formatAnnouncementDate(iso?: string | null, includeYear = true): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec((iso || '').trim());
  if (!match) return '';
  const [, y, m, d] = match;
  const month = Number(m);
  if (month < 1 || month > 12) return '';
  return includeYear ? `${MONTHS[month - 1]} ${Number(d)}, ${y}` : `${MONTHS[month - 1]} ${Number(d)}`;
}
