'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ContentSummary } from '@/domain/content/Content';
import { m } from 'framer-motion';
import { YoutubeMediaAdapter } from '@/infrastructure/content/YoutubeMediaAdapter';
import { useState, useMemo } from 'react';

export interface ContentCardProps {
    content: ContentSummary;
    readMoreLabel: string;
    categoryLabel?: string;
    index?: number;
}

/**
 * Enhanced content card with thumbnail support and premium aesthetics.
 * Prioritizes local thumbnail, falls back to YouTube thumbnail if videoId exists.
 * Now supports internationalized badges for Category and Difficulty.
 */
export function ContentCard({ content, readMoreLabel, categoryLabel, index = 0 }: ContentCardProps) {
    const t = useTranslations('CategoryIndex');
    const { lang, category, slug, metadata } = content;

    // Thumbnail management with fallback
    const initialThumbnail = useMemo(() => {
        let url = metadata.thumbnail;
        if (!url && metadata.audioSrc) {
            url = YoutubeMediaAdapter.getStandardThumbnailUrl(metadata.audioSrc);
        }
        return url || '/images/placeholders/default-content.webp';
    }, [metadata.thumbnail, metadata.audioSrc]);

    const [imgSrc, setImgSrc] = useState(initialThumbnail);
    const [imgErrorCount, setImgErrorCount] = useState(0);

    const handleThumbnailError = () => {
        if (!metadata.audioSrc) return;

        const candidates = YoutubeMediaAdapter.getThumbnailUrlCandidates(metadata.audioSrc);
        // next candidate after the one that failed
        if (imgErrorCount < candidates.length - 1) {
            setImgErrorCount(prev => prev + 1);
            setImgSrc(candidates[imgErrorCount + 1]);
        } else {
            setImgSrc('/images/placeholders/default-content.webp');
        }
    };

    // Labels
    const displayCategory = categoryLabel || (t.has(`categories.${category}`) ? t(`categories.${category}`) : category);

    // Difficulty logic
    const difficultyKey = `difficulty.${metadata.difficulty}`;
    const displayDifficulty = metadata.difficulty
        ? (t.has(difficultyKey) ? t(difficultyKey) : metadata.difficulty)
        : null;

    return (
        <m.div
            className="group overflow-hidden rounded-2xl bg-white border border-divider shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 + (index * 0.05) }}
        >
            {/* Image Area */}
            <Link href={`/${lang}/${category}/${slug}`} className="relative aspect-video overflow-hidden block">
                <Image
                    src={imgSrc}
                    alt={metadata.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={handleThumbnailError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category Badge (Overlay) */}
                <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2.5 py-1 rounded-full text-secondary uppercase tracking-wider shadow-sm">
                        {displayCategory}
                    </span>
                </div>

                {/* Difficulty Badge (Overlay) */}
                {displayDifficulty && (
                    <div className="absolute top-3 right-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full text-white tracking-wider shadow-sm ${metadata.difficulty === 'Beginner' ? 'bg-emerald-500' :
                            metadata.difficulty === 'Intermediate' ? 'bg-amber-500' : 'bg-rose-500'
                            }`}>
                            {displayDifficulty}
                        </span>
                    </div>
                )}
            </Link>

            {/* Content Body */}
            <div className="flex flex-col flex-grow p-5">
                {/* Title */}
                <Link href={`/${lang}/${category}/${slug}`} className="block group-hover:text-primary transition-colors duration-300">
                    <h3 className="text-lg font-bold text-secondary line-clamp-2 leading-tight mb-2">
                        {metadata.title}
                    </h3>
                </Link>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-4">
                    <span>{metadata.date}</span>
                    {metadata.composer && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span>{metadata.composer}</span>
                        </>
                    )}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                        href={`/${lang}/${category}/${slug}`}
                        className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                    >
                        {readMoreLabel}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </m.div>
    );
}
