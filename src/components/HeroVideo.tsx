'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const DESKTOP_SRC = '/media/hero-desktop.mp4';
const MOBILE_SRC = '/media/hero-mobile.mp4';
const AMBIENCE_SRC = '/media/ambience.m4a';

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
 * audio, so the room tone lives on a separate audio element that is armed by
 * the visitor's first real interaction and can be switched off at any time.
 * That is the closest a site can honestly get to "sound on arrival" without
 * the browser silently blocking it.
 *
 * The clip is attached after load and skipped entirely for reduced motion or
 * Data Saver, where the poster frame stays. The poster is a real frame of the
 * Emerald reception, so that fallback is complete rather than degraded.
 */
export function HeroVideo({ poster, filter }: { poster: string; filter: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [canSound, setCanSound] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    if (reduce || conn?.saveData || conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g') {
      return;
    }

    setCanSound(true);

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

  /**
   * Arm the room tone on the first genuine interaction. Browsers only grant
   * playback inside a user gesture, so this listens once and then removes
   * itself. It starts quiet and eases up rather than arriving at full volume.
   */
  useEffect(() => {
    if (!canSound) return;
    let done = false;

    const arm = () => {
      if (done) return;
      const el = audioRef.current;
      if (!el) return;
      done = true;
      el.volume = 0;
      void el
        .play()
        .then(() => {
          setSoundOn(true);
          const target = 0.35;
          const step = () => {
            if (!audioRef.current || audioRef.current.paused) return;
            const next = Math.min(target, audioRef.current.volume + 0.02);
            audioRef.current.volume = next;
            if (next < target) window.setTimeout(step, 90);
          };
          step();
        })
        .catch(() => {
          /* Still blocked. The toggle stays available. */
        });
    };

    const opts = { once: true, passive: true } as const;
    window.addEventListener('pointerdown', arm, opts);
    window.addEventListener('keydown', arm, opts);
    window.addEventListener('scroll', arm, opts);
    window.addEventListener('touchstart', arm, opts);
    return () => {
      window.removeEventListener('pointerdown', arm);
      window.removeEventListener('keydown', arm);
      window.removeEventListener('scroll', arm);
      window.removeEventListener('touchstart', arm);
    };
  }, [canSound]);

  const toggleSound = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.volume = 0.35;
      void el.play().then(() => setSoundOn(true)).catch(() => setSoundOn(false));
    } else {
      el.pause();
      setSoundOn(false);
    }
  }, []);

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

      {canSound ? (
        <>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption -- room tone, no speech */}
          <audio ref={audioRef} src={AMBIENCE_SRC} loop preload="none" />
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            className="absolute left-5 top-[4.5rem] z-20 flex min-h-[44px] items-center gap-2 rounded-full border border-ink/15 bg-ground/85 px-4 text-[11px] font-semibold uppercase tracking-widest text-ink shadow-sm backdrop-blur transition-colors hover:bg-ground sm:left-8 md:left-12 md:top-24"
          >
            {soundOn ? (
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <VolumeX className="h-4 w-4" aria-hidden="true" />
            )}
            {soundOn ? 'Sound on' : 'Sound off'}
          </button>
        </>
      ) : null}
    </>
  );
}
