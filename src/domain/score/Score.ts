/**
 * Score Format Constants
 * Defines supported notation formats.
 */
export const ScoreFormat = {
    ABC: 'abc',
    MUSICXML: 'musicxml', // Future support
} as const;

export type ScoreFormatType = typeof ScoreFormat[keyof typeof ScoreFormat];

/**
 * Score Entity
 * Represents a musical score agnostic of the specific notation format.
 */
export interface Score {
    format: ScoreFormatType;
    data: string; // The raw string content (ABC string, XML string, etc.)

    // Metadata (Optional)
    // Used when metadata is not included in the raw data or needs to be overridden/supplemented by the application.
    title?: string;
}

/**
 * IScoreRenderer Interface
 * Abstract interface for a score rendering engine.
 * Implementations in the Infrastructure layer will handle specific libraries (e.g., abcjs).
 */
export interface IScoreRenderer {
    /**
     * Renders the score into the provided HTML element.
     * @param score The score entity to render.
     * @param element The container HTML element.
     */
    render(score: Score, element: HTMLElement): Promise<void>;
}
