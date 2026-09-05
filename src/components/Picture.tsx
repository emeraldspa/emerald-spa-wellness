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
 * Plain <picture> with the WebP sources from the registry.
 *
 * Deliberately not next/image: every source is a build-time local file with
 * known intrinsic dimensions, so the runtime optimiser adds cost without
 * adding capability. Width and height are always declared to reserve layout.
 * Every asset on the site is WebP since the media diet round; the <img> src
 * is the same format as the sources, so the fallback never misses.
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
  const webp = img.webp.map((s) => `${s.p} ${s.w}w`).join(', ');

  return (
    <picture className={className}>
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
