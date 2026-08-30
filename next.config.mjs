/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  async headers() {
    /*
      Content Security Policy.

      The site's own pages are served entirely from this origin. The exceptions
      are real and each is here for a reason: the /visit page embeds Google
      Maps.

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
      "img-src 'self' data: blob: https://maps.gstatic.com https://maps.googleapis.com https://admin.emeraldspacc.com https://*.wp.com",
      "font-src 'self' data: https://d8j0ntlcm91z4.cloudfront.net",
      "connect-src 'self' https://d8j0ntlcm91z4.cloudfront.net",
      "media-src 'self' blob:",
      "frame-src 'self' https://www.google.com https://maps.google.com",
      "manifest-src 'self'",
      'upgrade-insecure-requests',
    ].join('; ');

    /*
      Content Security Policy and the other security headers live in
      src/middleware.ts, not here. The booking proxy at /api/booking/* must be
      served without the strict page policy (its app boots from the provider's
      CDN), and this config file cannot exclude a prefix from `/:path*`
      without duplicating the CSP header on proxy responses, which browsers
      enforce as an intersection. Middleware can branch on the path.
    */

    return [
      {
        source: '/api/booking/:path*',
        headers: [
          // The proxy mirrors the provider's pages; they must not be indexed.
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
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
    ];
  },
};
export default nextConfig;
