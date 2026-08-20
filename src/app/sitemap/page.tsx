import type { Metadata } from 'next';
import Link from 'next/link';
import { FooterMinimal } from '@/components/FooterMinimal';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHero } from '@/components/PageHero';
import { site , SITE_URL, ogFor } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'Every page on the Emerald Spa & Wellness Centre website.',
  alternates: { canonical: '/sitemap' },
  openGraph: ogFor('/sitemap'),
};

const GROUPS = [
  {
    title: 'Main',
    links: [
      { href: '/', label: 'Home' },
      { href: '/services', label: 'Services and Prices' },
      { href: '/gallery', label: 'Gallery' },
      { href: '/team', label: 'Our Team' },
      { href: '/visit', label: 'Visit and Contact' },
      { href: '/book', label: 'Book Now' },
      { href: '/whatsapp', label: 'Book on WhatsApp' },
      { href: '/vouchers', label: 'Gift Vouchers' },
    ],
  },
  {
    title: 'Reference',
    links: [
      { href: '/brand', label: 'Brand' },
      { href: '/privacy', label: 'Privacy Notice' },
      { href: '/terms', label: 'Terms of Use' },
      { href: '/sitemap', label: 'Sitemap' },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
                <PageHero
          slug="serenity-garden"
          eyebrow="Site"
          title="Every page."
        />

        <section className="shell grid gap-12 py-16 md:grid-cols-3 md:py-20">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <h2 className="eyebrow text-emerald-600">{g.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-ink/80 hover:text-emerald-600">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="eyebrow text-emerald-600">Treatment Categories</h2>
            <ul className="mt-4 space-y-2.5">
              {site.categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/services#${c.slug}`}
                    className="text-ink/80 hover:text-emerald-600"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <FooterMinimal />
    </>
  );
}
