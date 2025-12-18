import { ContentDetail, ContentSummary } from '@/domain/entities/content';

/**
 * コンテンツデータへのアクセスを抽象化するリポジトリインターフェース
 * Clean Architectureの原則に従い、特定のデータソース（ファイルシステム、CMS、DBなど）に依存しない定義とする。
 */
export interface IContentRepository {
    /**
     * 指定されたスラッグに対応するコンテンツ詳細（body含む）を取得する
     * @param slug URLパスの配列 (例: ['bach', 'prelude'])
     */
    getContentDetailBySlug(lang: string, category: string, slug: string[]): Promise<ContentDetail | null>;

    /**
     * 指定された言語・カテゴリのコンテンツ詳細一覧（body含む）を取得する
     * ※要注意: 全ファイルの本文を読み込むため、大規模なデータセットではパフォーマンスに影響する可能性がある。
     * 通常は getAllContentSummaries を使用すること。
     */
    getAllContentDetails(lang: string, category: string): Promise<ContentDetail[]>;

    /**
     * 指定された言語・カテゴリのコンテンツ概要一覧（メタデータのみ）を取得する
     * 本文(body)は含まれない。一覧表示やナビゲーション生成などの軽量な処理に使用する。
     */
    getAllContentSummaries(lang: string, category: string): Promise<ContentSummary[]>;
}
