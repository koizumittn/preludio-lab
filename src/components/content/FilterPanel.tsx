import { useTranslations } from 'next-intl';
import { FilterState } from '@/hooks/useFilterState';
import { ContentSortOption } from '@/domain/content/ContentConstants';
import { Input } from '@/components/ui/Input';
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from 'react';

interface FilterPanelProps {
    state: FilterState;
    onFilterChange: (key: keyof FilterState, value: string | string[] | undefined) => void;
    lang: string;
}

/**
 * カテゴリ一覧の検索とフィルタリングコントロールを含むパネル。
 */
export function FilterPanel({ state, onFilterChange, lang }: FilterPanelProps) {
    const t = useTranslations('CategoryIndex');

    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
    const sorts = Object.values(ContentSortOption);

    // Local state for search input to enable debouncing
    const [searchTerm, setSearchTerm] = useState(state.keyword || '');

    // Sync local state when parent state changes (e.g. via URL direct access)
    useEffect(() => {
        setSearchTerm(state.keyword || '');
    }, [state.keyword]);

    // 検索入力のデバウンス遅延時間（ミリ秒）
    // ユーザーが入力を終えたとみなすまでの待機時間。
    // 短すぎると頻繁なURL更新が発生し、長すぎると反応が遅く感じるため、500msに設定。
    const DEBOUNCE_DELAY_MS = 500;

    // Debounced filter update
    const debouncedFilterChange = useDebouncedCallback((value: string) => {
        onFilterChange('keyword', value || undefined);
    }, DEBOUNCE_DELAY_MS);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedFilterChange(value);
    };

    return (
        <div className="bg-paper shadow-sm border border-divider rounded-2xl p-6 mb-8">
            <div className={`grid grid-cols-1 ${(state.category === 'works' || state.category === 'theory') ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>

                {/* 検索入力 */}
                <div className="space-y-2">
                    <label htmlFor="search" className="text-sm font-medium text-secondary ml-1">
                        {t('filter.title')}
                    </label>
                    <div className="relative">
                        <Input
                            id="search"
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="pl-10 h-11 bg-white/50 border-divider focus:bg-white transition-all shadow-sm"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary pointer-events-none" />
                    </div>
                </div>

                {/* 難易度フィルタ (Works または Theory カテゴリのみ表示) */}
                {(state.category === 'works' || state.category === 'theory') && (
                    <div className="space-y-2">
                        <label htmlFor="difficulty" className="text-sm font-medium text-secondary ml-1">
                            {t('filter.difficulty')}
                        </label>
                        <div className="relative">
                            <select
                                id="difficulty"
                                className="w-full bg-white/50 border border-divider rounded-xl px-4 py-2.5 h-11 outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/40 focus:bg-white transition-all appearance-none cursor-pointer shadow-sm text-sm"
                                value={state.difficulty || ''}
                                onChange={(e) => onFilterChange('difficulty', e.target.value || undefined)}
                            >
                                <option value="">{t('filter.all')}</option>
                                {difficulties.map((diff) => (
                                    <option key={diff} value={diff}>
                                        {t(`difficulty.${diff}`)}
                                    </option>
                                ))}
                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary pointer-events-none" />
                        </div>
                    </div>
                )}

                {/* 並び順 */}
                <div className="space-y-2">
                    <label htmlFor="sort" className="text-sm font-medium text-secondary ml-1">
                        {t('sort.label')}
                    </label>
                    <div className="relative">
                        <select
                            id="sort"
                            className="w-full bg-white/50 border border-divider rounded-xl px-4 py-2.5 h-11 outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/40 focus:bg-white transition-all appearance-none cursor-pointer shadow-sm text-sm"
                            value={state.sort || ContentSortOption.LATEST}
                            onChange={(e) => onFilterChange('sort', e.target.value)}
                        >
                            {sorts
                                .filter(s => s !== ContentSortOption.POPULAR && s !== ContentSortOption.TRENDING)
                                .map((sort) => (
                                    <option key={sort} value={sort}>
                                        {t(`sort.${sort}`)}
                                    </option>
                                ))
                            }
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary pointer-events-none" />
                    </div>
                </div>

            </div>
        </div>
    );
}

function ChevronDownIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

function SearchIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}
