// next-intl.config.ts (root)
const config = {
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  // Do not prefix the default locale in URLs
  localePrefix: 'as-needed'
} as const;

export default config;