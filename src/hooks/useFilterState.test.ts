import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilterState } from './useFilterState';
import { handleClientError } from '@/lib/client-error';

// Mock next/navigation
const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
    usePathname: () => '/en/works',
    useSearchParams: () => mockSearchParams,
}));

// Mock error handler
vi.mock('@/lib/client-error', () => ({
    handleClientError: vi.fn(),
}));

describe('useFilterState', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset search params
        const keys = Array.from(mockSearchParams.keys());
        keys.forEach(key => mockSearchParams.delete(key));
    });

    it('initializes state from URL params', () => {
        mockSearchParams.set('keyword', 'Bach');
        mockSearchParams.set('difficulty', 'Advanced');

        const { result } = renderHook(() => useFilterState());

        expect(result.current.state).toEqual({
            category: 'works',
            keyword: 'Bach',
            difficulty: 'Advanced',
            sort: 'latest', // Default
            tags: [], // Default
        });
    });

    it('updates filter via setFilter (router.push)', () => {
        const { result } = renderHook(() => useFilterState());

        act(() => {
            result.current.setFilter('keyword', 'Mozart');
        });

        // Current param was empty used in hook init. 
        // setFilter creates NEW URLSearchParams from current + change.
        // It does NOT update the mockSearchParams reference instantly (unless I mock that behavior but here checking push arg is enough)

        // Expected URL: /en/works?keyword=Mozart
        expect(mockPush).toHaveBeenCalledWith('/en/works?keyword=Mozart', { scroll: false });
    });

    it('clears filter clears all params', () => {
        const { result } = renderHook(() => useFilterState());

        act(() => {
            result.current.clearFilters();
        });

        expect(mockPush).toHaveBeenCalledWith('/en/works', { scroll: false });
    });

    it('handles arrays in setFilter (tags)', () => {
        const { result } = renderHook(() => useFilterState());

        act(() => {
            result.current.setFilter('tags', ['piano', 'violin']);
        });

        // /en/works?tags=piano%2Cviolin
        expect(mockPush).toHaveBeenCalledWith(
            expect.stringContaining('tags=piano%2Cviolin'),
            { scroll: false }
        );
    });

    it('calls error handler if router.push fails', () => {
        // Mock push to throw
        mockPush.mockImplementationOnce(() => {
            throw new Error('Nav Error');
        });

        const { result } = renderHook(() => useFilterState());

        act(() => {
            result.current.setFilter('keyword', 'Error');
        });

        expect(handleClientError).toHaveBeenCalledWith(expect.any(Error), undefined, 'useFilterState:setFilter');
    });
});
