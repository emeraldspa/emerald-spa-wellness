'use client';

import { ArrowUp, MessageCircle, Star, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GOOGLE_REVIEW_URL, WHATSAPP_URL, site } from '@/lib/site';

/**
 * Floating actions: WhatsApp chat, Google review, scroll to top.
 *
 * Every control here is conditional rather than always mounted:
 *
 * - The whole cluster is suppressed on `/book`, where a fixed overlay would
 *   sit on top of the booking iframe's own controls.
 * - Scroll to top appears only once the visitor is past the first viewport,
 *   and leaves the tab order entirely while hidden.
 * - The chat and review actions collapse into a single toggle on small
 *   screens so they never stack into a column that covers content, and
 *   expand on wider screens where there is room.
 *
 * WhatsApp and the review link are real destinations, not a fake chat widget.
 */
export function FloatingActions() {
  const pathname = usePathname();
  const [showTop, setShowTop] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the expanded cluster when the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // The booking frame owns the whole viewport on this route.
  if (pathname === '/book') return null;

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div
      className="fixed right-4 z-40 flex flex-col items-end gap-3 sm:right-6"
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
    >
      <button
        type="button"
        onClick={toTop}
        aria-label="Scroll back to top"
        tabIndex={showTop ? 0 : -1}
        aria-hidden={!showTop}
        className={`flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 bg-ground text-ink shadow-lg transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-emerald-600 hover:text-emerald-600 ${
          showTop
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <ArrowUp className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Secondary actions, revealed by the toggle. */}
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-2 opacity-0'
        }`}
      >
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Leave a Google review for ${site.legalName}`}
          tabIndex={open ? 0 : -1}
          aria-hidden={!open}
          className="flex items-center gap-2 rounded-full border border-ink/15 bg-ground py-3 pl-4 pr-5 text-xs font-semibold uppercase tracking-widest text-ink shadow-lg transition-colors hover:border-emerald-600 hover:text-emerald-600"
        >
          <Star className="h-4 w-4 text-gold-500" aria-hidden="true" />
          Review us
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat with ${site.legalName} on WhatsApp`}
          tabIndex={open ? 0 : -1}
          aria-hidden={!open}
          className="flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-4 pr-5 text-xs font-semibold uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-[1.03]"
        >
          <WhatsAppGlyph className="h-4 w-4" />
          WhatsApp
        </a>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close contact options' : 'Contact us'}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

/** Official WhatsApp mark. Lucide does not ship a brand glyph for it. */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.83 9.83 0 0 1 2.893 6.994c-.003 5.45-4.437 9.886-9.885 9.886m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0 0 20.465 3.49" />
    </svg>
  );
}
