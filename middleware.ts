// middleware.ts
import createMiddleware from 'next-intl/middleware';

// Import the JS config without extension so Node resolves it correctly
// (works both locally and on Vercel)
const i18nConfig = require('./next-intl.config.js');

export default createMiddleware(i18nConfig);

export const config = {
  // Run middleware on everything (including / and locale paths)
  matcher: ['/', '/(.*)']
};