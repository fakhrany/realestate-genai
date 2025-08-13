// middleware.ts (root)
import createMiddleware from 'next-intl/middleware';

// Import the JS config with its extension so Node can resolve it in the serverless bundle
const i18nConfig = require('./next-intl.config.js');

export default createMiddleware(i18nConfig);

export const config = {
  matcher: ['/', '/(.*)']
};