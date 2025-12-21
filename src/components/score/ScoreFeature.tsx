'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';
import { Score, ScoreFormat } from '@/domain/score/Score';


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

export interface ScoreFeatureProps {
    score: Score;
    /**
     * 再生用の関連オーディオメタデータ。
     * 提供された場合、再生ボタンがレンダリングされます。
     */
    audioMetadata?: ScoreAudioMetadata;
    /**
     * ユーザーがオーディオの再生をリクエストした際のコールバック。
     */
    onPlayRequest?: (metadata: ScoreAudioMetadata) => void;
}

/**
 * ScoreFeature
 * Score機能のメインエントリーポイントです。
 * 責務:
 * 1. 純粋に視覚的なScoreコンポーネントをレンダリングする (フォーマット汎用)。
 * 2. 親に通知することで「再生」インタラクションを処理する (Player実装からの分離)。
 */
export function ScoreFeature({ score, audioMetadata, onPlayRequest }: ScoreFeatureProps) {

    const handlePlayClick = () => {
        if (audioMetadata && onPlayRequest) {
            onPlayRequest(audioMetadata);
        }
    };

    return (
        <div className="relative group score-wrapper mt-0">
            <ScoreView score={score} />

            {audioMetadata && audioMetadata.src && onPlayRequest && (
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
