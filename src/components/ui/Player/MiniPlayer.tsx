'use client';

import { useAudioPlayer } from '@/components/providers/AudioPlayerContext';

/**
 * [REQ-UI-004-02] Mini Player
 * Persistent audio player bar fixed at the bottom.
 */
export function MiniPlayer() {
    const {
        mode,
        setMode,
        videoTitle,
        videoAuthor,
        isPlaying,
        togglePlay,
        currentTime,
        duration
    } = useAudioPlayer();

    if (mode === 'hidden' || mode === 'focus') return null;

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-paper-white/95 backdrop-blur-md transition-all duration-300 shadow-up">
            {/* Progress Bar */}
            <div className="h-1 w-full bg-gray-200 cursor-pointer group" onClick={() => setMode('focus')}>
                <div
                    className="h-full bg-classic-gold transition-all duration-300 ease-linear"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            <div className="container mx-auto flex items-center justify-between px-4 py-3">
                {/* Track Info */}
                <div
                    className="flex items-center gap-4 cursor-pointer flex-1"
                    onClick={() => setMode('focus')}
                    role="button"
                    aria-label="Open Full Player"
                >
                    <div className={`h-10 w-10 bg-gray-300 rounded-md flex-shrink-0 ${isPlaying ? 'animate-pulse-slow' : ''}`} /> {/* Artwork Placeholder */}
                    <div className="min-w-0 pr-4">
                        <div className="text-sm font-bold text-preludio-black truncate">
                            {videoTitle || 'Loading...'}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                            {videoAuthor || 'Preludio Lab'}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 flex-shrink-0">
                    <button className="hidden sm:block p-2 text-gray-600 hover:text-preludio-black">
                        ⏮
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-preludio-black text-paper-white hover:bg-gray-800 transition-colors shadow-md text-lg"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button className="hidden sm:block p-2 text-gray-600 hover:text-preludio-black">
                        ⏭
                    </button>
                </div>

                {/* Mode Toggle (Hidden on mobile as clicking the bar expands it) */}
                <div className="hidden sm:block ml-6 pl-6 border-l border-gray-200">
                    <button
                        onClick={() => setMode('focus')}
                        className="text-xs font-semibold uppercase tracking-wider text-classic-gold hover:underline"
                    >
                        Expand
                    </button>
                </div>
            </div>
        </div>
    );
}
