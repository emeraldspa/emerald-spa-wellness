import type { Metadata } from 'next';
import { ArrowUpRight, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { Picture } from '@/components/Picture';
import { VideoReel } from '@/components/VideoReel';
import { VenueEnquiry } from '@/components/VenueEnquiry';
import { ClipReveal, FadeUp } from '@/components/motion';
import { RevealText } from '@/components/RevealText';
import { FooterFull } from '@/components/FooterFull';
import { SITE_URL, WHATSAPP_PATH, site, ogFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Venues and Events',
  description:
    'Host your celebration at Emerald Spa and Wellness Centre in Windhoek North. Gender reveals, birthday parties, corporate events and family gatherings, with the space, the garden and the team to make it memorable.',
  alternates: { canonical: '/venues' },
  ...ogFor('/venues'),
};

const REVEAL_PHOTOS = ['venue-party-1', 'venue-party-2', 'venue-party-3'];
const PARTY_PHOTOS = [
  'venue-party-4',
  'venue-party-5',
  'venue-party-6',
  'venue-party-7',
  'venue-party-8',
  'venue-party-9',
  'venue-party-10',
  'venue-party-11',
  'venue-party-12',
];

export default function VenuesPage() {
  return (
    <>
      <main id="main">
        <PageHero
          slug="venue-party-4"
          eyebrow="Venues and events"
          title="Your celebration, at the spa."
          lede="The garden, the lounge and the hydrotherapy suite become the backdrop for your event. Two recent gatherings, exactly as they happened, then the space itself."
        />

        {/* Two stories */}
        <section className="shell border-b border-ink/10 py-20 md:py-28">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <FadeUp>
              <article id="story-gender-reveal" className="scroll-mt-28">
                <p className="eyebrow text-emerald-600">Story one</p>
                <h2 className="display mt-4 text-3xl text-balance sm:text-4xl">
                  <ClipReveal>A gender reveal to remember.</ClipReveal>
                </h2>
                <RevealText
                  text="The big moment happened in the garden, with the reveal planned around a hydrotherapy afternoon for the family. What started as a soak became the surprise of the day, and the balloons told the story before anyone said a word."
                  lines={3}
                  className="mt-5 max-w-xl leading-relaxed text-ink/70"
                />
                <div className="mt-8">
                  <VideoReel
                    poster="/media/video/gender-reveal-poster.webp"
                    srcs={[
                      { type: 'video/mp4', src: '/media/video/gender-reveal.mp4' },
                    ]}
                  />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {REVEAL_PHOTOS.map((slug) => (
                    <div key={slug} className="overflow-hidden rounded-xl border border-ink/10">
                      <Picture
                        slug={slug}
                        alt=""
                        sizes="(max-width: 768px) 30vw, 22vw"
                        imgClassName="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              </article>
            </FadeUp>

            <FadeUp delay={0.08}>
              <article id="story-party" className="scroll-mt-28">
                <p className="eyebrow text-emerald-600">Story two</p>
                <h2 className="display mt-4 text-3xl text-balance sm:text-4xl">
                  <ClipReveal>A party that filled the garden.</ClipReveal>
                </h2>
                <RevealText
                  text="The venue became a private party for the night: tables under the trees, the lounge set up for guests, and the team moving between the garden and the hydrotherapy suite all evening. One venue, a whole evening of moods."
                  lines={3}
                  className="mt-5 max-w-xl leading-relaxed text-ink/70"
                />
                <div className="mt-8">
                  <VideoReel
                    poster="/media/video/party-reel-poster.webp"
                    srcs={[
                      { type: 'video/mp4', src: '/media/video/party-reel.mp4' },
                    ]}
                  />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {['venue-party-5', 'venue-party-7', 'venue-party-9'].map((slug) => (
                    <div key={slug} className="overflow-hidden rounded-xl border border-ink/10">
                      <Picture
                        slug={slug}
                        alt=""
                        sizes="(max-width: 768px) 30vw, 22vw"
                        imgClassName="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              </article>
            </FadeUp>
          </div>
        </section>

        {/* Masonry, natural aspect, nothing cropped */}
        <section className="surface-panel border-b border-ink/10 py-20 md:py-28">
          <div className="shell">
            <p className="eyebrow text-emerald-600">The night in full</p>
            <h2 className="display mt-4 max-w-2xl text-3xl text-balance sm:text-4xl">
              <ClipReveal>Photographs from the evening.</ClipReveal>
            </h2>
            <p className="mt-4 max-w-2xl text-ink/70 text-pretty">
              Every frame at its natural size, nothing cut off. Scroll the full set from the
              event.
            </p>
          </div>
          <div className="shell mt-12 grid grid-cols-2 gap-5 lg:grid-cols-3 items-start">
            {PARTY_PHOTOS.map((slug, i) => (
              <FadeUp key={slug} delay={(i % 3) * 0.06} >
                <div className="overflow-hidden rounded-2xl border border-ink/10">
                  <Picture
                    slug={slug}
                    alt=""
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 28vw"
                    imgClassName="w-full h-auto"
                  />
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* Book the venue */}
        <section id="book-venue" className="surface-marble-emerald relative scroll-mt-24 py-20 text-ground md:py-28">
          <div aria-hidden="true" className="absolute inset-0 bg-[#063D2F]/50" />
          <div aria-hidden="true" className="rule-gold absolute inset-x-0 top-0 h-px" />
          <div aria-hidden="true" className="rule-gold absolute inset-x-0 bottom-0 h-px" />
          <div className="shell relative">
            <div className="max-w-2xl">
              <p className="eyebrow text-emerald-300">Book the venue</p>
              <h2 className="display mt-4 text-3xl text-balance sm:text-4xl md:text-5xl">
                <ClipReveal>Make it your own night.</ClipReveal>
              </h2>
              <p className="mt-5 text-ground/75 text-pretty">
                Tell us the occasion, the size and the timing and we will come back with
                availability, a menu and the details.
              </p>
            </div>
            <div className="mt-12">
              <VenueEnquiry />
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ground/70">
              <span className="text-xs font-semibold uppercase tracking-widest text-ground/75">
                Or reach us directly
              </span>
              <a
                href={`tel:${site.phoneE164}`}
                className="flex items-center gap-2 font-medium transition-colors hover:text-gold-200"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {site.phone}
              </a>
              <Link
                href={WHATSAPP_PATH}
                className="flex items-center gap-2 font-medium transition-colors hover:text-gold-200"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </Link>
              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-gold-300/45 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-gold-200 transition-colors hover:border-gold-300 hover:bg-gold-300/10"
              >
                Book a treatment
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <FooterFull />
    </>
  );
}
