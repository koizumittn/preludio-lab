import { useEffect, useRef } from 'react';
import { Score } from '@/domain/score/Score';
import { AbcjsScoreRenderer } from '@/infrastructure/score/AbcjsScoreRenderer';
import { handleClientError } from '@/utils/client-error-handler';

/**
 * useScoreRenderer
 * Custom hook to handle score rendering logic.
 * It manages the lifecycle of the renderer and the DOM element.
 */
export function useScoreRenderer(score: Score) {
    const elementRef = useRef<HTMLDivElement>(null);

    // Dependency Injection (simplified)
    // Memoize the renderer to ensure stable reference across renders
    const renderer = useRef(new AbcjsScoreRenderer()).current;

    useEffect(() => {
        let isMounted = true;

        const renderScore = async () => {
            if (!elementRef.current || !score) return;

            try {
                if (process.env.NODE_ENV === 'development') {
                    console.debug('useScoreRenderer: rendering started', { format: score.format });
                }

                await renderer.render(score, elementRef.current);

                if (isMounted && process.env.NODE_ENV === 'development') {
                    console.debug('useScoreRenderer: rendering completed');
                }
            } catch (error) {
                if (isMounted) {
                    handleClientError(error, 'Failed to render score');
                }
            }
        };

        renderScore();

        return () => {
            isMounted = false;
        };
    }, [score, renderer]);

    return { elementRef };
}
