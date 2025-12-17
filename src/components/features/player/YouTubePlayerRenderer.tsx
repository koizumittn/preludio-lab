'use client';

import React, { useEffect, useRef } from 'react';
import YouTube, { YouTubeProps, YouTubeEvent } from 'react-youtube';
import { useAudioPlayer } from '@/components/providers/AudioPlayerContext';
import { handleClientError } from '@/utils/client-error-handler';

// export * from ... if needed

export default function YouTubePlayer() {
    const {
        videoId,
        isPlaying,
        setPlayerInstance,
        _onReady,
        _onStateChange,
        _onProgress,
        _onDuration,
        startTime,
        endTime,
        playbackId
    } = useAudioPlayer();

    const playerRef = useRef<any>(null);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);
    const lastPlaybackIdRef = useRef<number | null>(null);

    // YouTube Player Options
    const opts: YouTubeProps['opts'] = {
        height: '1', // カスタムUIを使用するため、視覚的なフットプリントを最小化
        width: '1',
        playerVars: {
            autoplay: 0, // 状態経由で制御
            controls: 0, // デフォルトのコントロールを非表示
            disablekb: 1,
            fs: 0,
            playsinline: 1, // iOSでインライン再生
            modestbranding: 1,
        },
    };

    /**
     * 再生状態と動画IDの同期
     * loadVideoById を使用して、明示的に開始位置と終了位置を指定します。
     * これにより、シーク処理をYouTube側で処理させることができます。
     */
    useEffect(() => {
        const player = playerRef.current;
        if (!player) return;

        if (isPlaying) {
            const isNewRequest = playbackId !== lastPlaybackIdRef.current;
            lastPlaybackIdRef.current = playbackId;

            const playerState = player.getPlayerState();
            // 既にこの動画がロードされており、かつ新しい再生リクエストでない場合（一時停止解除など）
            const currentVideoId = player.getVideoData()?.video_id;

            if (!isNewRequest && currentVideoId === videoId && (playerState === 2 || playerState === 1)) {
                if (playerState !== 1) player.playVideo();
            } else {
                // 新規リクエスト、または動画変更、または未ロード状態
                try {
                    player.loadVideoById({
                        videoId: videoId,
                        startSeconds: startTime || 0,
                        endSeconds: endTime
                    });
                } catch (e) {
                    handleClientError(e, 'Failed to load video');
                }
            }
        } else {
            const playerState = player.getPlayerState();
            if (playerState === 1) {
                player.pauseVideo();
            }
        }
    }, [isPlaying, videoId, startTime, endTime, playbackId]);

    /**
     * 再生時間のポーリング (Current Time) & End Time Check
     */
    useEffect(() => {
        if (isPlaying) {
            progressInterval.current = setInterval(() => {
                if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                    const time = playerRef.current.getCurrentTime();
                    const duration = playerRef.current.getDuration();
                    _onProgress(time);
                    if (duration > 0) _onDuration(duration);

                    // End Time Check (Manual fallback if API implementation is flaky)
                    if (endTime && time >= endTime) {
                        playerRef.current.pauseVideo();
                        _onStateChange(false); // Update local state
                    }
                }
            }, 500);
        } else {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        }
        return () => { if (progressInterval.current) clearInterval(progressInterval.current); };
    }, [isPlaying, _onProgress, _onDuration, endTime, _onStateChange]);


    const onReady = (event: YouTubeEvent) => {
        playerRef.current = event.target;
        setPlayerInstance(event.target);

        const duration = event.target.getDuration();
        _onReady(duration);

        // 必須チェック: すでに再生状態であるべきなら、即座に再生を開始する
        if (isPlaying) {
            if (startTime) {
                event.target.loadVideoById({
                    videoId: videoId,
                    startSeconds: startTime,
                    endSeconds: endTime
                });
            } else {
                event.target.playVideo();
            }
        }
    };

    const onStateChange = (event: YouTubeEvent) => {
        // PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued).
        const state = event.data;
        const duration = event.target.getDuration();
        if (duration) _onDuration(duration);

        if (state === 1) { // 再生中
            _onStateChange(true);
        } else if (state === 2) { // 一時停止
            _onStateChange(false);
        } else if (state === 0) { // 終了
            _onStateChange(false);
        }
    };

    const onError = (error: any) => {
        handleClientError(error, 'YouTube Player Error occurred');
    };

    // YouTube API (widgetapi) sometimes throws "Uncaught (in promise) Error: Invalid video id"
    // that fails to trigger the standard onError callback. We catch it globally here.
    useEffect(() => {
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            const reason = event.reason;

            // Debugging: Log the exact structure of the rejection reason
            console.log('[YouTubePlayerRenderer] Debug - Rejection Reason:', reason);

            let errorMessage = '';
            if (reason instanceof Error) {
                errorMessage = reason.message;
            } else if (typeof reason === 'string') {
                errorMessage = reason;
            } else {
                try {
                    errorMessage = JSON.stringify(reason);
                } catch (e) {
                    errorMessage = String(reason);
                }
            }

            if (errorMessage && errorMessage.includes('Invalid video id')) {
                handleClientError(new Error(errorMessage), 'Video load failed: Invalid ID');
                event.preventDefault();
            }
        };

        // Use capture phase to ensure we catch it early
        window.addEventListener('unhandledrejection', handleUnhandledRejection, true);

        return () => {
            window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
        };
    }, []);

    if (!videoId) return null;

    return (
        <div className="fixed bottom-0 left-0 -z-50 opacity-0 pointer-events-none" aria-hidden="true">
            <YouTube
                videoId={videoId}
                opts={opts}
                onReady={onReady}
                onStateChange={onStateChange}
                onError={onError}
            />
        </div>
    );
}
