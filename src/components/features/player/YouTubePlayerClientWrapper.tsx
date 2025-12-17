'use client';

import dynamic from 'next/dynamic';

const YouTubePlayerRenderer = dynamic(
    () => import('./YouTubePlayerRenderer'),
    {
        ssr: false,
        // No loading state needed for invisible player
    }
);

export default function YouTubePlayerClientWrapper() {
    return <YouTubePlayerRenderer />;
}
