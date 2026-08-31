import Link from 'next/link';
import { site } from '@/lib/site';

/**
 * The identity: vector gem + typeset wordmark, no box.
 *
 * Brand directive (client, Round 6): every letter of the wordmark is Radley,
 * and the two lines are set so that "Emerald" on top and "Spa & Wellness"
 * below render at exactly the same width. Sizes were computed from Radley
 * glyph metrics (bottom = top x 0.5663) so the lockup stays perfectly
 * equal-width at every scale.
 *
 * Brand directive (client, Round 9): the gem must sit at a good proportion
 * and read slightly LARGER than the wordmark block beside it, and the footer
 * lockup must be roughly four times the size it was. The gem therefore leads
 * each lockup by a clear margin at every step (sm 40px, md 48px, lg 64px,
 * xl fluid up to 168px).
 */
const SIZE = {
  sm: { gem: 'h-10 w-10', name: 21, gap: 'gap-3' },
  md: { gem: 'h-12 w-12', name: 26, gap: 'gap-3 md:gap-3.5' },
  lg: { gem: 'h-16 w-16', name: 34, gap: 'gap-4' },
} as const;

/** Radley width of "Spa & Wellness" relative to "Emerald" (equal-width lockup). */
const SUB_RATIO = 0.5663;

/** Footer statement lockup: fluid, roughly four times the old footer size. */
const XL = {
  gem: 'clamp(96px, 26vw, 168px)',
  name: 'clamp(54px, 15vw, 118px)',
};

export function Wordmark({
  tone = 'light',
  size = 'md',
  href = '/',
  className = '',
}: {
  /** 'dark' = for dark backgrounds (light text), 'light' = for light grounds. */
  tone?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  className?: string;
}) {
  const isXl = size === 'xl';
  const s = SIZE[size as keyof typeof SIZE] ?? SIZE.md;
  const subPx = isXl
    ? `calc(${XL.name} * ${SUB_RATIO})`
    : `${Math.round(s.name * SUB_RATIO * 100) / 100}px`;
  const subGap = isXl ? `calc(${XL.name} * 0.115)` : '3px';
  const nameSize = isXl ? XL.name : `${s.name}px`;
  const glow =
    tone === 'dark'
      ? 'drop-shadow-[0_0_14px_rgba(141,208,179,0.55)]'
      : 'drop-shadow-[0_2px_8px_rgba(7,33,26,0.2)]';

  return (
    <Link
      href={href}
      aria-label={`${site.legalName}, home`}
      className={`group inline-flex items-center ${isXl ? 'gap-4 md:gap-5' : s.gap} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/symbol-mark.svg"
        alt=""
        width={168}
        height={123}
        loading="eager"
        decoding="sync"
        style={isXl ? { width: XL.gem, height: `calc(${XL.gem} * 0.7315)` } : undefined}
        className={`${isXl ? '' : s.gem} ${glow} transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]`}
      />
      <span className="flex flex-col justify-center leading-none">
        <span
          className={`display ${tone === 'dark' ? 'text-ground' : 'text-ink'} transition-colors duration-300 ${
            tone === 'dark' ? 'group-hover:text-gold-200' : 'group-hover:text-emerald-700'
          }`}
          style={{ fontSize: nameSize, lineHeight: 1 }}
        >
          Emerald
        </span>
        <span
          className={`display ${tone === 'dark' ? 'text-ground/70' : 'text-ink/60'} transition-colors duration-300 ${
            tone === 'dark' ? 'group-hover:text-gold-200/90' : 'group-hover:text-emerald-700/90'
          }`}
          style={{ fontSize: subPx, lineHeight: 1, marginTop: subGap }}
        >
          Spa &amp; Wellness
        </span>
      </span>
    </Link>
  );
}
