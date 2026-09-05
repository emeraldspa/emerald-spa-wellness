import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    // No `host` directive: it is a Yandex-only, deprecated extension that
    // other crawlers report as unsupported syntax.
    // The Content Manager is a private back office: never indexed, never
    // suggested to crawlers, and its API surface is excluded alongside it.
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/cms'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
