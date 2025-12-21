'use client';

import { useAudioPlayer } from '@/components/player/AudioPlayerContext';
import ScoreFeature, { ScoreAudioMetadata } from '@/components/score';
import { PlayerPlatform, PlayerPlatformType } from '@/domain/player/PlayerConstants';

interface WorkScoreAdapterProps {
    abc: string;
    baseAudioMetadata?: ScoreAudioMetadata;
}

/**
 * WorkScoreAdapter
 * Integrates the independent ScoreFeature with the applications AudioPlayer.
 * This adapter lives in the 'content/work' feature (or app layer), keeping 'components/score' generic and dependency-free.
 */
export function WorkScoreAdapter({ abc, baseAudioMetadata }: WorkScoreAdapterProps) {
    const { play } = useAudioPlayer();

    const handlePlayRequest = (meta: ScoreAudioMetadata) => {
        // Map ScoreAudioMetadata to AudioPlayer's expected format
        if (!meta.src) { // src is standardized in ScoreAudioMetadata (ScoreFeature logic uses src)
            return;
        }

        // Determine Platform & Defaults
        const platform = (meta.platform as PlayerPlatformType) || PlayerPlatform.YOUTUBE;
        let platformUrl = meta.platformUrl;
        let platformLabel = meta.platformLabel;

        if (platform === PlayerPlatform.YOUTUBE && !platformUrl) {
            platformUrl = `https://www.youtube.com/watch?v=${meta.src}`;
        }
        if (platform === PlayerPlatform.YOUTUBE && !platformLabel) {
            platformLabel = 'Watch on YouTube';
        }

        play(
            meta.src,
            {
                title: meta.title || 'Audio Recording',
                composer: meta.composer,
                performer: meta.performer,
                artworkSrc: meta.artworkSrc,
                platformUrl,
                platformLabel,
                platform,
            },
            {
                startSeconds: meta.startSeconds,
                endSeconds: meta.endSeconds
            }
        );
    };

    return (
        <ScoreFeature
            abc={abc}
            baseAudioMetadata={baseAudioMetadata}
            onPlayRequest={handlePlayRequest}
        />
    );
}
