'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import dynamic from 'next/dynamic';
import { useAudioPlayer } from '@/components/providers/AudioPlayerContext';
// Simple Play Icon (Inline to avoid looking for icon lib if not sure, though likely lucide-react or similar is available. I'll use text or simple SVG for now or check if generic UI components exist)
// Checking previous files, user has not shown Icon imports. I'll use a simple styled button.

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

export default function ScoreClientWrapper({ abc, audioMetadata }: ScoreClientWrapperProps) {
    const { play } = useAudioPlayer();

    const handlePlay = () => {
        if (audioMetadata) {
            play(
                audioMetadata.videoId,
                {
                    title: audioMetadata.title || 'Audio Recording',
                    composer: audioMetadata.composer,
                    performer: audioMetadata.performer,
                    artworkSrc: audioMetadata.artworkSrc,
                    platformUrl: audioMetadata.platformUrl || `https://www.youtube.com/watch?v=${audioMetadata.videoId}`,
                    platformLabel: audioMetadata.platformLabel || 'Watch on YouTube',
                    platformType: audioMetadata.platformType || 'youtube',
                },
                {
                    startTime: audioMetadata.startTime,
                    endTime: audioMetadata.endTime
                }
            );
        }
    };

    return (
        <div className="relative group">
            <ScoreRenderer abc={abc} />

            {audioMetadata && (
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
