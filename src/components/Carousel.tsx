'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Picture } from '@/components/Picture';

/**
 * Scroll-snap carousel.
 *
 * Native scrolling does the work: no drag library, no transform maths, no
 * autoplay. Keyboard, trackpad, and touch all behave the way the platform
 * already defines. Arrows are progressive enhancement on top of a list that
 * is already usable without JavaScript.
 *
 * Round 11 (client): the caption copy under each slide is gone completely.
 * The strip is just images now, so every photograph carries its own alt
 * text instead of repeating a caption the page no longer shows.
 */
export function Carousel({ slugs, label }: { slugs: readonly string[]; label: string }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('li');
    const step = card ? card.clientWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/*
        The track scrolls, so it must be reachable and operable by keyboard.
        tabIndex 0 satisfies axe's scrollable-region-focusable rule while
        keeping the native list role intact, so the li children stay valid.
      */}
      <ul
        ref={trackRef}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label={label}
      >
        {slugs.map((slug, i) => {
          return (
            <li
              key={slug}
              className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw]"
            >
              <div className="group">
                {/*
                  Every slide is the same width and the same fixed height, so
                  the strip reads as one band instead of a ragged skyline.
                  Portrait and landscape sources both fill the frame through
                  object-cover rather than changing the card size.
                */}
                <div className="h-[300px] overflow-hidden bg-emerald-900/5 sm:h-[360px] lg:h-[420px]">
                  <Picture
                    slug={slug}
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 30vw"
                    imgClassName="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.04]"
                    priority={i === 0}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={() => nudge(-1)}
          disabled={atStart}
          aria-label="Previous images"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-emerald-600 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          disabled={atEnd}
          aria-label="Next images"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-emerald-600 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
