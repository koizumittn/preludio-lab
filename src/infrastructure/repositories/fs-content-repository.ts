import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ContentDetail, ContentSummary, MetadataSchema } from '@/domain/entities/content';
import { IContentRepository } from '@/domain/repositories/content-repository.interface';

export class FsContentRepository implements IContentRepository {
    private readonly contentDirectory: string;

    constructor() {
        this.contentDirectory = path.join(process.cwd(), 'content');
    }

    async getContentDetailBySlug(lang: string, category: string, slug: string[]): Promise<ContentDetail | null> {
        const slugPath = slug.join('/');
        const fullPath = path.join(this.contentDirectory, lang, category, `${slugPath}.mdx`);

        try {
            if (!fs.existsSync(fullPath)) {
                return null;
            }

            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            // Validate metadata
            const metadata = MetadataSchema.parse(data);

            return {
                slug: slugPath,
                lang,
                category,
                metadata,
                body: content,
            };
        } catch (error) {
            console.error(`Error loading markdown file ${fullPath}:`, error);
            return null;
        }
    }

    async getAllContentDetails(lang: string, category: string): Promise<ContentDetail[]> {
        const categoryPath = path.join(this.contentDirectory, lang, category);
        const files = this.getMdxFiles(categoryPath);

        const contents = files.map((filePath) => {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data, content } = matter(fileContents);

            // Calculate slug relative to category root
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
                console.warn(`Invalid metadata in ${filePath}`, e);
                return null;
            }
        })
            .filter((content): content is ContentDetail => content !== null);

        return contents;
    }

    async getAllContentSummaries(lang: string, category: string): Promise<ContentSummary[]> {
        const categoryPath = path.join(this.contentDirectory, lang, category);
        const files = this.getMdxFiles(categoryPath);

        const contents = files.map((filePath) => {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            // gray-matter parses the string. Even if we read the file, NOT storing 'content' in the
            // array helps memory significantly for large lists.
            const { data } = matter(fileContents);

            // Calculate slug relative to category root
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
                console.warn(`Invalid metadata in ${filePath}`, e);
                return null;
            }
        })
            .filter((content): content is ContentSummary => content !== null);

        return contents;
    }

    private getMdxFiles(dir: string): string[] {
        if (!fs.existsSync(dir)) return [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        const files = entries.map((entry) => {
            const res = path.resolve(dir, entry.name);
            return entry.isDirectory() ? this.getMdxFiles(res) : res;
        });
        return Array.prototype.concat(...files).filter((file: string) => file.endsWith('.mdx'));
    }
}
