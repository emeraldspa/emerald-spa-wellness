import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Emerald Spa & Wellness Centre',
    short_name: 'Emerald Spa',
    description:
      'Massages, facials, hydrotherapy and nails in Windhoek West, Namibia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F5F1',
    theme_color: '#063F31',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/emerald-logo-official.png', sizes: '500x500', type: 'image/png' },
    ],
  };
}
