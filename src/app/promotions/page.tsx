import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FooterFull } from '@/components/FooterFull';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHero } from '@/components/PageHero';
import { FadeUp } from '@/components/motion';
import { getActivePromotions } from '@/lib/wordpress';
import { BOOKING_CTA, BOOKING_PATH, SITE_URL, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Current Offers',
  description: `Current offers and packages at Emerald Spa & Wellness Centre, Windhoek West: massage packages for two, group escapes and more. ${site.phone}.`,
  alternates: { canonical: '/promotions' },
  openGraph: { url: `${SITE_URL}/promotions` },
};

type Offer = {
  name: string;
  description: string | null;
  duration: string;
  price: string;
};

/**
 * Every offer, not just the three on the home page.
 *
 * Live offers edited in WordPress lead; the verified venue packages fill the
 * rest. The page must never depend on the back office being up, so if
 * WordPress is empty or unreachable the verified package data still renders.
 */
export default async function PromotionsPage() {
  const wp = await getActivePromotions();
  const local = site.categories.find((c) => c.slug === 'promotions')?.items ?? [];

  const fromWordPress: Offer[] = wp.map((p) => ({
    name: p.title,
    description: p.excerpt,
    duration: p.startsOn && p.endsOn ? `Until ${p.endsOn}` : 'Current offer',
    price: '',
  }));

  const offers: Offer[] = [
    ...fromWordPress,
    ...local
      .filter((o) => !fromWordPress.some((w) => w.name === o.name))
      .map((o) => ({
        name: o.name,
        description: o.description,
        duration: o.duration ?? '',
        price: o.price ?? '',
      })),
  ];

  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHero
          slug="wine-pair"
          eyebrow="Current offers"
          title="Packages worth planning around."
          lede="Shareable escapes for two, quiet afternoons with friends, and the treatments the spa is best known for. Every offer is confirmed with the team before you book."
        />

        <section className="surface-marble-emerald border-t border-ink/10 py-16 md:py-20">
          {offers.length === 0 ? (
            <p className="text-ink/70">
              No packages are running right now. The full menu is always
              available on the services page.
            </p>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer, i) => (
                <FadeUp key={`${offer.name}-${i}`} delay={(i % 3) * 0.08} as="li">
                  <article className="relative flex h-full flex-col justify-between bg-ground p-7 shadow-sm">
                    <div aria-hidden="true" className="rule-gold absolute inset-x-0 top-0 h-0.5" />
                    <div>
                      <h2 className="text-lg font-semibold text-ink text-pretty">{offer.name}</h2>
                      {offer.description ? (
                        <p className="mt-3 text-sm leading-relaxed text-ink/70 text-pretty">
                          {offer.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="mt-8 flex items-baseline justify-between gap-4 border-t border-ink/10 pt-5">
                      <span className="text-xs font-semibold uppercase tracking-widest text-ink/65">
                        {offer.duration}
                      </span>
                      {offer.price ? (
                        <span className="text-sm font-semibold tabular-nums text-emerald-700">
                          {offer.price}
                        </span>
                      ) : null}
                    </div>
                  </article>
                </FadeUp>
              ))}
            </ul>
          )}

          <div className="mt-14 text-center">
            <Link
              href={BOOKING_PATH}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-emerald-600 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700"
            >
              {BOOKING_CTA}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="mt-4 text-sm text-ink/60">
              Prefer to talk first? Call {site.phone}.
            </p>
          </div>
        </section>
      </main>
      <FooterFull />
    </>
  );
}
