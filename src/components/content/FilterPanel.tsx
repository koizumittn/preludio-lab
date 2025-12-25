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
    totalCount: number;
}

/**
 * カテゴリ一覧の検索とフィルタリングコントロールを含むパネル。
 * "Premium & Musical" なデザインへの刷新。
 * - 枠線を廃止し、面と余白で階層を表現
 * - ドロップダウンではなくチップ(Tags)による直感的な難易度選択
 * - カプセル型の検索バー
 */
export function FilterPanel({ state, onFilterChange, lang, totalCount }: FilterPanelProps) {
    const t = useTranslations('CategoryIndex');

    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
    const sorts = Object.values(ContentSortOption);

    // Local state for search input to enable debouncing
    const [searchTerm, setSearchTerm] = useState(state.keyword || '');

    // Sync local state
    useEffect(() => {
        setSearchTerm(state.keyword || '');
    }, [state.keyword]);

    const DEBOUNCE_DELAY_MS = 500;
    const debouncedFilterChange = useDebouncedCallback((value: string) => {
        onFilterChange('keyword', value || undefined);
    }, DEBOUNCE_DELAY_MS);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedFilterChange(value);
    };

    const showDifficulty = state.category === 'works' || state.category === 'theory';

    return (
        <div className="w-full mb-10 space-y-6">

            {/* Main Control Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white/60 backdrop-blur-md rounded-[2rem] p-3 shadow-sm border border-white/50">

                {/* Left: Search Input */}
                <div className="relative flex-grow max-w-full lg:max-w-md group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-tertiary group-focus-within:text-primary transition-colors duration-300" />
                    </div>
                    <Input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="pl-11 pr-4 py-3 w-full bg-slate-100/50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 rounded-full transition-all duration-300 placeholder:text-tertiary/70 text-base"
                    />
                </div>

                {/* Right: Controls & Count */}
                <div className="flex flex-col sm:flex-row items-center gap-4">

                    {/* Sort Dropdown (Pill Style) */}
                    <div className="relative w-full sm:w-auto">
                        <select
                            className="w-full sm:w-auto appearance-none bg-white border border-divider hover:border-accent/50 py-3 pl-5 pr-10 rounded-full text-secondary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer shadow-sm hover:shadow-md"
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
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-tertiary">
                            <ChevronDownIcon className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Total Count Badge */}
                    <div className="hidden sm:flex items-center px-4 py-1.5 bg-slate-100 text-tertiary rounded-full text-xs font-semibold tracking-wide uppercase">
                        {totalCount} Items
                    </div>
                </div>
            </div>

            {/* Sub Filter: Difficulty (Chips) */}
            {showDifficulty && (
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 px-2 animate-fade-in-up">
                    <span className="text-sm font-bold text-tertiary/80 mr-1 uppercase tracking-wider text-[11px]">
                        {t('filter.difficulty')}
                    </span>

                    {/* All Chip */}
                    <button
                        onClick={() => onFilterChange('difficulty', undefined)}
                        className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${!state.difficulty
                                ? 'bg-preludio-black text-white shadow-md'
                                : 'bg-white text-secondary hover:bg-slate-100 border border-transparent'
                            }`}
                    >
                        {t('filter.all')}
                    </button>

                    {/* Difficulty Chips */}
                    {difficulties.map((diff) => {
                        const isSelected = state.difficulty === diff;
                        // Color coding based on difficulty
                        let activeColorClass = 'bg-preludio-black text-white';
                        if (diff === 'Beginner') activeColorClass = 'bg-emerald-500 text-white shadow-emerald-200';
                        if (diff === 'Intermediate') activeColorClass = 'bg-amber-500 text-white shadow-amber-200';
                        if (diff === 'Advanced') activeColorClass = 'bg-rose-500 text-white shadow-rose-200';

                        return (
                            <button
                                key={diff}
                                onClick={() => onFilterChange('difficulty', isSelected ? undefined : diff)}
                                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-sm ${isSelected
                                        ? `${activeColorClass} shadow-md`
                                        : 'bg-white text-secondary hover:bg-slate-100'
                                    }`}
                            >
                                {t(`difficulty.${diff}`)}
                            </button>
                        );
                    })}
                </div>
            )}
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
