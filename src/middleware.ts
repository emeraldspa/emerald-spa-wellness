import { NextRequest, NextResponse } from 'next/server';

/**
 * Security headers, applied to every page response.
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

export async function middleware(_req: NextRequest) {
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
