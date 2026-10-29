import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { env } from '@/env';
import { isLocale, localePath, type Locale } from '@/i18n/config';
import { findRoute } from './catalog';

export const siteOrigin = new URL(env.SITE_URL).origin;

export function alternateUrls(path: string) {
  return {
    fr: `${siteOrigin}${localePath('fr', path)}`,
    en: `${siteOrigin}${localePath('en', path)}`,
    'x-default': `${siteOrigin}${localePath('fr', path)}`,
  };
}

export function requireLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

export async function routeMetadata(
  value: string,
  path: string,
): Promise<Metadata> {
  const locale = requireLocale(value);
  const route = findRoute(path);
  if (!route) notFound();
  const t = await getTranslations({ locale });
  const title = `${t(route.message)} | JT2J`;
  const description = t('description', { title: t(route.message) });
  const canonical = `${siteOrigin}${localePath(locale, path)}`;
  return {
    title,
    description,
    alternates: { canonical, languages: alternateUrls(path) },
    // Remove only when the public content/publication layer replaces skeletons.
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: 'JT2J',
      locale: locale === 'fr' ? 'fr_CD' : 'en_GB',
      alternateLocale: [locale === 'fr' ? 'en_GB' : 'fr_CD'],
      images: [
        { url: '/opengraph-image', width: 1200, height: 630, alt: 'JT2J' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
    },
  };
}
