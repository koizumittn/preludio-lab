'use client';

import { useState } from 'react';

/**
 * [REQ-UI-004-02] Mini Player
 * Persistent audio player bar fixed at the bottom.
 */
export function MiniPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const togglePlay = () => setIsPlaying(!isPlaying);
    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-paper-white/95 backdrop-blur-md transition-all duration-300">
            {/* Progress Bar (Mock) */}
            <div className="h-1 w-full bg-gray-200">
                <div className="h-full w-1/3 bg-classic-gold" />
            </div>

            <div className="container mx-auto flex items-center justify-between px-4 py-3">
                {/* Track Info */}
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-gray-300 rounded-md" /> {/* Artwork Placeholder */}
                    <div>
                        <div className="text-sm font-bold text-preludio-black">Prelude in C Major</div>
                        <div className="text-xs text-gray-500">J.S. Bach</div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-600 hover:text-preludio-black">
                        ⏮
                    </button>
                    <button
                        onClick={togglePlay}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-preludio-black text-paper-white hover:bg-gray-800"
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button className="p-2 text-gray-600 hover:text-preludio-black">
                        ⏭
                    </button>
                </div>

                {/* Mode Toggle */}
                <button
                    onClick={toggleExpand}
                    className="hidden sm:block text-xs font-semibold uppercase tracking-wider text-classic-gold hover:underline"
                >
                    {isExpanded ? 'Minimize' : 'Focus Mode'}
                </button>
            </div>
        </div>
    );
}
