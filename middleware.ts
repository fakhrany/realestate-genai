// middleware.ts
import createMiddleware from 'next-intl/middleware';
import intlConfig from './next-intl.config';

export default createMiddleware(intlConfig);

// Only match localized paths (and the root)
export const config = {
  matcher: ['/', '/(en|ar)/:path*']
};