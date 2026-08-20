import type { Metadata } from 'next';
import { Picture } from '@/components/Picture';
import { FooterFull } from '@/components/FooterFull';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHero } from '@/components/PageHero';
import { ClipReveal, FadeUp } from '@/components/motion';
import { GALLERY_SECTIONS, POSTER_SLUGS, getImage, imageMap, site , SITE_URL, ogFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Photographs of Emerald Spa & Wellness Centre in Windhoek West: treatment rooms, the reception, the hydrotherapy suite, the garden and finished treatments.',
  alternates: { canonical: '/gallery' },
  openGraph: ogFor('/gallery'),
};

/**
 * Editorial mosaic rather than a uniform card grid.
 *
 * The photographs are honest phone captures at mixed aspect ratios, so the
 * layout varies span by orientation instead of forcing every frame into an
 * identical tile. Portrait shots take narrow columns, landscape shots take
 * wide ones, which keeps the rhythm irregular the way a printed spread is.
 */
/**
 * Irregular editorial rhythm.
 *
 * A rule like "landscape gets 7 columns" produces a grid that is technically
 * varied but visually metronomic, which is what made the earlier version feel
 * machine-placed. This instead walks a fixed rhythm of column spans and
 * heights that never repeats the same pair twice in a row, so the page reads
 * like a laid-out spread. Landscape frames are still given the wider slots,
 * because cropping a landscape photograph into a narrow column destroys it.
 */
const RHYTHM: ReadonlyArray<{ span: string; h: string }> = [
  { span: 'md:col-span-7', h: 'h-[380px] md:h-[560px]' },
  { span: 'md:col-span-5', h: 'h-[380px] md:h-[560px]' },
  { span: 'md:col-span-4', h: 'h-[320px] md:h-[400px]' },
  { span: 'md:col-span-8', h: 'h-[320px] md:h-[400px]' },
  { span: 'md:col-span-6', h: 'h-[360px] md:h-[480px]' },
  { span: 'md:col-span-6', h: 'h-[360px] md:h-[480px]' },
  { span: 'md:col-span-5', h: 'h-[340px] md:h-[440px]' },
  { span: 'md:col-span-7', h: 'h-[340px] md:h-[440px]' },
];

function frameFor(slug: string, index: number) {
  const img = imageMap[slug];
  const landscape = img ? img.width >= img.height : false;
  const cell = RHYTHM[index % RHYTHM.length];
  // Never squeeze a landscape photograph into the narrowest column.
  if (landscape && (cell.span === 'md:col-span-4' || cell.span === 'md:col-span-5')) {
    return { span: 'md:col-span-8', h: cell.h };
  }
  return cell;
}

export default function GalleryPage() {
  const total = GALLERY_SECTIONS.reduce((n, s) => n + s.slugs.length, 0);

  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHero
          slug="reception-lounge"
          eyebrow="Gallery"
          title="Inside the retreat."
          lede={`${total} photographs of the actual rooms, treatments and garden, taken at ${site.address.street}, ${site.address.suburb}. Nothing here is a stock image.`}
        />
        <div className="relative z-10 mx-auto -mt-8 max-w-3xl px-5 sm:px-8 md:px-12">

          <nav aria-label="Gallery sections" className="mt-8 rounded-full border border-ink/10 bg-ground/90 p-2 shadow-sm backdrop-blur">
            <ul className="flex flex-wrap gap-2">
              {GALLERY_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="inline-flex min-h-[44px] items-center rounded-full border border-ink/15 px-4 text-xs font-semibold uppercase tracking-widest text-ink/75 transition-colors hover:border-emerald-600 hover:text-emerald-700"
                  >
                    {section.eyebrow}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {GALLERY_SECTIONS.map((section, si) => (
          <section
            key={section.id}
            id={section.id}
            className={`scroll-mt-24 py-16 md:py-24 ${si % 2 === 1 ? 'surface-marble-pale' : ''} ${si > 0 ? 'border-t border-ink/10' : ''}`}
          >
            <div className="shell">
              <p className="eyebrow text-emerald-600">{section.eyebrow}</p>
              <h2 className="display mt-4 text-3xl sm:text-4xl">{section.title}</h2>
              <p className="mt-4 max-w-2xl text-ink/70 text-pretty">{section.lead}</p>
            </div>

            <ul className="shell mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-12">
              {section.slugs.map((slug, i) => {
                const img = getImage(slug);
                return (
                  <FadeUp
                    key={slug}
                    delay={(i % 3) * 0.07}
                    as="li"
                    className={frameFor(slug, i).span}
                  >
                    <figure className="group">
                      <div
                        className={`overflow-hidden bg-emerald-900/5 ${frameFor(slug, i).h}`}
                      >
                        {/* Caption below carries the description, so alt is empty. */}
                        <Picture
                          slug={slug}
                          alt=""
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 45vw"
                          priority={si === 0 && i < 2}
                          imgClassName="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.03]"
                        />
                      </div>
                      <figcaption className="mt-3 text-sm text-ink/65">{img.alt}</figcaption>
                    </figure>
                  </FadeUp>
                );
              })}
            </ul>
          </section>
        ))}

        <section className="shell border-t border-ink/10 py-16 md:py-20">
          <p className="eyebrow text-emerald-600">Announcements</p>
          <h2 className="display mt-4 text-3xl sm:text-4xl">Announcements and offers.</h2>
          <p className="mt-4 max-w-2xl text-ink/70 text-pretty">
            Current promotions and notices published by the spa.
          </p>

          <ul className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {POSTER_SLUGS.map((slug, i) => (
              <FadeUp key={slug} delay={(i % 4) * 0.07} as="li">
                <div className="overflow-hidden bg-emerald-900/5">
                  <Picture
                    slug={slug}
                    alt={getImage(slug).alt}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    imgClassName="w-full object-cover"
                  />
                </div>
              </FadeUp>
            ))}
          </ul>
        </section>
      </main>
      <FooterFull />
    </>
  );
}
