import type { Metadata } from 'next';
import { headers } from 'next/headers';
import fr from '@/i18n/dictionaries/fr.json';
import en from '@/i18n/dictionaries/en.json';
import { isLocale } from '@/i18n/config';
import { NotFoundContent } from '@/routing/NotFoundContent';
import { siteOrigin } from '@/routing/seo';
import '@/styles/tokens.css';
import '@/styles/typography.css';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: '404 | JT2J',
  robots: { index: false, follow: false },
};

export default async function GlobalNotFound() {
  const value = (await headers()).get('x-next-intl-locale') ?? 'fr';
  const locale = isLocale(value) ? value : 'fr';
  const messages = locale === 'fr' ? fr : en;
  return (
    <html lang={locale}>
      <body>
        <NotFoundContent
          locale={locale}
          title={messages.notFound.title}
          home={messages.notFound.home}
        />
      </body>
    </html>
  );
}
