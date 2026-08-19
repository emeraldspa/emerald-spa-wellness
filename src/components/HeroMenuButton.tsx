'use client';

import { useEffect, useState } from 'react';

/**
 * Small client island so the hero itself can stay a server component.
 * Dispatches a window event the page-level menu state listens for, and keeps
 * its own aria-expanded in sync via a state event the menu host broadcasts.
 */
export function HeroMenuButton({ targetId }: { targetId: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onState = (e: Event) => {
      const detail = (e as CustomEvent<{ open?: boolean }>).detail;
      setOpen(Boolean(detail?.open));
    };
    window.addEventListener(`${targetId}:state`, onState);
    return () => window.removeEventListener(`${targetId}:state`, onState);
  }, [targetId]);

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(targetId))}
      className="hero-down flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-full bg-ink"
      style={{ animationDelay: '0.5s' }}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      aria-controls="site-menu"
    >
      <span className="h-0.5 w-4 bg-white" />
      <span className="h-0.5 w-4 bg-white" />
      <span className="h-0.5 w-4 bg-white" />
    </button>
  );
}
