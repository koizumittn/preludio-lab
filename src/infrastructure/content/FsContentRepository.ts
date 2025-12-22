import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ContentDetail, ContentSummary, MetadataSchema } from '@/domain/content/Content';
import { IContentRepository } from '@/domain/content/ContentRepository';
import { SUPPORTED_CATEGORIES } from '@/domain/content/ContentConstants';
import { ILogger } from '@/domain/shared/logger';
import { PinoLogger } from '@/infrastructure/logging/pino-logger';

/**
 * ファイルシステム（FS）ベースのコンテンツリポジトリ実装
 * content フォルダ配下の MDX ファイルを読み込み、ドメインオブジェクトに変換する
 */
export class FsContentRepository implements IContentRepository {
    private readonly contentDirectory: string;
    private readonly logger: ILogger;

    constructor() {
        this.contentDirectory = path.join(process.cwd(), 'content');
        this.logger = new PinoLogger();
    }

    /**
     * 指定された言語、カテゴリ、スラグから単一のコンテンツ詳細を取得する
     */
    async getContentDetailBySlug(lang: string, category: string, slug: string[]): Promise<ContentDetail | null> {
        const slugPath = slug.join('/');
        const fullPath = path.join(this.contentDirectory, lang, category, `${slugPath}.mdx`);

        try {
            if (!fs.existsSync(fullPath)) {
                this.logger.warn(`File not found: ${fullPath}`, { context: 'FsContentRepository' });
                return null;
            }

            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            // メタデータのバリデーション（Zodスキーマを使用）
            const metadata = MetadataSchema.parse(data);

            return {
                slug: slugPath,
                lang,
                category,
                metadata,
                body: content,
            };
        } catch (error) {
            this.logger.error(`Markdownファイルの読み込みエラー: ${fullPath}`, error as Error, { context: 'FsContentRepository' });
            return null;
        }
    }

    /**
     * 指定されたカテゴリの全コンテンツ詳細（本文含む）を取得する
     */
    async getContentDetailsByCategory(lang: string, category: string): Promise<ContentDetail[]> {
        const categoryPath = path.join(this.contentDirectory, lang, category);
        const files = this.getMdxFiles(categoryPath);

        const contents = files.map((filePath) => {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data, content } = matter(fileContents);

            // カテゴリルートからの相対パスに基づいてスラグを算出
            const relativePath = path.relative(categoryPath, filePath);
            const slug = relativePath.replace(/\.mdx$/, '');

            try {
                const metadata = MetadataSchema.parse(data);
                return {
                    slug,
                    lang,
                    category,
                    metadata,
                    body: content,
                };
            } catch (e) {
                this.logger.warn(`Invalid metadata in ${filePath}`, { context: 'FsContentRepository', error: e });
                return null;
            }
        })
            .filter((content): content is ContentDetail => content !== null);

        return contents;
    }

    /**
     * 指定されたカテゴリの全コンテンツ概要（本文なし）を取得する
     * ※一覧表示や軽量なデータアクセスに使用する
     */
    async getContentSummariesByCategory(lang: string, category: string): Promise<ContentSummary[]> {
        const categoryPath = path.join(this.contentDirectory, lang, category);
        const files = this.getMdxFiles(categoryPath);

        const contents = files.map((filePath) => {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            // gray-matterでパース。概要一覧では本文（content）を保持しないことで
            // メモリ消費を抑える。
            const { data } = matter(fileContents);

            // カテゴリルートからの相対パスに基づいてスラグを算出
            const relativePath = path.relative(categoryPath, filePath);
            const slug = relativePath.replace(/\.mdx$/, '');

            try {
                const metadata = MetadataSchema.parse(data);
                return {
                    slug,
                    lang,
                    category,
                    metadata,
                };
            } catch (e) {
                this.logger.warn(`Invalid metadata in ${filePath}`, { context: 'FsContentRepository', error: e });
                return null;
            }
        })
            .filter((content): content is ContentSummary => content !== null);

        return contents;
    }

    async getLatestContentSummariesByCategory(lang: string, category: string, limit: number): Promise<ContentSummary[]> {
        // 全件取得してからソート・制限を行う（FS実装としてはこれで十分。DB実装時にSQLで最適化される）
        const allSummaries = await this.getContentSummariesByCategory(lang, category);

        return allSummaries
            .sort((a, b) => {
                const dateA = a.metadata.date ? new Date(a.metadata.date).getTime() : 0;
                const dateB = b.metadata.date ? new Date(b.metadata.date).getTime() : 0;
                return dateB - dateA;
            })
            .slice(0, limit);
    }

    async getLatestContentSummaries(lang: string, limit: number): Promise<ContentSummary[]> {
        // 全カテゴリから、必要な件数分だけ最新記事を取得する
        // インフラ層でループ処理を行うことで、アプリ層は「全件取得」の手段を意識しなくて済む
        const allContentsPromises = SUPPORTED_CATEGORIES.map(async (category) => {
            return this.getLatestContentSummariesByCategory(lang, category, limit);
        });

        const nestedResults = await Promise.all(allContentsPromises);
        const allContents = nestedResults.flat();

        if (allContents.length === 0) {
            return [];
        }

        const sorted = allContents.sort((a, b) => {
            const dateA = a.metadata.date ? new Date(a.metadata.date).getTime() : 0;
            const dateB = b.metadata.date ? new Date(b.metadata.date).getTime() : 0;
            return dateB - dateA;
        });

        return sorted.slice(0, limit);
    }

    /**
     * 指定されたディレクトリから、再帰的にすべての .mdx ファイルのパスを取得する
     */
    private getMdxFiles(dir: string): string[] {
        if (!fs.existsSync(dir)) {
            return [];
        }
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        const files = entries.map((entry) => {
            const res = path.resolve(dir, entry.name);
            return entry.isDirectory() ? this.getMdxFiles(res) : res;
        });
        return Array.prototype.concat(...files).filter((file: string) => file.endsWith('.mdx'));
    }
}
