// i18n/request.ts
import {createRequestConfig} from 'next-intl/server';

export default createRequestConfig({
  // The locales your app supports
  locales: ['en', 'ar'],

  // The default locale
  defaultLocale: 'en',

  // Use "/en" and "/ar" prefixes consistently
  localePrefix: 'always'

  // If you later want per-route pathnames, you can add:
  // pathnames: {
  //   '/': '/',
  //   '/admin': '/admin'
  // }
});