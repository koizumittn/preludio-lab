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
 * 独立した ScoreFeature をアプリケーションの AudioPlayer と統合します。
 * このアダプターは 'content/work' 機能 (またはアプリ層) に属し、'components/score' を汎用的かつ依存関係のない状態に保ちます。
 * 特定のフォーマット (ABC) のパースと、ScoreFeature 用の汎用データの準備を担当します。
 */
export function WorkScoreAdapter({ abc, baseAudioMetadata }: WorkScoreAdapterProps) {
    const { play } = useAudioPlayer();

    // パースロジック (ScoreFeature から移動)
    const { score, audioMetadata } = useMemo(() => {
        // インフラストラクチャのパーサーを使用して生のディレクティブを取得
        const directives = new AbcMetadataParser().parseDirectives(abc);

        // 生のディレクティブを ScoreAudioMetadata にマッピング
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

        // 時間の上書きが存在するか判定するロジック
        const directivesContainsTime =
            abcAudioMetadata.startSeconds !== undefined || abcAudioMetadata.endSeconds !== undefined;

        // マージロジック
        let effectiveMetadata: ScoreAudioMetadata | undefined = undefined;

        if (abcAudioMetadata.src) {
            // ABCが新しいソースを指示している場合 -> コンテキストをリセット
            effectiveMetadata = {
                ...abcAudioMetadata
            };
        } else if (baseAudioMetadata) {
            // ベースから継承するが、ABC内に時間指定があれば上書きする
            effectiveMetadata = {
                ...baseAudioMetadata,
                ...abcAudioMetadata,
                startSeconds: directivesContainsTime ? abcAudioMetadata.startSeconds : baseAudioMetadata.startSeconds,
                endSeconds: directivesContainsTime ? abcAudioMetadata.endSeconds : baseAudioMetadata.endSeconds
            };
        }

        // Score Entity の構築
        const scoreEntity: Score = {
            format: ScoreFormat.ABC,
            data: abc,
            title: effectiveMetadata?.title
        };

        return { score: scoreEntity, audioMetadata: effectiveMetadata };
    }, [abc, baseAudioMetadata]);

    const handlePlayRequest = (meta: ScoreAudioMetadata) => {
        // ScoreAudioMetadata を AudioPlayer が期待する形式にマッピング
        if (!meta.src) { // src は ScoreAudioMetadata で標準化されています (ScoreFeature ロジックは src を使用)
            return;
        }

        // プラットフォームとデフォルト値の決定
        const platform = (meta.platform as PlayerPlatformType) || PlayerPlatform.YOUTUBE;
        let platformUrl = meta.platformUrl;
        let platformLabel = meta.platformLabel;

        if (!platformUrl) {
            // UIユーティリティを使用してユーザー向け Watch URL を生成
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
