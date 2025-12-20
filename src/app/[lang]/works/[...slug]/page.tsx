import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import rehypeSlug from 'rehype-slug';
import GithubSlugger from 'github-slugger';
import { MdxLink } from '@/components/mdx/MdxLink';
import { TableOfContents } from '@/components/content/TableOfContents';
import { SeriesNavigation } from '@/components/content/SeriesNavigation';
import ScoreRenderer from '@/components/score';
import { WorkPlayerPlaceholder } from '@/components/content/work/WorkPlayerPlaceholder';
import { ListeningGuide } from '@/components/content/work/ListeningGuide';
// ... (imports remain)
import { FsContentRepository } from '@/infrastructure/content/FsContentRepository';



// Supported languages
const languages = ['en', 'ja', 'es', 'de', 'fr', 'it', 'zh'];

export async function generateStaticParams() {
    const params: { lang: string; slug: string[] }[] = [];
    // Instantiate locally to avoid stale state if server runs long
    const repository = new FsContentRepository();

    for (const lang of languages) {
        // Use lightweight summary for build params
        const contents = await repository.getAllContentSummaries(lang, 'works');
        for (const content of contents) {
            params.push({
                lang,
                slug: content.slug.split('/'),
            });
        }
    }

    return params;
}

// Utility to extract headings
function extractHeadings(content: string) {
    const slugger = new GithubSlugger();
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const headings = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2];
        const slug = slugger.slug(text);
        headings.push({ level, text, slug });
    }

    return headings;
}


// ... imports

export default async function WorkPage({
    params,
}: {
    params: Promise<{ lang: string; slug: string[] }>;
}) {
    const repository = new FsContentRepository();
    const { lang, slug } = await params;

    // Fetch Content Detail
    // content (body) is required for rendering MDX
    const content = await repository.getContentDetailBySlug(lang, 'works', slug);

    if (!content) {
        notFound();
    }

    const toc = extractHeadings(content.body);

    // Series Navigation Logic
    // Use metadata-only query for navigation finding (lighter)
    const allContents = await repository.getAllContentSummaries(lang, 'works');
    // Simple sort by title for now, or use metadata order if available
    const sortedContents = allContents.sort((a, b) => a.metadata.title.localeCompare(b.metadata.title));
    const currentIndex = sortedContents.findIndex((c) => c.slug === content.slug);
    const prevContent = currentIndex > 0 ? sortedContents[currentIndex - 1] : null;
    const nextContent = currentIndex < sortedContents.length - 1 ? sortedContents[currentIndex + 1] : null;

    // Construct AudioMetadata from Metadata
    const audioMetadata = content.metadata.videoId ? {
        videoId: content.metadata.videoId,
        title: content.metadata.title,
        composer: content.metadata.composer,
        performer: content.metadata.performer,
        artworkSrc: content.metadata.artworkSrc,
        startSeconds: content.metadata.startSeconds,
        endSeconds: content.metadata.endSeconds,
        // Legacy (optional mapping if wrapper needs it, but wrapper prefers startSeconds now)
        // startTime: content.metadata.startSeconds,
        platformType: 'youtube' as const,
    } : undefined;

    // Custom components for MDX (defined here to capture audioMetadata)
    const components = {
        a: MdxLink,
        pre: (props: any) => {
            // Check if the child is a code element with language-abc class
            const codeProps = props.children?.props;
            const className = codeProps?.className || '';

            if (className.includes('language-abc')) {
                return (
                    <div className="my-10 not-prose p-6 bg-neutral-100 rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                        <ScoreRenderer
                            abc={codeProps.children}
                            audioMetadata={audioMetadata}
                        />
                    </div>
                );
            }

            return <pre {...props} />;
        },
        ScoreRenderer,
    };

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
            {/* Breadcrumbs */}
            <nav className="text-sm text-neutral-500 mb-8 flex items-center gap-2">
                <Link href={`/${lang}`} className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <Link href={`/${lang}/works`} className="hover:text-primary transition-colors">Works</Link>
                <span>/</span>
                <span className="text-primary font-medium truncate">{content.metadata.title}</span>
            </nav>

            {/* Header (Full Width) */}
            <header className="mb-12 border-b border-neutral-200 pb-8">
                <div className="flex flex-col gap-4">
                    {/* Category Badge */}
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 tracking-wider uppercase">
                            Work Analysis
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary font-serif leading-tight max-w-4xl">
                        {content.metadata.title}
                    </h1>

                    {/* Metadata Row: Composer & Key */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-lg text-neutral-700">
                        <div>
                            <span className="font-bold text-primary">Composer:</span>{' '}
                            <span className="font-serif italic">{content.metadata.composer}</span>
                        </div>
                        {content.metadata.key && (
                            <div>
                                <span className="font-bold text-primary">Key:</span>{' '}
                                <span>{content.metadata.key}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tags & Difficulty */}
                <div className="flex flex-wrap gap-3 mt-6">
                    {content.metadata.difficulty && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200 shadow-sm">
                            {content.metadata.difficulty}
                        </span>
                    )}
                    {content.metadata.tags?.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-500 border border-neutral-200">
                            #{tag}
                        </span>
                    ))}
                </div>
            </header>

            {/* Content Body (Grid Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                <article className="lg:col-span-7 prose prose-lg prose-slate dark:prose-invert">
                    {/* Mobile Sidebar (Visible < lg) */}
                    <div className="lg:hidden mb-12 space-y-8">
                        <WorkPlayerPlaceholder />

                        <details className="group bg-neutral-50 rounded-xl overflow-hidden border border-neutral-200">
                            <summary className="flex items-center justify-between p-4 font-medium text-primary cursor-pointer list-none hover:bg-neutral-100 transition-colors">
                                <span>Table of Contents</span>
                                <span className="transition-transform group-open:rotate-180">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </span>
                            </summary>
                            <div className="p-4 pt-0 border-t border-neutral-100">
                                <TableOfContents items={toc} variant="minimal" />
                            </div>
                        </details>
                    </div>

                    <MDXRemote
                        source={content.body}
                        components={components}
                        options={{
                            mdxOptions: {
                                rehypePlugins: [rehypeSlug],
                            },
                        }}
                    />

                    <div className="mt-12 pt-8 border-t border-neutral-200">
                        <SeriesNavigation prev={prevContent} next={nextContent} lang={lang} />
                    </div>
                </article>

                {/* Sidebar (Right Col) */}
                <aside className="hidden lg:block lg:col-span-4 lg:col-start-9">
                    <div className="sticky top-24 space-y-8">
                        <div>
                            <WorkPlayerPlaceholder />
                            <ListeningGuide />
                        </div>
                        <div>
                            <TableOfContents items={toc} />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
