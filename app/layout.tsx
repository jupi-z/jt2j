import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { env } from '@/env';
import '@/styles/tokens.css';
import '@/styles/typography.css';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: 'JT2J',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
