import { NextRequest, NextResponse } from 'next/server';
import { HOUSE_JOURNAL_SLUGS } from '@/lib/journal-slugs';

/**
 * Security headers, applied per path.
 *
 * The booking proxy at /api/booking/* serves the booking provider's app under
 * this origin. Its document must be framed by this site, and it loads scripts,
 * styles and XHR from the provider's CDN, so the strict page policy below must
 * not apply there: browsers enforce every Content-Security-Policy header they
 * receive, and a second strict policy would silently break the frame. This is
 * why the headers moved here from next.config.mjs, whose rules cannot exclude
 * a path prefix from a broader match without duplicating the header.
 *
 * The proxy route itself sets `frame-ancestors 'self'` on every response, so
 * middleware only needs to stay out of its way.
 *
 * Page scripts keep 'unsafe-inline': every main route is prerendered as
 * static HTML at build time, and a nonce only works when the document is
 * rendered per-request (Next stamps nonces at render time, never into the
 * static shell). 'unsafe-eval' is dev-only and dropped in production.
 * script-src stays pinned to 'self' + inline, which still blocks every
 * injected third-party or remote script.
 */

const PAGE_CSP = (dev: boolean) =>
  [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "form-action 'self' https://wa.me https://api.whatsapp.com",
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://maps.gstatic.com https://maps.googleapis.com https://admin.emeraldspacc.com https://*.wp.com",
    "font-src 'self' data: https://d8j0ntlcm91z4.cloudfront.net",
    "connect-src 'self' https://d8j0ntlcm91z4.cloudfront.net",
    "media-src 'self' blob:",
    "frame-src 'self' https://www.google.com https://maps.google.com",
    "manifest-src 'self'",
    'upgrade-insecure-requests',
  ].join('; ');

/** OWASP-recommended disable list, broader than the obvious three. */
const PERMISSIONS_POLICY = [
  'camera=()',
  'microphone=()',
  'geolocation=()',
  'payment=()',
  'usb=()',
  'accelerometer=()',
  'gyroscope=()',
  'magnetometer=()',
  'interest-cohort=()',
  'idle-detection=()',
  'local-fonts=()',
  'xr-spatial-tracking=()',
].join(', ');

/**
 * Unknown journal slugs must answer 404, not a streamed 200. The article
 * page renders from WordPress over the network, and by the time its fetch
 * resolves the response head has already been committed, so notFound() in
 * the page can only swap the body, never the status. Deciding here, before
 * the render starts, is the one place the status can still be set.
 *
 * Known slugs are the house stories (bundled) plus whatever the editors
 * have published in WordPress (fetched, cached at the edge for 15 minutes
 * via the Cache API; middleware fetches are otherwise uncached).
 * If the back office cannot be reached the check fails OPEN: the page then
 * renders its own not-found body with a 200, the old soft behaviour, which
 * is the safe failure for a downed backend.
 */
const WP_SLUGS_URL =
  'https://admin.emeraldspacc.com/wp-json/wp/v2/posts?per_page=100&_fields=slug';
const WP_SLUGS_CACHE_KEY = new Request('https://edge-cache.local/journal-slugs');

async function knownJournalSlugs(): Promise<Set<string> | null> {
  try {
    const house = new Set<string>(HOUSE_JOURNAL_SLUGS);
    if (typeof caches === 'undefined') {
      const res = await fetch(WP_SLUGS_URL, { cache: 'no-store' });
      const list = (await res.json()) as { slug?: string }[];
      for (const p of Array.isArray(list) ? list : []) {
        if (typeof p.slug === 'string' && !p.slug.startsWith('demo-')) house.add(p.slug);
      }
      return house;
    }
    const cache = await caches.open('emerald-journal');
    const cached = await cache.match(WP_SLUGS_CACHE_KEY);
    if (cached) {
      for (const s of (await cached.json()) as string[]) house.add(s);
      return house;
    }
    const res = await fetch(WP_SLUGS_URL, { cache: 'no-store' });
    const list = (await res.json()) as { slug?: string }[];
    const slugs = (Array.isArray(list) ? list : [])
      .map((p) => p.slug)
      .filter((s): s is string => typeof s === 'string' && !s.startsWith('demo-'));
    await cache.put(
      WP_SLUGS_CACHE_KEY,
      new Response(JSON.stringify(slugs), {
        headers: { 'Cache-Control': 'max-age=900' },
      }),
    );
    for (const s of slugs) house.add(s);
    return house;
  } catch {
    return null; // fail open
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith('/api/booking')) {
    const res = NextResponse.next();
    // The proxy route owns its own headers. Only the shared basics apply.
    res.headers.set('X-Content-Type-Options', 'nosniff');
    return res;
  }

  if (path.startsWith('/journal/') && path !== '/journal/') {
    const slug = path.split('/')[2]?.replace(/\/+$/, '');
    // Only single-segment slugs are articles; anything else is a real 404
    // from the router already.
    if (slug && !slug.includes('/')) {
      const known = await knownJournalSlugs();
      if (known && !known.has(slug)) {
        // Rewriting to a path no route matches makes Next serve its native
        // 404 (status and branded page) without a redirect for the visitor.
        const miss = req.nextUrl.clone();
        miss.pathname = `/journal-miss/${slug}`;
        return NextResponse.rewrite(miss);
      }
    }
  }

  const dev = process.env.NODE_ENV === 'development';
  const csp = PAGE_CSP(dev);

  const res = NextResponse.next();
  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('Permissions-Policy', PERMISSIONS_POLICY);
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  res.headers.set('Cross-Origin-Resource-Policy', 'same-site');
  res.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains',
  );
  return res;
}

export const config = {
  /*
    Everything except the framework's own static assets, which are immutable
    and carry their own caching rules (plus nosniff) from next.config.mjs.
  */
  matcher: ['/((?!_next/static|_next/image|favicon.ico|media/).*)'],
};
