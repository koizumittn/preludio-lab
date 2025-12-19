'use client';

import React, { useEffect, useRef } from 'react';
import YouTube, { YouTubeProps, YouTubeEvent } from 'react-youtube';

export interface AudioPlayerProps {
    // State (データ)
    src: string; // 動画ID または URL
    platform?: 'youtube' | 'default'; // 将来的な拡張用、現状は youtube のみ実装

    // Control State (制御状態)
    isPlaying: boolean;
    volume: number; // 0-100
    seekTo?: number | null; // シーク位置 (命令的なトリガー)

    // Configuration (設定)
    startTime?: number;
    endTime?: number;
    playbackId?: number; // オプション: 再同期や再ロードを強制するためのID

    // Events (イベント)
    onReady: (duration: number) => void;
    onProgress: (currentTime: number) => void;
    onEnded: () => void;
    onError: (error: any) => void;
    onStateChange?: (isPlaying: boolean) => void;
}

/**
 * [REQ-UI-AUDIO-PLAYER] Audio Player (Dumb Component)
 * 
 * 下位のプレイヤーライブラリ（現在は react-youtube）をラップし、
 * 統一された Props 駆動のインターフェースを提供します。
 */
export function AudioPlayer({
    src,
    platform = 'youtube',
    isPlaying,
    volume,
    seekTo,
    startTime,
    endTime,
    playbackId,
    onReady,
    onProgress,
    onEnded,
    onError,
    onStateChange
}: AudioPlayerProps) {
    const playerRef = useRef<any>(null);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);
    const lastPlaybackIdRef = useRef<number | undefined>(undefined);
    const lastSeekToRef = useRef<number | null | undefined>(undefined);

    // YouTube Player のオプション設定
    const opts: YouTubeProps['opts'] = {
        height: '1',
        width: '1',
        playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            playsinline: 1,
            modestbranding: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
        host: 'https://www.youtube-nocookie.com',
    };

    // loadVideoById を安全に呼び出すヘルパー関数
    const safeLoadVideo = (target: any, options: { videoId: string; startSeconds?: number; endSeconds?: number }) => {
        try {
            console.debug('[AudioPlayer] 動画ロード開始:', options);
            const result = target.loadVideoById(options);
            if (result && typeof result.catch === 'function') {
                result.catch((e: any) => {
                    console.error('[AudioPlayer] 非同期ロードエラー:', e);
                    onError(e);
                });
            }
        } catch (e) {
            console.error('[AudioPlayer] 同期ロードエラー:', e);
            onError(e);
        }
    };

    /**
     * Effect: 再生状態とソース変更のハンドリング
     */
    useEffect(() => {
        const player = playerRef.current;
        if (!player || !src) return;

        // 新しい「再生リクエスト」かどうかを判定 (例: 新しい曲のクリック)
        const isNewRequest = playbackId !== lastPlaybackIdRef.current;
        const currentVideoId = player.getVideoData()?.video_id;

        if (isPlaying) {
            if (isNewRequest || currentVideoId !== src) {
                // 新しい動画をロード
                lastPlaybackIdRef.current = playbackId;
                safeLoadVideo(player, {
                    videoId: src,
                    startSeconds: startTime || 0,
                    endSeconds: endTime
                });
            } else {
                // 既存の動画を再開
                const playerState = player.getPlayerState();
                if (playerState !== 1) { // 再生中でなければ
                    player.playVideo();
                }
            }
        } else {
            const playerState = player.getPlayerState();
            if (playerState === 1) { // 再生中なら
                player.pauseVideo();
            }
        }
    }, [isPlaying, src, startTime, endTime, playbackId]);

    /**
     * Effect: Handle Seek
     */
    useEffect(() => {
        if (seekTo !== undefined && seekTo !== null && seekTo !== lastSeekToRef.current) {
            lastSeekToRef.current = seekTo;
            if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
                playerRef.current.seekTo(seekTo, true);
            }
        }
    }, [seekTo]);

    /**
     * Effect: Handle Volume
     */
    useEffect(() => {
        if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
            playerRef.current.setVolume(volume);
        }
    }, [volume]);

    /**
     * Effect: Progress Polling
     */
    useEffect(() => {
        if (isPlaying) {
            progressInterval.current = setInterval(() => {
                if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                    const time = playerRef.current.getCurrentTime();
                    onProgress(time);

                    // Manual End Check
                    if (endTime && time >= endTime) {
                        playerRef.current.pauseVideo();
                        if (onStateChange) onStateChange(false);
                    }
                }
            }, 500);
        } else {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        }
        return () => { if (progressInterval.current) clearInterval(progressInterval.current); };
    }, [isPlaying, onProgress, endTime, onStateChange]);


    // --- Event Handlers ---

    const _onReady = (event: YouTubeEvent) => {
        playerRef.current = event.target;
        const duration = event.target.getDuration();
        onReady(duration);

        // Initial Load if src is present (Manual Control)
        if (src) {
            // Prepare the player without auto-playing immediately unless isPlaying is true
            // Actually, cueVideoById might be better if !isPlaying, but loadVideoById is standardized here.
            // If !isPlaying, we might want to just cue it.
            // But simpler to just rely on the useEffect above to trigger play/load.
            // HOWEVER, onReady is the moment we can start interacting. 
            // Let's trigger the effect logic manually or just let React handle the effect firing after mount?
            // React effect fires after mount, but playerRef might be null then? 
            // No, playerRef is assigned here.
            // We need to trigger the "isPlaying" check logic once ready.

            // Check if we should play immediately
            if (isPlaying) {
                safeLoadVideo(event.target, { videoId: src, startSeconds: startTime || 0, endSeconds: endTime });
            } else {
                event.target.cueVideoById({ videoId: src, startSeconds: startTime || 0, endSeconds: endTime });
            }
        }
    };

    const _onStateChange = (event: YouTubeEvent) => {
        // PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued).
        const state = event.data;
        const duration = event.target.getDuration();
        if (duration > 0) {
            // Occasionally update duration if it changes (e.g. livestreams or loading)
            // But onReady usually covers it.
        }

        if (state === 1) { // Playing
            if (onStateChange) onStateChange(true);
        } else if (state === 2) { // Paused
            if (onStateChange) onStateChange(false);
        } else if (state === 0) { // Ended
            if (onStateChange) onStateChange(false);
            onEnded();
        }
    };

    const _onError = (event: any) => {
        // react-youtube returns an event object for onError, but the actual error code is in event.data
        console.error('[AudioPlayer] Internal Error Event:', event);
        onError(event.data);
    };

    if (platform !== 'youtube') {
        return <div className="hidden">Unsupported Platform</div>;
    }

    return (
        <div className="fixed bottom-0 left-0 -z-50 opacity-0 pointer-events-none" aria-hidden="true">
            <YouTube
                videoId={undefined} // 手動制御のため undefined
                opts={opts}
                onReady={_onReady}
                onStateChange={_onStateChange}
                onError={_onError}
            />
        </div>
    );
}
