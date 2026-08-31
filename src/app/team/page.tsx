import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import { Picture } from '@/components/Picture';
import { FooterFull } from '@/components/FooterFull';
import { PageHero } from '@/components/PageHero';
import { ClipReveal, FadeUp } from '@/components/motion';
import { SITE_URL, imageMap, site, ogFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Our Team',
  description:
    'Meet the founders and spa professionals at Emerald Spa & Wellness Centre in Windhoek North, Namibia.',
  alternates: { canonical: '/team' },
  ...ogFor('/team'),
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
    // No portrait yet: a branded emerald tile with the display initial and
    // the gem mark, so a missing photo still reads as a designed card
    // (client directive: OJ's image is unavailable, present him with copy).
    const initials = member.name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('');
    return (
      <div
        className="relative flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-emerald-800 to-emerald-900 text-ground"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/media/marble-emerald-xl.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/symbol-mark.svg"
          alt=""
          width={40}
          height={29}
          className="relative h-10 w-auto opacity-80 drop-shadow-[0_0_12px_rgba(141,208,179,0.45)]"
        />
        <span className="display relative text-5xl leading-none text-ground/95">{initials}</span>
      </div>
    );
  }
  return (
    <Picture
      slug={slug}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 260px"
      imgClassName={className}
      alt={`${member.name}, ${member.role ?? 'spa professional'} at ${site.legalName}`}
    />
  );
}

export default function TeamPage() {
  const founders = site.team.filter((m) => m.founder);
  const team = site.team.filter((m) => !m.founder);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: `${SITE_URL}/team`,
    numberOfItems: site.team.length,
    itemListElement: site.team.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Person',
        name: m.name,
        ...(m.role ? { jobTitle: m.role } : {}),
        worksFor: { '@type': 'Organization', name: site.legalName },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main id="main">
        <PageHero
          slug="garden-lounge-guests"
          eyebrow="The Team"
          title="The hands behind the calm."
          lede="Guests name our therapists in their reviews more than anything else. Ratings below are each professional's own verified average."
        />

        {/* The founders: both profiles side by side, one card each. */}
        <section className="shell border-b border-ink/10 py-16 md:py-24">
          <p className="eyebrow text-emerald-600">The founders</p>
          <h2 className="display mt-4 max-w-2xl text-3xl text-balance sm:text-4xl">
            <ClipReveal>Built in Windhoek, by two founders.</ClipReveal>
          </h2>
          <p className="mt-4 max-w-2xl text-ink/70 text-pretty">
            Emerald Spa &amp; Wellness Centre is led by its co-founders side by
            side: one runs the spa, one runs the business, and both answer for
            the same standard.
          </p>

          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:gap-12">
            {founders.map((m, i) => (
              <FadeUp key={m.slug} delay={i * 0.08} as="article">
                {/* Portrait frame kept deliberately small so both cards sit
                    level side by side on every screen from tablet up. */}
                <div className="mx-auto aspect-[4/5] w-full max-w-[260px] overflow-hidden rounded-2xl border border-ink/10 bg-emerald-900/8 shadow-[0_20px_50px_-30px_rgba(7,33,26,0.5)]">
                  <Avatar member={m} />
                </div>
                <div className="mx-auto mt-6 max-w-[340px] text-center">
                  <h3 className="display text-2xl text-ink sm:text-3xl">{m.name}</h3>
                  {m.role ? (
                    <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-emerald-700">
                      {m.role}
                    </p>
                  ) : null}
                  {m.bio ? (
                    <p className="mt-4 text-sm leading-relaxed text-ink/70 text-pretty">
                      {m.bio}
                    </p>
                  ) : null}
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* The team: four portraits side by side, smaller frames, professional
            attributes under each. */}
        <section className="surface-marble-pale border-t border-ink/10 py-16 md:py-20">
          <div className="shell">
            <p className="eyebrow text-emerald-600">The team</p>
            <h2 className="display mt-4 max-w-2xl text-3xl text-balance sm:text-4xl">
              <ClipReveal>The people you will actually meet.</ClipReveal>
            </h2>
            <p className="mt-4 max-w-2xl text-ink/70 text-pretty">
              Managers and therapists, side by side. Every portrait is kept
              small enough that the whole team reads in one line on a laptop.
            </p>
          </div>

          <ul className="shell mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <FadeUp key={m.slug} delay={(i % 4) * 0.07} as="li">
                <article>
                  <div className="mx-auto aspect-[4/5] w-full max-w-[240px] overflow-hidden rounded-2xl bg-emerald-900/8 shadow-[0_16px_40px_-28px_rgba(7,33,26,0.45)]">
                    <Avatar member={m} />
                  </div>
                  <div className="mt-5 text-center">
                    <h2 className="display text-xl text-ink">{m.name}</h2>
                    {m.role ? (
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                        {m.role}
                      </p>
                    ) : null}
                    {m.rating ? (
                      <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-ink/70">
                        <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" aria-hidden="true" />
                        <span className="tabular-nums">{m.rating}</span>
                        <span className="text-ink/65">average rating</span>
                      </p>
                    ) : null}
                    {m.bio ? (
                      <p className="mt-3 text-sm leading-relaxed text-ink/70 text-pretty">
                        {m.bio}
                      </p>
                    ) : null}
                  </div>
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
