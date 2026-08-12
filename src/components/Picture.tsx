import { getImage } from '@/lib/site';

type Props = {
  slug: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  alt?: string;
};

/**
 * Plain <picture> with AVIF then WebP then JPEG.
 *
 * Deliberately not next/image: every source is a build-time local file with
 * known intrinsic dimensions, so the runtime optimiser adds cost without
 * adding capability. Width and height are always declared to reserve layout.
 */
export function Picture({
  slug,
  sizes,
  className,
  imgClassName,
  priority = false,
  alt,
}: Props) {
  const img = getImage(slug);
  const avif = img.avif.map((s) => `${s.p} ${s.w}w`).join(', ');
  const webp = img.webp.map((s) => `${s.p} ${s.w}w`).join(', ');

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={avif} sizes={sizes} />
      <source type="image/webp" srcSet={webp} sizes={sizes} />
      <img
        src={img.src}
        alt={alt ?? img.alt}
        width={img.width}
        height={img.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={imgClassName}
      />
    </picture>
  );
}
