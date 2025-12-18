import { defineRouting } from 'next-intl/routing';
import { defaultLocale, supportedLocales } from '@/domain/shared/locale';

export const routing = defineRouting({
    locales: supportedLocales,
    defaultLocale: defaultLocale,
    localePrefix: 'always'
});
