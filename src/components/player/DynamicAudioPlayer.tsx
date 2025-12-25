'use client';

import dynamic from 'next/dynamic';

const AudioPlayerFeature = dynamic(
    () => import('./AudioPlayerFeature'),
    { ssr: false }
);

export function DynamicAudioPlayer() {
    return <AudioPlayerFeature />;
}
