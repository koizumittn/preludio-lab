import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { AppLocale, supportedLocales } from '@/domain/shared/locale';

export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming `locale` parameter is valid
    if (!supportedLocales.includes(locale as any)) notFound();

    return {
        messages: (await import(`./messages/${locale}.json`)).default,
        locale,
    };
});
