'use client';

import React from 'react';
import { AudioPlayerProvider } from '@/components/providers/AudioPlayerContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <AudioPlayerProvider>
            {children}
        </AudioPlayerProvider>
    );
}
