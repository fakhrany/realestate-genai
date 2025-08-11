// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export const config = {
  // Match the root and any path under /en or /ar
  matcher: ['/', '/(en|ar)/:path*']
};