import { HOUSE_POSTS } from '@/data/journal';

/**
 * WordPress content layer.
 *
 * The back office at admin.emeraldspacc.com is a fresh install with almost no
 * content yet, so every function here is written to degrade to an empty list
 * rather than throw. A page that depends on this must render fine when
 * WordPress is empty, slow, or down: that is the whole contract.
 *
 * The journal is never allowed to sit empty while that is true: the house
 * stories in src/data/journal.ts render whenever WordPress has nothing real
 * to show, and real posts slot in ahead of them the moment they are
 * published. Fetching happens on the server during rendering, so the
 * WordPress address never appears in a visitor's network tab, and its speed
 * never becomes the visitor's problem. Responses are revalidated on a timer,
 * which means an edit appears without a redeploy while the site still serves
 * instantly.
 *
 * Why the REST API and not a scraper: we own this install, and WordPress
 * publishes typed JSON. Parsing the theme's markup instead would mean
 * re-deriving fields the API already gives us, and breaking every time an
 * editor changes the layout.
 */

const WP_URL = process.env.WORDPRESS_URL ?? 'https://admin.emeraldspacc.com';
const REVALIDATE_SECONDS = 900;

export type WpPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string | null;
  /** Responsive candidates for the featured image, as a srcset string. */
  imageSrcset: string;
  imageAlt: string;
};

export type WpPromotion = WpPost & {
  startsOn: string | null;
  endsOn: string | null;
  showAsPopup: boolean;
  /** Venue duration text, e.g. "2 hours". */
  duration: string | null;
  /** Venue price in NAD, e.g. 1700. */
  priceNad: number | null;
};

type RawPost = {
  id: number;
  slug: string;
  date: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  acf?: Record<string, unknown>;
  _embedded?: { 'wp:featuredmedia'?: RawMedia[] };
};

type RawMedia = {
  source_url?: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<string, { source_url?: string; width?: number; height?: number }>;
  };
};

/** Strip tags and decode the handful of entities WordPress emits in titles. */
function plain(html: string | undefined): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&#8217;|&#039;|&apos;/g, "'")
    .replace(/&#8220;|&#8221;|&quot;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function wpFetch<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    // WordPress being unreachable must never take a page down with it.
    return [];
  }
}

function toPost(raw: RawPost): WpPost {
  const media = raw._embedded?.['wp:featuredmedia']?.[0];
  return {
    id: raw.id,
    slug: raw.slug,
    title: plain(raw.title?.rendered),
    excerpt: plain(raw.excerpt?.rendered),
    content: raw.content?.rendered ?? '',
    date: raw.date,
    image: bestImage(media),
    imageSrcset: srcsetFrom(media),
    imageAlt: media?.alt_text ?? '',
  };
}

/** Every rendition WordPress made, joined as a srcset string. */
function srcsetFrom(media: RawMedia | undefined): string {
  const sizes = media?.media_details?.sizes;
  if (!sizes) return '';
  return Object.values(sizes)
    .filter((s) => s.source_url && (s.width ?? 0) >= 300 && (s.width ?? 0) <= 1600)
    .sort((a, b) => (a.width ?? 0) - (b.width ?? 0))
    .map((s) => `${s.source_url} ${s.width}w`)
    .join(', ');
}

/**
 * The featured image URL to send to browsers: the original only when no
 * intermediate size exists, otherwise a card-sized WordPress rendition.
 * Editors upload 1600px+ photos, but journal cards render at ~400px, so
 * using the original would ship 3x or more pixels than any card needs.
 */
function bestImage(media: RawMedia | undefined): string | null {
  const sizes = media?.media_details?.sizes;
  if (!sizes) return media?.source_url ?? null;
  const candidates = ['medium_large', 'large', 'medium'] as const;
  for (const key of candidates) {
    const size = sizes[key];
    if (size?.source_url && (size.width ?? 0) >= 480) return size.source_url;
  }
  return media?.source_url ?? null;
}

/** Published journal posts, newest first. Empty list if there are none. */
/** WordPress demo/sample posts must never appear on the public site. */
function isDemo(raw: RawPost): boolean {
  return typeof raw.slug === 'string' && raw.slug.startsWith('demo-');
}

export async function getPosts(limit = 6): Promise<WpPost[]> {
  const raw = await wpFetch<RawPost>(
    `posts?per_page=${limit * 2}&_embed=wp:featuredmedia&status=publish&orderby=date&order=desc`,
  );
  const wpPosts = raw.filter((r) => !isDemo(r)).slice(0, limit).map(toPost);
  // House stories fill the page only when WordPress has nothing real yet.
  // Editors sometimes publish a story that also exists as a house story, so
  // the WordPress version (the one they can edit) wins the slug and the
  // house copy steps aside rather than doubling the card.
  const wpSlugs = new Set(wpPosts.map((p) => p.slug));
  const combined = [...wpPosts, ...HOUSE_POSTS.filter((h) => !wpSlugs.has(h.slug))];
  return combined.slice(0, limit);
}

export async function getPost(slug: string): Promise<WpPost | null> {
  const raw = await wpFetch<RawPost>(`posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`);
  if (raw.length && !isDemo(raw[0])) return toPost(raw[0]);
  // House stories are served under the same route as WordPress posts.
  return HOUSE_POSTS.find((p) => p.slug === slug) ?? null;
}

function asString(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

/**
 * Promotions, filtered to the ones running today.
 *
 * Dates are optional in the editor. A promotion with no dates is treated as
 * always on, because an editor who leaves them blank means "show it", not
 * "hide it forever".
 */
export async function getActivePromotions(): Promise<WpPromotion[]> {
  const raw = await wpFetch<RawPost>(
    'promotion?per_page=20&_embed=wp:featuredmedia&status=publish',
  );
  const today = new Date().toISOString().slice(0, 10);

  return raw
    .filter((r) => !isDemo(r))
    .map((r): WpPromotion => {
      const acf = r.acf ?? {};
      return {
        ...toPost(r),
        startsOn: asString(acf.starts_on),
        endsOn: asString(acf.valid_until) ?? asString(acf.ends_on),
        showAsPopup: acf.show_as_popup === true || acf.show_as_popup === 1,
        duration: asString(acf.duration),
        priceNad: typeof acf.price_nad === 'number' ? acf.price_nad : null,
      };
    })
    .filter((p) => {
      if (p.startsOn && p.startsOn > today) return false;
      if (p.endsOn && p.endsOn < today) return false;
      return true;
    });
}

/** The single promotion, if any, that should interrupt the visitor. */
export async function getPopupPromotion(): Promise<WpPromotion | null> {
  const active = await getActivePromotions();
  return active.find((p) => p.showAsPopup) ?? null;
}

/** True when there is anything to show: real WordPress posts or house stories. */
export async function hasJournal(): Promise<boolean> {
  if (HOUSE_POSTS.length > 0) return true;
  const posts = await getPosts(1);
  return posts.length > 0;
}
