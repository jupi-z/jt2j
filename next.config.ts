import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import './src/env';
import { securityHeaders } from './src/lib/security/headers';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: [
    'payload',
    '@payloadcms/db-postgres',
  ],
  experimental: { globalNotFound: true },
  headers: async () => [
    {
      source: '/(.*)',
      headers: Object.entries(
        securityHeaders({ production: process.env.NODE_ENV === 'production' }),
      ).map(([key, value]) => ({ key, value })),
    },
  ],
};

export default withPayload(createNextIntlPlugin('./src/i18n/request.ts')(nextConfig));
