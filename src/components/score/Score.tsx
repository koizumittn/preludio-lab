'use client';

import { useId } from 'react';
import { Score } from '@/domain/score/Score';
import { useScoreRenderer } from './useScoreRenderer';

interface ScoreProps {
    score: Score;
    className?: string; // Allow external styling
}

/**
 * Score View Component
 * A pure view component that renders a musical score.
 * It uses the 'useScoreRenderer' hook to handle the actual rendering logic.
 */
export function ScoreComponent({ score, className }: ScoreProps) {
    const uniqueId = `score-${useId()}`;
    const { elementRef } = useScoreRenderer(score);

    return (
        <div className={`w-full overflow-hidden ${className || ''}`}>
            <div
                id={uniqueId}
                ref={elementRef}
                className="w-full bg-white [&_.abcjs-staff]:fill-current [&_.abcjs-note]:fill-current"
            />
        </div>
    );
}

// Named export to match guideline
export { ScoreComponent as Score };
