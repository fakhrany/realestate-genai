// middleware.ts (repo root)
import createMiddleware from 'next-intl/middleware';
import i18nConfig from './next-intl.config';

export default createMiddleware(i18nConfig);

// Match the root and your locale segments
export const config = {
  matcher: ['/', '/(en|ar)/:path*']
};