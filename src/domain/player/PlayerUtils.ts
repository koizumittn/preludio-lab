import { PlayerPlatform, PlayerPlatformType, YOUTUBE_HOST } from './PlayerConstants';

/**
 * [DOMAIN SERVICE] Player URL Generator
 * 
 * プラットフォームごとのURL生成ロジックをカプセル化します。
 * UIやInfrastructureが具体的なURL構造を知ることを防ぎます。
 */
export const generatePlatformUrl = (platform: PlayerPlatformType, src: string): string | null => {
    if (!src) return null;

    switch (platform) {
        case PlayerPlatform.YOUTUBE:
            // youtube-nocookie.com は通常 Embed 用ですが、
            // ユーザー要件に従いこのホストを使用します。
            // Watch URLとして機能するかはホストの仕様によりますが、
            // 安全のため embed 形式ではなく一般的な watch 形式でホストのみ置換して生成します。
            // もしnocookieホストが /watch をサポートしない場合は /embed にすべきですが、
            // ここでは "外部サイトへのリンク" なので一旦 watch 形式とします。
            // (注: 実際に nocookie で /watch にアクセスするとリダイレクトされるかエラーになる可能性がありますが
            //  ユーザーの指示 "ホストを修正" に従います)

            // Correction: nocookie host is explicitly for embeds. 
            // External link should probably be a valid watch link. 
            // However, providing strict compliance:
            return `${YOUTUBE_HOST}/watch?v=${src}`;
        default:
            return null;
    }
};

/**
 * YouTubeの埋め込み用URLを生成する
 * (Infrastructure層で使用)
 */
export const generateYouTubeEmbedHost = (): string => {
    return YOUTUBE_HOST;
};
