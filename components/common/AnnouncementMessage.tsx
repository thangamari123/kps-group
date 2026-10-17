'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { getSpeedPxPerSecond } from '@/lib/announcement-utils';

export const DEFAULT_DWELL_MS = 6000;
const SCROLL_FADE_MASK = 'linear-gradient(to right, transparent 0, #000 14px, #000 calc(100% - 14px), transparent 100%)';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

interface AnnouncementMessageProps {
  text: string;
  speed?: string;
  /** While `.current` is true the message holds still (hover / focus on the bar) */
  pausedRef?: MutableRefObject<boolean>;
  /**
   * Called when the message is done: after one full scrolling pass, or after `dwellMs`
   * for a message that fits. Without it the message loops on its own (single announcement).
   */
  onCycleEnd?: () => void;
  dwellMs?: number;
}

/**
 * The announcement message inside its own clipped box (the flexible middle section of the bar).
 * It sits still when it fits; when it is longer than the box it enters from the right edge and
 * scrolls right-to-left inside it, then re-enters from the right. Exactly one copy of the text
 * is rendered.
 */
export default function AnnouncementMessage({
  text,
  speed,
  pausedRef,
  onCycleEnd,
  dwellMs = DEFAULT_DWELL_MS,
}: AnnouncementMessageProps) {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  const onCycleEndRef = useRef(onCycleEnd);
  useLayoutEffect(() => {
    onCycleEndRef.current = onCycleEnd;
  });
  const hasCycleEnd = !!onCycleEnd;

  // Does the text fit in the room the bar leaves for it?
  useLayoutEffect(() => {
    const container = containerRef.current;
    const el = textRef.current;
    if (!container || !el) return;
    const check = () => setOverflowing(el.scrollWidth > container.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(container);
    ro.observe(el);
    document.fonts?.ready.then(check).catch(() => {});
    return () => ro.disconnect();
  }, [text, reduced]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const el = textRef.current;
    if (!container || !el) return;

    const scrolling = overflowing && !reduced;
    el.style.transform = '';
    // A message that fits, with nothing to advance to, just stays put
    if (!scrolling && !hasCycleEnd) return;

    const pxPerSecond = getSpeedPxPerSecond(speed);
    let raf = 0;
    let last = performance.now();
    // translateX of the text: starts just outside the right edge of the box and moves left
    let x = scrolling ? container.clientWidth : 0;
    el.style.transform = `translate3d(${x}px,0,0)`;
    let dwellElapsed = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      if (!pausedRef?.current) {
        if (!scrolling) {
          dwellElapsed += dt * 1000;
          if (dwellElapsed >= dwellMs) {
            dwellElapsed = 0;
            onCycleEndRef.current?.();
          }
        } else {
          x -= pxPerSecond * dt;
          if (x <= -el.offsetWidth) {
            // Fully out on the left: hand over to the next announcement, or re-enter from the right
            x = container.clientWidth;
            onCycleEndRef.current?.();
          }
          el.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [overflowing, reduced, speed, hasCycleEnd, dwellMs, pausedRef, text]);

  return (
    <div
      ref={containerRef}
      className="min-w-0 w-full overflow-hidden leading-tight"
      // Soft fade at both edges while scrolling so letters are not cut mid-glyph
      style={overflowing && !reduced ? { maskImage: SCROLL_FADE_MASK, WebkitMaskImage: SCROLL_FADE_MASK } : undefined}
    >
      <span
        ref={textRef}
        title={reduced ? text : undefined}
        className={`${reduced ? 'block truncate' : 'inline-block'} whitespace-nowrap will-change-transform`}
      >
        {text}
      </span>
    </div>
  );
}
