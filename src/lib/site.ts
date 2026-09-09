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
  rating?: number | null;
  slug: string;
  /** Optional image-map slug override; falls back to `team-{slug}`. */
  photo?: string | null;
  founder?: boolean | null;
  /** Professional attributes, shown under the portrait. */
  bio?: string | null;
};

export type ImageAsset = {
  alt: string;
  width: number;
  height: number;
  src: string;
  webp: { w: number; p: string }[];
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

/**
 * Direct booking URL (client, 8 Sep 2025).
 *
 * The embedded calendar is gone: the provider's frame protections made an
 * in-page embed unreliable, and the client asked for a button instead. Every
 * "Book Now" on the site opens this URL in the SAME tab, so the booking page
 * simply takes over from ours, and the guest comes back with the back button.
 * No new tabs, no dead frames. Group bookings never go here: they run on
 * WhatsApp (see WHATSAPP_PATH and the /book-bulk page).
 */
export const BOOKING_URL =
  'https://www.fresha.com/book-now/emerald-spa-wellness-centre-qnp9ba1m/all-offer?share=true&pId=1477270';

/**
 * Book and pay.
 *
 * The client's own flow (30 Aug): the guest chooses, pays straight away, sends
 * the proof of payment, and the spa returns a voucher. Payments are confirmed
 * by hand, so the flow runs through WhatsApp where the guest already talks to
 * the spa, and a short reference code ties the payment to the right booking
 * without either side guessing.
 */
export const PAY_PATH = '/pay';

/**
 * Bank account, published by the client on 7 Sep 2025. Shown as a card on the
 * Pay step and on the voucher page, so a guest can pay without waiting for a
 * reply. Full name as reference is the client's own rule, stated in the same
 * message, so it is printed beside the account details.
 */
export const PAYMENT_ACCOUNT = {
  bank: 'FNB (First National Bank)',
  branch: 'Maerua Mall',
  branchCode: '282273',
  accountName: 'Emerald Spa Gold Business',
  accountNumber: '64287404716',
  accountType: 'Gold Business Account',
  referenceNote: 'Please use your full name as the payment reference.',
  walletNumber: '+264 81 607 7143',
  walletNote:
    'Send the payment to +264 81 607 7143, then share the proof of payment with us on WhatsApp.',
} as const;

/** Reference prefix for pay-and-voucher requests. */
export const PAY_REFERENCE_PREFIX = 'EMR';

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
 * The client's own photographs, grouped by what they actually show. Every
 * slug here was named after looking at the frame, not after its filename.
 * Grouping keeps the gallery readable at 40 images instead of one long wall.
 */
export const GALLERY_SECTIONS = [
  {
    id: 'rooms',
    eyebrow: 'The rooms',
    title: 'Where the work happens.',
    lead: 'Reception, the treatment rooms, and the spaces in between.',
    slugs: [
      'reception-lounge',
      'reception',
      'towel-shelf',
      'retail-display',
      'spa-retreat',
      'hydro-new-2',
      'hydro-new-3',
      'hydro-new-4',
      'hydro-new-5',
      'hydro-new-6',
    ],
  },
  {
    id: 'hydrotherapy',
    eyebrow: 'Hydrotherapy',
    title: 'Warm water, taken slowly.',
    lead: 'The hydrotherapy suite, prepared and in use.',
    slugs: [
      'hydrotherapy-tub-set',
      'hydrotherapy-suite',
      'hydrotherapy-soak',
      'hydrotherapy-guest',
    ],
  },
  {
    id: 'treatments',
    eyebrow: 'Treatments',
    title: 'Esteemed clients.',
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
  {
    id: 'atmosphere',
    eyebrow: 'Atmosphere',
    title: 'The light, the stone, the calm.',
    lead: 'Textures, light and quiet corners of the centre.',
    slugs: [
      'atmos-1', 'atmos-2', 'atmos-3', 'atmos-4', 'atmos-5', 'atmos-6',
      'atmos-7', 'atmos-8', 'atmos-9', 'atmos-10', 'atmos-11', 'atmos-12',
      'atmos-13', 'atmos-14', 'atmos-15', 'atmos-16', 'atmos-17', 'atmos-18',
    ],
  },
  {
    id: 'moments',
    eyebrow: 'Moments',
    title: 'Lounges and green light.',
    lead: 'Garden lounges, shade sails and the green-lit treatment rooms.',
    slugs: [
      'portrait-1', 'portrait-2', 'portrait-3', 'portrait-4',
      'portrait-5', 'portrait-6', 'portrait-7', 'portrait-8',
      'spa-photo-1', 'spa-photo-2', 'spa-photo-3',
    ],
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
  'spa-retreat',
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

/**
 * Site-wide soundtrack (client request, 8 Sep 2025).
 *
 * One looping ambience track for the whole site, controlled by the floating
 * sound button. The file ships as /public/media/audio/ambience.m4a; the
 * client supplied the reference track as a YouTube link, which cannot be
 * fetched from a server, so the file is drop-in replaceable: swap that one
 * file (same name, AAC in an m4a container) and no code changes.
 *
 * The shipped loop is "Healing" by Kevin MacLeod (incompetech.com), licensed
 * CC BY 4.0, so the credit below is printed in the footer for as long as it
 * plays. If the client swaps in their own track, the credit object should be
 * updated or the footer line removed with it.
 */
export const AMBIENCE_PATH = '/media/audio/ambience.m4a';
export const MUSIC_CREDIT = {
  title: 'Healing',
  artist: 'Kevin MacLeod',
  source: 'incompetech.com',
  license: 'CC BY 4.0',
  url: 'https://incompetech.com/music/royalty-free/music.html',
} as const;

export const NAV_LINKS = [
  { href: '/vouchers', label: 'Vouchers' },
  { href: '/services', label: 'Services' },
  { href: '/venues', label: 'Venues' },
  { href: '/specials', label: 'Specials' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/team', label: 'Team' },
  { href: '/visit', label: 'Visit' },
  { href: '/book-bulk', label: 'Group booking' },
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


/**
 * Social share blocks for a subpage: returns BOTH the openGraph and the
 * twitter objects, so a page spreads them ( ...ogFor('/services') ) and each
 * network gets page-correct cards.
 *
 * Why both: Next.js replaces `openGraph` and `twitter` wholesale instead of
 * merging them with the root layout, so a page that declares only a url loses
 * the share image and type, and a page that declares no twitter block at all
 * inherits the root's generic card (which overrides the page-correct
 * openGraph values on X). Title and description are deliberately left unset
 * here: Next falls back to the page's own metadata title and description,
 * which are always page-specific.
 *
 * og:locale uses en_GB because Facebook's supported-locale list has no
 * en_NA, and the site's English follows British/Namibian conventions.
 */
export function ogFor(
  path: string,
  opts: {
    type?: 'website' | 'article';
    publishedTime?: string;
    /** Absolute or root-relative URL of the article photo. */
    image?: string;
    imageAlt?: string;
  } = {},
) {
  const image = opts.image ?? '/og-image.jpg';
  const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  return {
    openGraph: {
      type: opts.type ?? ('website' as const),
      siteName: 'Emerald Spa & Wellness Centre',
      locale: 'en_GB',
      url: `${SITE_URL}${path}`,
      publishedTime: opts.publishedTime,
      images: [
        {
          url: absoluteImage,
          width: 1200,
          height: 630,
          type: 'image/jpeg',
          alt: opts.imageAlt ?? 'Emerald Spa & Wellness Centre, Windhoek',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image' as const,
      images: [absoluteImage],
    },
  };
}
