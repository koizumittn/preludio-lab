/**
 * Supported Audio Player Platforms
 */
export const PlayerPlatform = {
    YOUTUBE: 'youtube',
    DEFAULT: 'default',
} as const;

export const YOUTUBE_HOST = 'https://www.youtube-nocookie.com';

export type PlayerPlatformType = typeof PlayerPlatform[keyof typeof PlayerPlatform];
