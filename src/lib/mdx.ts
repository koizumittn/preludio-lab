import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';

const contentDirectory = path.join(process.cwd(), 'content');

// Define the Frontmatter schema using Zod
const FrontmatterSchema = z.object({
    title: z.string(),
    composer: z.string().optional(),
    work: z.string().optional(),
    key: z.string().optional(),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    tags: z.array(z.string()).optional(),
    videoId: z.string().optional(),
    performer: z.string().optional(),
    artworkSrc: z.string().optional(),
    startTime: z.number().optional(),
    endTime: z.number().optional(),
    ogp_excerpt: z.string().optional(),
    date: z.string().optional(), // YYYY-MM-DD
});

export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export type Post = {
    slug: string;
    lang: string;
    category: string;
    frontmatter: Frontmatter;
    content: string;
};

// Helper to recursively find all MDX files
function getMdxFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = entries.map((entry) => {
        const res = path.resolve(dir, entry.name);
        return entry.isDirectory() ? getMdxFiles(res) : res;
    });
    // optimize: flatten array with depth 1 is usually enough if recursive but let's use flat(Infinity) logic standard
    return Array.prototype.concat(...files).filter((file) => file.endsWith('.mdx'));
}

export async function getPostBySlug(lang: string, category: string, slug: string[]): Promise<Post | null> {
    const slugPath = slug.join('/');
    const fullPath = path.join(contentDirectory, lang, category, `${slugPath}.mdx`);

    try {
        if (!fs.existsSync(fullPath)) {
            return null;
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        // Validate frontmatter
        const frontmatter = FrontmatterSchema.parse(data);

        return {
            slug: slugPath,
            lang,
            category,
            frontmatter,
            content,
        };
    } catch (error) {
        console.error(`Error loading markdown file ${fullPath}:`, error);
        return null;
    }
}

export async function getAllPosts(lang: string, category: string): Promise<Post[]> {
    const categoryPath = path.join(contentDirectory, lang, category);
    const files = getMdxFiles(categoryPath);

    const posts = files.map((filePath) => {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        // Calculate slug relative to category root
        // e.g. /abs/path/to/content/en/works/bach/prelude.mdx -> bach/prelude
        const relativePath = path.relative(categoryPath, filePath);
        const slug = relativePath.replace(/\.mdx$/, '');

        try {
            const frontmatter = FrontmatterSchema.parse(data);
            return {
                slug, // Keep as string "dir/file"
                lang,
                category,
                frontmatter,
                content,
            };
        } catch (e) {
            console.warn(`Invalid frontmatter in ${filePath}`, e);
            return null;
        }
    })
        .filter((post): post is Post => post !== null); // Type guard

    return posts;
}
