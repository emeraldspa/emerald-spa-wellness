import type { Metadata } from 'next';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { FooterFull } from '@/components/FooterFull';
import { Picture } from '@/components/Picture';
import { SiteHeader } from '@/components/SiteHeader';
import { CategoryNav, CategoryRail } from '@/components/CategoryNav';
import { ClipReveal, FadeUp } from '@/components/motion';
import {
  BOOKING_CTA,
  BOOKING_PATH,
  LISTED_SERVICE_COUNT,
  SITE_URL,
  WHATSAPP_PATH,
  getImage,
  site,
} from '@/lib/site';

export const metadata: Metadata = {
  title: 'Services and Prices',
  description: `All ${LISTED_SERVICE_COUNT} treatments at Emerald Spa & Wellness Centre, Windhoek West: massages, facials, hydrotherapy, nails, lashes and hair removal. Prices in Namibian dollars.`,
  alternates: { canonical: '/services' },
};

/**
 * Full menu, fully visible.
 *
 * No accordions: the brief requires every price readable without a click,
 * and search engines index visible text far more reliably than collapsed
 * panels. A sticky category rail replaces the disclosure pattern.
 */
/**
 * A photograph for the categories the client actually documented. Each pairing
 * was checked against the frame, so nothing illustrates a treatment it does
 * not show. Categories without a matching photograph simply render without one.
 */
const CATEGORY_IMAGE: Record<string, string> = {
  massages: 'treatment-room',
  'facials-skincare': 'facial-treatment',
  hydrotherapy: 'hydrotherapy-tub-set',
  nails: 'nail-art',
  lashes: 'lash-extensions',
  'eyebrow-care': 'brow-detail',
  refreshments: 'wine-pair',
  promotions: 'garden-lounge-guests',
};

export default function ServicesPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: `${site.legalName} treatment menu`,
    url: `${SITE_URL}/services`,
    itemListElement: site.categories.map((cat, i) => ({
      '@type': 'OfferCatalog',
      position: i + 1,
      name: cat.name,
      itemListElement: cat.items.map((s, j) => ({
        '@type': 'Offer',
        position: j + 1,
        itemOffered: { '@type': 'Service', name: s.name, ...(s.description ? { description: s.description } : {}) },
        ...(s.priceValue !== null
          ? { price: s.priceValue, priceCurrency: 'NAD' }
          : {}),
      })),
    })),
  };

  return (
    <>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main id="main">
        <section className="surface-marble-pale relative border-b border-ink/10 py-16 md:py-24">
          <div aria-hidden="true" className="rule-gold absolute inset-x-0 bottom-0 h-px" />
          <div className="shell relative">
          <p className="eyebrow text-emerald-600">Treatment Menu</p>
          <h1 className="display mt-4 max-w-4xl text-4xl text-balance sm:text-5xl md:text-6xl">
            <ClipReveal>Every treatment, every price.</ClipReveal>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-ink/70 text-pretty">
            {LISTED_SERVICE_COUNT} treatments across {site.categories.length} categories, from a
            10 minute add-on to a full day of care. Prices are in Namibian dollars and
            match our live booking system.
          </p>
          <Link
            href={BOOKING_PATH}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-800"
          >
            {BOOKING_CTA}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          </div>
        </section>

        {/* Fixed on mobile, so it stays reachable through a long menu. */}
        <CategoryRail
            items={site.categories.map((c) => ({
              slug: c.slug,
              name: c.name,
              count: c.items.length,
          }))}
        />

        <div className="shell grid grid-cols-[minmax(0,1fr)] gap-12 py-16 md:grid-cols-12 md:py-20">
          <div className="hidden min-w-0 md:col-span-3 md:block md:h-full">
            <CategoryNav
              items={site.categories.map((c) => ({
                slug: c.slug,
                name: c.name,
                count: c.items.length,
              }))}
            />
          </div>

          <div className="min-w-0 md:col-span-9">
            {site.categories.map((cat, ci) => (
              <section
                key={cat.slug}
                id={cat.slug}
                className="mb-16 scroll-mt-28 border-t border-ink/15 pt-8 last:mb-0"
              >
                {/*
                  A numbered header gives the long menu a spine: the reader can
                  tell how far through thirteen categories they are without
                  scrolling back to the rail.
                */}
                <div className="flex items-baseline gap-4">
                  <span className="display text-xl text-emerald-700/80 tabular-nums sm:text-2xl">
                    {String(ci + 1).padStart(2, '0')}
                  </span>
                  <h2 className="display text-2xl sm:text-3xl md:text-4xl">{cat.name}</h2>
                  <span
                    aria-hidden="true"
                    className="mb-2 h-px flex-1 bg-gradient-to-r from-ink/20 to-transparent"
                  />
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-ink/65">
                    {cat.items.length} treatment{cat.items.length === 1 ? '' : 's'}
                  </span>
                </div>

                {CATEGORY_IMAGE[cat.slug] ? (
                  <div className="mt-6 overflow-hidden bg-emerald-900/5">
                    <Picture
                      slug={CATEGORY_IMAGE[cat.slug]}
                      alt={getImage(CATEGORY_IMAGE[cat.slug]).alt}
                      sizes="(max-width: 768px) 100vw, 70vw"
                      imgClassName="h-56 w-full object-cover md:h-72"
                    />
                  </div>
                ) : null}

                <ul className="mt-8 divide-y divide-ink/10">
                  {cat.items.map((s) => (
                    <li key={`${cat.slug}-${s.name}`} className="py-5">
                      <div className="flex items-baseline justify-between gap-6">
                        <h3 className="text-base font-medium text-ink">{s.name}</h3>
                        <p className="shrink-0 text-sm font-semibold tabular-nums text-emerald-700">
                          {s.price}
                        </p>
                      </div>
                      {s.duration ? (
                        <p className="mt-1 text-xs uppercase tracking-wider text-ink/65">
                          {s.duration}
                        </p>
                      ) : null}
                      {s.description ? (
                        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink/65 text-pretty">
                          {s.description}
                        </p>
                      ) : null}
                      {s.variants.length > 1 ? (
                        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                          {s.variants.map((v) => (
                            <li key={v.name + v.price} className="text-xs text-ink/65">
                              <span className="tabular-nums">{v.duration}</span>
                              <span className="mx-1.5 text-ink/65">/</span>
                              <span className="font-semibold tabular-nums text-emerald-700">
                                {v.price}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>

                {/*
                  Two routes, offered at the end of every category rather than
                  once at the top of the page. One books instantly on our own
                  page, the other opens a real conversation for anyone who
                  would rather ask first.
                */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={BOOKING_PATH}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-800"
                  >
                    Book {cat.name.toLowerCase()}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href={WHATSAPP_PATH}
                    className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-emerald-600 hover:text-emerald-700"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Ask on WhatsApp
                  </Link>
                </div>
              </section>
            ))}

            <FadeUp>
              <p className="mt-10 border-t border-ink/15 pt-8 text-sm text-ink/65">
                Prices shown are current listings. Confirm final pricing when you book.
              </p>
            </FadeUp>
          </div>
        </div>
      </main>
      <FooterFull />
    </>
  );
}
