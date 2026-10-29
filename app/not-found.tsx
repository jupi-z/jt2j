import type { Metadata } from 'next';
import fr from '@/i18n/dictionaries/fr.json';
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

export default function NotFound() {
  return (
    <NotFoundContent
      locale="fr"
      title={fr.notFound.title}
      home={fr.notFound.home}
    />
  );
}
