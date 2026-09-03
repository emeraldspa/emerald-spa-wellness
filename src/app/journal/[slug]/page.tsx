import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/PageHero';
import { FooterFull } from '@/components/FooterFull';
import { getPost } from '@/lib/wordpress';
import { SITE_URL, WHATSAPP_PATH, ogFor } from '@/lib/site';

/**
 * Articles are resolved from WordPress over the network, so the page must
 * render dynamically: streaming a static shell first would send HTTP 200
 * before notFound() can act on an unknown slug (a soft 404 that search
 * engines index). The WordPress fetch below keeps its own 15-minute cache.
 */
export const dynamic = 'force-dynamic';

type Params = { params: { slug: string } };

/** Meta descriptions render at ~155-160 characters before truncation. */
function clampDescription(text: string): string {
  if (text.length <= 158) return text;
  const cut = text.slice(0, 158);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 120 ? lastSpace : 158).trimEnd()}...`;
}

/**
 * The full headline stays on the page; the <title> gets the leading clause
 * when the headline is too long for a search result line.
 */
function seoTitle(title: string): string {
  if (title.length <= 62) return title;
  const firstClause = title.split(/[:?]/)[0].trim();
  return firstClause.length >= 24 && firstClause.length <= 62
    ? firstClause
    : `${title.slice(0, 59).trimEnd()}...`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getPost(params.slug);
  // Throwing here, before the shell streams, is what makes an unknown slug
  // answer with a real HTTP 404 instead of a soft 200.
  if (!post) notFound();
  return {
    title: seoTitle(post.title),
    description: clampDescription(post.excerpt || post.title),
    alternates: { canonical: `/journal/${post.slug}` },
    ...ogFor(`/journal/${post.slug}`, {
      type: 'article',
      publishedTime: post.date,
      image: post.image ?? undefined,
      imageAlt: post.imageAlt || post.title,
    }),
  };
}

export default async function JournalPostPage({ params }: Params) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_URL}/journal/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: post.date,
    dateModified: post.date,
    image: post.image
      ? [post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`]
      : [`${SITE_URL}/og-image.jpg`],
    author: {
      '@type': 'Organization',
      name: 'Emerald Spa & Wellness Centre',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Emerald Spa & Wellness Centre',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/journal/${post.slug}`,
    },
  };

  return (
    <>
      <main id="main">
        <PageHero
          slug="serenity-garden"
          eyebrow="Journal"
          title={post.title}
          lede={post.excerpt || undefined}
        />

        <article className="shell py-16 md:py-24">
          <Link
            href="/journal"
            className="inline-flex min-h-[44px] items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink/70 transition-colors hover:text-emerald-600"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All stories
          </Link>

          <p className="mt-8 text-sm text-ink/70">
            {new Date(post.date).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          {post.image ? (
            <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10">
              {/* Round 11 (client): the article photograph sits in a 4:3
                  frame. Several story photos are nine-by-sixteen portrait
                  shots that otherwise render taller than the viewport. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                srcSet={post.imageSrcset || undefined}
                sizes="(min-width: 768px) 672px, 92vw"
                alt={post.imageAlt || post.title}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          ) : null}

          <div
            className="prose-serif mt-10 max-w-2xl text-[17px] leading-[1.8] text-ink/85 text-pretty"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-8">
            <Link
              href="/journal"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-emerald-600 hover:text-emerald-600"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to the journal
            </Link>
            <Link
              href={WHATSAPP_PATH}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700"
            >
              Book on WhatsApp
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </article>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      </main>
      <FooterFull />
    </>
  );
}
