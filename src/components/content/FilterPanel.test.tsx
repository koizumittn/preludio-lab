import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterPanel } from './FilterPanel';
import { FilterState } from '@/hooks/useFilterState';
import { ContentSortOption } from '@/domain/content/ContentConstants';

// Mock next-intl
vi.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    AnimatePresence: ({ children }: any) => <div data-testid="animate-presence">{children}</div>,
    m: {
        div: ({ children, className, onClick }: any) => (
            <div className={className} onClick={onClick} data-testid="motion-div">
                {children}
            </div>
        ),
    },
}));

// Mock use-debounce to execute immediately
vi.mock('use-debounce', () => ({
    useDebouncedCallback: (fn: Function) => fn,
}));

describe('FilterPanel', () => {
    const mockOnFilterChange = vi.fn();
    const defaultState: FilterState = {
        category: 'works',
        keyword: '',
        difficulty: 'all',
        sort: ContentSortOption.LATEST,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly with initial state', () => {
        render(
            <FilterPanel
                state={defaultState}
                onFilterChange={mockOnFilterChange}
                lang="en"
                totalCount={10}
            />
        );

        expect(screen.getByPlaceholderText('searchPlaceholder')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('triggers onFilterChange when typing in search input', async () => {
        const user = userEvent.setup();

        render(
            <FilterPanel
                state={defaultState}
                onFilterChange={mockOnFilterChange}
                lang="en"
                totalCount={10}
            />
        );

        const input = screen.getByPlaceholderText('searchPlaceholder');
        await user.type(input, 'Bach');

        expect(mockOnFilterChange).toHaveBeenCalledWith('keyword', 'Bach');
    });

    it('clears search term when clear button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <FilterPanel
                state={{ ...defaultState, keyword: 'Bach' }}
                onFilterChange={mockOnFilterChange}
                lang="en"
                totalCount={10}
            />
        );

        const clearBtn = screen.getByLabelText('Clear search');
        await user.click(clearBtn);

        expect(mockOnFilterChange).toHaveBeenCalledWith('keyword', undefined);
    });

    it('changes difficulty when chip is clicked', async () => {
        const user = userEvent.setup();
        render(
            <FilterPanel
                state={defaultState}
                onFilterChange={mockOnFilterChange}
                lang="en"
                totalCount={10}
            />
        );

        const beginnerChip = screen.getByText('difficulty.Beginner');
        await user.click(beginnerChip);

        expect(mockOnFilterChange).toHaveBeenCalledWith('difficulty', 'Beginner');
    });

    it('toggles sort dropdown and selects option', async () => {
        const user = userEvent.setup();
        render(
            <FilterPanel
                state={defaultState}
                onFilterChange={mockOnFilterChange}
                lang="en"
                totalCount={10}
            />
        );

        // Open dropdown
        const trigger = screen.getByText(`sort.${ContentSortOption.LATEST}`);
        await user.click(trigger);

        // Select OLDEST
        const oldestOption = screen.getByText(`sort.${ContentSortOption.OLDEST}`);
        await user.click(oldestOption);

        expect(mockOnFilterChange).toHaveBeenCalledWith('sort', ContentSortOption.OLDEST);
    });
});
