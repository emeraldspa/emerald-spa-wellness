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
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/media/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};
export default nextConfig;
