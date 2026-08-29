import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, MessageCircle, Phone, Users } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { Picture } from '@/components/Picture';
import { VenueEnquiry } from '@/components/VenueEnquiry';
import { WhatsAppFlow } from '@/components/WhatsAppFlow';
import { ClipReveal, FadeUp } from '@/components/motion';
import { RevealText } from '@/components/RevealText';
import { FooterFull } from '@/components/FooterFull';
import { site, SITE_URL, WHATSAPP_PATH, ogFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Book in Bulk',
  description:
    'Arrange a group visit, a celebration or the venue at Emerald Spa & Wellness Centre, Windhoek North. Tell us who, how many and when, and we take it from there.',
  alternates: { canonical: '/book-bulk' },
  openGraph: ogFor('/book-bulk'),
};

const BULK_PHOTOS = [
  'venue-party-4',
  'venue-party-6',
  'venue-party-8',
  'venue-party-10',
  'venue-party-12',
  'venue-party-2',
];

export default function BookBulkPage() {
  const categories = site.categories
    .filter((c) => !['refreshments', 'add-on-services', 'promotions'].includes(c.slug))
    .map((c) => c.name);

  return (
    <>
      <main id="main">
        <PageHero
          slug="venue-party-8"
          eyebrow="Book in bulk"
          title="The whole group, taken care of."
          lede="A group of friends, a hen or stag party, a family celebration, a corporate team day: tell us what you are planning and we will build the day around it."
        />

        {/* The two paths: group treatments or the venue */}
        <section className="shell border-b border-ink/10 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2">
            <FadeUp>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="eyebrow text-emerald-600">Group treatments</p>
              </div>
              <h2 className="display mt-4 text-3xl text-balance">
                <ClipReveal>Treatments for a group, at one table.</ClipReveal>
              </h2>
              <RevealText
                text="We plan group visits around a shared start and end time, so everyone arrives together and finishes together. Tell us how many of you there are and we will suggest the right combination of treatments."
                lines={2}
                className="mt-5 max-w-xl leading-relaxed text-ink/70"
              />
            </FadeUp>
            <FadeUp delay={0.08}>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="eyebrow text-emerald-600">The venue</p>
              </div>
              <h2 className="display mt-4 text-3xl text-balance">
                <ClipReveal>Your own night at the spa.</ClipReveal>
              </h2>
              <RevealText
                text="The garden, the lounge and the hydrotherapy suite can be yours for the evening. See how two recent celebrations looked, then ask about availability and pricing."
                lines={2}
                className="mt-5 max-w-xl leading-relaxed text-ink/70"
              />
              <Link
                href="/venues"
                className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700"
              >
                See the venue
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </FadeUp>
          </div>
        </section>

        {/* Venue enquiry widget */}
        <section className="surface-panel border-b border-ink/10 py-16 md:py-24">
          <div className="shell grid gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow text-emerald-600">Venue availability</p>
              <h2 className="display mt-4 text-3xl text-balance sm:text-4xl">
                <ClipReveal>Ask about the venue.</ClipReveal>
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-ink/70 text-pretty">
                The occasion, the size of the group and roughly when: that is all we need to
                come back with availability, options and pricing.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3 items-start">
                {BULK_PHOTOS.map((slug, i) => (
                  <FadeUp key={slug} delay={(i % 3) * 0.05} >
                    <div className="overflow-hidden rounded-xl border border-ink/10">
                      <Picture
                        slug={slug}
                        alt=""
                        sizes="(max-width: 640px) 50vw, 25vw"
                        imgClassName="w-full h-auto"
                      />
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
            <VenueEnquiry />
          </div>
        </section>

        {/* Group treatments flow */}
        <section className="surface-marble-gold border-b border-ink/10 py-16 md:py-24">
          <div className="shell grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-emerald-600">Group treatments</p>
              <h2 className="display mt-4 text-3xl text-balance sm:text-4xl">
                <ClipReveal>Build the group message.</ClipReveal>
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-ink/70 text-pretty">
                Three quick steps and the message is ready in WhatsApp. Pick &ldquo;a group or
                event&rdquo; and the flow will ask how many of you there are.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-ink/70">
                <span className="text-xs font-semibold uppercase tracking-widest text-ink/50">
                  Or
                </span>
                <a
                  href={`tel:${site.phoneE164}`}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 font-medium transition-colors hover:border-emerald-600 hover:text-emerald-600"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {site.phone}
                </a>
                <Link
                  href={WHATSAPP_PATH}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 font-medium transition-colors hover:border-emerald-600 hover:text-emerald-600"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  General enquiries
                </Link>
              </div>
            </div>
            <div className="lg:col-span-7">
              <WhatsAppFlow categories={categories} initialIntent="group" />
            </div>
          </div>
        </section>

        {/* Online calendar fallback */}
        <section className="shell py-14 md:py-16">
          <div
            className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl bg-emerald-900 px-8 py-8 text-ground sm:flex-row sm:items-center md:px-12"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 60% 120% at 85% 20%, rgba(117,224,186,0.22), transparent 60%), url('/media/emerald-stone.webp')",
              backgroundSize: 'auto, 340px',
              backgroundRepeat: 'no-repeat, no-repeat',
              backgroundPosition: 'center, 92% 50%',
            }}
          >
            <div>
              <h2 className="display text-2xl text-balance sm:text-3xl">
                Prefer the online calendar?
              </h2>
              <p className="mt-2 max-w-xl text-ground/75 text-pretty">
                Individual bookings and smaller groups can also be made straight in the spa
                &rsquo;s booking system.
              </p>
            </div>
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-full bg-gold-300 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-emerald-950 transition-colors hover:bg-gold-200"
            >
              Book online
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>
      <FooterFull />
    </>
  );
}
