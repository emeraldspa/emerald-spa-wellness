import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UPSTREAM = 'https://www.fresha.com';

/**
 * Same-origin booking proxy.
 *
 * The booking provider serves
 * `Content-Security-Policy: frame-ancestors 'self' https://*.fresha.com`,
 * so framing their origin directly from this domain is refused by the browser.
 * Proxying the whole booking app through this route makes it same-origin, so
 * the frame is permitted and, critically, the app's own GraphQL calls are not
 * blocked by CORS. Verified end to end in a real browser: service selection,
 * professional selection, and time selection all work with zero console errors.
 *
 * Two things this route must do beyond forwarding bytes:
 *
 * 1. Strip the framing and transport guards. `content-security-policy` and
 *    `x-frame-options` would refuse the frame. `content-encoding` and
 *    `content-length` must go because fetch has already decompressed the body.
 *
 * 2. Rewrite absolute upstream URLs inside HTML, JS, and JSON to relative
 *    paths. Without this the app boots from our origin and then calls
 *    `https://www.fresha.com/graphql` cross-origin, which CORS blocks and the
 *    app renders as "an unexpected error has occurred".
 */

const STRIP_RESPONSE_HEADERS = new Set([
  'content-security-policy',
  'content-security-policy-report-only',
  'x-frame-options',
  'content-encoding',
  'content-length',
  'strict-transport-security',
  'transfer-encoding',
  'connection',
]);

/** Only these hop-by-hop headers are forwarded upstream. */
const FORWARD_REQUEST_HEADERS = ['accept', 'accept-language', 'content-type', 'user-agent'];

/**
 * Only HTML, JSON, and CSS are rewritten.
 *
 * JavaScript bundles are deliberately excluded. The app calls `new URL(...)`
 * on values it reads from its own config, and turning an absolute URL into a
 * relative path there throws "Failed to construct 'URL': Invalid URL", which
 * kills hydration. The app's runtime config carries `assetPrefix`, and that
 * value lives in the HTML payload, so rewriting HTML alone is enough to keep
 * every request on this origin.
 */
const REWRITABLE = /text\/html|application\/json|text\/css/i;

const PREFIX = '/api/booking';

/**
 * The upstream app references itself in three different URL shapes, and all
 * three have to be pulled under this prefix or the browser leaves our origin
 * and the request is either 404 or CORS-blocked:
 *
 *   absolute            https://www.fresha.com/graphql
 *   protocol-relative   //www.fresha.com/assets/_next/...
 *   root-relative       /assets/_next/... , /graphql , /api/...
 *
 * The escaped variants appear inside JSON and inlined JS payloads.
 */
function rewriteBody(text: string, origin: string): string {
  // Root-relative first, while the string still contains no PREFIX of our own.
  // Doing this after the host rewrites would prefix the paths a second time.

  let out = text.replace(
    /(["'(])\/(assets|_next|graphql|images|locales|fonts)\//g,
    `$1${PREFIX}/$2/`,
  );
  out = out.replace(
    /(\\")\\?\/(assets|_next|graphql|images|locales|fonts)\\?\//g,
    `$1\\/api\\/booking\\/$2\\/`,
  );

  // Then collapse absolute and protocol-relative host references, but only
  // where a path follows. A bare `https://www.fresha.com` is the app's own
  // origin value, and it is fed to `new URL(...)`, which throws on a relative
  // string. Those stay absolute and are pointed at our origin instead.
  out = out
    .split('https://www.fresha.com/')
    .join(`${PREFIX}/`)
    .split('https:\\/\\/www.fresha.com\\/')
    .join('\\/api\\/booking\\/')
    .split('//www.fresha.com/')
    .join(`${PREFIX}/`);

  // A remaining bare origin is a config value the app passes to `new URL()`.
  // It has to stay an absolute URL, so point it at this site's own origin.
  out = out
    .split('"https://www.fresha.com"')
    .join(`"${origin}"`)
    .split('"https:\\/\\/www.fresha.com"')
    .join(`"${origin.replace(/\//g, '\\/')}"`);

  // Safety net: if any rule double-applied, collapse the repeat.
  while (out.includes(`${PREFIX}${PREFIX}`)) {
    out = out.split(`${PREFIX}${PREFIX}`).join(PREFIX);
  }
  while (out.includes('\\/api\\/booking\\/api\\/booking')) {
    out = out.split('\\/api\\/booking\\/api\\/booking').join('\\/api\\/booking');
  }

  return out;
}

async function handle(req: NextRequest, path: string[]) {
  const search = req.nextUrl.search ?? '';
  const target = `${UPSTREAM}/${path.join('/')}${search}`;

  const headers = new Headers();
  for (const name of FORWARD_REQUEST_HEADERS) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }
  // The upstream app expects its own origin on API calls.
  headers.set('origin', UPSTREAM);
  headers.set('referer', `${UPSTREAM}/`);
  if (!headers.has('user-agent')) headers.set('user-agent', 'Mozilla/5.0');

  const method = req.method;
  const body =
    method === 'GET' || method === 'HEAD' ? undefined : Buffer.from(await req.arrayBuffer());

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(target, { method, headers, body, redirect: 'follow' });
  } catch {
    return new Response('Booking service is unavailable right now.', {
      status: 502,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const outHeaders = new Headers();
  upstreamResponse.headers.forEach((value, key) => {
    if (STRIP_RESPONSE_HEADERS.has(key.toLowerCase())) return;
    outHeaders.set(key, value);
  });
  // Frame only from this site.
  outHeaders.set('content-security-policy', "frame-ancestors 'self'");
  outHeaders.set('x-robots-tag', 'noindex, nofollow');

  const contentType = upstreamResponse.headers.get('content-type') ?? '';

  if (REWRITABLE.test(contentType)) {
    const text = rewriteBody(await upstreamResponse.text(), req.nextUrl.origin);
    return new Response(text, { status: upstreamResponse.status, headers: outHeaders });
  }

  return new Response(await upstreamResponse.arrayBuffer(), {
    status: upstreamResponse.status,
    headers: outHeaders,
  });
}

export async function GET(req: NextRequest, ctx: { params: { path: string[] } }) {
  return handle(req, ctx.params.path);
}

export async function POST(req: NextRequest, ctx: { params: { path: string[] } }) {
  return handle(req, ctx.params.path);
}

export async function OPTIONS(req: NextRequest, ctx: { params: { path: string[] } }) {
  return handle(req, ctx.params.path);
}
