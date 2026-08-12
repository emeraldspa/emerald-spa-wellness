'use client';

import { useEffect, useRef, useState } from 'react';

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260517_222138_3e3205be-3364-417b-a64a-bfe087acbec4.mp4';

/**
 * Deferred hero video.
 *
 * The source file is 22MB. Attaching it during initial load starves the
 * critical path on a throttled connection and pushes LCP past four seconds,
 * so the poster image carries first paint and the video is attached only
 * after the page has finished loading and the main thread is idle.
 *
 * It is skipped entirely when the visitor has asked for reduced motion or
 * has Data Saver enabled, in which case the poster stays. That is a real
 * fallback, not a degraded one: the poster is a genuine photograph of the
 * reception at Emerald.
 */
export function HeroVideo({ poster, filter }: { poster: string; filter: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    if (reduce || conn?.saveData || conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g') {
      return;
    }

    let cancelled = false;
    const attach = () => {
      if (!cancelled) setSrc(HERO_VIDEO);
    };

    const schedule = () => {
      const ric = (window as Window & { requestIdleCallback?: typeof requestIdleCallback })
        .requestIdleCallback;
      if (ric) {
        ric(attach, { timeout: 3000 });
      } else {
        window.setTimeout(attach, 1200);
      }
    };

    if (document.readyState === 'complete') {
      schedule();
    } else {
      window.addEventListener('load', schedule, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', schedule);
    };
  }, []);

  useEffect(() => {
    if (src && ref.current) {
      ref.current.load();
      void ref.current.play().catch(() => {
        /* Autoplay can be refused. The poster remains, which is acceptable. */
      });
    }
  }, [src]);

  return (
    <video
      ref={ref}
      style={{ filter }}
      className="absolute inset-0 h-full w-full object-cover"
      loop
      muted
      playsInline
      preload="none"
      poster={poster}
      aria-hidden="true"
      tabIndex={-1}
    >
      {src ? <source src={src} type="video/mp4" /> : null}
    </video>
  );
}
