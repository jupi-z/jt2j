import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import './src/env';

const nextConfig: NextConfig = {
  experimental: { globalNotFound: true },
};

export default createNextIntlPlugin('./src/i18n/request.ts')(nextConfig);
