/**
 * Preludio Lab でサポートされるロケール定義。
 * このファイルはドメイン層における言語定義の「信頼できる唯一の情報源 (Source of Truth)」として機能します。
 */

export const AppLocale = {
    /** 英語 (デフォルト) - 国際的な主要言語 */
    EN: 'en',
    /** 日本語 - 開発者の母国語であり、主要なターゲット */
    JA: 'ja',
    // 将来的な拡張
    // ES: 'es',
    // DE: 'de',
    // FR: 'fr',
    // IT: 'it',
    // ZH: 'zh',
} as const;

/**
 * アプリケーション内で使用可能な言語コードの型定義。
 * `typeof AppLocale` の値（'en' | 'ja'）のユニオン型です。
 */
export type AppLocale = (typeof AppLocale)[keyof typeof AppLocale];

/**
 * デフォルトの言語設定。
 * URLにロケールが含まれない場合や、非サポート言語へのアクセス時にフォールバックとして使用されます。
 */
export const defaultLocale: AppLocale = AppLocale.EN;

/**
 * サポートされている全言語の配列。
 * ルーティングやミドルウェアの設定で使用されます。
 */
export const supportedLocales: AppLocale[] = [
    AppLocale.EN,
    AppLocale.JA,
];

/**
 * UI表示用の言語ラベル定義。
 * 言語切り替えスイッチャーなどで使用されます。
 */
export const localeLabels: Record<AppLocale, string> = {
    [AppLocale.EN]: 'English',
    [AppLocale.JA]: '日本語',
};
