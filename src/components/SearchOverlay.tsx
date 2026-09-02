'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CornerDownLeft, FileText, Search, Sparkles, Tag, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PRODUCTS } from '@/data/products';
import { site } from '@/lib/site';

/**
 * Site search, Apple-style.
 *
 * A quiet full-screen glass overlay opened from the header (or Cmd/Ctrl+K).
 * It searches the whole site from local data only: pages, treatments,
 * packages, products and the latest journal entries. Nothing leaves the
 * device, results appear as you type, arrow keys + Enter navigate, Esc
 * closes. It renders nothing until opened, and everything inside is real
 * content from the site's own data.
 */

type Entry = {
  type: 'Page' | 'Treatment' | 'Package' | 'Product' | 'Journal';
  title: string;
  subtitle: string;
  href: string;
  icon: typeof FileText;
};

const PAGES: Omit<Entry, 'icon'>[] = [
  { type: 'Page', title: 'Home', subtitle: 'The retreat at a glance', href: '/' },
  { type: 'Page', title: 'Services', subtitle: 'Every treatment and price', href: '/services' },
  { type: 'Page', title: 'Book online', subtitle: 'The spa calendar', href: '/book' },
  { type: 'Page', title: 'Group booking', subtitle: 'Groups, parties and the venue', href: '/book-bulk' },
  { type: 'Page', title: 'Venues', subtitle: 'Gender reveals and celebrations', href: '/venues' },
  { type: 'Page', title: 'Gallery', subtitle: 'The rooms and the garden', href: '/gallery' },
  { type: 'Page', title: 'Journal', subtitle: 'Stories from the spa', href: '/journal' },
  { type: 'Page', title: 'Team', subtitle: 'The hands behind the calm', href: '/team' },
  { type: 'Page', title: 'Visit', subtitle: 'Address, hours and directions', href: '/visit' },
  { type: 'Page', title: 'Vouchers', subtitle: 'Gift a visit', href: '/vouchers' },
  { type: 'Page', title: 'Promotions', subtitle: 'Packages running now', href: '/promotions' },
  { type: 'Page', title: 'Book on WhatsApp', subtitle: 'Message the spa directly', href: '/whatsapp' },
];

const ICONS = {
  Page: FileText,
  Treatment: Wrench,
  Package: Sparkles,
  Product: Tag,
  Journal: FileText,
} as const;

export function SearchOverlay({
  open,
  onClose,
  journalPosts = [],
}: {
  open: boolean;
  onClose: () => void;
  journalPosts?: { title: string; slug: string }[];
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  /* The whole index is derived data; nothing here hits the network. */
  const entries = useMemo<Entry[]>(() => {
    const treatments: Entry[] = [];
    const packages: Entry[] = [];
    for (const cat of site.categories) {
      for (const item of cat.items ?? []) {
        const price = item.price ?? item.variants?.[0]?.price;
        const target: Entry[] = cat.slug === 'promotions' ? packages : treatments;
        target.push({
          type: cat.slug === 'promotions' ? 'Package' : 'Treatment',
          title: item.name,
          subtitle: `${cat.name}${price ? ` · ${price}` : ''}`,
          href: `/services#${cat.slug}`,
          icon: cat.slug === 'promotions' ? Sparkles : Wrench,
        });
      }
    }
    const products: Entry[] = PRODUCTS.map((p) => ({
      type: 'Product',
      title: p.name,
      subtitle: `${p.brand} · ${p.use}`,
      href: '/#products',
      icon: Tag,
    }));
    const journal: Entry[] = journalPosts.map((p) => ({
      type: 'Journal',
      title: p.title,
      subtitle: 'Journal',
      href: `/journal/${p.slug}`,
      icon: FileText,
    }));
    return [...PAGES.map((p) => ({ ...p, icon: ICONS[p.type] })), ...treatments, ...packages, ...products, ...journal];
  }, [journalPosts]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const scored = entries
      .map((e) => {
        const hay = `${e.title} ${e.subtitle}`.toLowerCase();
        if (!hay.includes(q)) return null;
        let score = hay.startsWith(q) ? 2 : 1;
        if (e.title.toLowerCase().startsWith(q)) score += 2;
        return { e, score };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, 10).map((r) => r.e);
  }, [entries, query]);

  const suggestions = ['Massage', 'Facial', 'Hydrotherapy', 'Besties', 'Venue'];

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = 'hidden';
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => (results.length ? (a + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter' && results[active]) {
        window.location.href = results[active].href;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, active, onClose]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] overflow-y-auto bg-[#0B352A]/92 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-label="Search the site"
        >
          <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-5 pb-16 pt-20 md:pt-24">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-emerald-300">Search</p>
              <button
                type="button"
                onClick={onClose}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-ground/25 text-ground transition-colors hover:border-gold-200 hover:text-gold-200"
                aria-label="Close search"
              >
                <span className="text-xs font-semibold uppercase tracking-widest">Esc</span>
              </button>
            </div>

            {/* Field */}
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-ground/20 bg-ground/10 px-5 py-4 backdrop-blur-xl">
              <Search className="h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Treatments, packages, products, stories…"
                className="w-full bg-transparent text-lg text-ground placeholder:text-ground/45 focus:outline-none"
                aria-label="Search treatments, packages, products and stories"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-xs font-semibold uppercase tracking-widest text-ground/55 hover:text-gold-200"
                >
                  Clear
                </button>
              ) : null}
            </div>

            {!query ? (
              <div className="mt-8">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-ground/45">
                  Try
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setQuery(s)}
                      className="rounded-full border border-ground/20 px-4 py-2 text-sm text-ground/80 transition-colors hover:border-gold-200 hover:text-gold-200"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="mt-8 text-sm text-ground/45">
                  Press <kbd className="rounded bg-ground/10 px-1.5 py-0.5 text-xs">⌘K</kbd> to
                  open search from anywhere.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-ground/15 p-8 text-center">
                <p className="text-lg text-ground">Nothing matched &ldquo;{query}&rdquo;.</p>
                <p className="mt-2 text-sm text-ground/55">
                  Try a treatment name, a package, or ask on WhatsApp and the team will point you
                  the right way.
                </p>
              </div>
            ) : (
              <ul ref={listRef} className="mt-6 divide-y divide-white/8">
                {results.map((r, i) => {
                  const Icon = r.icon;
                  const isActive = i === active;
                  return (
                    <li key={`${r.type}-${r.title}-${i}`}>
                      <Link
                        href={r.href}
                        onClick={onClose}
                        data-idx={i}
                        onMouseEnter={() => setActive(i)}
                        className={`flex min-h-[56px] items-center gap-4 rounded-xl px-3 py-3 transition-colors ${
                          isActive ? 'bg-ground/10' : 'hover:bg-ground/5'
                        }`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ground/10 text-emerald-300">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] text-ground">{r.title}</span>
                          <span className="block truncate text-xs text-ground/55">{r.subtitle}</span>
                        </span>
                        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-ground/40">
                          {r.type}
                        </span>
                        {isActive ? (
                          <CornerDownLeft className="h-4 w-4 shrink-0 text-gold-200" aria-hidden="true" />
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
