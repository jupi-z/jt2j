import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/routing/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/_next/'],
    },
    sitemap: `${siteOrigin}/sitemap.xml`,
  };
}
