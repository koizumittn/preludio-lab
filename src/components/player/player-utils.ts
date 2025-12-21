import { PlayerPlatform, PlayerPlatformType } from '@/domain/player/PlayerConstants';

/**
 * [UI HELPER] Player URL Generator
 * 
 * Generates user-facing URLs for external platforms.
 * This belongs in the UI layer (or a shared utility) as it transforms data for display/navigation
 * and handles "Standard" URLs (e.g. www.youtube.com), disjoint from Infrastructure's "Embed" URLs.
 */
export const generateWatchUrl = (platform: PlayerPlatformType, src: string): string | null => {
    if (!src) return null;

    switch (platform) {
        case PlayerPlatform.YOUTUBE:
            return `https://www.youtube.com/watch?v=${src}`;
        default:
            return null;
    }
};
