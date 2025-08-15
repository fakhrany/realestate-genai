// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

export const config = {
  matcher: ['/', '/(en|ar)/:path*']
};