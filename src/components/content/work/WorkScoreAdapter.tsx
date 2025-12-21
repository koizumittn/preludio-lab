'use client';

import { useAudioPlayer } from '@/components/player/AudioPlayerContext';
import ScoreFeature, { ScoreAudioMetadata } from '@/components/score';
import { PlayerPlatform, PlayerPlatformType } from '@/domain/player/PlayerConstants';
import { generateWatchUrl } from '@/components/player/PlayerLinkHelper';
import { AbcMetadataParser } from '@/infrastructure/score/AbcMetadataParser';
import { Score, ScoreFormat } from '@/domain/score/Score';
import { useMemo } from 'react';

interface WorkScoreAdapterProps {
    abc: string;
    baseAudioMetadata?: ScoreAudioMetadata;
}

/**
 * WorkScoreAdapter
 * Integrates the independent ScoreFeature with the applications AudioPlayer.
 * This adapter lives in the 'content/work' feature (or app layer), keeping 'components/score' generic and dependency-free.
 * It is responsible for parsing the specific format (ABC) and preparing generic data for the ScoreFeature.
 */
export function WorkScoreAdapter({ abc, baseAudioMetadata }: WorkScoreAdapterProps) {
    const { play } = useAudioPlayer();

    // Parse logic (moved from ScoreFeature)
    const { score, audioMetadata } = useMemo(() => {
        // Use Infrastructure Parser to get raw directives
        const directives = new AbcMetadataParser().parseDirectives(abc);

        // Map raw directives to ScoreAudioMetadata
        const abcAudioMetadata: Partial<ScoreAudioMetadata> = {};

        if (directives.audio_src) abcAudioMetadata.src = directives.audio_src;
        if (directives.audio_title) abcAudioMetadata.title = directives.audio_title;
        if (directives.audio_composer) abcAudioMetadata.composer = directives.audio_composer;
        if (directives.audio_performer) abcAudioMetadata.performer = directives.audio_performer;
        if (directives.audio_artworkSrc) abcAudioMetadata.artworkSrc = directives.audio_artworkSrc;
        if (directives.audio_platform) abcAudioMetadata.platform = directives.audio_platform;
        if (directives.audio_platformUrl) abcAudioMetadata.platformUrl = directives.audio_platformUrl;
        if (directives.audio_platformLabel) abcAudioMetadata.platformLabel = directives.audio_platformLabel;

        if (directives.audio_startTime || directives.audio_startSeconds) {
            const val = parseFloat(directives.audio_startTime || directives.audio_startSeconds);
            if (!isNaN(val)) abcAudioMetadata.startSeconds = val;
        }
        if (directives.audio_endTime || directives.audio_endSeconds) {
            const val = parseFloat(directives.audio_endTime || directives.audio_endSeconds);
            if (!isNaN(val)) abcAudioMetadata.endSeconds = val;
        }

        // Logic to determine if time override is present
        const directivesContainsTime =
            abcAudioMetadata.startSeconds !== undefined || abcAudioMetadata.endSeconds !== undefined;

        // Merge Logic
        let effectiveMetadata: ScoreAudioMetadata | undefined = undefined;

        if (abcAudioMetadata.src) {
            // ABC dictates a new source -> Reset context
            effectiveMetadata = {
                ...abcAudioMetadata
            };
        } else if (baseAudioMetadata) {
            // Inherit from base, but override time if present in ABC
            effectiveMetadata = {
                ...baseAudioMetadata,
                ...abcAudioMetadata,
                startSeconds: directivesContainsTime ? abcAudioMetadata.startSeconds : baseAudioMetadata.startSeconds,
                endSeconds: directivesContainsTime ? abcAudioMetadata.endSeconds : baseAudioMetadata.endSeconds
            };
        }

        // Construct Score Entity
        const scoreEntity: Score = {
            format: ScoreFormat.ABC,
            data: abc,
            title: effectiveMetadata?.title
        };

        return { score: scoreEntity, audioMetadata: effectiveMetadata };
    }, [abc, baseAudioMetadata]);

    const handlePlayRequest = (meta: ScoreAudioMetadata) => {
        // Map ScoreAudioMetadata to AudioPlayer's expected format
        if (!meta.src) { // src is standardized in ScoreAudioMetadata (ScoreFeature logic uses src)
            return;
        }

        // Determine Platform & Defaults
        const platform = (meta.platform as PlayerPlatformType) || PlayerPlatform.YOUTUBE;
        let platformUrl = meta.platformUrl;
        let platformLabel = meta.platformLabel;

        if (!platformUrl) {
            // Use UI Utility to generate user-facing Watch URL
            platformUrl = generateWatchUrl(platform, meta.src) || undefined;
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
            score={score}
            audioMetadata={audioMetadata}
            onPlayRequest={handlePlayRequest}
        />
    );
}
