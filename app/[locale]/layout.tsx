import type { Metadata } from 'next';
import { routing } from '@/i18n/config';
import { requireLocale, siteOrigin } from '@/routing/seo';
import '@/styles/tokens.css';
import '@/styles/typography.css';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: 'JT2J',
  robots: { index: false, follow: true },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// The skeleton inventory is closed until approved content queries are added.
export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const locale = requireLocale((await params).locale);
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
