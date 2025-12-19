'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import dynamic from 'next/dynamic';
import { useAudioPlayer } from '@/components/providers/AudioPlayerContext';
import { PlayerPlatform, PlayerPlatformType } from '@/domain/player/constants';
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
        videoId?: string; // Legacy support (mapped to src)
        src?: string;     // New generic field
        title?: string;
        composer?: string;
        performer?: string;
        artworkSrc?: string;
        platformUrl?: string; // e.g. "https://youtube.com/..."
        platformLabel?: string; // e.g. "Watch on YouTube"
        platform?: PlayerPlatformType;
        startSeconds?: number;
        endSeconds?: number;
        // Legacy support
        startTime?: number;
        endTime?: number;
    };
}

/**
 * [REQ-UI-SCORE-WRAPPER] Score Client Wrapper
 * 
 * ScoreRenderer をラップし、インタラクティブ機能（再生ボタンなど）を提供します。
 * ABC記法のディレクティブを解析し、抜粋ごとのオーディオメタデータを処理します。
 */
export default function ScoreClientWrapper({ abc, audioMetadata }: ScoreClientWrapperProps) {
    const { play } = useAudioPlayer();

    /**
     * カスタム ABC ディレクティブ (%%audio_*) を解析し、メタデータをオーバーライドします。
     * @param abcContent - 生の ABC 文字列
     * @returns 解析されたディレクティブ・オブジェクト
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
                case '%%audio_startSeconds':
                    const start = parseFloat(valueStr);
                    if (!isNaN(start)) directives.startSeconds = start;
                    break;
                case '%%audio_endTime':
                case '%%audio_endSeconds':
                    const end = parseFloat(valueStr);
                    if (!isNaN(end)) directives.endSeconds = end;
                    break;
                case '%%audio_videoId':
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

    const directivesContainsTime = (d: any) =>
        d.startSeconds !== undefined || d.startTime !== undefined ||
        d.endSeconds !== undefined || d.endTime !== undefined;

    const abcDirectives = parseAudioDirectives(abc);

    // Merge Logic
    let effectiveMetadata = null;

    if (abcDirectives.videoId) {
        // [動画コンテキストのリセットルール]
        // ABC指定でビデオIDがある場合、完全に新しいソースとして扱います。
        // Frontmatterからのメタデータ継承は行わず、コンテキストの混在（例: グールドの動画再生中にラン・ランのメタデータが表示される等）を防ぎます。
        effectiveMetadata = {
            ...abcDirectives
            // メモ: directivesからの startTime/endTime はここで直接使用されます
        };
    } else if (audioMetadata) {
        // [標準的な継承と時間リセット]
        // 同一ビデオソースの場合はメタデータを継承しますが、時間が指定されている場合はリセットします。
        // Check for either legacy (startTime) or new (startSeconds) keys in directives (parser normalizes to startSeconds/endSeconds but let's be safe)
        const hasAbcTime = directivesContainsTime(abcDirectives);
        effectiveMetadata = {
            ...audioMetadata,
            ...abcDirectives,
            startSeconds: hasAbcTime ? (abcDirectives.startSeconds ?? abcDirectives.startTime) : (audioMetadata.startSeconds ?? audioMetadata.startTime),
            endSeconds: hasAbcTime ? (abcDirectives.endSeconds ?? abcDirectives.endTime) : (audioMetadata.endSeconds ?? audioMetadata.endTime)
        };
    }

    const handlePlay = () => {
        try {
            // Map legacy videoId to src if needed
            const src = effectiveMetadata?.src || effectiveMetadata?.videoId;

            if (effectiveMetadata && src) {
                play(
                    src,
                    {
                        title: effectiveMetadata.title || 'Audio Recording',
                        composer: effectiveMetadata.composer,
                        performer: effectiveMetadata.performer,
                        artworkSrc: effectiveMetadata.artworkSrc,
                        platformUrl: effectiveMetadata.platformUrl || (effectiveMetadata.videoId ? `https://www.youtube.com/watch?v=${effectiveMetadata.videoId}` : undefined),
                        platformLabel: effectiveMetadata.platformLabel || 'Watch on YouTube',
                        platform: (effectiveMetadata.platform as PlayerPlatformType) || (effectiveMetadata.platformType as PlayerPlatformType) || PlayerPlatform.YOUTUBE,
                    },
                    {
                        startSeconds: effectiveMetadata.startSeconds ?? effectiveMetadata.startTime,
                        endSeconds: effectiveMetadata.endSeconds ?? effectiveMetadata.endTime
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
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 m-1">
                    <button
                        onClick={handlePlay}
                        className="flex items-center gap-1.5 rounded-full bg-gray-900/90 text-white px-3 py-1.5 shadow-sm hover:bg-black hover:scale-105 transition-all text-xs font-medium backdrop-blur-sm"
                    >
                        <span>▶ Play Audio</span>
                    </button>
                </div>
            )}
        </div>
    );
}
