'use client';

import { Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/**
 * Poster-first video reel.
 *
 * The poster paints first (a WebP still), then the loop starts only when it
 * is safe to: reduced-motion users get the still, and the video never plays
 * until the element is near the viewport. Tap toggles sound for guests who
 * want it; clicking the mute toggle is the only way audio starts, so the
 * page never autoplays sound.
 */
export function VideoReel({
  poster,
  srcs,
  className,
  aspect = 'aspect-video',
}: {
  poster: string;
  /** [{ type: 'video/mp4', src }, { type: 'video/webm', src }] */
  srcs: { type: string; src: string }[];
  className?: string;
  aspect?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  // Start playback when the reel scrolls near, unless reduced motion.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            videoRef.current?.play().catch(() => undefined);
            setPlaying(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  };

  return (
    <div
      ref={wrapRef}
      className={`group relative overflow-hidden rounded-2xl border border-ink/10 bg-emerald-900/10 ${aspect} ${className ?? ''}`}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload="none"
        aria-label="Video of Emerald Spa"
      >
        {srcs.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
      {playing ? (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#07211A]/55 text-ground backdrop-blur transition-colors hover:bg-[#07211A]/80"
        >
          {muted ? (
            <Play className="h-4 w-4 translate-x-px" aria-hidden="true" />
          ) : (
            <span className="sr-only">Sound on</span>
          )}
          {muted ? null : (
            <span aria-hidden="true" className="text-sm leading-none">
              ♪
            </span>
          )}
        </button>
      ) : null}
    </div>
  );
}
