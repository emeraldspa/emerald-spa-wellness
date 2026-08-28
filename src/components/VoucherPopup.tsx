'use client';

import { Gift, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VOUCHER_PATH } from '@/lib/site';

const DISMISS_KEY = 'emerald:voucher-dismissed';
const DELAY_MS = 22000;

/**
 * Voucher invitation.
 *
 * Deliberately restrained. It waits until the visitor has actually been
 * reading, appears once, and stays dismissed for thirty days. It never
 * appears on the voucher page itself, on the booking page, or on the
 * WhatsApp page, because interrupting someone mid task is how popups earn
 * their bad reputation.
 *
 * It is a dialog, so it traps nothing but does close on Escape and returns
 * focus to where the visitor was. The body does not scroll behind it.
 */
export function VoucherPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<Element | null>(null);

  const suppressed =
    pathname === VOUCHER_PATH || pathname === '/book' || pathname === '/whatsapp';

  const close = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* Private mode can refuse storage. The popup simply reappears next visit. */
    }
    if (restoreRef.current instanceof HTMLElement) restoreRef.current.focus();
  }, []);

  useEffect(() => {
    if (suppressed) return;

    let dismissedAt = 0;
    try {
      dismissedAt = Number(window.localStorage.getItem(DISMISS_KEY) ?? 0);
    } catch {
      dismissedAt = 0;
    }
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (dismissedAt && Date.now() - dismissedAt < thirtyDays) return;

    const timer = window.setTimeout(() => {
      restoreRef.current = document.activeElement;
      setOpen(true);
    }, DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [suppressed]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="voucher-popup-title"
        className="voucher-pop relative w-full max-w-lg overflow-hidden border border-ink/15 bg-ground shadow-2xl"
      >
        {/* Marble panel gives the card a surface instead of a flat fill. */}
        <div className="surface-marble-emerald relative px-7 py-10 text-ground">
          <div aria-hidden="true" className="absolute inset-0 bg-emerald-900/45" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-ground/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest">
              <Gift className="h-3.5 w-3.5" aria-hidden="true" />
              Gift voucher
            </span>
            <h2 id="voucher-popup-title" className="display mt-4 text-3xl sm:text-4xl">
              Give someone an afternoon off.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ground/85">
              Choose a value, tell us the occasion, and we send the voucher number and expiry
              straight back to you.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-7 sm:flex-row">
          <Link
            href={VOUCHER_PATH}
            onClick={close}
            className="flex flex-1 items-center justify-center rounded-full bg-emerald-700 px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-800"
          >
            Buy a voucher
          </Link>
          <button
            type="button"
            onClick={close}
            className="flex-1 rounded-full border border-ink/20 px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-ink/75 transition-colors hover:border-ink/40"
          >
            Not now
          </button>
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close voucher offer"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ground/20 text-ground transition-colors hover:bg-ground/35"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
