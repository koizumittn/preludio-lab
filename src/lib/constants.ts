export const SITE_NAME = 'PreludioLab';
export const SITE_DESCRIPTION = 'Beyond Listening. Dive deeper into the classics.';
export const LOCALES = ['ja', 'en', 'es', 'de', 'zh', 'fr', 'it'] as const;
export type Locale = (typeof LOCALES)[number];
