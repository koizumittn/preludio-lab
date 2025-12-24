import { useTranslations } from 'next-intl';
import { FilterState } from '@/hooks/useFilterState';
import { ContentSortOption } from '@/domain/content/ContentConstants';

interface FilterPanelProps {
    state: FilterState;
    onFilterChange: (key: keyof FilterState, value: string | string[] | undefined) => void;
    lang: string;
}

/**
 * A panel containing search and filter controls for the category index.
 */
export function FilterPanel({ state, onFilterChange, lang }: FilterPanelProps) {
    const t = useTranslations('CategoryIndex');

    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
    const sorts = Object.values(ContentSortOption);

    return (
        <div className="bg-paper shadow-sm border border-divider rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Search Input */}
                <div className="space-y-2">
                    <label htmlFor="search" className="text-sm font-medium text-secondary ml-1">
                        {t('filter.all')}
                    </label>
                    <div className="relative">
                        <input
                            id="search"
                            type="text"
                            className="w-full bg-white border border-divider rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all pl-10"
                            placeholder={t('searchPlaceholder')}
                            value={state.keyword || ''}
                            onChange={(e) => onFilterChange('keyword', e.target.value)}
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                    </div>
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-2">
                    <label htmlFor="difficulty" className="text-sm font-medium text-secondary ml-1">
                        {t('filter.difficulty')}
                    </label>
                    <select
                        id="difficulty"
                        className="w-full bg-white border border-divider rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all appearance-none cursor-pointer"
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
                </div>

                {/* Sort Order */}
                <div className="space-y-2">
                    <label htmlFor="sort" className="text-sm font-medium text-secondary ml-1">
                        {t('sort.label')}
                    </label>
                    <select
                        id="sort"
                        className="w-full bg-white border border-divider rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all appearance-none cursor-pointer"
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
                </div>

            </div>
        </div>
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
