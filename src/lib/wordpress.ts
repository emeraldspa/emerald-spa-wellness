/**
 * WordPress content layer.
 *
 * The back office at admin.emeraldspacc.com is a fresh install with almost no
 * content yet, so every function here is written to degrade to an empty list
 * rather than throw. A page that depends on this must render fine when
 * WordPress is empty, slow, or down: that is the whole contract.
 *
 * Fetching happens on the server during rendering, so the WordPress address
 * never appears in a visitor's network tab, and its speed never becomes the
 * visitor's problem. Responses are revalidated on a timer, which means an edit
 * appears without a redeploy while the site still serves instantly.
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
  imageAlt: string;
};

export type WpPromotion = WpPost & {
  startsOn: string | null;
  endsOn: string | null;
  showAsPopup: boolean;
};

type RawPost = {
  id: number;
  slug: string;
  date: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  acf?: Record<string, unknown>;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string; alt_text?: string }>;
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
    image: media?.source_url ?? null,
    imageAlt: media?.alt_text ?? '',
  };
}

/** Published journal posts, newest first. Empty list if there are none. */
export async function getPosts(limit = 6): Promise<WpPost[]> {
  const raw = await wpFetch<RawPost>(
    `posts?per_page=${limit}&_embed=wp:featuredmedia&status=publish&orderby=date&order=desc`,
  );
  return raw.map(toPost);
}

export async function getPost(slug: string): Promise<WpPost | null> {
  const raw = await wpFetch<RawPost>(`posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`);
  return raw.length ? toPost(raw[0]) : null;
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
    .map((r): WpPromotion => {
      const acf = r.acf ?? {};
      return {
        ...toPost(r),
        startsOn: asString(acf.starts_on),
        endsOn: asString(acf.ends_on),
        showAsPopup: acf.show_as_popup === true || acf.show_as_popup === 1,
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

/** True when WordPress has real content to show. Used to hide empty sections. */
export async function hasJournal(): Promise<boolean> {
  const posts = await getPosts(1);
  return posts.length > 0;
}
