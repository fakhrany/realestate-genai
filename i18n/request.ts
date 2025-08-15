// i18n/request.ts
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => ({
  // Keep the active locale in the config
  locale,
  // Load the matching translation file from i18n/messages
  messages: (await import(`./messages/${locale}.json`)).default
}));
