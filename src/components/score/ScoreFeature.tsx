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

    /**
     * カスタムABCディレクティブ (%%audio_*) を解析します
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

    // 時間の上書きが存在するか判定するロジック
    const directivesContainsTime =
        abcDirectives.startSeconds !== undefined || abcDirectives.endSeconds !== undefined;

    // Merge Logic
    let effectiveMetadata: ScoreAudioMetadata | null = null;

    if (abcDirectives.src) {
        // ABCが新しいソースを指示している場合 -> コンテキストをリセット
        effectiveMetadata = {
            ...abcDirectives
        };
    } else if (baseAudioMetadata) {
        // ベースから継承するが、ABC内に時間指定があれば上書きする
        effectiveMetadata = {
            ...baseAudioMetadata,
            ...abcDirectives,
            startSeconds: directivesContainsTime ? abcDirectives.startSeconds : baseAudioMetadata.startSeconds,
            endSeconds: directivesContainsTime ? abcDirectives.endSeconds : baseAudioMetadata.endSeconds
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
