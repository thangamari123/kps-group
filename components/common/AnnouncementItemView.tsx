import type { MutableRefObject } from 'react';
import Link from 'next/link';
import { Megaphone, Calendar, MapPin, ArrowRight } from 'lucide-react';
import type { AnnouncementItem } from '@/lib/cms-types';
import {
  DEFAULT_ANNOUNCEMENT_LABEL,
  DEFAULT_CTA_TEXT,
  DEFAULT_REGISTER_CTA_TEXT,
  OPEN_WEBINAR_REGISTRATION_EVENT,
  formatAnnouncementDate,
  isExternalLink,
  normalizeAnnouncementLink,
} from '@/lib/announcement-utils';
import AnnouncementMessage from './AnnouncementMessage';

export type AnnouncementViewData = Pick<
  AnnouncementItem,
  'text' | 'label' | 'date' | 'location' | 'availability' | 'ctaText' | 'linkUrl' | 'speed'
> &
  Partial<Pick<AnnouncementItem, 'id' | 'ctaAction' | 'webinarTitle'>>;

function Divider() {
  return <span aria-hidden="true" className="h-4 w-px shrink-0 bg-[#0F5B44]/25" />;
}

/**
 * One announcement laid out as a single line:
 * [📣 LABEL] | MESSAGE (flexible)  (date) (location)  availability | CTA →
 * The label and details sections are fixed; the message scrolls right-to-left inside its own
 * clipped, flexible section only when it does not fit. Shared by the public bar and the admin preview.
 * In `preview` mode the CTA is rendered as plain text instead of a link.
 *
 * Fixed parts are added as room allows so the message always keeps a usable window:
 *   phones (<480px)  icon, message, short date (no year), CTA
 *   480px+           + location badge, roomier gaps
 *   640px+           + full date with year
 *   768px+           + label text
 *   1024px+          + availability text
 */
export default function AnnouncementItemView({
  item,
  preview = false,
  pausedRef,
  onMessageCycleEnd,
}: {
  item: AnnouncementViewData;
  preview?: boolean;
  pausedRef?: MutableRefObject<boolean>;
  /** Advance to the next announcement once the message has finished */
  onMessageCycleEnd?: () => void;
}) {
  const label = item.label?.trim() || DEFAULT_ANNOUNCEMENT_LABEL;
  const date = formatAnnouncementDate(item.date);
  const shortDate = formatAnnouncementDate(item.date, false);
  const location = item.location?.trim();
  const availability = item.availability?.trim();
  const isRegister = item.ctaAction === 'register';
  const href = isRegister ? null : normalizeAnnouncementLink(item.linkUrl);
  const ctaText = isRegister
    ? item.ctaText?.trim() || DEFAULT_REGISTER_CTA_TEXT
    : href
      ? item.ctaText?.trim() || DEFAULT_CTA_TEXT
      : '';

  // The CTA opens the registration popup (mounted once in the root layout) instead of navigating
  const openRegistration = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!item.id) return;
    window.dispatchEvent(
      new CustomEvent(OPEN_WEBINAR_REGISTRATION_EVENT, {
        detail: {
          announcementId: item.id,
          webinarName: item.webinarTitle?.trim() || item.text,
          opener: e.currentTarget,
        },
      })
    );
  };

  const ctaContent = (
    <>
      <span className="truncate">{ctaText}</span>
      <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" aria-hidden="true" />
    </>
  );
  const ctaClass =
    'inline-flex max-w-[9.5rem] md:max-w-[14rem] items-center gap-1 text-[11px] md:text-xs font-bold text-[#073B2C] hover:text-[#0F7A5A] transition-colors';

  return (
    <div className="flex items-center gap-2 min-[480px]:gap-3 md:gap-4 w-full h-full min-w-0 px-2.5 sm:px-5 lg:px-8 text-[#073B2C]">
      {/* Fixed: label */}
      <span className="flex-none md:w-[150px] inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
        <Megaphone className="w-4 h-4 shrink-0 text-[#0F7A5A]" aria-hidden="true" />
        <span className="hidden md:inline truncate">{label}</span>
      </span>
      <Divider />

      {/* Flexible: the only part that scrolls (clipped to this section) */}
      <div className="flex-1 min-w-0 text-[11px] md:text-[13px] font-extrabold uppercase tracking-[0.02em] md:tracking-wide">
        <AnnouncementMessage
          text={item.text}
          speed={item.speed}
          pausedRef={pausedRef}
          onCycleEnd={onMessageCycleEnd}
        />
      </div>

      {/* Fixed: details */}
      <div className="flex-none flex items-center gap-2 min-[480px]:gap-3 md:gap-4 whitespace-nowrap">
        {date && (
          <span
            title={date}
            className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-[#2E9E78] px-2 sm:px-3 py-0.5 text-[10px] sm:text-[11px] font-semibold text-white"
          >
            <Calendar className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span className="sm:hidden">{shortDate}</span>
            <span className="hidden sm:inline">{date}</span>
          </span>
        )}

        {location && (
          <span className="hidden min-[480px]:inline-flex items-center gap-1.5 rounded-full bg-[#E8F5EF] px-2.5 md:px-3 py-0.5 text-[10px] md:text-[11px] font-semibold text-[#073B2C]">
            <MapPin className="w-3 h-3 shrink-0 text-[#0F7A5A]" aria-hidden="true" />
            {location}
          </span>
        )}

        {availability && (
          <span className="hidden lg:inline text-[11px] font-medium text-[#3D524A]">{availability}</span>
        )}

        {ctaText && (
          <>
            <Divider />
            {preview ? (
              <span className={ctaClass}>{ctaContent}</span>
            ) : isRegister ? (
              <button type="button" onClick={openRegistration} className={`${ctaClass} cursor-pointer`}>
                {ctaContent}
              </button>
            ) : href && isExternalLink(href) ? (
              <a
                href={href}
                target={/^https?:/i.test(href) ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={ctaClass}
              >
                {ctaContent}
              </a>
            ) : (
              <Link href={href as string} className={ctaClass}>
                {ctaContent}
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
