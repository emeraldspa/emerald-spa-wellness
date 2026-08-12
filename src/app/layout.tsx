import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { SITE_URL, site } from '@/lib/site';
import './globals.css';

/**
 * Type pairing follows the COLLINS framework: a serif display voice against a
 * neutral grotesk. Fraunces carries the gemstone warmth; Inter is the spec's
 * required UI face and handles all interface text.
 */
const display = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  axes: ['SOFT', 'WONK', 'opsz'],
});

const sans = Inter({
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
    default: 'Emerald Spa & Wellness Centre | Spa in Windhoek West, Namibia',
    template: '%s | Emerald Spa & Wellness Centre',
  },
  description:
    'Massages, facials, hydrotherapy and nails at Emerald Spa & Wellness Centre, Blackett Street, Windhoek West. Rated 4.8 from 228 verified guest reviews. Book online.',
  keywords: [
    'spa Windhoek',
    'massage Windhoek',
    'facials Windhoek',
    'hydrotherapy Namibia',
    'wellness centre Windhoek West',
    'Emerald Spa Namibia',
  ],
  authors: [{ name: site.legalName }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_NA',
    url: SITE_URL,
    siteName: site.legalName,
    title: 'Emerald Spa & Wellness Centre | Spa in Windhoek West',
    description:
      'A refined retreat in Windhoek West. Massages, facials, hydrotherapy and nails, rated 4.8 from 228 verified reviews.',
    images: [{ url: '/og.svg', width: 1200, height: 630, alt: `${site.legalName}, Windhoek` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emerald Spa & Wellness Centre | Windhoek',
    description: 'A refined retreat in Windhoek West. Rated 4.8 from 228 verified reviews.',
    images: ['/og.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/emerald-logo-official.png' }],
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
    logo: `${SITE_URL}/emerald-spa-stacked-color.svg`,
    priceRange: `NAD ${site.priceRange.min} - NAD ${site.priceRange.max}`,
    currenciesAccepted: 'NAD',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${site.address.street}, ${site.address.suite}`,
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
    sameAs: [site.social.instagram, site.social.facebook, site.bookingUrl],
    hasMap: site.address.mapsUrl,
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-NA" className={`${display.variable} ${sans.variable}`}>
      <head>
        <link rel="preconnect" href="https://d8j0ntlcm91z4.cloudfront.net" />
        <StructuredData />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-emerald-600 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
