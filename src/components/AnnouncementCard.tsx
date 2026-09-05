'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export type SiteAnnouncement = {
  id: string;
  title: string;
  body: string;
  linkText?: string;
  linkUrl?: string;
};

/**
 * The announcement card: a small, dismissible notice that floats at the
 * bottom-left of the viewport. It is deliberately not a top banner: the
 * hero must keep fitting the viewport exactly (client rule since round 11),
 * and a banner above the header would push it out. A floating card adds no
 * layout shift, sits clear of the floating contact actions on the right,
 * and stays dismissed once a visitor closes it.
 */
export function AnnouncementCard({ notice }: { notice: SiteAnnouncement | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!notice) return;
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem('emerald-notice-dismissed') === notice.id;
    } catch {
      // Storage can be blocked; the card then simply shows every visit.
    }
    if (!dismissed) {
      const t = window.setTimeout(() => setVisible(true), 1200);
      return () => window.clearTimeout(t);
    }
  }, [notice]);

  if (!notice) return null;
  const current = notice;

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem('emerald-notice-dismissed', current.id);
    } catch {
      // Same story on the way out: private mode, quotas, nothing to do.
    }
  }

  return (
    <aside
      role="status"
      aria-label={`Announcement: ${current.title}`}
      className={`fixed bottom-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-emerald-300/20 bg-emerald-950/95 p-5 shadow-2xl shadow-black/40 backdrop-blur transition-all duration-500 motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
          Notice
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="-mr-1 -mt-1 rounded-full px-2 py-1 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          ×
        </button>
      </div>
      <p className="mt-2 font-[family-name:var(--font-display)] text-lg leading-snug text-white">
        {current.title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{current.body}</p>
      {current.linkText && current.linkUrl ? (
        <Link
          href={current.linkUrl}
          onClick={dismiss}
          className="mt-4 inline-block rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-emerald-950 transition hover:bg-emerald-400"
        >
          {current.linkText}
        </Link>
      ) : null}
    </aside>
  );
}
