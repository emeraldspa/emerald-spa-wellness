import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { HOUSE_POSTS } from '@/data/journal';
import { getPosts } from '@/lib/wordpress';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: { path: string; priority: number; freq: 'weekly' | 'monthly' | 'yearly' }[] = [
    { path: '', priority: 1.0, freq: 'weekly' },
    { path: '/book', priority: 0.95, freq: 'monthly' },
    { path: '/pay', priority: 0.9, freq: 'monthly' },
    { path: '/book-bulk', priority: 0.8, freq: 'monthly' },
    { path: '/vouchers', priority: 0.8, freq: 'monthly' },
    { path: '/promotions', priority: 0.7, freq: 'monthly' },
    { path: '/whatsapp', priority: 0.8, freq: 'monthly' },
    { path: '/venues', priority: 0.8, freq: 'monthly' },
    { path: '/journal', priority: 0.6, freq: 'weekly' },
    { path: '/services', priority: 0.9, freq: 'weekly' },
    { path: '/gallery', priority: 0.7, freq: 'monthly' },
    { path: '/team', priority: 0.7, freq: 'monthly' },
    { path: '/visit', priority: 0.8, freq: 'monthly' },
    { path: '/brand', priority: 0.3, freq: 'yearly' },
    { path: '/sitemap', priority: 0.3, freq: 'monthly' },
    { path: '/privacy', priority: 0.2, freq: 'yearly' },
    { path: '/terms', priority: 0.2, freq: 'yearly' },
  ];

  // Static routes carry no lastModified: a build timestamp is not a real
  // change date, and Google ignores (or distrusts) identical stamps.
  // House journal stories and live WordPress posts have real dates.
  const housePosts = HOUSE_POSTS.map((p) => ({
    url: `${SITE_URL}/journal/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // Everything the editors have published in WordPress, ahead of the house
  // stories, exactly as the journal page itself orders them.
  const wpPosts = (await getPosts(50))
    .filter((p) => !HOUSE_POSTS.some((h) => h.slug === p.slug))
    .map((p) => ({
      url: `${SITE_URL}/journal/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  return [
    ...routes.map((r) => ({
      url: `${SITE_URL}${r.path}`,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...wpPosts,
    ...housePosts,
  ];
}
