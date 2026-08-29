import Link from 'next/link';
import { site } from '@/lib/site';

/**
 * The identity: vector gem + typeset wordmark, no box.
 *
 * Brand directive (client, Round 6): every letter of the wordmark is Radley,
 * and the two lines are set so that "Emerald" on top and "Spa & Wellness"
 * below render at exactly the same width. Sizes were computed from Radley
 * glyph metrics (bottom = top x 0.5663) so the lockup stays perfectly
 * equal-width at every scale. The gem sits directly on the surface it is
 * placed on, with a soft light glow on dark grounds so the dark-green
 * facets stay visible. Spacing is fixed per size so the gem, letterforms
 * and line widths never drift between header and footer.
 */
const SIZE = {
  sm: { gem: 'h-7 w-7', name: 21, gap: 'gap-2.5' },
  md: { gem: 'h-8 w-8', name: 26, gap: 'gap-2.5 md:gap-3' },
  lg: { gem: 'h-10 w-10', name: 32, gap: 'gap-3' },
} as const;

/** Radley width of "Spa & Wellness" relative to "Emerald" (equal-width lockup). */
const SUB_RATIO = 0.5663;

export function Wordmark({
  tone = 'light',
  size = 'md',
  href = '/',
  className = '',
}: {
  /** 'dark' = for dark backgrounds (light text), 'light' = for light grounds. */
  tone?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
}) {
  const s = SIZE[size];
  const namePx = s.name;
  const subPx = Math.round(namePx * SUB_RATIO * 100) / 100;
  const glow =
    tone === 'dark'
      ? 'drop-shadow-[0_0_14px_rgba(141,208,179,0.55)]'
      : 'drop-shadow-[0_2px_8px_rgba(7,33,26,0.2)]';

  return (
    <Link
      href={href}
      aria-label={`${site.legalName}, home`}
      className={`group inline-flex items-center ${s.gap} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/symbol-mark.svg"
        alt=""
        width={40}
        height={40}
        loading="eager"
        decoding="sync"
        className={`${s.gem} ${glow} transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]`}
      />
      <span className="flex flex-col justify-center leading-none">
        <span
          className={`display ${tone === 'dark' ? 'text-ground' : 'text-ink'} transition-colors duration-300 ${
            tone === 'dark' ? 'group-hover:text-gold-200' : 'group-hover:text-emerald-700'
          }`}
          style={{ fontSize: `${namePx}px`, lineHeight: 1 }}
        >
          Emerald
        </span>
        <span
          className={`display mt-[3px] ${
            tone === 'dark' ? 'text-ground/70' : 'text-ink/60'
          } transition-colors duration-300 ${
            tone === 'dark' ? 'group-hover:text-gold-200/90' : 'group-hover:text-emerald-700/90'
          }`}
          style={{ fontSize: `${subPx}px`, lineHeight: 1 }}
        >
          Spa &amp; Wellness
        </span>
      </span>
    </Link>
  );
}
