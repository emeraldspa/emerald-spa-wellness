import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { HeroMenuButton } from '@/components/HeroMenuButton';
import { HeroVideo } from '@/components/HeroVideo';
import { site } from '@/lib/site';

/**
 * Stats are verified Fresha figures pulled from the live venue record,
 * not the agency placeholders in the original spec.
 */
const STATS = [
  { value: site.serviceCount, prefix: '+', label: 'SPA\nTREATMENTS' },
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
        The supplied footage is chrome with pink and violet iridescence.
        Neutralising to sepia first, then rotating the hue, swings the whole
        frame into the emerald and teal range so the video reinforces the
        brand instead of competing with it.
      */}
      <HeroVideo
        poster="/media/reception-1600.jpg"
        filter="sepia(1) hue-rotate(105deg) saturate(3.2) brightness(1.04) contrast(1.06)"
      />

      {/* Ground veil lifts the frame so black body text clears AA contrast. */}
      <div aria-hidden="true" className="absolute inset-0 bg-ground/62" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ground/70 via-ground/35 to-ground/80"
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <nav
          className="flex items-center justify-between px-5 pt-5 sm:px-8 md:px-12 md:pt-6"
          aria-label="Primary"
        >
          <div className="hero-down">
            <Link href="/" aria-label="Emerald Spa and Wellness Centre, home">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-600">
                <span className="block h-[10px] w-[10px] rounded-full bg-emerald-600" />
              </span>
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
                  className="text-sm font-semibold uppercase tracking-widest text-ink transition-colors hover:text-emerald-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <HeroMenuButton targetId={menuButtonId} />
        </nav>

        <div className="flex flex-1 items-center justify-end px-5 py-8 sm:px-8 md:px-12 md:py-0">
          <div className="flex gap-5 sm:gap-8 md:gap-10">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="hero-up text-right"
                style={{ animationDelay: `${(i + 2) * 0.12}s` }}
              >
                <p
                  className="font-semibold leading-none text-ink"
                  style={{ fontSize: 'clamp(1.5rem, 5vw, 3.5rem)' }}
                >
                  {stat.prefix ? (
                    <span className="text-emerald-600" style={{ fontSize: '0.5em' }}>
                      {stat.prefix}
                    </span>
                  ) : null}
                  {stat.value}
                </p>
                <p className="whitespace-pre-line text-[10px] font-semibold uppercase leading-tight tracking-widest text-ink sm:text-xs md:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 px-5 pb-8 sm:px-8 md:gap-12 md:px-12 md:pb-12">
          <div className="flex items-center justify-between gap-4">
            <p
              className="hero-up max-w-[130px] text-[10px] font-semibold uppercase tracking-widest text-ink sm:max-w-[160px] sm:text-xs md:max-w-xs md:text-sm"
              style={{ animationDelay: '0.6s' }}
            >
              Quiet Luxury
              <br />
              In The Heart Of
              <br />
              Windhoek West
            </p>

            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-up flex items-center gap-1 whitespace-nowrap font-semibold text-emerald-600 transition-opacity hover:opacity-70"
              style={{ animationDelay: '0.72s', fontWeight: 600 }}
            >
              <span className="text-base sm:text-xl md:text-2xl">Book Your Escape</span>
              <ArrowUpRight
                className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px]"
                aria-hidden="true"
              />
            </a>
          </div>

          <div className="flex items-end justify-between gap-3 sm:gap-4">
            <p
              className="hero-up w-[120px] shrink-0 text-left text-[9px] font-semibold uppercase tracking-widest text-ink sm:w-[180px] sm:text-xs md:w-[280px] md:text-right md:text-sm"
              style={{ animationDelay: '0.84s' }}
            >
              A refined retreat where calm, balance and quiet luxury set the tone
            </p>

            <h1 className="display text-right text-ink">
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
