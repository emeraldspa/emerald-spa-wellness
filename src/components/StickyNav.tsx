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
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
        shown ? 'translate-y-0' : '-translate-y-full'
      }`}
      // Hidden from assistive tech while off screen so the same links are not
      // announced twice.
      aria-hidden={!shown}
    >
      <div className="border-b border-ink/10 bg-ground/[0.97] backdrop-blur-md">
        <nav
          className="shell flex items-center justify-between gap-6 py-3"
          aria-label={shown ? 'Condensed' : undefined}
        >
          <Link
            href="/"
            tabIndex={shown ? undefined : -1}
            aria-label={`${site.legalName}, home`}
            className="flex shrink-0 items-center gap-2.5"
          >
            {/* The symbol alone, because the strip is short and the wordmark
                would eat the space the sections need. */}
            <picture>
              <source srcSet="/brand/symbol-mark.svg" type="image/svg+xml" />
              <img
                src="/brand/symbol-mark.svg"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7"
              />
            </picture>
            <span className="hidden text-sm font-semibold uppercase tracking-[0.2em] text-ink lg:block">
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
                    className={`relative py-1 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:text-emerald-700 ${
                      active ? 'text-emerald-700' : 'text-ink/80'
                    }`}
                  >
                    {item.label}
                    {/* A hairline under the current section, the way an
                        editorial masthead marks position. */}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-emerald-700 transition-transform duration-300 ${
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
              className="hidden items-center gap-1.5 rounded-full border border-ink/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:border-emerald-600 hover:text-emerald-700 lg:flex"
            >
              <Gift className="h-3.5 w-3.5" aria-hidden="true" />
              Vouchers
            </Link>
            <Link
              href={WHATSAPP_PATH}
              tabIndex={shown ? undefined : -1}
              aria-label="Message us on WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-emerald-600 hover:text-emerald-700 sm:hidden"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={BOOKING_PATH}
              tabIndex={shown ? undefined : -1}
              className="flex items-center gap-1.5 rounded-full bg-emerald-700 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-emerald-800"
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
