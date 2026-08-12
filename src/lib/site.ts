import business from '@/data/business.json';
import images from '@/data/images.json';

export type ServiceVariant = {
  name: string;
  duration: string | null;
  price: string | null;
};

export type Service = {
  name: string;
  duration: string | null;
  price: string | null;
  priceValue: number | null;
  description: string | null;
  variants: ServiceVariant[];
};

export type ServiceCategory = {
  id: string;
  slug: string;
  name: string;
  items: Service[];
};

export type Review = {
  id: string;
  rating: number;
  text: string;
  author: string;
  initials: string;
  date: string;
  iso: string;
};

export type TeamMember = {
  name: string;
  role: string | null;
  rating: number | null;
  slug: string;
};

export type ImageAsset = {
  alt: string;
  width: number;
  height: number;
  src: string;
  webp: { w: number; p: string }[];
  avif: { w: number; p: string }[];
};

export const site = business as typeof business & {
  categories: ServiceCategory[];
  reviews: Review[];
  team: TeamMember[];
};

export const imageMap = images as Record<string, ImageAsset>;

export function getImage(slug: string): ImageAsset {
  const img = imageMap[slug];
  if (!img) {
    throw new Error(`Unknown image slug: ${slug}`);
  }
  return img;
}

/** Canonical origin. Overridden at build time on Vercel. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
  'https://emerald-spa-wellness.vercel.app';

/** Bare digits, the form wa.me expects. */
export const WHATSAPP_NUMBER = site.phoneE164.replace('+', '');
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

/**
 * Booking.
 *
 * The visitor-facing wording never names the booking platform. Emerald takes
 * the booking; the platform is an implementation detail the guest does not
 * need to read. Use these constants rather than writing CTA copy inline, so
 * the rule cannot drift as pages are edited.
 */
export const BOOKING_CTA = 'Book Now';
export const BOOKING_CTA_LONG = 'Book Your Visit';
export const BOOKING_PATH = '/book';

/**
 * Same-origin path the booking iframe loads. Served by the proxy route at
 * `src/app/api/booking/[...path]/route.ts`, which makes the provider's app
 * same-origin so the browser permits framing it.
 */
export const BOOKING_EMBED_PATH =
  '/api/booking/a/emerald-spa-wellness-centre-windhoek-blackett-street-awio4ik8/booking?allOffer=true';

/**
 * Google Business Profile.
 *
 * The Place ID was not supplied, so it was resolved rather than guessed.
 * Searching the verified street address on Google Maps returns a listing whose
 * feature id is `0x1c0b1bd880e03f33:0x62571815f1656858`. The place id below was
 * then checked by loading `maps/place/?q=place_id:...`, which resolves to
 * "Emerald Spa & Wellness Centre", 7 Blackett Street, with the same phone
 * number as the venue record. The write-review URL was loaded too and prompts
 * a Google sign-in for that listing, which is the expected behaviour.
 */
export const GOOGLE_PLACE_ID = 'ChIJMz_giNgbCxwRWGhl8RUYV2I';

/**
 * Numeric customer id for the same listing, taken from the second half of the
 * feature id `0x1c0b1bd880e03f33:0x62571815f1656858`. The short Maps link the
 * client supplied redirects to a URL carrying that exact feature id, which is
 * independent confirmation this is the right listing.
 */
export const GOOGLE_CID = '7086159021214099544';

export const GOOGLE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;
export const GOOGLE_MAPS_URL = `https://www.google.com/maps/place/?q=place_id:${GOOGLE_PLACE_ID}`;
export const GOOGLE_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  'Emerald Spa & Wellness Centre, 7 Blackett Street, Windhoek',
)}&destination_place_id=${GOOGLE_PLACE_ID}`;

/**
 * The `cid` embed form was compared against `q=place_id`, a plain lat/lng, and
 * a text query. Only this one renders the business as a named pin with its own
 * info card and a directions control.
 */
export const GOOGLE_MAPS_EMBED_URL = `https://maps.google.com/maps?cid=${GOOGLE_CID}&output=embed`;


/**
 * Photographs of the actual rooms. Order is deliberate: arrival, treatment,
 * candlelight, garden.
 */
export const GALLERY_SLUGS = [
  'reception',
  'treatment-room',
  'spa-retreat',
  'candlescape',
  'serenity-garden',
  'green-escape',
] as const;

/**
 * The spa's own promotional graphics from its Fresha portfolio. Kept separate
 * from the room photographs because they are designed artwork, not interiors.
 */
export const POSTER_SLUGS = [
  'portfolio-1',
  'portfolio-2',
  'portfolio-3',
  'portfolio-4',
] as const;

export const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/sitemap', label: 'Sitemap' },
] as const;

/** Prefilled WhatsApp enquiry. Kept here so every entry point sends the same text. */
export const WHATSAPP_PATH = '/whatsapp';

export const NAV_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/team', label: 'Team' },
  { href: '/visit', label: 'Visit' },
  { href: '/book', label: 'Book' },
] as const;

export function formatNad(value: number): string {
  return `NAD ${value.toLocaleString('en-NA')}`;
}

/**
 * Number of treatments actually published on this site, counted from the
 * priced menu rather than taken from the venue record's own total.
 *
 * The venue record reports 130 bookable services, but only 90 come back with
 * a name, duration, and price. Printing 130 next to a menu of 90 would claim
 * more than the page can show, so every visible count uses this figure. The
 * "+" prefix in the hero stat carries the difference honestly.
 */
export const LISTED_SERVICE_COUNT = site.categories.reduce(
  (total, category) => total + category.items.length,
  0,
);
