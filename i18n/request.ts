// i18n/request.ts
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => ({
  // The locales your app supports are configured in next-intl.config.mjs
  locale,
  messages: (await import(`./messages/${locale}.json`)).default
}));