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

/**
 * Canonical origin.
 *
 * This is the address the business owns, so it is what canonical tags, the
 * sitemap, robots.txt and Open Graph URLs must advertise. Search engines are
 * told about one home for this content, not the deployment host it happens to
 * run on today. `NEXT_PUBLIC_SITE_URL` still wins when set, which keeps preview
 * deployments self-consistent.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
  'https://emeraldspacc.com';

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
 * Direct booking URL, used only when the embed fails to render.
 *
 * The embed keeps the visitor on this domain and never names the provider,
 * which is the preferred path. But a booking page that cannot take a booking
 * is worse than one that hands the visitor off, so this is offered inside the
 * failure state alongside phone and WhatsApp. It opens in a new tab, so the
 * visitor keeps their place on the Emerald site.
 */
export const BOOKING_FALLBACK_URL =
  'https://www.fresha.com/a/emerald-spa-wellness-centre-windhoek-blackett-street-awio4ik8';

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
 * The client's own photographs, grouped by what they actually show. Every
 * slug here was named after looking at the frame, not after its filename.
 * Grouping keeps the gallery readable at 40 images instead of one long wall.
 */
export const GALLERY_SECTIONS = [
  {
    id: 'rooms',
    eyebrow: 'The rooms',
    title: 'Where the work happens.',
    lead: 'Reception, the treatment rooms, and the quiet corners in between.',
    slugs: [
      'reception-lounge',
      'treatment-room',
      'reception',
      'towel-shelf',
      'retail-display',
      'spa-retreat',
    ],
  },
  {
    id: 'hydrotherapy',
    eyebrow: 'Hydrotherapy',
    title: 'Warm water, taken slowly.',
    lead: 'The hydrotherapy suite, prepared and in use.',
    slugs: ['hydrotherapy-suite', 'hydrotherapy-tub-set', 'hydrotherapy-soak', 'hydrotherapy-guest'],
  },
  {
    id: 'treatments',
    eyebrow: 'Treatments',
    title: 'Results on real guests.',
    lead: 'Lashes, brows, facials and nails, photographed at the end of the appointment.',
    slugs: [
      'lash-extensions',
      'lash-detail',
      'brow-result',
      'brow-detail',
      'facial-treatment',
      'treatment-bed-guest',
      'treatment-mirror',
      'nail-art',
    ],
  },
  {
    id: 'garden',
    eyebrow: 'The garden',
    title: 'Outside, and still inside.',
    lead: 'The garden, the pond and the shaded seating guests use between treatments.',
    slugs: [
      'garden-lounge-guests',
      'hanging-chair',
      'garden-pond',
      'garden-walk',
      'garden-planting',
      'garden-signage',
      'robe-garden-seat',
      'robe-garden-stand',
      'garden-reading',
      'serenity-garden',
      'green-escape',
      'candlescape',
    ],
  },
  {
    id: 'refreshments',
    eyebrow: 'Refreshments',
    title: 'Something cold, on arrival.',
    lead: 'Welcome drinks and refreshments served during a visit.',
    slugs: ['welcome-drink', 'wine-pair', 'wine-service', 'refreshments'],
  },
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

/**
 * A wider, mixed set for the home page carousel. Drawn from the client's own
 * photographs so the strip shows rooms, treatments, garden and refreshments
 * rather than repeating the six interiors the site launched with.
 */
export const HOME_CAROUSEL_SLUGS = [
  'reception-lounge',
  'hydrotherapy-tub-set',
  'lash-extensions',
  'hanging-chair',
  'nail-art',
  'treatment-room',
  'garden-pond',
  'welcome-drink',
  'facial-treatment',
  'garden-lounge-guests',
  'towel-shelf',
  'green-escape',
] as const;

/**
 * Published mailboxes. Confirmed live by the client on 17 August.
 * General enquiries, group and corporate bookings, and complaints are kept
 * separate so messages reach the right person without triage.
 */
export const EMAILS = {
  info: 'info@emeraldspacc.com',
  bookings: 'bookings@emeraldspacc.com',
  complaints: 'complaints@emeraldspacc.com',
} as const;

export const VOUCHER_PATH = '/vouchers';

/**
 * Voucher denominations. These are entry points for the enquiry, not a
 * checkout: nothing is charged here. Staff confirm the amount, then issue the
 * voucher number and expiry by hand, which is how the spa already works.
 */
export const VOUCHER_AMOUNTS = [300, 500, 800, 1200, 1700] as const;

export const VOUCHER_OCCASIONS = [
  'Birthday',
  'Anniversary',
  'Thank you',
  'Just because',
] as const;

export const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/sitemap', label: 'Sitemap' },
] as const;

/** Prefilled WhatsApp enquiry. Kept here so every entry point sends the same text. */
export const WHATSAPP_PATH = '/whatsapp';

export const NAV_LINKS = [
  { href: '/vouchers', label: 'Vouchers' },
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
