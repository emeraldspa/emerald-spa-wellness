import Link from 'next/link';
import { site } from '@/lib/site';

/**
 * The identity: vector gem + typeset wordmark, no box.
 *
 * Brand directive: the mark is the traced gem SVG (crisp at any size) and the
 * wordmark is type, never a flattened lockup image. The name reads on two
 * lines by design: "Emerald" in Radley on top, "SPA & WELLNESS" in tracked
 * caps below. The gem sits directly on the surface it is placed on, with a
 * soft light glow on dark grounds so the dark-green facets stay visible.
 * Spacing is fixed per size so the gem, letterforms and tracking never drift
 * between header and footer.
 */
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
  const gem = { sm: 'h-7 w-7', md: 'h-8 w-8', lg: 'h-10 w-10' }[size];
  const name = { sm: 'text-[21px]', md: 'text-[26px]', lg: 'text-[32px]' }[size];
  const sub = { sm: 'text-[8px]', md: 'text-[9px]', lg: 'text-[10px]' }[size];
  const glow =
    tone === 'dark'
      ? 'drop-shadow-[0_0_14px_rgba(141,208,179,0.55)]'
      : 'drop-shadow-[0_2px_8px_rgba(7,33,26,0.2)]';

  return (
    <Link
      href={href}
      aria-label={`${site.legalName}, home`}
      className={`group inline-flex items-center gap-2.5 md:gap-3 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/symbol-mark.svg"
        alt=""
        width={40}
        height={40}
        loading="eager"
        decoding="sync"
        className={`${gem} ${glow} transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]`}
      />
      <span className="flex flex-col justify-center leading-none">
        <span
          className={`display ${name} ${
            tone === 'dark' ? 'text-ground' : 'text-ink'
          } tracking-[-0.01em] transition-colors duration-300 ${
            tone === 'dark' ? 'group-hover:text-gold-200' : 'group-hover:text-emerald-700'
          }`}
        >
          Emerald
        </span>
        <span
          className={`mt-[3px] ${sub} font-semibold uppercase tracking-[0.3em] ${
            tone === 'dark' ? 'text-ground/65' : 'text-ink/55'
          }`}
        >
          Spa &amp; Wellness
        </span>
      </span>
    </Link>
  );
}
