import type { Metadata, Viewport } from 'next';
import { Poppins, Radley } from 'next/font/google';
import type { ReactNode } from 'react';
import { AnnouncementCard } from '@/components/AnnouncementCard';
import { FloatingActions } from '@/components/FloatingActions';
import { StickyNav } from '@/components/StickyNav';
import { VoucherPopup } from '@/components/VoucherPopup';
import announcementsData from '@/data/cms/announcements.json';
import { GOOGLE_MAPS_URL, SITE_URL, site } from '@/lib/site';
import { getPosts } from '@/lib/wordpress';
import './globals.css';

/**
 * Type pairing: Radley (serif display) carries the gemstone warmth in a
 * single quiet weight; Poppins handles all interface text with a geometric,
 * friendly voice and precise letterforms.
 */
const display = Radley({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const sans = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const viewport: Viewport = {
  themeColor: '#063F31',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Emerald Spa & Wellness Centre | Spa in Windhoek, Namibia',
    template: '%s | Emerald Spa & Wellness Centre',
  },
  description:
    `Relax the body, Renew the mind, Rejuvenate the soul at Emerald Spa & Wellness Centre in Windhoek North. Massages, facials, hydrotherapy and nails. Rated ${site.rating} from ${site.reviewCount} verified reviews.`,
  keywords: [
    'spa Windhoek',
    'massage Windhoek',
    'facials Windhoek',
    'hydrotherapy Namibia',
    'wellness centre Windhoek North',
    'Emerald Spa Namibia',
  ],
  authors: [{ name: site.legalName }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: site.legalName,
    title: 'Emerald Spa & Wellness Centre | Spa in Windhoek North',
    description: `A refined retreat in Windhoek North. Massages, facials, hydrotherapy and nails, rated ${site.rating} from ${site.reviewCount} verified reviews.`,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, type: 'image/jpeg', alt: `${site.legalName}, Windhoek` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emerald Spa & Wellness Centre | Windhoek',
    description: `A refined retreat in Windhoek North. Rated ${site.rating} from ${site.reviewCount} verified reviews.`,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icons/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon.ico' }],
    apple: [{ url: '/icons/favicon-180.png', sizes: '180x180' }],
  },
};

/** LocalBusiness schema. Every value is verified from the live Fresha record. */
function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DaySpa',
    '@id': `${SITE_URL}/#business`,
    name: site.legalName,
    description: site.description,
    url: SITE_URL,
    telephone: site.phoneE164,
    image: `${SITE_URL}/media/reception-1600.jpg`,
    logo: `${SITE_URL}/brand/lockup-stacked-light.png`,
    priceRange: `NAD ${site.priceRange.min} - NAD ${site.priceRange.max}`,
    currenciesAccepted: 'NAD',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: 'NA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.address.lat,
      longitude: site.address.lng,
    },
    openingHours: site.openingHoursSpec,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: site.rating,
      reviewCount: site.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    sameAs: [site.social.instagram, site.social.facebook, GOOGLE_MAPS_URL],
    hasMap: GOOGLE_MAPS_URL,
    amenityFeature: site.features.map((f) => ({
      '@type': 'LocationFeatureSpecification',
      name: f,
      value: true,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * The one active announcement, if any, resolved on the server so the client
 * bundle only ever receives the notice that should show. Status and dates
 * are maintained in the Content Manager; an expired or archived notice is
 * simply absent here.
 */
function activeAnnouncement(): {
  id: string;
  title: string;
  body: string;
  linkText?: string;
  linkUrl?: string;
} | null {
  const today = new Date().toISOString().slice(0, 10);
  const found = (announcementsData as Array<Record<string, unknown>>).find((a) => {
    if (a.status !== 'active') return false;
    const from = typeof a.startsOn === 'string' && a.startsOn ? a.startsOn : null;
    const until = typeof a.endsOn === 'string' && a.endsOn ? a.endsOn : null;
    if (from && from > today) return false;
    if (until && until < today) return false;
    return typeof a.title === 'string' && typeof a.body === 'string';
  });
  if (!found) return null;
  return {
    id: String(found.id ?? found.title ?? 'notice'),
    title: String(found.title),
    body: String(found.body),
    linkText: typeof found.linkText === 'string' && found.linkText ? found.linkText : undefined,
    linkUrl: typeof found.linkUrl === 'string' && found.linkUrl ? found.linkUrl : undefined,
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  /* The header's Journal dropdown and search are fed by WordPress when it has
     content, and render their empty states when it does not. The fetch is
     server-side, revalidated, and never allowed to take the site down. */
  const journalPosts = (await getPosts(3).catch(() => [])).map((p) => ({
    title: p.title,
    slug: p.slug,
  }));

  return (
    <html lang="en-NA" className={`${display.variable} ${sans.variable}`}>
      <head>
        <link rel="preconnect" href="https://d8j0ntlcm91z4.cloudfront.net" />
        <StructuredData />
      </head>
      <body>
        <noscript>
          <p style={{ fontFamily: 'Georgia, serif', padding: '1rem', textAlign: 'center' }}>
            {site.legalName}, {site.address.street}, Windhoek North. Call{' '}
            <a href={`tel:${site.phoneE164}`}>{site.phone}</a> or book online once JavaScript loads.
          </p>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-emerald-600 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <StickyNav journalPosts={journalPosts} />
        <FloatingActions />
        <VoucherPopup />
        <AnnouncementCard notice={activeAnnouncement()} />
      </body>
    </html>
  );
}
