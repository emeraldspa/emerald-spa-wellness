import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import { Picture } from '@/components/Picture';
import { FooterFull } from '@/components/FooterFull';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHero } from '@/components/PageHero';
import { ClipReveal, FadeUp } from '@/components/motion';
import { imageMap, site , SITE_URL, ogFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Our Team',
  description:
    'Meet the therapists and spa professionals at Emerald Spa & Wellness Centre in Windhoek West, Namibia.',
  alternates: { canonical: '/team' },
  openGraph: ogFor('/team'),
};

export default function TeamPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHero
          slug="garden-lounge-guests"
          eyebrow="The Team"
          title="The hands behind the calm."
          lede="Guests name our therapists in their reviews more than anything else. Ratings below are each professional's own verified average."
        />

        <section className="surface-marble-pale border-t border-ink/10 py-16 md:py-20">
          <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {site.team.map((m, i) => {
              const slug = `team-${m.slug}`;
              const hasPhoto = Boolean(imageMap[slug]);
              return (
                <FadeUp key={m.slug} delay={(i % 3) * 0.07} as="li">
                  <article>
                    <div className="aspect-square w-full overflow-hidden rounded-full bg-emerald-900/8">
                      {hasPhoto ? (
                        <Picture
                          slug={slug}
                          sizes="(max-width: 640px) 100vw, 320px"
                          imgClassName="h-full w-full object-cover"
                          alt={`${m.name}, ${m.role ?? 'spa professional'} at ${site.legalName}`}
                        />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center bg-emerald-800 text-4xl text-ground"
                          aria-hidden="true"
                        >
                          {m.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h2 className="display mt-6 text-2xl">{m.name}</h2>
                    {m.role ? (
                      <p className="mt-1 text-sm uppercase tracking-wider text-ink/65">{m.role}</p>
                    ) : null}
                    {m.rating ? (
                      <p className="mt-3 flex items-center gap-1.5 text-sm text-ink/70">
                        <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" aria-hidden="true" />
                        <span className="tabular-nums">{m.rating}</span>
                        <span className="text-ink/65">average rating</span>
                      </p>
                    ) : null}
                  </article>
                </FadeUp>
              );
            })}
          </ul>
        </section>
      </main>
      <FooterFull />
    </>
  );
}
