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
      Security headers, audit-driven (OWASP ASVS V14).
      - CSP permits the same-origin booking proxy (frame-src 'self') and the
        /visit Google Maps embed. Inline scripts are required by Next's
        hydration bootstrap; tighten further with nonces once feasible.
      - The booking iframe content is governed by its own proxied document,
        so the permissive-ish script-src does not relax the booking app.
    */
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.fresha.com",
      "font-src 'self' data: https://d8j0ntlcm91z4.cloudfront.net",
      "connect-src 'self' https://d8j0ntlcm91z4.cloudfront.net",
      "media-src 'self' blob:",
      "frame-src 'self' https://maps.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://wa.me https://api.whatsapp.com",
      "frame-ancestors 'self'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: csp },
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
