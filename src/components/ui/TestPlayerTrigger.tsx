'use client';

import { useAudioPlayer } from '@/components/providers/AudioPlayerContext';
import toast from 'react-hot-toast';

export function TestPlayerTrigger() {
    const { play } = useAudioPlayer();

    const handlePlay = () => {
        // J.S. Bach - Prelude in C Major (BWV 846) - performed by Kimiko Ishizaka (Public Domain)
        // Video ID: gVah1cr3pU0 (Example ID: actually "S6tgXo91r9w" is a common one, let's use a very stable one)
        // Let's use Glenn Gould: gVah1cr3pU0
        play('gVah1cr3pU0', {
            title: 'Prelude in C Major, BWV 846',
            author: 'J.S. Bach',
            artworkSrc: 'https://img.youtube.com/vi/gVah1cr3pU0/hqdefault.jpg',
            platformUrl: 'https://www.youtube.com/watch?v=gVah1cr3pU0',
            platformLabel: 'Watch on YouTube',
            platformType: 'youtube'
        }, {
            startTime: 10,  // Skip first 10s (Silence/Intro)
            endTime: 40     // Stop at 40s for testing
        });
    };

    const handlePlayMockArchive = () => {
        // Same video, but pretending it's from "Preludio Archives" (Non-YouTube source)
        play('gVah1cr3pU0', {
            title: 'Prelude in C Major (Archive)',
            author: 'J.S. Bach',
            artworkSrc: 'https://img.youtube.com/vi/gVah1cr3pU0/hqdefault.jpg',
            platformUrl: 'https://preludio.io/archives/bach',
            platformLabel: 'View in Archives',
            platformType: 'default' // This triggers the generic icon
        }, {
            startTime: 0,
            endTime: 15
        });
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handlePlay}
                className="px-4 py-2 bg-preludio-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors shadow-lg"
            >
                Test Play (YouTube)
            </button>
            <button
                onClick={handlePlayMockArchive}
                className="px-4 py-2 bg-white text-preludio-black border border-gray-200 text-sm font-bold rounded-full hover:bg-gray-50 transition-colors shadow-sm"
            >
                Test Play (Archive)
            </button>
            <button
                onClick={() => play('INVALID_VIDEO_ID_FOR_TESTING')}
                className="px-4 py-2 bg-red-100 text-red-700 text-sm font-bold rounded-full hover:bg-red-200 transition-colors shadow-sm"
            >
                Test Error (Invalid ID)
            </button>
            <button
                onClick={() => toast.success('Toast is working!')}
                className="px-4 py-2 bg-green-100 text-green-700 text-sm font-bold rounded-full hover:bg-green-200 transition-colors shadow-sm"
            >
                Test Toast
            </button>
        </div>
    );
}
