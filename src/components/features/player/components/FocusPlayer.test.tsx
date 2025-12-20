import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FocusPlayer } from './FocusPlayer';
import { AudioPlayerContext } from '@/components/providers/AudioPlayerContext';

// Mock context value helper
const mockContextValue = (overrides = {}) => ({
    isPlaying: false,
    src: null,
    currentTime: 0,
    duration: 0,
    volume: 100,
    mode: 'focus' as const,
    title: 'Test Title',
    composer: 'Test Composer',
    performer: 'Test Performer',
    artworkSrc: null,
    platformUrl: null,
    platformLabel: null,
    platform: null,
    isReady: true,
    play: vi.fn(),
    pause: vi.fn(),
    togglePlay: vi.fn(),
    seekTo: vi.fn(),
    setVolume: vi.fn(),
    setMode: vi.fn(),
    setPlayerInstance: vi.fn(),
    _onReady: vi.fn(),
    _onStateChange: vi.fn(),
    _onProgress: vi.fn(),
    _onDuration: vi.fn(),
    startSeconds: undefined,
    endSeconds: undefined,
    playbackId: 0,
    ...overrides,
});

describe('FocusPlayer', () => {
    it('renders metadata correctly', () => {
        render(
            <AudioPlayerContext.Provider value={mockContextValue()}>
                <FocusPlayer />
            </AudioPlayerContext.Provider>
        );
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Composer')).toBeInTheDocument();
    });

    it('renders "Watch on YouTube" link when platform data is provided', () => {
        render(
            <AudioPlayerContext.Provider value={mockContextValue({
                platformUrl: 'https://youtube.com/watch?v=123',
                platformLabel: 'Watch on YouTube',
                platform: 'youtube'
            })}>
                <FocusPlayer />
            </AudioPlayerContext.Provider>
        );

        const link = screen.getByText('Watch on YouTube').closest('a');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', 'https://youtube.com/watch?v=123');
    });

    it('does not render link if platformUrl is missing', () => {
        render(
            <AudioPlayerContext.Provider value={mockContextValue({
                platformUrl: null
            })}>
                <FocusPlayer />
            </AudioPlayerContext.Provider>
        );

        expect(screen.queryByText('Watch on YouTube')).not.toBeInTheDocument();
    });
});
