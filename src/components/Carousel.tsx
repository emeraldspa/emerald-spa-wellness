'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Picture } from '@/components/Picture';
import { getImage } from '@/lib/site';

/**
 * Scroll-snap carousel.
 *
 * Native scrolling does the work: no drag library, no transform maths, no
 * autoplay. Keyboard, trackpad, and touch all behave the way the platform
 * already defines. Arrows are progressive enhancement on top of a list that
 * is already usable without JavaScript.
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
          const img = getImage(slug);
          const portrait = img.height > img.width;
          return (
            <li
              key={slug}
              className={`shrink-0 snap-start ${
                portrait
                  ? 'w-[68vw] sm:w-[38vw] lg:w-[24vw]'
                  : 'w-[86vw] sm:w-[56vw] lg:w-[38vw]'
              }`}
            >
              <figure className="group">
                <div className="overflow-hidden bg-emerald-900/5">
                  {/*
                    The visible figcaption already carries this description,
                    so repeating it in alt would make screen readers announce
                    the same sentence twice. Empty alt marks the image as
                    decorative and lets the caption do the work.
                  */}
                  <Picture
                    slug={slug}
                    alt=""
                    sizes="(max-width: 640px) 86vw, (max-width: 1024px) 56vw, 38vw"
                    imgClassName="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.04]"
                    priority={i === 0}
                  />
                </div>
                <figcaption className="mt-3 text-sm text-ink/70">{img.alt}</figcaption>
              </figure>
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
