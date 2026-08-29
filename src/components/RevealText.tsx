'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

/**
 * Click-to-reveal text.
 *
 * Long copy stays clamped to a few lines so the page reads visually; a quiet
 * "Read more" control expands it in place. This is the site's standard way of
 * hiding supporting text behind a reveal, keeping pages minimal without
 * losing the words entirely.
 */
export function RevealText({
  text,
  lines = 3,
  className = '',
  labelOpen = 'Read more',
  labelClose = 'Show less',
}: {
  text: string;
  lines?: 2 | 3 | 4 | 5;
  className?: string;
  labelOpen?: string;
  labelClose?: string;
}) {
  const [open, setOpen] = useState(false);
  const clamp =
    lines === 2 ? 'line-clamp-2' : lines === 4 ? 'line-clamp-4' : lines === 5 ? 'line-clamp-5' : 'line-clamp-3';

  return (
    <div className={className}>
      <p className={`text-pretty ${open ? '' : clamp}`}>{text}</p>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-2 inline-flex min-h-[32px] items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-600 transition-colors hover:text-emerald-700"
      >
        {open ? labelClose : labelOpen}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
