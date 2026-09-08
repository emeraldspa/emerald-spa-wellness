'use client';

import { useEffect, useRef, useState } from 'react';

const DESKTOP_SRC = '/media/hero-desktop.webm';
const MOBILE_SRC = '/media/hero-mobile.webm';
const DESKTOP_TYPE = 'video/webm; codecs="vp9, opus"';
const MOBILE_TYPE = 'video/webm; codecs="vp9"';

/**
 * Hero reel, cut from the venue tour film the client supplied (Round 19).
 *
 * The client's 61.7s master was trimmed to a 22.4s loop of its strongest
 * scenes and encoded as VP9 WebM: a 1600x900 landscape cut for desktop
 * viewports and a 640x1138 crop for phones. The browser picks one before
 * the file is fetched, so nobody downloads both.
 *
 * The reel is a silent visual since 8 Sep 2025: the site has exactly one
 * sound channel now, the looping ambience track (SiteAudio) controlled by
 * the floating sound button. Two audios at once would fight each other, so
 * the reel always plays muted and its own soundtrack stays untouched in the
 * file, ready if the client ever wants it back.
 *
 * The clip is attached after load and skipped entirely for reduced motion or
 * Data Saver, where the poster frame stays. The poster is a real frame of
 * the reel's opening garden scene, so that fallback is complete rather
 * than degraded.
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
    // eslint-disable-next-line jsx-a11y/media-has-caption -- background reel, no speech
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
      {src ? (
        <source src={src} type={src === DESKTOP_SRC ? DESKTOP_TYPE : MOBILE_TYPE} />
      ) : null}
    </video>
  );
}
