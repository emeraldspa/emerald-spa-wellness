'use client';

import { useEffect, useRef } from 'react';
import { AMBIENCE_PATH } from '@/lib/site';
import { MUSIC_PREF_KEY, MUSIC_STATE, MUSIC_TOGGLE, type MusicStateDetail } from '@/lib/sound';

const TARGET_VOLUME = 0.55;
const FADE_STEP = 0.035;
const FADE_MS = 70;

/**
 * The site's one sound: a looping ambience track, mounted once in the root
 * layout so it plays continuously across every route without restarting.
 *
 * Client brief (8 Sep 2025): the song must be on, it must be pauseable, and
 * the control must be obvious, on the side, on mobile too. Browsers refuse
 * audible autoplay, so "on" means: the moment the visitor gives the page
 * their first tap, click or key press, the track fades in by itself, and
 * from then on it keeps playing across the whole site until they pause it.
 * The choice persists between visits (localStorage), and the floating sound
 * button always shows the truth through the MUSIC_STATE events.
 *
 * The track itself ships at /public/media/audio/ambience.m4a and is
 * drop-in replaceable with the client's own file (see AMBIENCE_PATH).
 * Audio is fetched only when playback actually starts: preload="none"
 * keeps it out of every page budget until the visitor has opted in.
 */
export function SiteAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let pref: string | null = null;
    try {
      pref = window.localStorage.getItem(MUSIC_PREF_KEY);
    } catch {
      /* private mode: no persistence, still fully functional */
    }

    const announce = () => {
      window.dispatchEvent(
        new CustomEvent<MusicStateDetail>(MUSIC_STATE, { detail: { playing: !audio.paused } }),
      );
    };

    const easeIn = () => {
      audio.volume = 0;
      const step = () => {
        if (audio.paused) return;
        audio.volume = Math.min(TARGET_VOLUME, audio.volume + FADE_STEP);
        if (audio.volume < TARGET_VOLUME) window.setTimeout(step, FADE_MS);
      };
      step();
    };

    const start = (persist: boolean) => {
      const play = () => {
        easeIn();
        announce();
      };
      void audio
        .play()
        .then(play)
        .catch(() => {
          /* a tiny fraction of browsers still refuse; the button stays the way in */
          announce();
        });
      if (persist) {
        try {
          window.localStorage.setItem(MUSIC_PREF_KEY, 'on');
        } catch {
          /* ignore */
        }
      }
    };

    const pause = (persist: boolean) => {
      audio.pause();
      if (persist) {
        try {
          window.localStorage.setItem(MUSIC_PREF_KEY, 'off');
        } catch {
          /* ignore */
        }
      }
      announce();
    };

    const toggle = () => {
      if (audio.paused) start(true);
      else pause(true);
    };

    /* Returning visitors who paused the music keep it paused; everyone else
       gets the track on their first interaction with the page. */
    let armed = pref !== 'off';
    const arm = () => {
      if (!armed) return;
      armed = false;
      removeArm();
      start(false);
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

    audio.addEventListener('playing', announce);
    audio.addEventListener('pause', announce);
    window.addEventListener(MUSIC_TOGGLE, toggle);

    return () => {
      audio.removeEventListener('playing', announce);
      audio.removeEventListener('pause', announce);
      removeArm();
      window.removeEventListener(MUSIC_TOGGLE, toggle);
      audio.pause();
    };
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption -- ambient loop, no speech
    <audio ref={audioRef} src={AMBIENCE_PATH} loop preload="none" aria-hidden="true" tabIndex={-1} />
  );
}
