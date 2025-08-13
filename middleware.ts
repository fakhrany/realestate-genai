// middleware.ts (root)
import createMiddleware from 'next-intl/middleware';
import nextIntlConfig from './next-intl.config'; // imports the .js default export

export default createMiddleware(nextIntlConfig);

// Do NOT rename this export; Next.js looks for "config"
export const config = {
  // Exclude Next internals, assets and API routes
  matcher: ['/((?!api|_next|.*\\..*).*)']
};