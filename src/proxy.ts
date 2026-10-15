import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Sends `/` and unprefixed paths to /ar or /en: NEXT_LOCALE cookie first, then Accept-Language.
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next/Vercel internals and anything with a file extension.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
