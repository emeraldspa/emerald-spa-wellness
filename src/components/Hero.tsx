import { ArrowUpRight } from 'lucide-react';
import { HeroVideo } from '@/components/HeroVideo';
import { BOOKING_CTA, BOOKING_URL, LISTED_SERVICE_COUNT, site } from '@/lib/site';

/**
 * Stats are verified Fresha figures pulled from the live venue record,
 * not the agency placeholders in the original spec.
 */
const STATS = [
  { value: LISTED_SERVICE_COUNT, prefix: '+', label: 'SPA\nTREATMENTS' },
  { value: site.reviewCount, prefix: '+', label: 'VERIFIED\nREVIEWS' },
  { value: site.rating, prefix: '', label: 'GUEST\nRATING' },
];

/*
  Client round 11 (2026-09-03): the three hero words become the tagline's own
  verbs, matching "Relax the body, Renew the mind, Rejuvenate the soul".
  Structure and motion are unchanged.
*/
const HEADING = ['Relax', 'Renew', 'Rejuvenate'];


/**
 * Server component. The hero carries the largest contentful paint, so its
 * entrance runs on CSS animations rather than a JavaScript motion library.
 * Navigation lives entirely in the universal StickyNav header above it.
 */
export function Hero() {
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
        hiding the film. The wash holds at 45% through the middle and top
        because the footage has bright window frames in every scene, and the
        headline, eyebrow and stats must keep WCAG AA contrast on the
        brightest frame, deepening to 75% at the bottom where the type is
        densest.
      */}
      <div aria-hidden="true" className="absolute inset-0 bg-[#07211A]/30" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#07211A]/75 via-[#07211A]/45 to-[#07211A]/45"
      />

      {/*
        The inner column is height-capped, not just min-heighted, so on short
        viewports the hero ends where the viewport ends instead of pushing a
        second scroll page under the fold. The svh-aware clamps on the heading
        (.hero-word) and the panel margin (.hero-panel-mb) shrink the content
        budget first, so the cap is reached, not exceeded, at every common
        resolution.
      */}
      <div className="relative z-10 flex h-full min-h-[100svh] flex-col">

        {/* Stats: a soft glass chip just behind the numbers.
            The room-tone pill that used to sit in flow here (Round 9) was
            retired in Round 19: the reel now carries its own soundtrack and
            the mute control lives in the floating action stack, bottom
            right, next to WhatsApp and scroll-to-top.
            The top padding keeps the chip clear of the fixed header on short
            viewports: the chip used to centre straight under the nav, which
            hid the numbers behind it in Chrome. The chip itself is kept
            deliberately small so it reads as a caption, not a banner. */}
        <div className="hero-top flex min-h-0 flex-1 flex-col justify-center gap-4 px-5 pb-8 pt-24 sm:px-8 md:px-12 md:pb-8 md:pt-28">
          <div className="hero-extras flex justify-end">
            <div className="flex gap-4 rounded-xl bg-[#07211A]/55 px-4 py-2.5 backdrop-blur-md sm:gap-6 sm:px-5 md:gap-8">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="hero-up text-right"
                style={{ animationDelay: `${(i + 2) * 0.12}s` }}
              >
                <p
                  className="font-semibold leading-none text-ground"
                  style={{ fontSize: 'clamp(1.25rem, 3.2vw, 2.4rem)' }}
                >
                  {stat.prefix ? (
                    <span className="text-emerald-300" style={{ fontSize: '0.5em' }}>
                      {stat.prefix}
                    </span>
                  ) : null}
                  {stat.value}
                </p>
                <p className="whitespace-pre-line text-[10px] font-semibold uppercase leading-tight tracking-widest text-ground/75 sm:text-[11px] md:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* The words, on a whisper of glass: a little blur exactly behind the
            type so the film still shows through everywhere else. The bottom
            margin (.hero-panel-mb) scales with the viewport and keeps a floor
            that clears the fixed contact cluster on small screens, so the
            floating toggle never sits on the last word of the heading. */}
        <div className="hero-panel-mb hero-panel-compact mx-5 flex flex-col gap-6 rounded-3xl bg-[#07211A]/25 p-4 backdrop-blur-md sm:mx-8 sm:p-5 md:mx-12 md:gap-8 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <p
              className="hero-up max-w-[130px] text-[12px] font-semibold uppercase tracking-widest text-ground/85 sm:max-w-[160px] sm:text-xs md:max-w-xs md:text-sm"
              style={{ animationDelay: '0.6s' }}
            >
              Quiet Luxury
              <br />
              In The Heart Of
              <br />
              Windhoek North
            </p>

            <a
              href={BOOKING_URL}
              className="hero-up flex min-h-[44px] items-center gap-1 whitespace-nowrap font-semibold text-emerald-300 transition-opacity hover:opacity-75"
              style={{ animationDelay: '0.72s', fontWeight: 600 }}
            >
              <span className="text-base sm:text-xl md:text-2xl">{BOOKING_CTA}</span>
              <ArrowUpRight
                className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px]"
                aria-hidden="true"
              />
            </a>
          </div>

          {/* Stacks on phones: the tagline sits above the words so the
              headline owns the full panel width. Forcing both into one row
              left ~86px for a ~175px-wide word at 320-375px, and the
              headline clipped off the right edge. */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <p
              className="hero-up max-w-[280px] text-left text-[11px] leading-snug text-ground/90 sm:max-w-none sm:w-[220px] sm:text-sm md:w-[320px] md:text-base md:leading-relaxed"
              style={{ animationDelay: '0.84s' }}
            >
              {site.tagline}
            </p>

            <h1 className="display text-right text-ground">
              {HEADING.map((word, i) => (
                <span key={word} className="reveal-clip">
                  <span
                    className="hero-rise hero-word"
                    style={{ animationDelay: `${0.4 + i * 0.14}s` }}
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
