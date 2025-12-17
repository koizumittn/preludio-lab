'use client';

import React, { useEffect, useRef } from 'react';
import YouTube, { YouTubeProps, YouTubeEvent } from 'react-youtube';
import { useAudioPlayer } from '@/components/providers/AudioPlayerContext';

export function YouTubePlayer() {
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
        height: '1', // Minimize visual footprint as we use custom UI
        width: '1',
        playerVars: {
            autoplay: 0, // Controlled via state
            controls: 0, // Hide default controls
            disablekb: 1,
            fs: 0,
            playsinline: 1, // iOS inline playback
            modestbranding: 1,
        },
    };

    // Sync Play/Pause state with prop change is handled by react-youtube's internal logic?
    // Actually no, react-youtube just initializes. We need to command it.
    // BUT, react-youtube doesn't expose a "playing" prop easily to control the player.
    // We used `setPlayerInstance` to pass the ref up to Context, so Context calls `.playVideo()` / `.pauseVideo()`.
    // Wait, in Context I implemented `play` as just setting state `isPlaying: true`.
    // I need to REACT to that state change here in a useEffect and call the player method.

    // CORRECT APPROACH:
    // Context holds `isPlaying`.
    // This component `useEffect` listens to `isPlaying` and calls `player.playVideo()` or `player.pauseVideo()`.

    useEffect(() => {
        const player = playerRef.current;
        if (!player) return;

        if (isPlaying) {
            // Need to handle the case where videoId just changed. 
            // YouTube player takes a moment to load new video.
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
    }, [isPlaying, videoId]); // Run when playing state or video ID changes

    // Polling for progress (Current Time)
    // YouTube API doesn't have a "timeupdate" event like HTML5 Audio. We must poll.
    useEffect(() => {
        if (isPlaying) {
            progressInterval.current = setInterval(() => {
                if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                    const time = playerRef.current.getCurrentTime();
                    const duration = playerRef.current.getDuration();
                    _onProgress(time);
                    // Also update duration if it wasn't set correctly initially
                    if (duration > 0) _onDuration(duration);
                }
            }, 500); // Update every 500ms
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

        // Required check: If we are supposed to be playing, start now.
        if (isPlaying) {
            event.target.playVideo();
        }
    };

    const onStateChange = (event: YouTubeEvent) => {
        // PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued).
        const state = event.data;
        const duration = event.target.getDuration();
        if (duration) _onDuration(duration);

        if (state === 1) { // Playing
            _onStateChange(true);
        } else if (state === 2) { // Paused
            _onStateChange(false);
        } else if (state === 0) { // Ended
            _onStateChange(false);
        }
    };

    const onError = (error: any) => {
        console.error('YouTube Player Error:', error);
        // Fallback or Toast could be triggered here via Context
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
