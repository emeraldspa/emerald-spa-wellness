'use client';

import { Hammer, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const DISMISS_KEY = 'emerald:construction-banner-dismissed';

/**
 * Thin construction notice pinned to the top of every page.
 *
 * Lets visitors know the site is still being finished and credits the studio
 * that is building it. Dismissible per browser so it never gets in the way on
 * repeat visits.
 */
export function ConstructionBanner() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(DISMISS_KEY)) setHidden(true);
    } catch {
      /* Storage can be blocked; the banner is harmless either way. */
    }
  }, []);

  if (hidden) return null;

  const dismiss = () => {
    setHidden(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  return (
    <div role="region" aria-label="Site status" className="relative z-[45] bg-emerald-900 text-ground">
      <div className="shell flex items-center justify-center gap-2 py-2.5 pr-11 text-center text-[10px] font-semibold uppercase tracking-[0.16em] sm:text-[11px]">
        <Hammer className="h-3.5 w-3.5 shrink-0 text-gold-300" aria-hidden="true" />
        <span>
          This site is under construction ·{' '}
          <Link
            href="https://studio.tangison.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-gold-300/50 underline-offset-2 transition-colors hover:text-gold-200"
          >
            Built by Tangison Studio
          </Link>
        </span>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss notice"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ground/70 transition-colors hover:bg-ground/10 hover:text-ground"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
