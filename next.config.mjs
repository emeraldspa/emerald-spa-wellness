/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    /*
      Content Security Policy and the page security headers live in
      src/middleware.ts, not here. The booking proxy at /api/booking/* must be
      served without the strict page policy (its app boots from the provider's
      CDN), and this config file cannot exclude a prefix from `/:path*`
      without duplicating the CSP header on proxy responses, which browsers
      enforce as an intersection. Middleware can branch on the path.

      What lives here: immutable caching plus X-Content-Type-Options for every
      path the middleware matcher skips (static assets, media, favicons) and
      the booking proxy's noindex.
    */

    return [
      {
        source: '/api/booking/:path*',
        headers: [
          // The proxy mirrors the provider's pages; they must not be indexed.
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/media/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/brand/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/icons/:path*',
        headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }],
      },
      {
        source: '/favicon.ico',
        headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }],
      },
      {
        source: '/:path*.webmanifest',
        headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }],
      },
    ];
  },
};
export default nextConfig;
