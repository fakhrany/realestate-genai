import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './i18n/request';

export default createMiddleware({
  // Supported locales & default
  locales,
  defaultLocale
});

export const config = {
  // Paths that should be localized
  matcher: ['/', '/(en|ar)/:path*']
};