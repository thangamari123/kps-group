'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { AnnouncementItem } from '@/lib/cms-types';
import AnnouncementItemView from './AnnouncementItemView';

type PublicAnnouncement = Pick<
  AnnouncementItem,
  | 'id'
  | 'text'
  | 'label'
  | 'date'
  | 'location'
  | 'availability'
  | 'ctaText'
  | 'linkUrl'
  | 'ctaAction'
  | 'webinarTitle'
  | 'speed'
>;

interface BarState {
  items: PublicAnnouncement[];
  pauseOnHover: boolean;
}

const CACHE_KEY = 'kps-announcements-v2';

function readCache(): BarState {
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (parsed && Array.isArray(parsed.items)) {
      return { items: parsed.items, pauseOnHover: parsed.pauseOnHover !== false };
    }
  } catch {
    /* storage unavailable or corrupt */
  }
  return { items: [], pauseOnHover: true };
}

function writeCache(state: BarState) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
}

export default function AnnouncementBar() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  const [state, setState] = useState<BarState>({ items: [], pauseOnHover: true });
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);

  const { items, pauseOnHover } = state;
  const showing = !isAdminRoute && items.length > 0;

  const load = useCallback(async () => {
    try {
      // Loaded lazily so Firebase stays out of the initial bundle for every page
      const { announcementsCms } = await import('@/lib/cms-firestore');
      const [settings, active] = await Promise.all([
        announcementsCms.getSettings().catch(() => ({ enabled: true, pauseOnHover: true })),
        announcementsCms.getActive(),
      ]);
      const visible: PublicAnnouncement[] = settings.enabled
        ? active
            .filter((a) => typeof a.text === 'string' && a.text.trim())
            .map((a) => ({
              id: a.id,
              text: a.text.trim(),
              label: a.label,
              date: a.date,
              location: a.location,
              availability: a.availability,
              ctaText: a.ctaText,
              linkUrl: a.linkUrl,
              ctaAction: a.ctaAction,
              webinarTitle: a.webinarTitle,
              speed: a.speed,
            }))
        : [];
      const next = { items: visible, pauseOnHover: settings.pauseOnHover };
      setState(next);
      writeCache(next);
    } catch (err) {
      // A failed fetch must never break the public site: keep whatever is already shown
      console.warn('Announcement bar failed to load:', err);
    }
  }, []);

  // Start from the cached announcements (no layout jump), then refresh from Firestore
  useEffect(() => {
    if (isAdminRoute) return;
    setState(readCache());
    load();
    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [isAdminRoute, load]);

  // Reserve space for the fixed bar (the header and <body> read --announcement-h)
  useEffect(() => {
    if (!showing) return;
    document.documentElement.setAttribute('data-announcement', 'true');
    return () => document.documentElement.removeAttribute('data-announcement');
  }, [showing]);

  const advance = useCallback(() => setIndex((i) => i + 1), []);

  if (!showing) return null;

  const current = items[index % items.length];
  const pause = () => {
    pausedRef.current = pauseOnHover;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div
      role="region"
      aria-label="Announcements"
      className="fixed top-0 inset-x-0 z-50 h-9 sm:h-10 flex items-center bg-white border-b border-[#0F5B44]/20 shadow-[0_1px_0_rgba(15,91,68,0.04)]"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={(e) => {
        // Only keyboard focus pauses; a mouse click on the CTA (or focus returning after the popup closes) must not
        if ((e.target as HTMLElement).matches?.(':focus-visible')) pause();
      }}
      onBlur={resume}
    >
      {/* Keyed per announcement so the message restarts cleanly when the bar moves to the next one.
          With a single announcement there is nothing to advance to, so the message loops by itself. */}
      <AnnouncementItemView
        key={`${current.id}-${items.length > 1 ? index : 0}`}
        item={current}
        pausedRef={pausedRef}
        onMessageCycleEnd={items.length > 1 ? advance : undefined}
      />
    </div>
  );
}
