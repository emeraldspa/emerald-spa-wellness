'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const AMBIENCE_SRC = '/media/ambience.m4a';

/**
 * Room-tone toggle, self-contained.
 *
 * The video element in the hero is always muted (browsers refuse autoplay
 * audio), so the spa ambience lives on its own audio element here. It is
 * armed by the visitor's first real interaction and can be switched off at
 * any time.
 *
 * Round 9: this used to be an absolutely-positioned pill pinned under the
 * nav, which collided with the stats chip on short viewports (client
 * screenshot). It now renders in flow inside the hero's stats column, so it
 * can never overlap the nav or the stats regardless of viewport height.
 */
export function SoundToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
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
  }, []);

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

  if (!canSound) return null;

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.volume = 0.35;
      void el.play().then(() => setSoundOn(true)).catch(() => setSoundOn(false));
    } else {
      el.pause();
      setSoundOn(false);
    }
  };

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- room tone, no speech */}
      <audio ref={audioRef} src={AMBIENCE_SRC} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={soundOn}
        className="flex min-h-[44px] items-center gap-2 self-start rounded-full border border-ground/25 bg-[#07211A]/25 px-4 text-[11px] font-semibold uppercase tracking-widest text-ground shadow-sm backdrop-blur transition-colors hover:bg-[#07211A]/45"
      >
        {soundOn ? (
          <Volume2 className="h-4 w-4" aria-hidden="true" />
        ) : (
          <VolumeX className="h-4 w-4" aria-hidden="true" />
        )}
        {soundOn ? 'Sound on' : 'Sound off'}
      </button>
    </>
  );
}
