'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  CalendarCheck,
  ChevronDown,
  Clock,
  Facebook,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { SearchOverlay } from '@/components/SearchOverlay';
import { Wordmark } from '@/components/Wordmark';
import {
  BOOKING_CTA,
  BOOKING_PATH,
  NAV_LINKS,
  WHATSAPP_PATH,
  site,
} from '@/lib/site';

/**
 * The one universal header.
 *
 * Every page carries exactly this navigation: a floating liquid-glass pill,
 * present from first paint on every route including home. Inside it: the
 * wordmark (gem SVG + Radley type, no box), the section links with visual
 * dropdowns, search, the hamburger, and two booking CTAs on desktop. On
 * mobile the header carries exactly three things: the wordmark, a small
 * search icon and the hamburger. The hamburger opens a compact glass panel
 * under the pill (no off-canvas drawer) with the full menu, contact and
 * hours; search opens its own overlay. One header, one system, nothing
 * competing.
 */

type DropdownKey = 'services' | 'venues' | 'journal' | null;

/** The one entrance curve used across the header, drawer and dropdowns. */
const EASE = [0.22, 1, 0.36, 1] as const;

const PLAIN_LINKS = NAV_LINKS.filter((l) =>
  ['gallery', 'team', 'visit', 'vouchers'].includes(l.href.replace('/', '')),
);

const drawerItems = [
  {
    group: 'Explore',
    links: [
      { href: '/', label: 'Home' },
      { href: '/services', label: 'Services' },
      { href: '/venues', label: 'Venues' },
      { href: '/gallery', label: 'Gallery' },
      { href: '/journal', label: 'Journal' },
      { href: '/team', label: 'Team' },
      { href: '/visit', label: 'Visit' },
      { href: '/vouchers', label: 'Vouchers' },
    ],
  },
  {
    group: 'Book',
    links: [
      { href: '/book', label: 'Book online' },
      { href: '/book-bulk', label: 'Book in bulk' },
      { href: '/whatsapp', label: 'Book on WhatsApp' },
    ],
  },
];

export function StickyNav({
  journalPosts = [],
}: {
  journalPosts?: { title: string; slug: string }[];
}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeAll = useCallback(() => {
    setDrawerOpen(false);
    setSearchOpen(false);
    setOpenDropdown(null);
  }, []);

  /* Close everything on navigation. */
  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  /* Esc closes the drawer or an open dropdown. Search handles its own Esc. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        setOpenDropdown(null);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Clear the dropdown hover timer on unmount. */
  useEffect(
    () => () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    },
    [],
  );

  const hoverOpen = (key: Exclude<DropdownKey, null>) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpenDropdown(key);
  };
  const hoverClose = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenDropdown(null), 140);
  };

  const serviceCats = site.categories.filter(
    (c) => !['refreshments', 'add-on-services', 'promotions'].includes(c.slug),
  );

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long' });
  const todayHours = site.hours.find((h) => h.day === today);

  return (
    <>
      <div className="fixed inset-x-3 top-3 z-50 sm:inset-x-5 sm:top-4 lg:inset-x-8">
        {/*
          The pill surface is its own layer so the dropdown panels can open
          below it without being clipped by the rounded shape.
        */}
        <div className="relative">
          {/* Liquid glass: a web approximation of Apple Liquid Glass
              (backdrop blur + layered borders + highlight sheen). Labeled as
              an approximation per taste-skill; no official web package. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full border border-white/20 bg-[#0E4634]/60 shadow-[0_18px_50px_-16px_rgba(7,33,26,0.55)] backdrop-blur-2xl backdrop-saturate-150"
          >
            {/* Top glass sheen */}
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <div className="rule-gold absolute inset-x-10 bottom-0 h-px opacity-50" />
          </div>
          <nav
            className="relative flex items-center justify-between gap-2.5 px-3 py-2 sm:gap-4 sm:px-5 md:gap-5"
            aria-label="Primary"
          >
            <Wordmark tone="dark" size="md" />

            {/* Desktop links + dropdowns */}
            <ul className="hidden items-center gap-0.5 lg:flex">
              {/* Services */}
              <li
                className="relative"
                onMouseEnter={() => hoverOpen('services')}
                onMouseLeave={hoverClose}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'services' ? null : 'services')}
                  aria-haspopup='true'
                  aria-expanded={openDropdown === 'services'}
                  className={`flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                    pathname.startsWith('/services')
                      ? 'text-gold-200'
                      : 'text-ground/90 hover:text-gold-200'
                  }`}
                >
                  Services
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${
                      openDropdown === 'services' ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <DropdownPanel open={openDropdown === 'services'}>
                  <div className="grid w-[340px] grid-cols-2 gap-1">
                    {serviceCats.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/services#${cat.slug}`}
                        onClick={closeAll}
                        className="rounded-xl px-3.5 py-3 transition-colors hover:bg-white/6"
                      >
                        <span className="block text-sm text-ground">{cat.name}</span>
                        <span className="mt-0.5 block text-[11px] text-ground/75">
                          {cat.items.length} treatments
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/services"
                    onClick={closeAll}
                    className="mt-3 flex items-center gap-1.5 rounded-xl border border-white/10 px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-200 transition-colors hover:border-gold-300/60 hover:bg-gold-300/10"
                  >
                    All services
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </DropdownPanel>
              </li>

              {/* Venues */}
              <li
                className="relative"
                onMouseEnter={() => hoverOpen('venues')}
                onMouseLeave={hoverClose}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'venues' ? null : 'venues')}
                  aria-haspopup='true'
                  aria-expanded={openDropdown === 'venues'}
                  className={`flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                    pathname.startsWith('/venues') || pathname === '/book-bulk'
                      ? 'text-gold-200'
                      : 'text-ground/90 hover:text-gold-200'
                  }`}
                >
                  Venues
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${
                      openDropdown === 'venues' ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <DropdownPanel open={openDropdown === 'venues'}>
                  <div className="w-72 space-y-1">
                    <Link
                      href="/venues#story-gender-reveal"
                      onClick={closeAll}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-colors hover:bg-white/6"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/media/venue-party-1-800.webp"
                        alt=""
                        width={96}
                        height={72}
                        loading="lazy"
                        decoding="async"
                        className="h-12 w-16 shrink-0 rounded-lg object-cover"
                      />
                      <span>
                        <span className="block text-sm text-ground">Gender reveal</span>
                        <span className="block text-[11px] text-ground/75">The big moment</span>
                      </span>
                    </Link>
                    <Link
                      href="/venues#story-party"
                      onClick={closeAll}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-colors hover:bg-white/6"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/media/venue-party-6-800.webp"
                        alt=""
                        width={96}
                        height={72}
                        loading="lazy"
                        decoding="async"
                        className="h-12 w-16 shrink-0 rounded-lg object-cover"
                      />
                      <span>
                        <span className="block text-sm text-ground">Party at the venue</span>
                        <span className="block text-[11px] text-ground/75">The night in full</span>
                      </span>
                    </Link>
                    <Link
                      href="/venues#book-venue"
                      onClick={closeAll}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-colors hover:bg-white/6"
                    >
                      <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-white/6 text-gold-200">
                        <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-sm text-ground">Book the venue</span>
                        <span className="block text-[11px] text-ground/75">Availability and pricing</span>
                      </span>
                    </Link>
                  </div>
                </DropdownPanel>
              </li>

              {/* Journal */}
              <li
                className="relative"
                onMouseEnter={() => hoverOpen('journal')}
                onMouseLeave={hoverClose}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'journal' ? null : 'journal')}
                  aria-haspopup='true'
                  aria-expanded={openDropdown === 'journal'}
                  className={`flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                    pathname.startsWith('/journal')
                      ? 'text-gold-200'
                      : 'text-ground/90 hover:text-gold-200'
                  }`}
                >
                  Journal
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${
                      openDropdown === 'journal' ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <DropdownPanel open={openDropdown === 'journal'}>
                  <div className="w-80 space-y-1">
                    {journalPosts.length ? (
                      journalPosts.slice(0, 3).map((p) => (
                        <Link
                          key={p.slug}
                          href={`/journal/${p.slug}`}
                          onClick={closeAll}
                          className="block rounded-xl px-3.5 py-3 transition-colors hover:bg-white/6"
                        >
                          <span className="block text-sm leading-snug text-ground">{p.title}</span>
                          <span className="mt-1 block text-[11px] uppercase tracking-widest text-ground/45">
                            Journal
                          </span>
                        </Link>
                      ))
                    ) : (
                      <p className="px-3.5 py-3 text-sm text-ground/75">Stories are on the way.</p>
                    )}
                    <Link
                      href="/journal"
                      onClick={closeAll}
                      className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-200 transition-colors hover:border-gold-300/60 hover:bg-gold-300/10"
                    >
                      All stories
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </DropdownPanel>
              </li>

              {/* Plain links */}
              {PLAIN_LINKS.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`flex min-h-[44px] items-center rounded-full px-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                        active ? 'text-gold-200' : 'text-ground/90 hover:text-gold-200'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Right cluster */}
            <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search the site"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ground/30 text-ground transition-colors hover:border-gold-300 hover:text-gold-200 md:h-11 md:w-11"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>

              {/* Two CTAs, desktop only */}
              <Link
                href="/book-bulk"
                className="hidden min-h-[44px] items-center gap-1.5 rounded-full border border-gold-300/45 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-200 transition-colors hover:border-gold-300 hover:bg-gold-300/10 lg:flex"
              >
                <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Book in bulk
              </Link>
              <Link
                href={BOOKING_PATH}
                className="hidden min-h-[44px] items-center gap-1.5 rounded-full bg-gold-300 px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0A1310] transition-colors hover:bg-gold-200 lg:flex"
              >
                {BOOKING_CTA}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>

              {/* Hamburger: two lines morph into an X, never disappear. */}
              <button
                type="button"
                onClick={() => setDrawerOpen((o) => !o)}
                aria-expanded={drawerOpen}
                aria-controls="site-menu"
                aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-ground text-[#07211A] transition-colors hover:bg-gold-200 md:h-11 md:w-11 lg:hidden"
              >
                <span className="relative block h-[14px] w-[18px]" aria-hidden="true">
                  <span
                    className={`absolute left-0 top-0 block h-[1.5px] w-full rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                      drawerOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : ''
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 left-0 block h-[1.5px] w-full rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                      drawerOpen ? 'bottom-auto top-1/2 -translate-y-1/2 -rotate-45' : ''
                    }`}
                  />
                </span>
              </button>
            </div>
          </nav>

                {/* Mobile menu: a compact glass panel under the pill, not an off-canvas
          drawer. Desktop keeps its inline links; this only exists on small
          screens (lg:hidden). Legible text throughout, closes on Esc or any
          navigation. */}
      <AnimatePresence>
        {drawerOpen ? (
          <motion.div
            id="site-menu"
            className="absolute inset-x-0 top-full z-[60] mt-3 lg:hidden"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-[#0E4634]/96 shadow-[0_28px_70px_-20px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              {/* Top glass sheen, matching the header pill. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
              <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6">
                {/* Search shortcut */}
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    setSearchOpen(true);
                  }}
                  className="flex min-h-[52px] w-full items-center gap-3 rounded-xl border border-white/15 bg-white/6 px-4 text-left text-sm text-ground/80 transition-colors hover:border-gold-200/50 hover:text-gold-200"
                >
                  <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="flex-1">Search treatments, packages, stories</span>
                  <kbd className="rounded-md border border-white/25 px-2 py-0.5 text-[10px] uppercase tracking-widest text-ground/75">
                    ⌘K
                  </kbd>
                </button>

                <nav className="mt-5" aria-label="Menu">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ground/75">
                    Explore
                  </p>
                  <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                    {drawerItems[0].links.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setDrawerOpen(false)}
                            className={`flex min-h-[44px] items-center rounded-lg px-2.5 text-sm transition-colors ${
                              active ? 'text-gold-200' : 'text-ground hover:text-gold-200'
                            }`}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-ground/75">
                    Book
                  </p>
                  <ul className="mt-2 space-y-1">
                    {drawerItems[1].links.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setDrawerOpen(false)}
                          className="flex min-h-[44px] items-center gap-2 rounded-lg px-2.5 text-sm text-ground transition-colors hover:text-gold-200"
                        >
                          {item.label}
                          <ArrowUpRight className="h-3.5 w-3.5 text-ground/40" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Contact strip */}
                <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 text-sm text-ground/85 sm:grid-cols-2">
                  <div className="space-y-2">
                    <a
                      href={`tel:${site.phoneE164}`}
                      className="flex min-h-[40px] items-center gap-3 transition-colors hover:text-gold-200"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                      {site.phone}
                    </a>
                    <Link
                      href={WHATSAPP_PATH}
                      onClick={() => setDrawerOpen(false)}
                      className="flex min-h-[40px] items-center gap-3 transition-colors hover:text-gold-200"
                    >
                      <MessageCircle className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                      WhatsApp the spa
                    </Link>
                    <p className="flex min-h-[40px] items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                      <span>
                        {site.address.street}
                        <br />
                        {site.address.suburb}, {site.address.city}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex min-h-[40px] items-center gap-3">
                      <Clock className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                      {todayHours
                        ? todayHours.closed
                          ? `Closed ${today}`
                          : `Open today ${todayHours.value}`
                        : 'Open seven days'}
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <a
                        href={site.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-ground transition-colors hover:border-gold-200 hover:text-gold-200"
                      >
                        <Instagram className="h-4 w-4" aria-hidden="true" />
                      </a>
                      <a
                        href={site.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-ground transition-colors hover:border-gold-200 hover:text-gold-200"
                      >
                        <Facebook className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>



        </div>
      </div>

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        journalPosts={journalPosts}
      />
    </>
  );
}

/** Liquid-glass panel shared by the desktop dropdowns. */
function DropdownPanel({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="absolute left-1/2 top-full z-50 mt-3 -translate-x-1/2 rounded-2xl border border-white/20 bg-[#0E4634]/95 p-3 shadow-[0_28px_70px_-20px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
