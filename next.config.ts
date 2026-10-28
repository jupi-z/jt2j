import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import './src/env';

const nextConfig: NextConfig = {
  serverExternalPackages: [
    'payload',
    '@payloadcms/db-postgres',
    '@payloadcms/storage-s3',
  ],
  experimental: { globalNotFound: true },
};

export default createNextIntlPlugin('./src/i18n/request.ts')(nextConfig);
