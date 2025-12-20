'use client';

import dynamic from 'next/dynamic';

const GlobalAudioPlayer = dynamic(
    () => import('./GlobalAudioPlayer'),
    {
        ssr: false,
        // 再生機能は背後で動くため、ロード中の表示は不要
    }
);

export default function GlobalAudioPlayerClientWrapper() {
    return <GlobalAudioPlayer />;
}
