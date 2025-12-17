'use client';

import React, { useEffect, useRef } from 'react';
import YouTube, { YouTubeProps, YouTubeEvent } from 'react-youtube';
import { useAudioPlayer } from '@/components/providers/AudioPlayerContext';

// export * from ... if needed

export default function YouTubePlayer() {
    const {
        videoId,
        isPlaying,
        setPlayerInstance,
        _onReady,
        _onStateChange,
        _onProgress,
        _onDuration
    } = useAudioPlayer();

    const playerRef = useRef<any>(null);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

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
     * 再生状態の同期ロジック:
     * Contextが `isPlaying` の真偽値を保持します。
     * このコンポーネントは `useEffect` でその変更を監視し、
     * YouTube Playerの実体に対して命令 (`playVideo` / `pauseVideo`) を発行します。
     */
    useEffect(() => {
        const player = playerRef.current;
        if (!player) return;

        if (isPlaying) {
            // videoIdが変更された直後のケースを考慮する必要があります。
            // YouTubeプレイヤーが新しい動画をロードするのに一瞬時間がかかります。
            const playerState = player.getPlayerState();
            // 1 = Playing, 2 = Paused, 3 = Buffering, 5 = Cued
            if (playerState !== 1 && playerState !== 3) {
                player.playVideo();
            }
        } else {
            const playerState = player.getPlayerState();
            if (playerState === 1) {
                player.pauseVideo();
            }
        }
    }, [isPlaying, videoId]); // 再生状態または動画IDが変更されたら実行

    /**
     * 再生時間のポーリング (Current Time)
     * YouTube APIにはHTML5 Audioのような "timeupdate" イベントがないため、
     * `setInterval` を使用してポーリングする必要があります。
     */
    useEffect(() => {
        if (isPlaying) {
            progressInterval.current = setInterval(() => {
                if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                    const time = playerRef.current.getCurrentTime();
                    const duration = playerRef.current.getDuration();
                    _onProgress(time);
                    // 初期ロード時に取得できなかった場合に備えてdurationも更新
                    if (duration > 0) _onDuration(duration);
                }
            }, 500); // 500msごとに更新
        } else {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        }

        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, [isPlaying, _onProgress, _onDuration]);


    const onReady = (event: YouTubeEvent) => {
        playerRef.current = event.target;
        setPlayerInstance(event.target);

        const duration = event.target.getDuration();
        _onReady(duration);

        // 必須チェック: すでに再生状態であるべきなら、即座に再生を開始する
        if (isPlaying) {
            event.target.playVideo();
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
        console.error('YouTube Player Error:', error);
        // 必要に応じてContext経由でフォールバックやToastを表示可能
    };

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
