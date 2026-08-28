import Link from 'next/link';
import { site } from '@/lib/site';

/**
 * The identity, rebuilt as vector + text.
 *
 * Brand directive: the mark is the traced gem SVG (crisp at any size, no
 * raster) and the wordmark is typeset text in Radley with measured tracking,
 * never a flattened lockup image. On dark surfaces the dark-green facets of
 * the gem need a light seat to stay perfectly visible, so the SVG sits in a
 * small ivory glass tile; on light surfaces it renders directly on the
 * ground. Spacing is fixed per size so the tile, the letterforms and the
 * tracking never drift between header and footer.
 */
export function Wordmark({
  tone = 'light',
  size = 'md',
  href = '/',
  className = '',
}: {
  /** 'dark' = for dark backgrounds (light text + ivory tile), 'light' = for light grounds. */
  tone?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
}) {
  const iconBox = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' }[size];
  const gem = { sm: 'h-5 w-5', md: 'h-6 w-6', lg: 'h-7 w-7' }[size];
  const name = { sm: 'text-[17px]', md: 'text-xl', lg: 'text-2xl' }[size];
  const tile =
    tone === 'dark'
      ? 'bg-ground/95 shadow-[0_10px_28px_-10px_rgba(7,33,26,0.55)] ring-1 ring-white/15'
      : 'ring-1 ring-ink/10';

  return (
    <Link
      href={href}
      aria-label={`${site.legalName}, home`}
      className={`group inline-flex items-center gap-2.5 md:gap-3 ${className}`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-[22%] p-1.5 ${iconBox} ${tile} transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.04]`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/symbol-mark.svg"
          alt=""
          width={40}
          height={40}
          loading="eager"
          decoding="sync"
          className={`${gem} drop-shadow-[0_2px_6px_rgba(7,33,26,0.25)]`}
        />
      </span>
      <span className="flex flex-col justify-center leading-none">
        <span
          className={`display ${name} ${
            tone === 'dark' ? 'text-ground' : 'text-ink'
          } tracking-[-0.01em] transition-colors duration-300 ${
            tone === 'dark' ? 'group-hover:text-gold-200' : 'group-hover:text-emerald-700'
          }`}
        >
          Emerald Spa
        </span>
        <span
          className={`mt-1 text-[8px] font-semibold uppercase tracking-[0.32em] md:text-[9px] ${
            tone === 'dark' ? 'text-ground/60' : 'text-ink/55'
          }`}
        >
          Wellness Centre
        </span>
      </span>
    </Link>
  );
}
