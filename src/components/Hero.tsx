import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import { HeroMenuButton } from '@/components/HeroMenuButton';
import { HeroVideo } from '@/components/HeroVideo';
import { BOOKING_CTA, BOOKING_PATH, LISTED_SERVICE_COUNT, site } from '@/lib/site';

/**
 * Stats are verified Fresha figures pulled from the live venue record,
 * not the agency placeholders in the original spec.
 */
const STATS = [
  { value: LISTED_SERVICE_COUNT, prefix: '+', label: 'SPA\nTREATMENTS' },
  { value: site.reviewCount, prefix: '+', label: 'VERIFIED\nREVIEWS' },
  { value: site.rating, prefix: '', label: 'GUEST\nRATING' },
];

const HEADING = ['Restore', 'Balance', 'Glow'];

const NAV = [
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/team', label: 'Team' },
  { href: '/visit', label: 'Visit' },
];

/**
 * Server component. The hero carries the largest contentful paint, so its
 * entrance runs on CSS animations rather than a JavaScript motion library.
 * Only the menu button needs interactivity, and it is isolated as its own
 * client island.
 */
export function Hero({ menuButtonId }: { menuButtonId: string }) {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/*
        Real walkthrough footage of the venue: reception, the garden, the
        treatment room. It needs no hue surgery, only a gentle lift, so the
        rooms read as themselves rather than as a graded abstraction.
      */}
      <HeroVideo
        poster="/media/hero-poster-1600.jpg"
        filter="saturate(1.08) contrast(1.03)"
      />

      {/*
        A dark wash over the footage: enough to seat light type without
        hiding the film. The gradient deepens toward the bottom where the
        headline sits, and the top stays light so the brand logo holds.
      */}
      <div aria-hidden="true" className="absolute inset-0 bg-[#07211A]/30" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#07211A]/75 via-[#07211A]/10 to-[#07211A]/25"
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <nav
          className="flex items-center justify-between px-5 pt-5 sm:px-8 md:px-12 md:pt-6"
          aria-label="Primary"
        >
          <div className="hero-down">
            <Link href="/" aria-label={`${site.legalName}, home`}>
              <BrandLogo tone="light" priority className="h-10 w-auto md:h-12" />
            </Link>
          </div>

          <ul className="hidden items-center gap-8 md:flex">
            {NAV.map((item, i) => (
              <li
                key={item.href}
                className="hero-down"
                style={{ animationDelay: `${(i + 1) * 0.1}s` }}
              >
                <Link
                  href={item.href}
                  className="text-sm font-semibold uppercase tracking-widest text-ground/90 transition-colors hover:text-gold-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <HeroMenuButton targetId={menuButtonId} />
        </nav>

        {/* Stats: a soft glass chip just behind the numbers, nothing else. */}
        <div className="flex flex-1 items-center justify-end px-5 py-8 sm:px-8 md:px-12 md:py-0">
          <div className="flex gap-5 rounded-2xl bg-[#07211A]/15 px-4 py-3 backdrop-blur-[3px] sm:gap-8 sm:px-5 md:gap-10">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="hero-up text-right"
                style={{ animationDelay: `${(i + 2) * 0.12}s` }}
              >
                <p
                  className="font-semibold leading-none text-ground"
                  style={{ fontSize: 'clamp(1.5rem, 5vw, 3.5rem)' }}
                >
                  {stat.prefix ? (
                    <span className="text-emerald-300" style={{ fontSize: '0.5em' }}>
                      {stat.prefix}
                    </span>
                  ) : null}
                  {stat.value}
                </p>
                <p className="whitespace-pre-line text-[12px] font-semibold uppercase leading-tight tracking-widest text-ground/75 sm:text-xs md:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* The words, on a whisper of glass: a little blur exactly behind the
            type so the film still shows through everywhere else. */}
        <div className="mx-5 mb-8 flex flex-col gap-6 rounded-3xl bg-[#07211A]/15 p-4 backdrop-blur-[3px] sm:mx-8 sm:p-5 md:mx-12 md:mb-12 md:gap-10 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <p
              className="hero-up max-w-[130px] text-[12px] font-semibold uppercase tracking-widest text-ground/85 sm:max-w-[160px] sm:text-xs md:max-w-xs md:text-sm"
              style={{ animationDelay: '0.6s' }}
            >
              Quiet Luxury
              <br />
              In The Heart Of
              <br />
              Windhoek West
            </p>

            <Link
              href={BOOKING_PATH}
              className="hero-up flex min-h-[44px] items-center gap-1 whitespace-nowrap font-semibold text-emerald-300 transition-opacity hover:opacity-75"
              style={{ animationDelay: '0.72s', fontWeight: 600 }}
            >
              <span className="text-base sm:text-xl md:text-2xl">{BOOKING_CTA}</span>
              <ArrowUpRight
                className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px]"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="flex items-end justify-between gap-3 sm:gap-4">
            <p
              className="hero-up w-[120px] shrink-0 text-left text-[9px] font-semibold uppercase tracking-widest text-ground/80 sm:w-[180px] sm:text-xs md:w-[280px] md:text-right md:text-sm"
              style={{ animationDelay: '0.84s' }}
            >
              A refined retreat where calm, balance and quiet luxury set the tone
            </p>

            <h1 className="display text-right text-ground">
              {HEADING.map((word, i) => (
                <span key={word} className="reveal-clip">
                  <span
                    className="hero-rise"
                    style={{
                      animationDelay: `${0.4 + i * 0.14}s`,
                      fontSize: 'clamp(2rem, 9vw, 9rem)',
                      lineHeight: 0.88,
                      fontWeight: 600,
                    }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
