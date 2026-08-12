import { site } from '@/lib/site';

type Props = {
  /** `light` for dark backgrounds, `dark` for light backgrounds. */
  tone?: 'light' | 'dark';
  className?: string;
  priority?: boolean;
};

/**
 * Horizontal logo lockup for the header.
 *
 * The symbol and the wordmark are one raster asset because the supplied
 * artwork is photoreal: the gem's gradients and the rose gold rings do not
 * survive being flattened into a small traced SVG. AVIF and WebP with a PNG
 * fallback, alpha preserved, dimensions declared so the header never shifts.
 */
export function BrandLogo({ tone = 'dark', className, priority = false }: Props) {
  // `dark` tone means dark ink on a light ground, which is the light artwork.
  const file = tone === 'dark' ? 'lockup-horizontal-light' : 'lockup-horizontal-dark';

  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`/brand/${file}-320.avif 320w, /brand/${file}-640.avif 640w`}
        sizes="(max-width: 640px) 150px, 190px"
      />
      <source
        type="image/webp"
        srcSet={`/brand/${file}-320.webp 320w, /brand/${file}-640.webp 640w`}
        sizes="(max-width: 640px) 150px, 190px"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/brand/${file}.png`}
        alt={`${site.legalName}`}
        width={640}
        height={154}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={className}
      />
    </picture>
  );
}
