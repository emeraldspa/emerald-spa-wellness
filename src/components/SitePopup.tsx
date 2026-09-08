'use client';

import { Gift, MessageCircle, Sparkles, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VOUCHER_PATH, WHATSAPP_NUMBER, formatNad } from '@/lib/site';

export type PopupPromotion = {
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
  imageAlt: string;
  imageSrcset: string;
  duration: string | null;
  priceNad: number | null;
};

const DELAY_MS = 22000;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

/**
 * The one site popup, fed by WordPress.
 *
 * When an editor flags a special as "show as popup" in wp-admin, that special
 * interrupts the visit: its own photo, its own price, and one tap to open
 * WhatsApp with the booking message already typed. When nothing is flagged,
 * the quiet voucher invitation takes the same slot, exactly as before. Both
 * faces share one styled card, one 22-second delay, and one set of manners:
 * never on the pages doing a task (vouchers, pay, whatsapp), once per
 * session-set, dismissed for thirty days.
 *
 * Styling brief (client, 8 Sep 2025: "the popup must be perfectly styled"):
 * a bottom sheet on phones and a centred card on desktop, the brand's
 * emerald marble panel with a gold hairline, real photography from
 * WordPress when a special has one, and a close button that is easy to hit
 * with a thumb.
 */
export function SitePopup({ promotion }: { promotion: PopupPromotion | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<Element | null>(null);

  const suppressed =
    pathname === VOUCHER_PATH || pathname === '/pay' || pathname === '/whatsapp';

  const dismissKey = promotion
    ? `emerald:promo-dismissed-${promotion.slug}`
    : 'emerald:voucher-dismissed';

  const close = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(dismissKey, String(Date.now()));
    } catch {
      /* Private mode can refuse storage. The popup simply reappears next visit. */
    }
    if (restoreRef.current instanceof HTMLElement) restoreRef.current.focus();
  }, [dismissKey]);

  useEffect(() => {
    if (suppressed) return;

    let dismissedAt = 0;
    try {
      dismissedAt = Number(window.localStorage.getItem(dismissKey) ?? 0);
    } catch {
      dismissedAt = 0;
    }
    if (dismissedAt && Date.now() - dismissedAt < THIRTY_DAYS) return;

    const timer = window.setTimeout(() => {
      restoreRef.current = document.activeElement;
      setOpen(true);
    }, DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [suppressed, dismissKey]);

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

  const bookingMessage = promotion
    ? `Hello Emerald Spa & Wellness Centre. I saw the "${promotion.title}" special on your website and I would like to book it.` +
      (promotion.priceNad ? ` The special is ${formatNad(promotion.priceNad)}.` : '') +
      ' Please tell me the available times.'
    : '';

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(bookingMessage)}`;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-popup-title"
        className="voucher-pop relative flex w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-ink/15 bg-ground shadow-[0_32px_80px_-24px_rgba(7,33,26,0.65)] sm:rounded-3xl"
      >
        {/* Photo panel: the special's own image from WordPress when there is
            one; the brand marble with the gift mark when there is not. */}
        {promotion?.image ? (
          <div className="relative h-44 sm:h-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={promotion.image}
              srcSet={promotion.imageSrcset || undefined}
              alt={promotion.imageAlt || promotion.title}
              sizes="(max-width: 640px) 100vw, 512px"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#063F31]/85 via-[#063F31]/25 to-transparent" />
            <span className="absolute left-5 top-4 inline-flex items-center gap-2 rounded-full bg-[#063F31]/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-gold-200 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Special
            </span>
          </div>
        ) : (
          <div className="surface-marble-emerald relative px-7 pb-8 pt-9 text-ground sm:px-8">
            <div aria-hidden="true" className="absolute inset-0 bg-emerald-900/45" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-ground/15 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-ground backdrop-blur-sm">
                {promotion ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    Special
                  </>
                ) : (
                  <>
                    <Gift className="h-3.5 w-3.5" aria-hidden="true" />
                    Gift voucher
                  </>
                )}
              </span>
              <h2 id="site-popup-title" className="display mt-4 text-3xl sm:text-4xl">
                {promotion ? promotion.title : 'Give someone an afternoon off.'}
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-ground/85">
                {promotion
                  ? promotion.excerpt ||
                    'A current special at the spa. Message us on WhatsApp and we will book you in.'
                  : 'Choose a value, tell us the occasion, and we send the voucher number and expiry straight back to you.'}
              </p>
            </div>
          </div>
        )}

        {/* Title band for the photo variant, over the body area below. */}
        {promotion?.image ? (
          <div className="border-b border-ink/10 bg-[#063F31] px-7 py-5 text-ground sm:px-8">
            <h2 id="site-popup-title" className="display text-2xl leading-snug sm:text-3xl">
              {promotion.title}
            </h2>
            {promotion.excerpt ? (
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ground/85">
                {promotion.excerpt}
              </p>
            ) : null}
            {promotion.duration || promotion.priceNad ? (
              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-widest text-gold-200">
                {promotion.duration ? <span>{promotion.duration}</span> : null}
                {promotion.priceNad ? <span>{formatNad(promotion.priceNad)}</span> : null}
              </p>
            ) : null}
          </div>
        ) : null}

        {/* Actions. A special opens WhatsApp with the booking message typed;
            the voucher invitation leads to the voucher page. Both carry one
            quiet way out. */}
        <div className="flex flex-col gap-3 p-6 sm:flex-row sm:p-7">
          {promotion ? (
            <>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#07211A] transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Book on WhatsApp
              </a>
              <Link
                href="/specials"
                onClick={close}
                className="flex-1 rounded-full border border-ink/20 px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-widest text-ink/80 transition-colors hover:border-ink/40 hover:text-ink"
              >
                See all specials
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close this message"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink/45 text-white shadow-md backdrop-blur-md transition-colors hover:bg-ink/65"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
