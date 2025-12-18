import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AudioPlayerProvider, useAudioPlayer } from './AudioPlayerContext';

describe('AudioPlayerContext', () => {
    it('provides default values', () => {
        const { result } = renderHook(() => useAudioPlayer(), {
            wrapper: AudioPlayerProvider,
        });

        expect(result.current.mode).toBe('hidden');
        expect(result.current.isPlaying).toBe(false);
    });

    it('updates state on play()', () => {
        const { result } = renderHook(() => useAudioPlayer(), {
            wrapper: AudioPlayerProvider,
        });

        act(() => {
            result.current.play('test-video-id', {
                title: 'Test Song',
                composer: 'Test Artist'
            });
        });

        expect(result.current.isPlaying).toBe(true);
        expect(result.current.videoId).toBe('test-video-id');
        expect(result.current.videoTitle).toBe('Test Song');
        expect(result.current.videoTitle).toBe('Test Song');
        expect(result.current.videoComposer).toBe('Test Artist');
    });

    it('updates platform metadata on play()', () => {
        const { result } = renderHook(() => useAudioPlayer(), {
            wrapper: AudioPlayerProvider,
        });

        act(() => {
            result.current.play('test-video-id', {
                platformUrl: 'https://example.com',
                platformLabel: 'External Link',
                platformType: 'default'
            });
        });

        expect(result.current.platformUrl).toBe('https://example.com');
        expect(result.current.platformLabel).toBe('External Link');
        expect(result.current.platformType).toBe('default');
    });
});
