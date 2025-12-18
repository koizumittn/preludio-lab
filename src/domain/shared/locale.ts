/**
 * Supported Locales for Preludio Lab.
 * This file acts as the Source of Truth for available languages in the domain.
 */

export const AppLocale = {
    EN: 'en',
    JA: 'ja',
    // Future support
    // ES: 'es',
    // DE: 'de',
    // FR: 'fr',
    // IT: 'it',
    // ZH: 'zh',
} as const;

export type AppLocale = (typeof AppLocale)[keyof typeof AppLocale];

export const defaultLocale: AppLocale = AppLocale.EN;

export const supportedLocales: AppLocale[] = [
    AppLocale.EN,
    AppLocale.JA,
];

export const localeLabels: Record<AppLocale, string> = {
    [AppLocale.EN]: 'English',
    [AppLocale.JA]: '日本語',
};
