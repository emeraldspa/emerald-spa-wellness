'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Poster-first silent video reel.
 *
 * The poster paints first (a WebP still), then the loop starts only when it
 * is safe to: reduced-motion users get the still, and the video never plays
 * until the element is near the viewport. Every reel file on the site carries
 * no audio track at all (client request, media-diet round), so there is no
 * sound toggle: the loops are purely visual and autoplay stays silent.
 */
export function VideoReel({
  poster,
  srcs,
  className,
  aspect = 'aspect-video',
}: {
  poster: string;
  /** [{ type: 'video/mp4', src }] — one H.264 file, silent. */
  srcs: { type: string; src: string }[];
  className?: string;
  aspect?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);

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
            setArmed(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
        muted
        loop
        playsInline
        preload="none"
        aria-label="Silent video of Emerald Spa"
      >
        {srcs.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
      {armed ? null : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        />
      )}
    </div>
  );
}
