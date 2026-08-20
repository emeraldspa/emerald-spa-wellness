import type { Metadata } from 'next';
import { ArrowUpRight, Facebook, Instagram, MapPin, MessageCircle, Phone, Star } from 'lucide-react';
import Link from 'next/link';
import { FooterMinimal } from '@/components/FooterMinimal';
import { MapEmbed } from '@/components/MapEmbed';
import { Picture } from '@/components/Picture';
import { Faq } from '@/components/Faq';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHero } from '@/components/PageHero';
import { ClipReveal, FadeUp } from '@/components/motion';
import { BOOKING_CTA, BOOKING_PATH, GOOGLE_REVIEW_URL, WHATSAPP_PATH, getImage, site , SITE_URL, ogFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Visit and Contact',
  description: `Emerald Spa & Wellness Centre is at ${site.address.street}, ${site.address.suburb}, Windhoek. Open seven days. Call ${site.phone} or book online.`,
  alternates: { canonical: '/visit' },
  openGraph: ogFor('/visit'),
};

/** Arrival sequence: the entrance, the lounge, the garden, a welcome drink. */
const ARRIVAL_SLUGS = ['garden-signage', 'reception-lounge', 'hanging-chair', 'welcome-drink'];

/**
 * Answers drawn from the venue record: the amenity list, the published hours,
 * and the booking settings confirmed against the live listing. Nothing here is
 * invented, and no price or policy is stated that the spa has not published.
 */
const FAQ_ITEMS = [
  {
    q: 'Do I need to book, or can I walk in?',
    a: `Booking is the safer option, especially at weekends. You can reserve online in a few taps, or send a WhatsApp message on ${site.phone} and a person will answer during opening hours.`,
  },
  {
    q: 'Is there parking?',
    a: 'Yes. There is parking at the spa, and the venue is near public transport if you would rather not drive.',
  },
  {
    q: 'What is provided when I arrive?',
    a: 'Showers, lockers and bath towels are all available on site, so you can come straight from work or the gym.',
  },
  {
    q: 'Can I choose my therapist?',
    a: 'Yes. You can request a specific therapist when you book, subject to their availability that day.',
  },
  {
    q: 'How do I pay?',
    a: 'Payment is taken at the spa rather than online, so nothing is charged when you reserve your appointment.',
  },
  {
    q: 'Are children welcome?',
    a: 'Yes. The spa is kid-friendly and there is a dedicated Kiddie\u2019s Corner menu of treatments for younger guests.',
  },
  {
    q: 'Are you open on Sunday?',
    a: 'Yes, from 10:00 AM to 4:00 PM. Monday to Saturday the spa is open 9:00 AM to 6:00 PM.',
  },
  {
    q: 'Can I buy a gift voucher?',
    a: 'Yes. Choose a value on the vouchers page and send the order over WhatsApp or email. Staff confirm payment, then send you the voucher number and its expiry date.',
  },
] as const;

export default function VisitPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
                <PageHero
          slug="garden-signage"
          eyebrow="Visit"
          title="Find us in Windhoek West."
          lede="7 Blackett Street, Windhoek West, Khomas Region, Namibia. Open seven days."
        />

        <section className="shell grid gap-12 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-5">
            <h2 className="eyebrow text-emerald-600">Address</h2>
            <address className="mt-4 space-y-4 text-lg not-italic text-ink/80">
              <a
                href={site.address.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 transition-colors hover:text-emerald-600"
              >
                <MapPin className="mt-1.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.suburb}
                  <br />
                  {site.address.city}, {site.address.region}
                </span>
              </a>
              <a
                href={`tel:${site.phoneE164}`}
                className="flex items-center gap-3 transition-colors hover:text-emerald-600"
              >
                <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
                {site.phone}
              </a>
              <Link
                href={WHATSAPP_PATH}
                className="flex items-center gap-3 transition-colors hover:text-emerald-600"
              >
                <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                Book on WhatsApp
              </Link>
            </address>

            <h2 className="eyebrow mt-12 text-emerald-600">Opening Hours</h2>
            <ul className="mt-4 divide-y divide-ink/10 border-t border-ink/10">
              {site.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4 py-3 text-ink/80">
                  <span>{h.day}</span>
                  <span className="tabular-nums">{h.value}</span>
                </li>
              ))}
            </ul>

            <h2 className="eyebrow mt-12 text-emerald-600">Been in already</h2>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-ink/80 transition-colors hover:text-emerald-600"
            >
              <Star className="h-5 w-5 shrink-0 text-gold-500" aria-hidden="true" />
              Leave a Google review
            </a>

            <h2 className="eyebrow mt-12 text-emerald-600">Follow</h2>
            <div className="mt-4 flex gap-3">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Emerald Spa on Instagram"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-colors hover:border-emerald-600 hover:text-emerald-600"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Emerald Spa on Facebook"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-colors hover:border-emerald-600 hover:text-emerald-600"
              >
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>

            <Link
              href={BOOKING_PATH}
              className="mt-12 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700"
            >
              {BOOKING_CTA}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="md:col-span-7">
            <FadeUp>
              <MapEmbed />
            </FadeUp>
            <FadeUp delay={0.1}>
              <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
                {site.features.map((f) => (
                  <li key={f} className="text-sm text-ink/65">
                    {f}
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>
        </section>

        {/* What arrival actually looks like, so the address has a face. */}
        <section className="surface-marble-gold border-t border-ink/10 py-16 md:py-20">
          <div className="shell">
            <p className="eyebrow text-emerald-600">On arrival</p>
            <h2 className="display mt-4 text-3xl sm:text-4xl">What to expect when you get here.</h2>
          </div>
          <ul className="shell mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {ARRIVAL_SLUGS.map((slug, i) => (
              <FadeUp key={slug} delay={(i % 4) * 0.07} as="li">
                <figure>
                  <div className="overflow-hidden bg-emerald-900/5">
                    <Picture
                      slug={slug}
                      alt=""
                      sizes="(max-width: 768px) 50vw, 25vw"
                      imgClassName="h-48 w-full object-cover md:h-60"
                    />
                  </div>
                  <figcaption className="mt-2.5 text-xs text-ink/65">{getImage(slug).alt}</figcaption>
                </figure>
              </FadeUp>
            ))}
          </ul>
        </section>

        {/*
          Secondary detail, behind an accordion because it is consulted rather
          than read. Every answer comes from the venue record: the amenity list,
          the published hours, the verified booking settings. Prices, address,
          hours and phone stay visible elsewhere on this page, so nothing a
          visitor must not miss is hidden behind an interaction.
        */}
        <section className="surface-marble-pale border-t border-ink/10 py-16 md:py-20">
          <div className="shell grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="eyebrow text-emerald-700">Good to know</p>
              <h2 className="display mt-4 text-3xl sm:text-4xl">Before you visit.</h2>
              <p className="mt-4 max-w-sm text-ink/70 text-pretty">
                Anything not answered here, message us and a person replies.
              </p>
            </div>
            <div className="md:col-span-8">
              <Faq items={FAQ_ITEMS} />
            </div>
          </div>
        </section>
      </main>
      <FooterMinimal />
    </>
  );
}
