import type { MetadataRoute } from 'next';
import { routing, localePath } from '@/i18n/config';
import { publicRoutes } from '@/routing/catalog';
import { alternateUrls, siteOrigin } from '@/routing/seo';

// Architecture inventory; future public queries must filter approved publication.
export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    publicRoutes.map(({ path }) => ({
      url: `${siteOrigin}${localePath(locale, path)}`,
      alternates: { languages: alternateUrls(path) },
    })),
  );
}
