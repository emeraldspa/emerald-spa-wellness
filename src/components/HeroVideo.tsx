'use client';

import { useEffect, useRef, useState } from 'react';
import {
  HERO_SOUND_STATE,
  HERO_SOUND_TOGGLE,
  HERO_VIDEO_GONE,
  HERO_VIDEO_READY,
  SOUND_PREF_KEY,
  type HeroSoundDetail,
} from '@/lib/sound';

const DESKTOP_SRC = '/media/hero-desktop.webm';
const MOBILE_SRC = '/media/hero-mobile.webm';
const DESKTOP_TYPE = 'video/webm; codecs="vp9, opus"';
const MOBILE_TYPE = 'video/webm; codecs="vp9"';
const TARGET_VOLUME = 0.45;

/**
 * Hero reel, cut from the venue tour film the client supplied (Round 19).
 *
 * The client's 61.7s master was trimmed to a 22.4s loop of its strongest
 * scenes and encoded as VP9 WebM: a 1600x900 landscape cut for desktop
 * viewports and - kept from the earlier portrait shoot - a 640x1138 crop
 * for phones. The browser picks one before the file is fetched, so nobody
 * downloads both. Only the desktop cut carries audio (the portrait source
 * was shot silent), so the sound widget appears for the desktop reel only.
 *
 * Sound: browsers refuse autoplay with audio, so the reel always starts
 * muted. On the visitor's first pointer/key/touch we unmute and ease the
 * volume up; the floating widget (FloatingActions) can mute again, and the
 * preference survives visits. If the browser refuses the unmute (some
 * activation rules), the state announced to the widget stays truthful.
 *
 * The clip is attached after load and skipped entirely for reduced motion or
 * Data Saver, where the poster frame stays. The poster is a real frame of
 * the reel's opening garden scene, so that fallback is complete rather
 * than degraded.
 */
export function HeroVideo({ poster, filter }: { poster: string; filter: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);

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

  // React's muted prop is not reliably synced to the DOM property after
  // mount, so the property stays the single source of truth.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted, src]);

  // Sound bridge: arm on first real interaction, answer widget toggles,
  // announce every state change so the floating widget always shows the
  // truth. Only the desktop cut has an audio stream.
  useEffect(() => {
    const video = videoRef.current;
    if (!src || !video) return;
    const hasAudio = src === DESKTOP_SRC;

    const announce = () => {
      window.dispatchEvent(
        new CustomEvent<HeroSoundDetail>(HERO_SOUND_STATE, {
          detail: { muted: video.muted, hasAudio },
        }),
      );
    };

    const onPlaying = () => {
      window.dispatchEvent(new CustomEvent(HERO_VIDEO_READY));
      announce();
      video.removeEventListener('playing', onPlaying);
    };
    video.addEventListener('playing', onPlaying);

    let pref: string | null = null;
    try {
      pref = window.localStorage.getItem(SOUND_PREF_KEY);
    } catch {
      /* private mode: no persistence, still fully functional */
    }

    const easeIn = () => {
      video.volume = 0;
      const step = () => {
        if (video.muted || video.paused) return;
        video.volume = Math.min(TARGET_VOLUME, video.volume + 0.03);
        if (video.volume < TARGET_VOLUME) window.setTimeout(step, 80);
      };
      step();
      // If the browser silently ignored the unmute (activation rules),
      // roll the widget state back so it never lies.
      window.setTimeout(() => {
        if (video.muted) {
          setMuted(true);
          announce();
        }
      }, 150);
    };

    const setSound = (on: boolean, persist: boolean) => {
      video.muted = !on;
      setMuted(!on);
      if (persist) {
        try {
          window.localStorage.setItem(SOUND_PREF_KEY, on ? 'on' : 'off');
        } catch {
          /* ignore */
        }
      }
      announce();
      if (on && !video.paused) easeIn();
      else if (on) void video.play().then(easeIn).catch(() => announce());
    };

    const onToggle = () => setSound(video.muted, true);

    let armed = false;
    const arm = () => {
      if (armed || !hasAudio || pref === 'off') return;
      armed = true;
      removeArm();
      if (!video.paused && video.muted) setSound(true, false);
    };
    const opts = { once: true, passive: true } as const;
    window.addEventListener('pointerdown', arm, opts);
    window.addEventListener('keydown', arm, opts);
    window.addEventListener('touchstart', arm, opts);
    const removeArm = () => {
      window.removeEventListener('pointerdown', arm);
      window.removeEventListener('keydown', arm);
      window.removeEventListener('touchstart', arm);
    };

    window.addEventListener(HERO_SOUND_TOGGLE, onToggle);

    return () => {
      video.removeEventListener('playing', onPlaying);
      removeArm();
      window.removeEventListener(HERO_SOUND_TOGGLE, onToggle);
      window.dispatchEvent(new CustomEvent(HERO_VIDEO_GONE));
    };
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
