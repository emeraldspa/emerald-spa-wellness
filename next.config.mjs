/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  async rewrites() {
    /*
      The embedded booking app navigates between its own steps with
      root-relative paths like `/a/<venue>/booking`. Those land on this origin
      and would 404, so they are rewritten back into the booking proxy.
      Rewriting rather than redirecting keeps the URL inside the iframe and
      never touches the parent address bar.
    */
    return [
      { source: '/a/:path*', destination: '/api/booking/a/:path*' },
      { source: '/graphql', destination: '/api/booking/graphql' },
      { source: '/assets/:path*', destination: '/api/booking/assets/:path*' },
    ];
  },
  async headers() {
    /*
      Content Security Policy.

      The site's own pages are served entirely from this origin. The exceptions
      are real and each is here for a reason: the /visit page embeds Google
      Maps, and the booking proxy serves the provider's app from our origin, so
      that app's own images and webfonts have to be reachable or the embed
      renders unstyled.

      'unsafe-inline' is a genuine concession, not laziness. Next.js App Router
      writes its hydration payload as inline script tags and its critical CSS as
      inline style blocks. Removing it needs per-request nonces through
      middleware. script-src stays pinned to 'self', which is the part that
      stops injected third-party code from executing.

      frame-ancestors replaces X-Frame-Options for modern browsers; the older
      header is kept for agents that predate CSP level 2.
    */
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self' https://wa.me https://api.whatsapp.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.fresha.com https://maps.gstatic.com https://maps.googleapis.com",
      "font-src 'self' data: https://d8j0ntlcm91z4.cloudfront.net",
      "connect-src 'self' https://d8j0ntlcm91z4.cloudfront.net",
      "media-src 'self' blob:",
      "frame-src 'self' https://www.google.com https://maps.google.com",
      "manifest-src 'self'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
      {
        source: '/media/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/brand/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/api/booking/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ];
  },
};
export default nextConfig;
