import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Feather } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { FooterFull } from '@/components/FooterFull';
import { FadeUp } from '@/components/motion';
import { Picture } from '@/components/Picture';
import { getPosts, hasJournal } from '@/lib/wordpress';
import { imageMap, SITE_URL, WHATSAPP_PATH, ogFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'Stories, notes and announcements from Emerald Spa and Wellness Centre in Windhoek North.',
  alternates: { canonical: '/journal' },
  ...ogFor('/journal'),
};

export const revalidate = 900;

/** Branded placeholder when a post has no featured image. */
function Placeholder({ title }: { title: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex aspect-[4/3] w-full items-end bg-gradient-to-br from-emerald-700 via-emerald-900 to-[#0A1310] p-5"
    >
      <p className="display text-xl leading-none text-emerald-200/90">{title}</p>
    </div>
  );
}

/**
 * Card art. House stories render through the responsive Picture pipeline
 * (avif + webp variants that already exist); WordPress posts carry a srcset
 * built from the renditions the back office generated on upload. Either way
 * the browser only downloads what the card size needs, never the 1600px
 * original a 424px card would otherwise pay for.
 */
function CardImage({ post }: { post: { image: string | null; imageSrcset: string; imageAlt: string; title: string } }) {
  const houseSlug = post.image?.startsWith('/media/')
    ? post.image.match(/^\/media\/([a-z0-9-]+)-\d+\.(?:jpg|webp|avif)$/i)?.[1]
    : null;
  const pictureImg = houseSlug ? imageMap[houseSlug] : undefined;

  if (pictureImg) {
    return (
      <Picture
        slug={houseSlug as never}
        sizes="(min-width: 1024px) 424px, (min-width: 640px) 45vw, 92vw"
        imgClassName="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.03]"
      />
    );
  }

  if (post.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={post.image}
        srcSet={post.imageSrcset || undefined}
        sizes="(min-width: 1024px) 424px, (min-width: 640px) 45vw, 92vw"
        alt={post.imageAlt || post.title}
        loading="lazy"
        decoding="async"
        className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.03]"
      />
    );
  }

  return <Placeholder title={post.title} />;
}

export default async function JournalPage() {
  const [posts, journalReady] = await Promise.all([getPosts(12), hasJournal()]);

  return (
    <>
      <main id="main">
        <PageHero
          slug="candlescape"
          eyebrow="Journal"
          title="Stories from the spa."
          lede="Notes on treatments, the venue, the team and the rituals that make a visit to Windhoek North worth planning around."
        />

        <section className="shell border-t border-ink/10 py-16 md:py-24">
          {!journalReady || posts.length === 0 ? (
            <div className="mx-auto max-w-xl py-16 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Feather className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="display mt-6 text-3xl text-balance">Stories are coming.</h2>
              <p className="mt-4 text-ink/70 text-pretty">
                The team is writing the first entries now. While they do, the services page has
                every treatment, and the team would be glad to talk on WhatsApp.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/services"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700"
                >
                  Explore treatments
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href={WHATSAPP_PATH}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-emerald-600 hover:text-emerald-600"
                >
                  Message us
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
              {posts.map((post, i) => (
                <FadeUp key={post.id} delay={(i % 3) * 0.06} >
                  <Link href={`/journal/${post.slug}`} className="group block">
                    <article className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-[0_20px_50px_-24px_rgba(7,33,26,0.35)]">
                      <div className="overflow-hidden">
                        <CardImage post={post} />
                      </div>
                      <div className="p-6">
                        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                          {new Date(post.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                        <h2 className="display mt-3 text-2xl text-balance text-ink">{post.title}</h2>
                        {post.excerpt ? (
                          <p className="mt-3 text-sm leading-relaxed text-ink/65 text-pretty">
                            {post.excerpt}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  </Link>
                </FadeUp>
              ))}
            </div>
          )}
        </section>
      </main>
      <FooterFull />
    </>
  );
}
