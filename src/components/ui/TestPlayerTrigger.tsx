'use client';

import { useAudioPlayer } from '@/components/providers/AudioPlayerContext';

export function TestPlayerTrigger() {
    const { play } = useAudioPlayer();

    const handlePlay = () => {
        // J.S. Bach - Prelude in C Major (BWV 846) - performed by Kimiko Ishizaka (Public Domain)
        // Video ID: gVah1cr3pU0 (Example ID: actually "S6tgXo91r9w" is a common one, let's use a very stable one)
        // Let's use Glenn Gould: gVah1cr3pU0
        play('gVah1cr3pU0', {
            title: 'Prelude in C Major, BWV 846',
            author: 'J.S. Bach'
        }, {
            startTime: 5,   // Skip first 5s (Silence/Intro)
            // endTime: 30  // Removed endTime to allow testing of Seek without force-stopping
        });
    };

    return (
        <button
            onClick={handlePlay}
            className="mt-4 rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
            ▶ Test Play (BWV 846)
        </button>
    );
}
