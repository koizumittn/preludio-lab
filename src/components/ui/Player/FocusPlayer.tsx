'use client';

import React, { useRef, useState } from 'react';
import { useAudioPlayer } from '@/components/providers/AudioPlayerContext';
// Helper for time formatting if not available
const formatTimeHelper = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const cleanSeconds = Math.floor(seconds);
    const m = Math.floor(cleanSeconds / 60);
    const s = cleanSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

export function FocusPlayer() {
    const {
        mode,
        setMode,
        videoTitle,
        videoAuthor,
        isPlaying,
        togglePlay,
        currentTime,
        duration,
        seekTo
    } = useAudioPlayer();

    const [isDragging, setIsDragging] = useState(false);
    const [dragTime, setDragTime] = useState(0);

    if (mode !== 'focus') return null;

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDragTime(Number(e.target.value));
    };

    const handleSeekStart = () => {
        setIsDragging(true);
        setDragTime(currentTime);
    };

    const handleSeekEnd = () => {
        setIsDragging(false);
        seekTo(dragTime);
    };

    const displayTime = isDragging ? dragTime : currentTime;
    const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;

    return (
        <div className="fixed inset-0 z-[60] flex flex-col bg-paper-white text-preludio-black animate-in slide-in-from-bottom duration-300">
            {/* Header: Minimize Button */}
            <div className="flex items-center justify-between px-6 py-8">
                <button
                    onClick={() => setMode('mini')}
                    className="p-2 text-2xl hover:text-classic-gold transition-colors"
                    aria-label="Minimize Player"
                >
                    ⌄
                </button>
                <div className="text-sm font-bold tracking-widest uppercase text-gray-500">Now Playing</div>
                <div className="w-8" /> {/* Spacer for balance */}
            </div>

            {/* Content: Artwork & Info */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
                {/* Artwork Placeholder - Dynamic shadow based on playing state */}
                <div className={`
                    w-64 h-64 sm:w-80 sm:h-80 bg-gray-200 rounded-lg shadow-2xl 
                    transition-transform duration-700 ease-out
                    ${isPlaying ? 'scale-100' : 'scale-95 opacity-90'}
                `}>
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {/* Music Note Icon */}
                        <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                    </div>
                </div>

                {/* Metadata */}
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-serif font-bold text-preludio-black leading-tight max-w-md mx-auto">
                        {videoTitle || 'Unknown Title'}
                    </h2>
                    <p className="text-lg text-classic-gold font-medium">
                        {videoAuthor || 'Unknown Composer'}
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="px-6 py-12 sm:px-12 max-w-3xl mx-auto w-full space-y-6">
                {/* Seek Bar */}
                <div className="space-y-2">
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={displayTime}
                        onChange={handleSeekChange}
                        onMouseDown={handleSeekStart}
                        onMouseUp={handleSeekEnd}
                        onTouchStart={handleSeekStart}
                        onTouchEnd={handleSeekEnd}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-classic-gold"
                    />
                    <div className="flex justify-between text-xs font-mono text-gray-500">
                        <span>{formatTimeHelper(displayTime)}</span>
                        <span>{formatTimeHelper(duration)}</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-12">
                    <button className="text-4xl text-gray-400 hover:text-preludio-black transition-colors" aria-label="Previous">
                        ⏮
                    </button>
                    <button
                        onClick={togglePlay}
                        className="flex items-center justify-center w-20 h-20 bg-preludio-black text-paper-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg text-4xl pl-1"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button className="text-4xl text-gray-400 hover:text-preludio-black transition-colors" aria-label="Next">
                        ⏭
                    </button>
                </div>
            </div>
        </div>
    );
}
