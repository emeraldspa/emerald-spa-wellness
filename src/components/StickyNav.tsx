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
 * dropdowns, search, the hamburger, and two booking CTAs on desktop. The
 * hamburger opens a full-screen glass drawer with the complete menu, contact
 * and hours; search opens its own overlay. One header, one system, nothing
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

  /* Scroll lock while the drawer is open. */
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [drawerOpen]);

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
                        <span className="mt-0.5 block text-[11px] text-ground/50">
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
                        <span className="block text-[11px] text-ground/50">The big moment</span>
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
                        <span className="block text-[11px] text-ground/50">The night in full</span>
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
                        <span className="block text-[11px] text-ground/50">Availability and pricing</span>
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
                      <p className="px-3.5 py-3 text-sm text-ground/60">Stories are on the way.</p>
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
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ground/25 text-ground transition-colors hover:border-gold-300 hover:text-gold-200"
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
                aria-controls="site-drawer"
                aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
                className="relative flex h-11 w-11 items-center justify-center rounded-full bg-ground text-[#07211A] transition-colors hover:bg-gold-200"
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
        </div>
      </div>

      {/* Off-canvas drawer: full-screen glass, staggered masked reveals. */}
      <AnimatePresence>
        {drawerOpen ? (
          <motion.div
            id="site-drawer"
            className="fixed inset-0 z-[60] overflow-y-auto bg-[#0B352A]/94 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-5 pb-14 pt-6 sm:px-8">
              <div className="flex items-center justify-between">
                <Wordmark tone="dark" size="sm" />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ground/25 text-ground transition-colors hover:border-gold-200 hover:text-gold-200"
                >
                  <span className="relative block h-[14px] w-[18px]" aria-hidden="true">
                    <span className="absolute left-0 top-1/2 block h-[1.5px] w-full -translate-y-1/2 rotate-45 rounded-full bg-current" />
                    <span className="absolute left-0 top-1/2 block h-[1.5px] w-full -translate-y-1/2 -rotate-45 rounded-full bg-current" />
                  </span>
                </button>
              </div>

              {/* Search shortcut */}
              <motion.button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  setSearchOpen(true);
                }}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
                className="mt-8 flex min-h-[56px] items-center gap-3 rounded-2xl border border-ground/20 bg-ground/8 px-5 text-left text-ground/60 transition-colors hover:border-gold-200/50 hover:text-gold-200"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span className="flex-1 text-sm">Search treatments, packages, stories…</span>
                <kbd className="rounded-md border border-ground/25 px-2 py-1 text-[10px] uppercase tracking-widest">
                  ⌘K
                </kbd>
              </motion.button>

              <nav className="mt-10 flex flex-1 flex-col gap-10" aria-label="Menu">
                {drawerItems.map((group) => (
                  <div key={group.group}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ground/45">
                      {group.group}
                    </p>
                    <ul className="mt-3">
                      {group.links.map((item, i) => {
                        const active = pathname === item.href;
                        return (
                          <li key={item.href} className="overflow-hidden">
                            <motion.div
                              initial={reduce ? false : { y: '110%' }}
                              animate={{ y: 0 }}
                              exit={{ y: '110%' }}
                              transition={{
                                duration: 0.55,
                                delay: 0.05 + i * 0.05,
                                ease: EASE,
                              }}
                            >
                              <Link
                                href={item.href}
                                onClick={() => setDrawerOpen(false)}
                                className={`group flex min-h-[52px] items-center justify-between border-b border-white/8 py-3 ${
                                  active ? 'text-gold-200' : 'text-ground'
                                }`}
                              >
                                <span className="display text-2xl tracking-[-0.01em] transition-colors group-hover:text-gold-200 sm:text-3xl">
                                  {item.label}
                                </span>
                                <ArrowUpRight
                                  className="h-5 w-5 text-ground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold-200"
                                  aria-hidden="true"
                                />
                              </Link>
                            </motion.div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>

              {/* Contact strip */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
                className="mt-12 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-2"
              >
                <div className="space-y-3 text-sm text-ground/80">
                  <a
                    href={`tel:${site.phoneE164}`}
                    className="flex min-h-[40px] items-center gap-3 transition-colors hover:text-gold-200"
                  >
                    <Phone className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                    {site.phone}
                  </a>
                  <a
                    href={WHATSAPP_PATH}
                    className="flex min-h-[40px] items-center gap-3 transition-colors hover:text-gold-200"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                    WhatsApp the spa
                  </a>
                  <p className="flex min-h-[40px] items-start gap-3">
                    <MapPin className="mt-1 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                    <span>
                      {site.address.street}
                      <br />
                      {site.address.suburb}, {site.address.city}
                    </span>
                  </p>
                </div>
                <div className="space-y-3 text-sm text-ground/80">
                  <p className="flex min-h-[40px] items-center gap-3">
                    <Clock className="h-4 w-4 text-emerald-300" aria-hidden="true" />
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
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-ground/25 text-ground transition-colors hover:border-gold-200 hover:text-gold-200"
                    >
                      <Instagram className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <a
                      href={site.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-ground/25 text-ground transition-colors hover:border-gold-200 hover:text-gold-200"
                    >
                      <Facebook className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

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
