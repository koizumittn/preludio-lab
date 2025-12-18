import createMiddleware from 'next-intl/middleware';
import { defaultLocale, supportedLocales } from '@/domain/shared/locale';

export default createMiddleware({
    // A list of all locales that are supported
    locales: supportedLocales,

    // Used when no locale matches
    defaultLocale: defaultLocale,

    // Always show the locale prefix for better SEO and consistency
    localePrefix: 'always'
});

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(ja|en)/:path*']
};
