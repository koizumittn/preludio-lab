'use client';

import React from 'react';
import { AudioPlayerProvider } from '@/components/player/AudioPlayerContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <AudioPlayerProvider>
            {children}
        </AudioPlayerProvider>
    );
}
