import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/PageHero';
import { FooterFull } from '@/components/FooterFull';
import { getPost } from '@/lib/wordpress';
import { SITE_URL, WHATSAPP_PATH, ogFor } from '@/lib/site';

export const revalidate = 900;

type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Journal' };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: ogFor(`/journal/${post.slug}`),
  };
}

export default async function JournalPostPage({ params }: Params) {
  const post = await getPost(params.slug);
  if (!post) notFound();

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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.imageAlt || post.title}
                className="w-full object-cover"
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
      </main>
      <FooterFull />
    </>
  );
}
