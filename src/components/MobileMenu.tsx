'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { NAV_LINKS, site } from '@/lib/site';

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape to close, and lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 flex flex-col bg-ground px-5 py-5 sm:px-8 md:px-12"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between">
            <Link href="/" onClick={onClose} aria-label="Emerald Spa and Wellness Centre, home">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-600">
                <span className="block h-[10px] w-[10px] rounded-full bg-emerald-600" />
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <ul className="mt-16 flex flex-col gap-8">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="display text-3xl font-semibold uppercase tracking-widest text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="mt-auto flex items-center gap-2 text-xl font-semibold text-emerald-600"
          >
            Book Your Escape
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
