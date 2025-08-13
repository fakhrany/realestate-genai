// next-intl.config.ts (root)
export default {
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  // "as-needed" avoids always prefixing the default locale
  localePrefix: 'as-needed'
} as const;