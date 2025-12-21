'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';
import { Score, ScoreFormat } from '@/domain/score/Score';
import { AbcMetadataParser } from '@/infrastructure/score/AbcMetadataParser';

// ドメインの結合度を下げるため、Playerの型をインポートすることは避けます。
// 代わりに、この機能が生成/消費するものを定義します。

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
    src?: string; // 汎用的なソース識別子 (url または videoId)
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
     * 親コンポーネントから提供される外部メタデータ (例: MDX Frontmatter から)
     */
    baseAudioMetadata?: ScoreAudioMetadata;
    /**
     * ユーザーがこのスコアに関連付けられたオーディオの再生をリクエストした際のコールバック。
     * ここで渡されるメタデータは、baseMetadata と ABC 内で見つかったディレクティブのマージ結果です。
     */
    onPlayRequest?: (metadata: ScoreAudioMetadata) => void;
}

/**
 * ScoreFeature
 * Score機能のメインエントリーポイントです。
 * 責務:
 * 1. ABCディレクティブ (%%audio_*) を解析して埋め込みメタデータを抽出する。
 * 2. 外部メタデータとマージする。
 * 3. 生の文字列を Score Entity に変換する。
 * 4. 純粋な視覚コンポーネントである Score をレンダリングする。
 * 5. 親に通知することで「再生」インタラクションを処理する (Player実装からの分離)。
 */
export function ScoreFeature({ abc, baseAudioMetadata, onPlayRequest }: ScoreFeatureProps) {

    // Use Infrastructure Parser to get raw directives
    // In a full DI setup, this parser could be injected, but instantiating here is acceptable for Feature components.
    const directives = new AbcMetadataParser().parseDirectives(abc);

    // Map raw directives to ScoreAudioMetadata (Adapter Logic)
    // This logic resides here (Integration Layer) to bridge generic Score directives to Player requirements.
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
    let effectiveMetadata: ScoreAudioMetadata | null = null;

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

    // Score Entity の構築
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
