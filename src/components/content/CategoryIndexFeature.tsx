'use client';

import { ContentSummary } from '@/domain/content/Content';
import { useFilterState } from '@/hooks/useFilterState';
import { FilterPanel } from './FilterPanel';
import { ContentCard } from './ContentCard';
import { useTranslations } from 'next-intl';
import { FadeInHeading } from '@/components/ui/FadeInHeading';

interface CategoryIndexFeatureProps {
    lang: string;
    category: string;
    contents: ContentSummary[];
}

/**
 * カテゴリ一覧ページのメイン機能コンポーネント。
 * 状態管理、フィルタリングUI、および結果表示を処理します。
 */
export function CategoryIndexFeature({ lang, category, contents }: CategoryIndexFeatureProps) {
    const t = useTranslations('CategoryIndex');
    const { state, setFilter } = useFilterState();

    // Server Component (ページ) から渡される 'contents' は、
    // 'setFilter' (router.push) によって更新された現在の searchParams をすでに反映しています。
    // これにより、SEOに適したフィルタリングとスムーズなクライアント操作が可能になります。

    return (
        <section className="min-h-screen pt-28 pb-20 px-4 md:px-8">
            <div className="container mx-auto max-w-7xl">

                {/* 見出しエリア */}
                <header className="mb-12 text-center">
                    <FadeInHeading className="text-4xl md:text-5xl font-black text-primary mb-4">
                        {t('title', { category: t(`categories.${category}`) })}
                    </FadeInHeading>
                    <p className="text-secondary font-medium tracking-wide">
                        {t('totalCount', { count: contents.length })}
                    </p>
                </header>

                {/* フィルタ & 検索コントロール */}
                <FilterPanel
                    state={state}
                    onFilterChange={setFilter}
                    lang={lang}
                />

                {/* 結果グリッド */}
                {contents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {contents.map((content, idx) => (
                            <ContentCard
                                key={`${content.category}-${content.slug}`}
                                content={content}
                                readMoreLabel={t('readMore')}
                                index={idx}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-paper/30 backdrop-blur-sm rounded-3xl border border-divider/50 border-dashed">
                        <div className="mb-4 text-tertiary">
                            <SearchOffIcon className="w-16 h-16 mx-auto opacity-20" />
                        </div>
                        <p className="text-secondary text-lg font-medium">
                            {t('emptyState')}
                        </p>
                        <button
                            onClick={() => window.location.href = window.location.pathname}
                            className="mt-6 text-sm font-bold text-accent hover:underline"
                        >
                            {t('filter.all')}
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
}

function SearchOffIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m2 2 20 20" />
            <path d="M16.57 11a7 7 0 0 0-9.14-9.14" />
            <path d="M4.43 13a7 7 0 0 0 9.14 9.14" />
            <path d="M18.12 18.12 21 21" />
        </svg>
    );
}
