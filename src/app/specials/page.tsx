import type { Metadata } from 'next';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { FooterFull } from '@/components/FooterFull';
import { PageHero } from '@/components/PageHero';
import { FadeUp } from '@/components/motion';
import { getActivePromotions } from '@/lib/wordpress';
import { BOOKING_CTA, BOOKING_URL, PAY_PATH, WHATSAPP_NUMBER, formatNad, ogFor, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Specials',
  description: `Current specials and packages at Emerald Spa & Wellness Centre, Windhoek North: massage packages for two, group escapes and more. ${site.phone}.`,
  alternates: { canonical: '/specials' },
  ...ogFor('/specials'),
};

type Offer = {
  /** Anchor id on this page, e.g. sp-squad-package for nav deep links. */
  anchor: string;
  name: string;
  description: string | null;
  duration: string;
  price: string;
};

/** One tap opens WhatsApp with the special already described. */
function waOfferHref(offer: Offer): string {
  const text = [
    `Hello ${site.legalName}. I would like to book the "${offer.name}" special.`,
    offer.price ? `I saw it at ${offer.price}.` : '',
    offer.duration ? `Duration: ${offer.duration}.` : '',
    'Please tell me the available times.',
  ]
    .filter(Boolean)
    .join(' ');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Every special, not just the three on the home page.
 *
 * Live specials edited in WordPress lead; the verified venue packages fill
 * the rest. The page must never depend on the back office being up, so if
 * WordPress is empty or unreachable the verified package data still renders.
 *
 * Every card carries its own WhatsApp button (client request, 8 Sep 2025):
 * a special is usually a conversation first, so the booking message is
 * pre-typed with the special's name and price.
 */
export default async function PromotionsPage() {
  const wp = await getActivePromotions();
  const local = site.categories.find((c) => c.slug === 'promotions')?.items ?? [];

  const fromWordPress: Offer[] = wp.map((p) => ({
    anchor: `sp-${p.slug}`,
    name: p.title,
    description: p.excerpt,
    duration:
      p.duration ||
      (p.startsOn && p.endsOn ? `Until ${p.endsOn}` : 'Current offer'),
    price: p.priceNad ? formatNad(p.priceNad) : '',
  }));

  const offers: Offer[] = [
    ...fromWordPress,
    ...local
      .filter((o) => !fromWordPress.some((w) => w.name === o.name))
      .map((o) => ({
        anchor: `sp-local-${o.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: o.name,
        description: o.description,
        duration: o.duration ?? '',
        price: o.price ?? '',
      })),
  ];

  return (
    <>
      <main id="main">
        <PageHero
          slug="wine-pair"
          eyebrow="Specials"
          title="Packages worth planning around."
          lede="Shareable escapes for two, quiet afternoons with friends, and the treatments the spa is best known for. Every special is confirmed with the team before you book."
        />

        <section className="surface-marble-emerald border-t border-ink/10 py-16 md:py-20">
          {offers.length === 0 ? (
            <p className="text-ink/70">
              No specials are running right now. The full menu is always
              available on the services page.
            </p>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer, i) => (
                <FadeUp key={`${offer.name}-${i}`} delay={(i % 3) * 0.08} as="li">
                  <article
                    id={offer.anchor}
                    className="relative flex h-full scroll-mt-28 flex-col justify-between bg-ground p-7 shadow-sm"
                  >
                    <div aria-hidden="true" className="rule-gold absolute inset-x-0 top-0 h-0.5" />
                    <div>
                      <h2 className="text-lg font-semibold text-ink text-pretty">{offer.name}</h2>
                      {offer.description ? (
                        <p className="mt-3 text-sm leading-relaxed text-ink/70 text-pretty">
                          {offer.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="mt-8">
                      <div className="flex items-baseline justify-between gap-4 border-t border-ink/10 pt-5">
                        <span className="text-xs font-semibold uppercase tracking-widest text-ink/65">
                          {offer.duration}
                        </span>
                        {offer.price ? (
                          <span className="text-sm font-semibold tabular-nums text-emerald-700">
                            {offer.price}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2.5">
                        <a
                          href={waOfferHref(offer)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-[#07211A] transition-transform hover:scale-[1.02]"
                        >
                          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          Book on WhatsApp
                        </a>
                        <a
                          href={BOOKING_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-ink/20 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-ink transition-colors hover:border-emerald-600 hover:text-emerald-700"
                        >
                          Book now
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </article>
                </FadeUp>
              ))}
            </ul>
          )}

          <div className="mt-14 text-center">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-emerald-600 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700"
              >
                {BOOKING_CTA}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={waOfferHref({
                  anchor: '',
                  name: 'current specials',
                  description: null,
                  duration: '',
                  price: '',
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#25D366] px-8 py-3 text-xs font-semibold uppercase tracking-widest text-[#07211A] transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Ask on WhatsApp
              </a>
              <a
                href={PAY_PATH}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-emerald-700/40 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-emerald-800 transition-colors hover:border-emerald-700 hover:bg-emerald-50"
              >
                Book &amp; pay now
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <p className="mt-4 text-sm text-ink/70">
              Prefer to talk first? Call {site.phone}.
            </p>
          </div>
        </section>
      </main>
      <FooterFull />
    </>
  );
}
