'use client';

import { useEffect, useState } from 'react';

type Item = { slug: string; name: string; count: number };

/**
 * Treatment category navigation with position tracking.
 *
 * Ninety treatments is a long page, and a plain list of anchors tells you
 * where you can go but never where you are. An observer watches each category
 * heading and marks the one currently in view, so the list doubles as a
 * position indicator.
 *
 * Two presentations from one source: a vertical rail on desktop, and a
 * horizontal scrolling strip pinned under the sticky bar on mobile, where a
 * thirteen item vertical list would be taller than the screen.
 *
 * Anchors are real hrefs, so this works with JavaScript disabled and the
 * observer only adds the highlight.
 */
export function CategoryNav({ items }: { items: Item[] }) {
  const [active, setActive] = useState<string>(items[0]?.slug ?? '');

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.slug))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer whichever tracked section is nearest the top of the reading
        // area. Using the last intersecting entry alone flickers when two
        // sections are on screen together.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // The band sits just under the sticky bar, so the highlight changes when
      // a heading reaches reading position rather than when it first appears.
      { rootMargin: '-88px 0px -70% 0px', threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    // Keep the active chip in view on the mobile rail without scrolling the page.
    const chip = document.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    chip?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [active]);

  return (
    <>
      {/* Desktop rail */}
      <nav className="hidden md:block md:h-full" aria-label="Treatment categories">
        <div className="sticky top-24">
          <p className="eyebrow text-emerald-700">Jump to</p>
          <ul className="mt-5 space-y-1">
            {items.map((cat) => {
              const on = active === cat.slug;
              return (
                <li key={cat.slug}>
                  <a
                    href={`#${cat.slug}`}
                    aria-current={on ? 'true' : undefined}
                    className={`group flex items-baseline justify-between gap-3 border-l-2 py-1.5 pl-3 text-sm transition-all duration-300 ${
                      on
                        ? 'border-emerald-700 pl-4 font-medium text-emerald-800'
                        : 'border-ink/10 text-ink/70 hover:border-ink/30 hover:text-ink'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`text-xs tabular-nums transition-colors ${
                        on ? 'text-emerald-700' : 'text-ink/65'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile rail, pinned under the sticky bar */}
      <div className="sticky top-0 z-30 -mx-[var(--grid-padding)] border-b border-ink/10 bg-ground/95 backdrop-blur-md md:hidden">
        <ul
          tabIndex={0}
          aria-label="Treatment categories"
          className="flex gap-2 overflow-x-auto px-[var(--grid-padding)] py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((cat) => {
            const on = active === cat.slug;
            return (
              <li key={cat.slug} data-chip={cat.slug} className="shrink-0">
                <a
                  href={`#${cat.slug}`}
                  aria-current={on ? 'true' : undefined}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                    on
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-ink/20 text-ink/75'
                  }`}
                >
                  {cat.name}
                  <span className={on ? 'text-white/80' : 'text-ink/65'}>{cat.count}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
