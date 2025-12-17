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
            origin: typeof window !== 'undefined' ? window.location.origin : undefined, // Explicit origin
        },
        host: 'https://www.youtube-nocookie.com', // Privacy-enhanced mode to reduce tracking/CORS noise
    };

    // Helper to safely call loadVideoById handling both Sync and Async errors
    const safeLoadVideo = (target: any, options: { videoId: string; startSeconds?: number; endSeconds?: number }) => {
        try {
            const result = target.loadVideoById(options);
            // Handle if it returns a Promise (Async error)
            if (result && typeof result.catch === 'function') {
                result.catch((e: any) => handleClientError(e, 'Failed to load video (Async)'));
            }
        } catch (e) {
            // Handle Sync error
            handleClientError(e, 'Failed to load video (Sync)');
        }
    };

    /**
     * 再生状態と動画IDの同期
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
                safeLoadVideo(player, {
                    videoId: videoId || '',
                    startSeconds: startTime || 0,
                    endSeconds: endTime
                });
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
        // ... (No change to progress polling logic)
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

        // 手動ロード制御: Propでの自動ロードを停止したため、ここで明示的にロードする
        if (videoId) {
            safeLoadVideo(event.target, {
                videoId: videoId,
                startSeconds: startTime || 0,
                endSeconds: endTime
            });

            // isPlayingフラグに応じて再生/一時停止を制御
            // loadVideoByIdは自動再生するため、!isPlayingならpauseする等の制御が必要だが、
            // 基本的にplay()経由で呼ばれるためisPlaying=true前提。
            // 必要であればここに !isPlaying 分岐を追加
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

    if (!videoId) return null;

    return (
        <div className="fixed bottom-0 left-0 -z-50 opacity-0 pointer-events-none" aria-hidden="true">
            <YouTube
                // videoId propを渡すとライブラリ内部で loadVideoById が走ってしまい
                // Promiseエラーを捕捉できないため、初期化以降は渡さない（または空）にする。
                // ただしマウント条件として videoId の存在チェックは外側で行っている。
                videoId={undefined}
                opts={opts}
                onReady={onReady}
                onStateChange={onStateChange}
                onError={onError}
            />
        </div>
    );
}
