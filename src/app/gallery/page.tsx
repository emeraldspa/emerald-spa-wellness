import type { Metadata } from 'next';
import { Picture } from '@/components/Picture';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { ClipReveal, FadeUp } from '@/components/motion';
import { GALLERY_SLUGS, POSTER_SLUGS, getImage, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Photographs of Emerald Spa & Wellness Centre in Windhoek West: treatment rooms, the reception, the hydrotherapy space and the garden.',
  alternates: { canonical: '/gallery' },
};

/**
 * Editorial mosaic rather than a uniform card grid.
 *
 * The source photographs are honest phone captures at mixed aspect ratios,
 * so the layout varies span and scale deliberately to build rhythm instead
 * of flattening everything into identical tiles.
 */
const SPANS: Record<string, string> = {
  reception: 'md:col-span-7',
  'treatment-room': 'md:col-span-5',
  'spa-retreat': 'md:col-span-5',
  candlescape: 'md:col-span-7',
  'serenity-garden': 'md:col-span-12',
  'green-escape': 'md:col-span-12',
};

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="shell border-b border-ink/10 py-16 md:py-24">
          <p className="eyebrow text-emerald-600">Gallery</p>
          <h1 className="display mt-4 max-w-4xl text-4xl text-balance sm:text-5xl md:text-6xl">
            <ClipReveal>Inside the retreat.</ClipReveal>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-ink/70 text-pretty">
            Photographs of the actual rooms, taken at {site.address.street}{' '}
            {site.address.suite}, {site.address.suburb}. Nothing here is a stock image.
          </p>
        </section>

        <section className="shell py-16 md:py-20">
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {GALLERY_SLUGS.map((slug, i) => {
              const img = getImage(slug);
              return (
                <FadeUp
                  key={slug}
                  delay={(i % 3) * 0.07}
                  as="li"
                  className={SPANS[slug] ?? 'md:col-span-6'}
                >
                  <figure className="group">
                    <div className="overflow-hidden bg-emerald-900/5">
                      {/* Caption below carries the description, so alt is empty. */}
                      <Picture
                        slug={slug}
                        alt=""
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={i < 2}
                        imgClassName="w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.03]"
                      />
                    </div>
                    <figcaption className="mt-3 text-sm text-ink/65">{img.alt}</figcaption>
                  </figure>
                </FadeUp>
              );
            })}
          </ul>
        </section>

        <section className="shell border-t border-ink/10 py-16 md:py-20">
          <p className="eyebrow text-emerald-600">From Our Feed</p>
          <h2 className="display mt-4 text-3xl sm:text-4xl">Announcements and offers.</h2>
          <p className="mt-6 max-w-2xl text-ink/70 text-pretty">
            Artwork the spa publishes on its own channels. These are designed
            graphics rather than photographs of the rooms.
          </p>
          <ul className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {POSTER_SLUGS.map((slug, i) => (
              /*
                No caption and no duplicate screen-reader paragraph here. The
                alt text on the image is the single description, which keeps
                it from being announced twice.
              */
              <FadeUp key={slug} delay={(i % 4) * 0.06} as="li">
                <div className="overflow-hidden bg-emerald-900/5">
                  <Picture
                    slug={slug}
                    sizes="(max-width: 640px) 50vw, 25vw"
                    imgClassName="w-full object-cover"
                  />
                </div>
              </FadeUp>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
