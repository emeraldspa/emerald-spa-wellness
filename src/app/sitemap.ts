import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; freq: 'weekly' | 'monthly' | 'yearly' }[] = [
    { path: '', priority: 1.0, freq: 'weekly' },
    { path: '/book', priority: 0.95, freq: 'monthly' },
    { path: '/vouchers', priority: 0.8, freq: 'monthly' },
    { path: '/whatsapp', priority: 0.8, freq: 'monthly' },
    { path: '/services', priority: 0.9, freq: 'weekly' },
    { path: '/gallery', priority: 0.7, freq: 'monthly' },
    { path: '/team', priority: 0.7, freq: 'monthly' },
    { path: '/visit', priority: 0.8, freq: 'monthly' },
    { path: '/brand', priority: 0.3, freq: 'yearly' },
    { path: '/sitemap', priority: 0.3, freq: 'monthly' },
    { path: '/privacy', priority: 0.2, freq: 'yearly' },
    { path: '/terms', priority: 0.2, freq: 'yearly' },
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
