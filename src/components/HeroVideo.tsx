'use client';

import { useEffect, useRef, useState } from 'react';

const DESKTOP_SRC = '/media/hero-desktop.mp4';
const MOBILE_SRC = '/media/hero-mobile.mp4';

/**
 * Hero video, cut from the walkthrough footage the client supplied.
 *
 * The source is a 1080x1920 portrait clip. Stretching that across a desktop
 * hero would pillarbox or crop the subject out, so two encodes are served:
 * a 1600x900 centre crop for landscape viewports and the native portrait
 * framing for phones. The browser picks one before the file is fetched, so
 * nobody downloads both.
 *
 * The video element itself is always muted. Every browser refuses to autoplay
 * audio, so the room tone lives on a separate audio element owned by the
 * SoundToggle component, placed in flow in the hero's stats column (Round 9:
 * the old absolute pill under the nav collided with the stats on short
 * viewports).
 *
 * The clip is attached after load and skipped entirely for reduced motion or
 * Data Saver, where the poster frame stays. The poster is a real frame of the
 * Emerald reception, so that fallback is complete rather than degraded.
 */
export function HeroVideo({ poster, filter }: { poster: string; filter: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
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
      if (cancelled) return;
      const portrait = window.matchMedia('(max-aspect-ratio: 1/1)').matches;
      setSrc(portrait ? MOBILE_SRC : DESKTOP_SRC);
    };

    const schedule = () => {
      const ric = (window as Window & { requestIdleCallback?: typeof requestIdleCallback })
        .requestIdleCallback;
      if (ric) ric(attach, { timeout: 2500 });
      else window.setTimeout(attach, 900);
    };

    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', schedule);
    };
  }, []);

  useEffect(() => {
    if (src && videoRef.current) {
      videoRef.current.load();
      void videoRef.current.play().catch(() => {
        /* Autoplay can still be refused. The poster remains, which is fine. */
      });
    }
  }, [src]);

  return (
    <>
      <video
        ref={videoRef}
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
    </>
  );
}
