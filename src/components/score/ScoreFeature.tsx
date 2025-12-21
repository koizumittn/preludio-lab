'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';
import { Score, ScoreFormat } from '@/domain/score/Score';
// We avoid importing Player types to keep Domain Decoupling.
// Instead we define what this feature produces/consumes.

const ScoreView = dynamic(
    () => import('./Score').then(mod => mod.Score),
    {
        ssr: false,
        loading: () => (
            <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
                <div className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <div className="flex gap-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                </div>
            </div>
        )
    }
);

export interface ScoreAudioMetadata {
    title?: string;
    composer?: string;
    performer?: string;
    src?: string; // Generic source identifier (url or videoId)
    platform?: string; // 'youtube', 'file', etc.
    platformUrl?: string;
    platformLabel?: string;
    artworkSrc?: string;
    startSeconds?: number;
    endSeconds?: number;
}

interface ScoreFeatureProps {
    abc: string;
    /**
     * External metadata provided by the parent (e.g. from MDX Frontmatter)
     */
    baseAudioMetadata?: ScoreAudioMetadata;
    /**
     * Callback when the user requests to play the audio associated with this score.
     * The metadata passed here is a merge of baseMetadata and directives found in ABC.
     */
    onPlayRequest?: (metadata: ScoreAudioMetadata) => void;
}

/**
 * ScoreFeature
 * The main entry point for the Score functionality.
 * Responsibilities:
 * 1. Parse ABC directives (%%audio_*) to extract embedded metadata.
 * 2. Merge with external metadata.
 * 3. transform raw string to Score Entity.
 * 4. Render the purely visual Score component.
 * 5. Handle "Play" interaction by notifying the parent (Decoupled form Player implementation).
 */
export function ScoreFeature({ abc, baseAudioMetadata, onPlayRequest }: ScoreFeatureProps) {

    /**
     * Parses custom ABC directives (%%audio_*)
     */
    const parseAudioDirectives = (abcContent: string): Partial<ScoreAudioMetadata> => {
        const directives: any = {};
        const lines = abcContent.split('\n');

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed.startsWith('%%audio_')) return;

            const parts = trimmed.split(/\s+/);
            const key = parts[0];
            const valueStr = parts.slice(1).join(' ');

            switch (key) {
                case '%%audio_startTime':
                case '%%audio_startSeconds':
                    const start = parseFloat(valueStr);
                    if (!isNaN(start)) directives.startSeconds = start;
                    break;
                case '%%audio_endTime':
                case '%%audio_endSeconds':
                    const end = parseFloat(valueStr);
                    if (!isNaN(end)) directives.endSeconds = end;
                    break;
                case '%%audio_src':
                    if (valueStr) directives.src = valueStr;
                    break;
                case '%%audio_title':
                    if (valueStr) directives.title = valueStr;
                    break;
                case '%%audio_composer':
                    if (valueStr) directives.composer = valueStr;
                    break;
                case '%%audio_performer':
                    if (valueStr) directives.performer = valueStr;
                    break;
                case '%%audio_artworkSrc':
                    if (valueStr) directives.artworkSrc = valueStr;
                    break;
                case '%%audio_platform':
                    if (valueStr) directives.platform = valueStr;
                    break;
                case '%%audio_platformUrl':
                    if (valueStr) directives.platformUrl = valueStr;
                    break;
                case '%%audio_platformLabel':
                    if (valueStr) directives.platformLabel = valueStr;
                    break;
            }
        });
        return directives;
    };

    const abcDirectives = parseAudioDirectives(abc);

    // Logic to determine if time override is present
    const directivesContainsTime =
        abcDirectives.startSeconds !== undefined || abcDirectives.endSeconds !== undefined;

    // Merge Logic
    let effectiveMetadata: ScoreAudioMetadata | null = null;

    if (abcDirectives.src) {
        // ABC dictates a new source -> Reset context
        effectiveMetadata = {
            ...abcDirectives
        };
    } else if (baseAudioMetadata) {
        // Inherit from base, but override time if present in ABC
        effectiveMetadata = {
            ...baseAudioMetadata,
            ...abcDirectives,
            startSeconds: directivesContainsTime ? abcDirectives.startSeconds : baseAudioMetadata.startSeconds,
            endSeconds: directivesContainsTime ? abcDirectives.endSeconds : baseAudioMetadata.endSeconds
        };
    }

    // Construct Score Entity
    const scoreEntity: Score = {
        format: ScoreFormat.ABC,
        data: abc,
        title: effectiveMetadata?.title
    };

    const handlePlayClick = () => {
        if (effectiveMetadata && onPlayRequest) {
            onPlayRequest(effectiveMetadata);
        }
    };

    return (
        <div className="relative group score-wrapper mt-0">
            <ScoreView score={scoreEntity} />

            {effectiveMetadata && effectiveMetadata.src && onPlayRequest && (
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 m-1">
                    <button
                        onClick={handlePlayClick}
                        className="flex items-center gap-1.5 rounded-full bg-gray-900/90 text-white px-3 py-1.5 shadow-sm hover:bg-black hover:scale-105 transition-all text-xs font-medium backdrop-blur-sm"
                    >
                        <span>▶ Play Audio</span>
                    </button>
                </div>
            )}
        </div>
    );
}
