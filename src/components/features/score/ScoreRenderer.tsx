'use client';

import { useEffect, useRef, useId } from 'react';
import * as abcjs from 'abcjs';
// import { Skeleton } from '@/components/ui/Skeleton'; // removed unused import

interface ScoreRendererProps {
    abc: string;
    width?: number; // Optional: Force width
}

/**
 * [REQ-UI-003] Score Renderer
 * Renders ABC notation as SVG using abcjs.
 */
export default function ScoreRenderer({ abc }: ScoreRendererProps) {
    const scoreRef = useRef<HTMLDivElement>(null);
    const uniqueId = `score-${useId()}`;

    useEffect(() => {
        console.debug('ScoreRenderer: rendering started', { abc });
        if (scoreRef.current && abc) {
            // Render options for responsive layout
            const renderOptions: abcjs.AbcVisualParams = {
                responsive: 'resize', // Auto-resize on window change
                add_classes: true,    // Add classes to elements for styling
                paddingtop: 20,
                paddingbottom: 20,
                paddingleft: 0,
                paddingright: 0,
                // staffwidth will be auto-calculated by 'responsive: resize'
            };
            try {
                console.time('ScoreRender');
                abcjs.renderAbc(uniqueId, abc, renderOptions);
                console.timeEnd('ScoreRender');
                console.debug('ScoreRenderer: rendering completed');
            } catch (error) {
                console.error('ScoreRenderer: rendering error', error);
            }
        }
    }, [abc, uniqueId]);

    return (
        <div className="w-full overflow-hidden">
            <div
                id={uniqueId}
                ref={scoreRef}
                className="w-full bg-white [&_.abcjs-staff]:fill-current [&_.abcjs-note]:fill-current"
            />
            {/* Fallback/Loading is handled by parent, but we could add internal loading state if renderAbc was async */}
        </div>
    );
}
