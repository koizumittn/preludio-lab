import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from './routing';
import { AppLocale } from '@/domain/shared/locale';

export default getRequestConfig(async ({ requestLocale }) => {
    // これは通常、URLの `[locale]` セグメントに対応します
    let locale = await requestLocale;

    // 入力された `locale` パラメータが有効かどうかを検証します
    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    return {
        messages: (await import(`./messages/${locale}.json`)).default,
        locale: locale // 文字列として明示的に返す
    };
});
