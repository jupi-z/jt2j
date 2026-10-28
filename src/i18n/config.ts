import { defineRouting } from 'next-intl/routing';
import { locales } from '@/content/types';

export type Locale = (typeof locales)[number];
export const routing = defineRouting({
  locales,
  defaultLocale: 'fr',
  localePrefix: 'always',
  localeDetection: false,
  localeCookie: false,
  // Metadata uses the configured origin, never untrusted forwarding headers.
  alternateLinks: false,
});

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function localePath(locale: Locale, path = '') {
  return `/${locale}${path}`;
}
