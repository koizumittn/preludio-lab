'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import dynamic from 'next/dynamic';
import { useAudioPlayer } from '@/components/providers/AudioPlayerContext';
import { handleClientError } from '@/utils/client-error-handler';

const ScoreRenderer = dynamic(
    () => import('./ScoreRenderer'),
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

interface ScoreClientWrapperProps {
    abc: string;
    audioMetadata?: {
        videoId: string;
        title?: string;
        composer?: string;
        performer?: string;
        artworkSrc?: string;
        platformUrl?: string; // e.g. "https://youtube.com/..."
        platformLabel?: string; // e.g. "Watch on YouTube"
        platformType?: 'youtube' | 'default';
        startTime?: number;
        endTime?: number;
    };
}

/**
 * [REQ-UI-SCORE-WRAPPER] Score Client Wrapper
 * 
 * Wraps the ScoreRenderer with interactive features (Play Button).
 * Handles parsing of ABC directives for per-excerpt audio metadata.
 */
export default function ScoreClientWrapper({ abc, audioMetadata }: ScoreClientWrapperProps) {
    const { play } = useAudioPlayer();

    /**
     * Parses custom ABC directives (%%audio_*) to override metadata.
     * @param abcContent - The raw ABC string
     * @returns Parsed directives object
     */
    const parseAudioDirectives = (abcContent: string) => {
        const directives: any = {};
        const lines = abcContent.split('\n');

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed.startsWith('%%audio_')) return;

            const parts = trimmed.split(/\s+/);
            const key = parts[0];
            const valueStr = parts.slice(1).join(' '); // Rejoin rest for text fields

            switch (key) {
                case '%%audio_startTime':
                    const start = parseFloat(valueStr);
                    if (!isNaN(start)) directives.startTime = start;
                    break;
                case '%%audio_endTime':
                    const end = parseFloat(valueStr);
                    if (!isNaN(end)) directives.endTime = end;
                    break;
                case '%%audio_videoId':
                    if (valueStr) directives.videoId = valueStr;
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

    // Merge Logic
    let effectiveMetadata = null;

    if (abcDirectives.videoId) {
        // [Video Context Reset Rule]
        // If ABC specifies a Video ID, we treat it as a completely new source.
        // We do NOT inherit any metadata from Frontmatter to avoid mixing contexts 
        // (e.g. displaying "Lang Lang" for a "Glenn Gould" video ref).
        effectiveMetadata = {
            ...abcDirectives
            // Note: startTime/endTime from directives are used directly here.
        };
    } else if (audioMetadata) {
        // [Standard Inheritance with Time Reset]
        // Same video source, inheriting metadata BUT resetting time if overridden.
        const hasAbcTime = abcDirectives.startTime !== undefined || abcDirectives.endTime !== undefined;
        effectiveMetadata = {
            ...audioMetadata,
            ...abcDirectives,
            startTime: hasAbcTime ? abcDirectives.startTime : audioMetadata.startTime,
            endTime: hasAbcTime ? abcDirectives.endTime : audioMetadata.endTime
        };
    }

    const handlePlay = () => {
        try {
            if (effectiveMetadata && effectiveMetadata.videoId) {
                play(
                    effectiveMetadata.videoId,
                    {
                        title: effectiveMetadata.title || 'Audio Recording',
                        composer: effectiveMetadata.composer,
                        performer: effectiveMetadata.performer,
                        artworkSrc: effectiveMetadata.artworkSrc,
                        platformUrl: effectiveMetadata.platformUrl || `https://www.youtube.com/watch?v=${effectiveMetadata.videoId}`,
                        platformLabel: effectiveMetadata.platformLabel || 'Watch on YouTube',
                        platformType: effectiveMetadata.platformType || 'youtube',
                    },
                    {
                        startTime: effectiveMetadata.startTime,
                        endTime: effectiveMetadata.endTime
                    }
                );
            }
        } catch (error) {
            handleClientError(error, 'Failed to start playback');
        }
    };

    return (
        <div className="relative group score-wrapper mt-0">
            <ScoreRenderer abc={abc} />

            {effectiveMetadata && effectiveMetadata.videoId && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                        onClick={handlePlay}
                        className="flex items-center gap-2 rounded-full bg-gray-900 text-white px-4 py-2 shadow-md hover:bg-black hover:scale-105 transition-all text-sm font-medium"
                    >
                        <span>▶ Play Audio</span>
                    </button>
                </div>
            )}
        </div>
    );
}
