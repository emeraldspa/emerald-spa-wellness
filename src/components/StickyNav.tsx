'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Gift, MessageCircle } from 'lucide-react';
import {
  BOOKING_CTA,
  BOOKING_PATH,
  NAV_LINKS,
  VOUCHER_PATH,
  WHATSAPP_PATH,
  site,
} from '@/lib/site';

/**
 * Sticky navigation bar.
 *
 * It is a second, condensed bar rather than a header that changes position on
 * scroll. Turning the existing header sticky would make it jump the moment it
 * detaches from the flow, and would keep a tall marketing header on screen
 * while someone is reading a price list.
 *
 * So this stays hidden until the visitor is past the first screen, then slides
 * in as a compact strip: symbol, the sections, and the two actions. It leaves
 * again when they return to the top, because a page that is already showing
 * its own header does not need a duplicate.
 *
 * The scroll listener is passive and only ever flips one boolean, so it does
 * no layout work per frame.
 */
export function StickyNav() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);
  const frame = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(() => {
        frame.current = 0;
        setShown(window.scrollY > window.innerHeight * 0.6);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  // The booking page is a single task. A bar offering other routes competes
  // with the only thing that page exists to do.
  if (pathname === BOOKING_PATH) return null;

  const links = NAV_LINKS.filter(
    (item) => item.href !== BOOKING_PATH && item.href !== VOUCHER_PATH,
  );

  return (
    <div
      className={`fixed inset-x-3 top-3 z-50 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] sm:inset-x-5 sm:top-4 lg:inset-x-8 ${
        shown
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-6 opacity-0'
      }`}
      // Hidden from assistive tech while off screen so the same links are not
      // announced twice.
      aria-hidden={!shown}
    >
      <div className="surface-stone-bar relative overflow-hidden rounded-full border border-gold-500/30 shadow-[0_10px_40px_-12px_rgba(7,33,26,0.55)]">
        {/* Scrim keeps the stone readable as texture under the type. */}
        <div aria-hidden="true" className="absolute inset-0 bg-[#0A1310]/72" />
        {/* Brand gold hairline along the bottom edge. */}
        <div aria-hidden="true" className="rule-gold absolute inset-x-8 bottom-0 h-px opacity-70" />
        <nav
          className="relative flex items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:gap-6"
          aria-label={shown ? 'Condensed' : undefined}
        >
          <Link
            href="/"
            tabIndex={shown ? undefined : -1}
            aria-label={`${site.legalName}, home`}
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center gap-2.5"
          >
            {/* The symbol alone, because the strip is short and the wordmark
                would eat the space the sections need. */}
            <picture>
              <source srcSet="/brand/symbol-photoreal-200.avif" type="image/avif" />
              <source srcSet="/brand/symbol-photoreal-200.webp" type="image/webp" />
              <img
                src="/brand/symbol-photoreal.png"
                alt=""
                width={38}
                height={38}
                className="h-9 w-9 drop-shadow-[0_0_10px_rgba(117,224,186,0.45)]"
              />
            </picture>
            <span className="hidden text-sm font-semibold uppercase tracking-[0.22em] text-ground lg:block">
              Emerald
            </span>
          </Link>

          <ul className="hidden items-center gap-7 md:flex">
            {links.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    tabIndex={shown ? undefined : -1}
                    aria-current={active ? 'page' : undefined}
                    className={`relative flex min-h-[44px] items-center px-1 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:text-gold-200 ${
                      active ? 'text-gold-300' : 'text-ground/85'
                    }`}
                  >
                    {item.label}
                    {/* A hairline under the current section, the way an
                        editorial masthead marks position. */}
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-2.5 left-1 h-px w-[calc(100%-0.5rem)] origin-left bg-gold-300 transition-transform duration-300 ${
                        active ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={VOUCHER_PATH}
              tabIndex={shown ? undefined : -1}
              className="hidden min-h-[44px] items-center gap-1.5 rounded-full border border-gold-300/45 px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-200 transition-colors hover:border-gold-300 hover:bg-gold-300/10 lg:flex"
            >
              <Gift className="h-3.5 w-3.5" aria-hidden="true" />
              Vouchers
            </Link>
            <Link
              href={WHATSAPP_PATH}
              tabIndex={shown ? undefined : -1}
              aria-label="Message us on WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ground/30 text-ground transition-colors hover:border-gold-300 hover:text-gold-200 sm:hidden"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={BOOKING_PATH}
              tabIndex={shown ? undefined : -1}
              className="flex min-h-[44px] items-center gap-1.5 rounded-full bg-gold-300 px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0A1310] transition-colors hover:bg-gold-200 sm:px-5"
            >
              {BOOKING_CTA}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
