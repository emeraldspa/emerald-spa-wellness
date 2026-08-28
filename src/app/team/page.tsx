import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import { Picture } from '@/components/Picture';
import { FooterFull } from '@/components/FooterFull';
import { PageHero } from '@/components/PageHero';
import { ClipReveal, FadeUp } from '@/components/motion';
import { imageMap, site, SITE_URL, ogFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Our Team',
  description:
    'Meet the founders and spa professionals at Emerald Spa & Wellness Centre in Windhoek West, Namibia.',
  alternates: { canonical: '/team' },
  openGraph: ogFor('/team'),
};

function Avatar({
  member,
  className = 'h-full w-full object-cover',
}: {
  member: (typeof site.team)[number];
  className?: string;
}) {
  const slug = member.photo ?? `team-${member.slug}`;
  const hasPhoto = Boolean(imageMap[slug]);
  if (!hasPhoto) {
    return (
      <div
        className="flex h-full w-full items-center justify-center bg-emerald-800 text-4xl text-ground"
        aria-hidden="true"
      >
        {member.name.charAt(0)}
      </div>
    );
  }
  return (
    <Picture
      slug={slug}
      sizes="(max-width: 640px) 100vw, 320px"
      imgClassName={className}
      alt={`${member.name}, ${member.role ?? 'spa professional'} at ${site.legalName}`}
    />
  );
}

export default function TeamPage() {
  const founders = site.team.filter((m) => m.founder);
  const team = site.team.filter((m) => !m.founder);

  return (
    <>
      <main id="main">
        <PageHero
          slug="garden-lounge-guests"
          eyebrow="The Team"
          title="The hands behind the calm."
          lede="Guests name our therapists in their reviews more than anything else. Ratings below are each professional's own verified average."
        />

        {/* The founders. */}
        <section className="shell border-b border-ink/10 py-16 md:py-24">
          <p className="eyebrow text-emerald-600">The founders</p>
          <h2 className="display mt-4 max-w-2xl text-3xl text-balance sm:text-4xl">
            <ClipReveal>Built in Windhoek, by Windhoek.</ClipReveal>
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {founders.map((m, i) => (
              <FadeUp key={m.slug} delay={i * 0.08} as="article">
                <div className="flex flex-col items-start gap-6 sm:flex-row">
                  <div className="aspect-[4/5] w-full max-w-[240px] shrink-0 overflow-hidden rounded-2xl border border-ink/10 bg-emerald-900/8">
                    <Avatar member={m} />
                  </div>
                  <div>
                    <h3 className="display text-3xl text-ink">{m.name}</h3>
                    {m.role ? (
                      <p className="mt-1 text-sm uppercase tracking-wider text-ink/65">{m.role}</p>
                    ) : null}
                    <p className="mt-4 max-w-md leading-relaxed text-ink/70 text-pretty">
                      {m.slug === 'evelyne-mulilo' ? (
                        <>
                          Proudly Namibian, Evelyne leads the spa day to day: the guest
                          experience, the team and the standard every treatment is held to. She
                          is the co-founder and chief executive of the centre.
                        </>
                      ) : (
                        <>
                          OJ founded Emerald Spa & Wellness Centre with a simple idea: that
                          Windhoek deserves a retreat where rest is taken seriously. He still
                          meets guests at the door whenever he is on the floor.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        <section className="surface-marble-pale border-t border-ink/10 py-16 md:py-20">
          <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => (
              <FadeUp key={m.slug} delay={(i % 3) * 0.07} as="li">
                <article>
                  <div className="aspect-square w-full overflow-hidden rounded-full bg-emerald-900/8">
                    <Avatar member={m} />
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
            ))}
          </ul>
        </section>
      </main>
      <FooterFull />
    </>
  );
}
