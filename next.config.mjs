/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    /*
      Paths that no longer exist, kept answering instead of 404ing.

      - /promotions: the specials page was renamed (client request); 308 so
        existing links and search results land on the page.
      - /book and /journal (with their subpaths): retired on 8 Sep 2025 at
        the client's request. The embedded booking page is gone - every Book
        button now opens the live booking page directly in the same tab - so
        /book forwards to that destination. The journal is removed from the
        site entirely, so its paths fold into the home page.
      - /api/booking/*: the same-origin booking proxy was removed with the
        embed; stale URLs forward to the same live destination.
    */
    return [
      {
        source: '/promotions',
        destination: '/specials',
        permanent: true,
      },
      {
        source: '/book',
        destination:
          'https://www.fresha.com/book-now/emerald-spa-wellness-centre-qnp9ba1m/all-offer?share=true&pId=1477270',
        permanent: false,
      },
      {
        source: '/api/booking/:path*',
        destination:
          'https://www.fresha.com/book-now/emerald-spa-wellness-centre-qnp9ba1m/all-offer?share=true&pId=1477270',
        permanent: false,
      },
      {
        source: '/journal',
        destination: '/',
        permanent: true,
      },
      {
        source: '/journal/:path*',
        destination: '/',
        permanent: true,
      },
    ];
  },
  async headers() {
    /*
      Content Security Policy and the page security headers live in
      src/middleware.ts, not here. The strict page policy must branch by path
      when a route needs a looser one, and middleware can do that; this file
      cannot exclude a prefix from `/:path*` without duplicating headers.

      What lives here: immutable caching plus X-Content-Type-Options for every
      path the middleware matcher skips (static assets, media, favicons).
    */

    return [
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
