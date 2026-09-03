import { ArrowUpRight, Star } from 'lucide-react';
import Link from 'next/link';
import { Carousel } from '@/components/Carousel';
import { StatusWidgets } from '@/components/StatusWidgets';
import { TodayHours } from '@/components/TodayHours';
import { getActivePromotions } from '@/lib/wordpress';
import { Hero } from '@/components/Hero';
import { Picture } from '@/components/Picture';
import { ClipReveal, FadeUp } from '@/components/motion';
import { RevealText } from '@/components/RevealText';
import { FooterFull } from '@/components/FooterFull';
import { PRODUCTS } from '@/data/products';
import {
  BOOKING_CTA,
  BOOKING_PATH,
  GOOGLE_REVIEW_URL,
  HOME_CAROUSEL_SLUGS,
  LISTED_SERVICE_COUNT,
  formatNad,
  site,
} from '@/lib/site';

/** Four signature categories, chosen for breadth across the real menu. */
const SIGNATURE = ['massages', 'facials-skincare', 'hydrotherapy', 'nails'];

/** Event name shared between the hero button island and the menu host. */

export default async function HomePage() {
  const signatureCats = SIGNATURE.map(
    (slug) => site.categories.find((c) => c.slug === slug)!,
  ).filter(Boolean);

  /* The three offers with a written description, which are the ones that
     explain themselves without the visitor opening the full menu. */
  const localOffers = (site.categories.find((c) => c.slug === 'promotions')?.items ?? [])
    .filter((item) => item.description)
    .slice(0, 3);

  /*
    Offers the spa is running now, edited in WordPress. If WordPress has none,
    is empty, or is unreachable, the verified package data still renders. The
    page must never depend on the back office being up.
  */
  const wpPromotions = await getActivePromotions();
  const fromWordPress = wpPromotions.slice(0, 3).map((p) => ({
    name: p.title,
    description: p.excerpt,
    duration:
      p.duration ||
      (p.startsOn && p.endsOn ? `Until ${p.endsOn}` : 'Current offer'),
    price: p.priceNad ? formatNad(p.priceNad) : '',
  }));

  /*
    Live offers lead, verified packages fill the rest of the row. One
    promotion in WordPress should add to the section, not empty it.
  */
  const PROMOTIONS = [
    ...fromWordPress,
    ...localOffers.filter((o) => !fromWordPress.some((w) => w.name === o.name)),
  ].slice(0, 3);

  /* The strongest voices, spiral-stacked: longest and most substantive first,
     thin one-word reviews excluded. Sorted for rhythm, never fabricated. */
  const featured = site.reviews
    .filter((r) => r.text.trim().length > 12)
    .slice()
    .sort((a, b) => b.text.length - a.text.length);

  return (
    <>
      <header>
        <Hero />
      </header>

      <main id="main">
        {/* Four live facts, no more. The questions a visitor has before calling. */}
        <section className="shell -mt-px border-b border-ink/10 py-6">
          <StatusWidgets />
        </section>

        {/* Introduction. The spa's own words, verbatim from the venue record. */}
        <section className="shell border-b border-ink/10 py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="eyebrow text-emerald-600">The Retreat</p>
            </div>
            <div className="md:col-span-8">
              <h2 className="display text-3xl text-balance sm:text-4xl md:text-5xl">
                <ClipReveal>A refined retreat in Windhoek North.</ClipReveal>
              </h2>
              <FadeUp delay={0.1}>
                <RevealText
                  text={site.description}
                  lines={3}
                  className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/75"
                />
              </FadeUp>
              <FadeUp delay={0.18}>
                <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                  {site.features.map((f) => (
                    <li key={f} className="text-sm font-medium text-ink/65">
                      {f}
                    </li>
                  ))}
                </ul>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* Signature services. Real names, real prices, no accordion. */}
        <section className="shell border-b border-ink/10 py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-emerald-600">Signature Treatments</p>
              <h2 className="display mt-4 text-3xl sm:text-4xl md:text-5xl">
                <ClipReveal>Care with intention.</ClipReveal>
              </h2>
            </div>
            <Link
              href="/services"
              className="group flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-emerald-600"
            >
              All {LISTED_SERVICE_COUNT} services
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <TodayHours />

          <div className="mt-14 grid gap-x-10 gap-y-14 md:grid-cols-2">
            {signatureCats.map((cat, i) => (
              <FadeUp key={cat.slug} delay={i * 0.08} as="article">
                <h3 className="display text-2xl sm:text-3xl">{cat.name}</h3>
                <ul className="mt-6 divide-y divide-ink/10 border-t border-ink/10">
                  {cat.items.slice(0, 4).map((s) => (
                    <li key={s.name} className="flex items-baseline justify-between gap-6 py-3.5">
                      <span className="text-[0.95rem] text-ink/85">{s.name}</span>
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-emerald-700">
                        {s.price}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services#${cat.slug}`}
                  className="mt-5 inline-block text-xs font-semibold uppercase tracking-widest text-ink/65 transition-colors hover:text-emerald-600"
                >
                  {cat.items.length} treatments
                </Link>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* Gallery carousel, authentic venue photography. */}
        <section className="border-b border-ink/10 py-20 md:py-28">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-emerald-600">Inside Emerald</p>
                <h2 className="display mt-4 text-3xl sm:text-4xl md:text-5xl">
                  <ClipReveal>The space itself.</ClipReveal>
                </h2>
              </div>
              <Link
                href="/gallery"
                className="group flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-emerald-600"
              >
                Full gallery
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
          <div className="mt-12 pl-[var(--grid-padding)]">
            <Carousel slugs={HOME_CAROUSEL_SLUGS} label="Photographs of Emerald Spa and Wellness Centre" />
          </div>
        </section>

        {/* Guest reviews as a spiral: staggered cards, quiet rotation, real
            words from the booking record. */}
        <section className="surface-marble-emerald relative py-20 text-ground md:py-28">
          <div aria-hidden="true" className="absolute inset-0 bg-[#063D2F]/50" />
          <div aria-hidden="true" className="rule-gold absolute inset-x-0 top-0 h-px" />
          <div aria-hidden="true" className="rule-gold absolute inset-x-0 bottom-0 h-px" />
          <div className="shell relative">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-emerald-300">Guest Reviews</p>
                <h2 className="display mt-4 text-3xl sm:text-4xl md:text-5xl">
                  <ClipReveal>{site.rating} from {site.reviewCount} reviews.</ClipReveal>
                </h2>
              </div>
              <div
                role="img"
                aria-label={`Rated ${site.rating} out of 5`}
                className="flex items-center gap-1"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold-300 text-gold-300" aria-hidden="true" />
                ))}
              </div>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:gap-10">
              {featured.map((r, i) => (
                <FadeUp key={r.id} delay={(i % 4) * 0.06}>
                  <blockquote
                    className={`relative rounded-2xl border border-ground/12 bg-ground/[0.04] p-6 backdrop-blur-[2px] sm:p-8 ${
                      i % 3 === 0
                        ? 'md:-rotate-1 md:translate-y-2'
                        : i % 3 === 1
                          ? 'md:rotate-[0.5deg]'
                          : 'md:-translate-y-2 md:rotate-1'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="display absolute -top-5 left-4 text-6xl leading-none text-gold-300/40"
                    >
                      “
                    </span>
                    {/* Full review text, never clamped: the client flagged the
                        cut-off cards, and every curated review is short
                        enough to read in place. */}
                    <p className="text-pretty text-lg leading-relaxed text-ground/90">
                      {r.text}
                    </p>
                    {/* Round 11 (client): dates removed from every review
                        card. Name and initials only. */}
                    <figcaption className="mt-6 flex items-center gap-3 text-sm text-ground/75">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-200">
                        {r.initials}
                      </span>
                      {r.author}
                    </figcaption>
                  </blockquote>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.2}>
              <p className="mt-14 max-w-3xl text-ground/70 text-pretty">{site.reviewSummary}</p>
              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-ground/30 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ground transition-colors hover:border-gold-200 hover:text-gold-200"
              >
                <Star className="h-4 w-4 text-gold-300" aria-hidden="true" />
                Leave a Google review
              </a>
            </FadeUp>
          </div>
        </section>

        {/*
          Current offers, rendered from the venue's own record rather than
          framed in from the booking platform. Same data, no third-party
          chrome, no platform name, and it stays styled like the rest of the
          site.
        */}
        <section className="surface-marble-gold border-b border-ink/10 py-20 md:py-28">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-emerald-600">Current offers</p>
                <h2 className="display mt-4 text-3xl text-balance sm:text-4xl md:text-5xl">
                  <ClipReveal>Packages worth planning around.</ClipReveal>
                </h2>
              </div>
              <Link
                href="/promotions"
                className="group flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-emerald-600"
              >
                All offers
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {PROMOTIONS.map((offer, i) => (
                <FadeUp key={offer.name} delay={(i % 3) * 0.08} as="li">
                  <article className="relative flex h-full flex-col justify-between bg-ground p-7 shadow-sm">
                    <div aria-hidden="true" className="rule-gold absolute inset-x-0 top-0 h-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-ink text-pretty">{offer.name}</h3>
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
                        <span className="display text-2xl text-emerald-700">{offer.price}</span>
                      ) : null}
                    </div>
                  </article>
                </FadeUp>
              ))}
            </ul>
          </div>
        </section>

        {/* Products the spa uses. Descriptions only: the spa does not resell
            these, so there are no prices, just what they are and what they do. */}
        <section id="products" className="surface-panel scroll-mt-24 border-b border-ink/10 py-20 md:py-28">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-emerald-600">Products we use</p>
                <h2 className="display mt-4 max-w-xl text-3xl text-balance sm:text-4xl md:text-5xl">
                  <ClipReveal>The skincare in our treatments.</ClipReveal>
                </h2>
              </div>
              <p className="max-w-xs text-sm text-ink/70">
                Professional products from BioMedical Emporium, chosen for the results. Ask the
                team about them in store.
              </p>
            </div>

            <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
              {PRODUCTS.map((p, i) => (
                <FadeUp key={p.slug} delay={(i % 6) * 0.05} as="li">
                  <figure className="group">
                    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.name}
                        width={320}
                        height={320}
                        loading="lazy"
                        decoding="async"
                        className="aspect-square w-full object-contain mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                      />
                    </div>
                    <figcaption className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                        {p.use}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold leading-snug text-ink">{p.name}</h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-ink/65 text-pretty">
                        {p.description}
                      </p>
                    </figcaption>
                  </figure>
                </FadeUp>
              ))}
            </ul>
          </div>
        </section>

        {/* An imagery band: the tagline over a full-bleed photograph. */}
        <section
          aria-label="The Emerald promise"
          className="relative overflow-hidden py-28 text-center md:py-40"
        >
          <div aria-hidden="true" className="absolute inset-0">
            <Picture
              slug="atmos-14"
              alt=""
              sizes="100vw"
              imgClassName="h-full w-full object-cover"
            />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-[#07211A]/62" />
          <div className="shell relative">
            <FadeUp>
              <p className="display text-2xl text-balance text-ground sm:text-4xl md:text-5xl">
                {site.tagline}
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Visit. Address, hours, and the booking action. */}
        <section className="shell py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="eyebrow text-emerald-600">Visit</p>
              <h2 className="display mt-4 text-3xl text-balance sm:text-4xl md:text-5xl">
                <ClipReveal>Blackett Street, Windhoek North.</ClipReveal>
              </h2>
              <FadeUp delay={0.1}>
                <Link
                  href={BOOKING_PATH}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700"
                >
                  {BOOKING_CTA}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </FadeUp>
            </div>

            <div className="md:col-span-7">
              <FadeUp>
                <div className="overflow-hidden">
                  <Picture
                    slug="serenity-garden"
                    sizes="(max-width: 768px) 100vw, 58vw"
                    imgClassName="w-full object-cover"
                  />
                </div>
              </FadeUp>
            </div>
          </div>
        </section>
      </main>

      <FooterFull />
    </>
  );
}
