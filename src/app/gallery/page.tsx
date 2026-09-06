import type { Metadata } from 'next';
import { Picture } from '@/components/Picture';
import { FooterFull } from '@/components/FooterFull';
import { GalleryGrid, type GallerySectionData } from '@/components/GalleryGrid';
import { PageHero } from '@/components/PageHero';
import { ClipReveal, FadeUp } from '@/components/motion';
import { GALLERY_SECTIONS, POSTER_SLUGS, getImage, site, SITE_URL, ogFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Photographs of Emerald Spa & Wellness Centre in Windhoek North: treatment rooms, the reception, the hydrotherapy suite, the garden and finished treatments. View any photo full size.',
  alternates: { canonical: '/gallery' },
  ...ogFor('/gallery'),
};

/**
 * Gallery, reshaped (Round 8): every section opens with a feature photograph
 * beside its own text, the rest of the photographs run in a numbered grid,
 * and any photograph opens full size in the lightbox. Frames still keep their
 * natural proportions, so nothing is cropped to fit a tile.
 */
export default function GalleryPage() {
  const total = GALLERY_SECTIONS.reduce((n, s) => n + s.slugs.length, 0);

  const sections: GallerySectionData[] = GALLERY_SECTIONS.map((s) => ({
    id: s.id,
    eyebrow: s.eyebrow,
    title: s.title,
    lead: s.lead,
    slugs: [...s.slugs],
  }));

  return (
    <>
      <main id="main">
        <PageHero
          slug="reception-lounge"
          eyebrow="Gallery"
          title="Inside the retreat."
          lede={`${total} photographs of the actual rooms, treatments and garden, taken at ${site.address.street}, ${site.address.suburb}. Tap any photograph to see it full size.`}
        />
        <div className="relative z-10 mx-auto -mt-8 max-w-3xl px-5 sm:px-8 md:px-12">
          <nav
            aria-label="Gallery sections"
            className="mt-8 rounded-full border border-ink/10 bg-ground/90 p-2 shadow-sm backdrop-blur"
          >
            <ul className="flex flex-wrap gap-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ink/15 px-4 text-xs font-semibold uppercase tracking-widest text-ink/75 transition-colors hover:border-emerald-600 hover:text-emerald-700"
                  >
                    {section.eyebrow}
                    <span className="tabular-nums text-ink/60">{section.slugs.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <GalleryGrid sections={sections} />

        <section className="shell border-t border-ink/10 py-16 md:py-20">
          <p className="eyebrow text-emerald-600">Announcements</p>
          <h2 className="display mt-4 text-3xl sm:text-4xl">
            <ClipReveal>Announcements and offers.</ClipReveal>
          </h2>
          <p className="mt-4 max-w-2xl text-ink/70 text-pretty">
            Current promotions and notices published by the spa.
          </p>

          <ul className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {POSTER_SLUGS.map((slug, i) => (
              <FadeUp key={slug} delay={(i % 4) * 0.07} as="li">
                <div className="overflow-hidden rounded-2xl border border-ink/10 bg-emerald-900/5">
                  {/* Round 11: uniform 4:5 poster frame, the designed
                      proportion of the artwork; the one taller poster is
                      cropped to match instead of towering over the row. */}
                  <Picture
                    slug={slug}
                    alt={getImage(slug).alt}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    imgClassName="aspect-[4/5] w-full object-cover"
                  />
                </div>
              </FadeUp>
            ))}
          </ul>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ImageGallery',
              name: `${site.legalName} gallery`,
              url: `${SITE_URL}/gallery`,
              image: GALLERY_SECTIONS.flatMap((section) =>
                section.slugs
                  .map((slug) => getImage(slug))
                  .filter((img): img is NonNullable<ReturnType<typeof getImage>> => Boolean(img))
                  .map((img) => ({
                    '@type': 'ImageObject',
                    contentUrl: img.src.startsWith('http') ? img.src : `${SITE_URL}${img.src}`,
                    name: img.alt,
                    description: img.alt,
                  })),
              ),
            }),
          }}
        />
      </main>
      <FooterFull />
    </>
  );
}
