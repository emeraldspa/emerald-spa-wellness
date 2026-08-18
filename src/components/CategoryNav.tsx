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
function useActiveCategory(items: Item[]) {
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

  return active;
}

/** Desktop rail. Lives inside the grid column beside the treatment list. */
export function CategoryNav({ items }: { items: Item[] }) {
  const active = useActiveCategory(items);

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
                    className={`group flex min-h-[40px] items-center justify-between gap-3 border-l-2 py-2 pl-3 text-sm transition-all duration-300 ${
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
    </>
  );
}

/**
 * Mobile category rail.
 *
 * Exported separately because it has to be a sibling of the whole grid rather
 * than a child of the narrow first column. A sticky element can only travel
 * inside its parent, and that column is only as tall as the rail itself, so
 * nested it would scroll straight out of view.
 */
export function CategoryRail({ items }: { items: Item[] }) {
  const active = useActiveCategory(items);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    // Show the rail once the reader is actually inside the treatment list,
    // and hide it again at the top where the page header already orients them.
    const first = document.getElementById(items[0]?.slug ?? '');
    const onScroll = () => {
      const startedList = first
        ? first.getBoundingClientRect().top < 200
        : window.scrollY > 600;
      const atBottom =
        window.innerHeight + window.scrollY > document.body.scrollHeight - 400;
      setPinned(startedList && !atBottom);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  return (
    <>
      {/*
        Mobile rail.

        It must span the full viewport while its parent is inside the padded
        shell. A negative margin achieved that but also widened the document,
        because the negative side pushed content past the right edge. Using
        viewport width with a centering translate keeps the rail edge to edge
        without ever contributing to page width.
      */}
      <div className={`fixed inset-x-0 top-[68px] z-40 border-y border-ink/10 bg-ground/96 backdrop-blur-md transition-transform duration-300 md:hidden ${
          pinned ? 'translate-y-0' : '-translate-y-[150%]'
        }`}>
        <ul
          tabIndex={0}
          aria-label="Treatment categories"
          className="flex gap-2 overflow-x-auto px-5 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((cat) => {
            const on = active === cat.slug;
            return (
              <li key={cat.slug} data-chip={cat.slug} className="shrink-0">
                <a
                  href={`#${cat.slug}`}
                  aria-current={on ? 'true' : undefined}
                  className={`inline-flex min-h-[44px] items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-xs transition-colors ${
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
