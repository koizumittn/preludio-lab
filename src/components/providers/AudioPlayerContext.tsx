'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type PlayerMode = 'hidden' | 'mini' | 'focus';

export interface PlayerState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    videoId: string | null;
    mode: PlayerMode;
    videoTitle: string | null;
    videoComposer: string | null; // e.g. "J.S. Bach"
    videoPerformer: string | null; // e.g. "Glenn Gould"
    artworkSrc: string | null; // URL for the thumbnail/artwork
    platformUrl: string | null; // e.g. "https://youtube.com/..."
    platformLabel: string | null; // e.g. "Watch on YouTube"
    platformType: 'youtube' | 'default' | null;
    isReady: boolean;
    volume: number;
    startTime?: number;
    endTime?: number;
    playbackId: number; // Increment on every explicit play request
}

export interface PlayerActions {
    play: (
        videoId?: string,
        meta?: {
            title?: string;
            composer?: string;
            performer?: string;
            artworkSrc?: string;
            platformUrl?: string;
            platformLabel?: string;
            platformType?: 'youtube' | 'default';
        },
        options?: { startTime?: number; endTime?: number }
    ) => void;
    pause: () => void;
    togglePlay: () => void;
    seekTo: (time: number) => void;
    setVolume: (volume: number) => void;
    setMode: (mode: PlayerMode) => void;

    // Internal use by YouTubePlayer component
    _onReady: (duration: number) => void;
    _onProgress: (currentTime: number) => void;
    _onDuration: (duration: number) => void;
    _onStateChange: (isPlaying: boolean) => void;
}

export const AudioPlayerContext = createContext<(PlayerState & PlayerActions) | null>(null);

export function useAudioPlayer() {
    const context = useContext(AudioPlayerContext);
    if (!context) {
        throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
    }
    return context;
}

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<PlayerState>({
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        videoId: null,
        mode: 'hidden',
        videoTitle: null,
        videoComposer: null,
        videoPerformer: null,
        artworkSrc: null,
        platformUrl: null,
        platformLabel: null,
        platformType: null,
        isReady: false,
        volume: 100,
        startTime: undefined,
        endTime: undefined,
        playbackId: 0,
    });

    // NOTE: We need a mechanism to communicate with the YouTube Player instance.
    // In a cleaner architecture, we might use a ref exposed by the player,
    // but since the Player component is likely a sibling, we might need an Event Bus or 
    // simply expose 'requests' in the state that the player listens to.
    // simpler approach for now: The Context holds the "Truth", the Player component listens to it.
    // HOWEVER, `seekTo` is imperative.
    // Let's use a Mutable Ref for imperative commands to avoid re-renders or complex state flags for "seek request".

    // Actually, for React wrapper of Youtube, checking props change is enough for Play/Pause/VideoId.
    // But SeekTo usually requires calling an instance method.
    // Let's add a "seekRequest" timestamp/value to state? 
    // Or better, expose a registration callback for the player.
    const playerRef = React.useRef<any>(null); // Holds the YouTube Player object

    const setPlayerInstance = useCallback((player: any) => {
        playerRef.current = player;
    }, []);

    const play = useCallback((
        videoId?: string,
        meta?: {
            title?: string;
            composer?: string;
            performer?: string;
            artworkSrc?: string;
            platformUrl?: string;
            platformLabel?: string;
            platformType?: 'youtube' | 'default';
        },
        options?: { startTime?: number; endTime?: number }
    ) => {
        setState((prev) => {
            const newState = { ...prev, isPlaying: true, playbackId: prev.playbackId + 1 };
            if (videoId && videoId !== prev.videoId) {
                newState.videoId = videoId;
                newState.currentTime = 0; // Reset time on new video
                if (prev.mode === 'hidden') {
                    newState.mode = 'mini';
                }
                // Reset metadata if new video
                newState.videoTitle = null;
                newState.videoComposer = null;
                newState.videoPerformer = null;
                newState.artworkSrc = null;
                newState.platformUrl = null;
                newState.platformLabel = null;
                newState.platformType = null;
            }
            if (meta) {
                if (meta.title) newState.videoTitle = meta.title;
                if (meta.composer) newState.videoComposer = meta.composer;
                if (meta.performer) newState.videoPerformer = meta.performer;
                if (meta.artworkSrc) newState.artworkSrc = meta.artworkSrc;
                if (meta.platformUrl) newState.platformUrl = meta.platformUrl;
                if (meta.platformLabel) newState.platformLabel = meta.platformLabel;
                if (meta.platformType) newState.platformType = meta.platformType;
            }
            if (options) {
                newState.startTime = options.startTime;
                newState.endTime = options.endTime;
            } else {
                // If checking a new video without options, reset bounds? 
                // Or keep them? Usually reset.
                if (videoId && videoId !== prev.videoId) {
                    newState.startTime = undefined;
                    newState.endTime = undefined;
                }
            }
            return newState;
        });
    }, []);

    const pause = useCallback(() => {
        setState((prev) => ({ ...prev, isPlaying: false }));
    }, []);

    const togglePlay = useCallback(() => {
        setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
    }, []);

    const seekTo = useCallback((time: number) => {
        if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
            playerRef.current.seekTo(time, true);
            setState(prev => ({ ...prev, currentTime: time }));
        }
    }, []);

    const setVolume = useCallback((volume: number) => {
        if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
            playerRef.current.setVolume(volume);
            setState(prev => ({ ...prev, volume }));
        }
    }, []);

    const setMode = useCallback((mode: PlayerMode) => {
        setState((prev) => ({ ...prev, mode }));
    }, []);

    // --- Internal Callbacks from Player Component ---

    const _onReady = useCallback((duration: number) => {
        setState((prev) => ({ ...prev, isReady: true, duration }));
    }, []);

    const _onProgress = useCallback((currentTime: number) => {
        setState((prev) => ({ ...prev, currentTime }));
    }, []);

    const _onDuration = useCallback((duration: number) => {
        setState((prev) => ({ ...prev, duration }));
    }, []);

    const _onStateChange = useCallback((isPlaying: boolean) => {
        // Only update if different to avoid loops, though likely fine
        setState((prev) => {
            if (prev.isPlaying === isPlaying) return prev;
            return { ...prev, isPlaying };
        });
    }, []);

    const value = useMemo(() => ({
        ...state,
        play,
        pause,
        togglePlay,
        seekTo,
        setVolume,
        setMode,
        _onReady,
        _onProgress,
        _onDuration,
        _onStateChange,
        setPlayerInstance, // Internal helper to register player
    }), [state, play, pause, togglePlay, seekTo, setVolume, setMode, _onReady, _onProgress, _onDuration, _onStateChange, setPlayerInstance]);

    return (
        <AudioPlayerContext.Provider value={value}>
            {children}
        </AudioPlayerContext.Provider>
    );
}

// Extend the interface to include the internal setter
declare module './AudioPlayerContext' {
    interface PlayerActions {
        setPlayerInstance: (player: any) => void;
    }
}
