import {getRequestConfig} from 'next-intl/server';

// Locales your app supports
export const locales = ['en', 'ar'] as const;
export type AppLocale = (typeof locales)[number];

// Default locale
export const defaultLocale: AppLocale = 'en';

// Tell next-intl where to load messages for each locale
export default getRequestConfig(async ({locale}) => {
  // Load the JSON from your existing messages
  const messages = (await import(`@/lib/i18n/messages/${locale}.json`)).default;

  return {
    locale,
    messages
  };
});