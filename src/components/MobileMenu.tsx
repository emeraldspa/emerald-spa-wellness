'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Clock, Facebook, Instagram, MapPin, Phone, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import {
  BOOKING_CTA,
  BOOKING_PATH,
  NAV_LINKS,
  WHATSAPP_PATH,
  site,
} from '@/lib/site';

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Off-canvas site menu.
 *
 * More than a list of links: a photograph of the garden sets the tone, the
 * day's opening hours are computed in the visitor's clock, and the phone,
 * address and WhatsApp are one tap away. Everything a guest needs to decide
 * and to act, without leaving the menu.
 */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const [today, setToday] = useState<{ day: string; value: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    const d = new Date().getDay();
    const entry = site.hours.find((h) => h.day.toLowerCase() === DAY_KEYS[d]);
    setToday(
      entry
        ? { day: DAY_NAMES[d], value: entry.closed ? 'Closed today' : entry.value }
        : null,
    );
  }, [open]);

  // Escape to close, lock background scroll, and move focus into the panel.
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

  const contextRows = [
    {
      key: 'hours',
      icon: <Clock className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />,
      label: 'Today',
      value: today ? `${today.day} · ${today.value}` : null,
      href: '/visit',
    },
    {
      key: 'phone',
      icon: <Phone className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />,
      label: site.phone,
      value: null,
      href: `tel:${site.phoneE164}`,
    },
    {
      key: 'address',
      icon: <MapPin className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />,
      label: `${site.address.street}, ${site.address.suburb}`,
      value: site.address.city,
      href: site.address.directionsUrl,
    },
  ];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          id="site-menu"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 flex flex-col bg-ground"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Visual band: the garden behind the brand, a quiet opening frame. */}
          <div className="relative shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/green-escape-1443.jpg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-emerald-900/70" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent"
            />

            <div className="relative flex items-center justify-between px-5 py-4 sm:px-8">
              <Link href="/" onClick={onClose} aria-label={`${site.legalName}, home`}>
                <BrandLogo tone="light" className="h-10 w-auto" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-ground text-ink transition-colors hover:bg-groundDeep"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <p className="display relative px-5 pb-5 text-xl italic text-ground/95 sm:px-8 sm:text-2xl">
              Exhale, restore, and leave renewed.
            </p>
          </div>

          {/* Scrollable body: navigation, then the facts that matter. */}
          <div className="flex-1 overflow-y-auto px-5 pb-4 pt-7 sm:px-8 md:px-12">
            <ul className="flex flex-col gap-6">
              {NAV_LINKS.filter((item) => item.href !== BOOKING_PATH).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="display text-3xl font-semibold uppercase tracking-widest text-ink transition-colors hover:text-emerald-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-3 border-t border-ink/10 pt-6">
              {contextRows.map((row) => (
                <Link
                  key={row.key}
                  href={row.href}
                  onClick={onClose}
                  target={row.href.startsWith('http') ? '_blank' : undefined}
                  rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex min-h-[40px] items-center gap-3 text-sm text-ink/80 transition-colors hover:text-emerald-700"
                >
                  {row.icon}
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{row.label}</span>
                    {row.value ? (
                      <span className="block truncate text-xs text-ink/60">{row.value}</span>
                    ) : null}
                  </span>
                </Link>
              ))}

              <Link
                href={WHATSAPP_PATH}
                onClick={onClose}
                className="flex min-h-[40px] items-center gap-3 text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-800"
              >
                <MessageCircleIcon />
                Book on WhatsApp
              </Link>
            </div>

            <ul className="mt-6 flex gap-3">
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.legalName} on Instagram`}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink/70 transition-colors hover:border-emerald-600 hover:text-emerald-600"
                >
                  <Instagram className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.legalName} on Facebook`}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink/70 transition-colors hover:border-emerald-600 hover:text-emerald-600"
                >
                  <Facebook className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          {/* Persistent booking action. */}
          <div className="shrink-0 border-t border-ink/10 bg-ground px-5 py-5 sm:px-8">
            <Link
              href={BOOKING_PATH}
              onClick={onClose}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700"
            >
              {BOOKING_CTA}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** WhatsApp glyph from lucide (MessageCircle) so the row reads like an action. */
function MessageCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-emerald-600"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
