import * as abcjs from 'abcjs';
import { IScoreRenderer, Score, ScoreFormat } from '@/domain/score/Score';

/**
 * AbcjsScoreRenderer
 * Infrastructure implementation of IScoreRenderer using the 'abcjs' library.
 */
export class AbcjsScoreRenderer implements IScoreRenderer {
    /**
     * Renders the score into the provided element.
     */
    async render(score: Score, element: HTMLElement): Promise<void> {
        if (score.format !== ScoreFormat.ABC) {
            console.warn(`AbcjsScoreRenderer: Unsupported format '${score.format}'. Skipping render.`);
            return;
        }

        if (!element) {
            console.error('AbcjsScoreRenderer: Target element is null.');
            return;
        }

        try {
            // Render options for responsive layout (Encapsulated from Domain)
            const renderOptions: abcjs.AbcVisualParams = {
                responsive: 'resize', // Auto-resize on window change
                add_classes: true,    // Add classes to elements for styling
                paddingtop: 20,
                paddingbottom: 20,
                paddingleft: 0,
                paddingright: 0,
                // staffwidth will be auto-calculated by 'responsive: resize'
            };

            // If a custom title is provided in metadata, we might want to inject it or handle it.
            // For now, abcjs renders title from ABC string. 
            // If we wanted to override, we would need to manipulate the ABC string or use visual options.
            // Current requirement implies just rendering what is given.

            abcjs.renderAbc(element, score.data, renderOptions);

        } catch (error) {
            // Re-throw so the UI layer/controller can handle it (e.g., show toast) or log it here.
            // Since this is Infra, capturing exception here is good for debugging, but we should let upper layer know it failed?
            // "handleClientError" is a utility often used in UI. 
            // For now, let's throw a standardized error or just simple Error.
            throw new Error(`Failed to render ABC score: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
