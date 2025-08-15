// middleware.ts (root)
import createMiddleware from 'next-intl/middleware';
// Import the ESM config; the bundler will include it
import intlConfig from './next-intl.config.mjs';

export default createMiddleware(intlConfig);

// Next.js reads this for routing; keep API/_next/static excluded
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};