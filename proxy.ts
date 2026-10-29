import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/config';

export default createMiddleware(routing);

// Public locales only: admin, APIs and metadata/assets never enter negotiation.
export const config = { matcher: ['/', '/(fr|en)/:path*'] };
