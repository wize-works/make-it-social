/**
 * Platform Configuration
 * Centralized configuration for social media platforms including
 * icons, colors, and display metadata used throughout the application.
 */

import type { SocialPlatform } from '@/types';

export interface PlatformConfig {
    id: SocialPlatform;
    name: string;
    icon: string;
    color: string;
    bgColor: string;
    characterLimit: number;
    contentStyle: 'short' | 'medium' | 'long';
}

/**
 * Platform icon classes with brand colors
 */
export const PLATFORM_ICONS: Record<SocialPlatform, string> = {
    instagram: 'fa-brands fa-instagram text-fuchsia-600',
    facebook: 'fa-brands fa-facebook text-blue-600',
    twitter: 'fa-brands fa-x-twitter text-slate-900',
    linkedin: 'fa-brands fa-linkedin text-blue-700',
    pinterest: 'fa-brands fa-pinterest text-red-600',
    tiktok: 'fa-brands fa-tiktok text-black',
    youtube: 'fa-brands fa-youtube text-red-600',
};

/**
 * Platform brand colors (for text)
 */
export const PLATFORM_COLORS: Record<SocialPlatform, string> = {
    instagram: 'text-fuchsia-600',
    facebook: 'text-blue-600',
    twitter: 'text-slate-900',
    linkedin: 'text-blue-700',
    pinterest: 'text-red-600',
    tiktok: 'text-black',
    youtube: 'text-red-600',
};

/**
 * Platform background colors (for badges and containers)
 */
export const PLATFORM_BG_COLORS: Record<SocialPlatform, string> = {
    instagram: 'bg-fuchsia-600/10',
    facebook: 'bg-blue-600/10',
    twitter: 'bg-slate-900/10',
    linkedin: 'bg-blue-700/10',
    pinterest: 'bg-red-600/10',
    tiktok: 'bg-black/10 dark:bg-white/10',
    youtube: 'bg-red-600/10',
};

/**
 * Platform display names
 */
export const PLATFORM_NAMES: Record<SocialPlatform, string> = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
    pinterest: 'Pinterest',
    tiktok: 'TikTok',
    youtube: 'YouTube',
};

/**
 * Platform character limits
 */
export const PLATFORM_CHAR_LIMITS: Record<SocialPlatform, number> = {
    instagram: 2200, // Caption limit
    facebook: 63206, // Post limit
    twitter: 280, // Tweet limit
    linkedin: 3000, // Post limit
    pinterest: 500, // Pin description limit
    tiktok: 2200, // Caption limit
    youtube: 5000, // Video description limit
};

/**
 * Complete platform configuration objects
 */
export const PLATFORM_CONFIG: Record<SocialPlatform, PlatformConfig> = {
    instagram: {
        id: 'instagram',
        name: 'Instagram',
        icon: 'fa-brands fa-instagram text-fuchsia-600',
        color: 'text-fuchsia-600',
        bgColor: 'bg-fuchsia-600/10',
        characterLimit: 2200,
        contentStyle: 'medium',
    },
    facebook: {
        id: 'facebook',
        name: 'Facebook',
        icon: 'fa-brands fa-facebook text-blue-600',
        color: 'text-blue-600',
        bgColor: 'bg-blue-600/10',
        characterLimit: 63206,
        contentStyle: 'long',
    },
    twitter: {
        id: 'twitter',
        name: 'Twitter',
        icon: 'fa-brands fa-x-twitter text-slate-900',
        color: 'text-slate-900',
        bgColor: 'bg-slate-900/10',
        characterLimit: 280,
        contentStyle: 'short',
    },
    linkedin: {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: 'fa-brands fa-linkedin text-blue-700',
        color: 'text-blue-700',
        bgColor: 'bg-blue-700/10',
        characterLimit: 3000,
        contentStyle: 'long',
    },
    pinterest: {
        id: 'pinterest',
        name: 'Pinterest',
        icon: 'fa-brands fa-pinterest text-red-600',
        color: 'text-red-600',
        bgColor: 'bg-red-600/10',
        characterLimit: 500,
        contentStyle: 'short',
    },
    tiktok: {
        id: 'tiktok',
        name: 'TikTok',
        icon: 'fa-brands fa-tiktok text-black',
        color: 'text-black dark:text-white',
        bgColor: 'bg-black/10 dark:bg-white/10',
        characterLimit: 2200,
        contentStyle: 'medium',
    },
    youtube: {
        id: 'youtube',
        name: 'YouTube',
        icon: 'fa-brands fa-youtube text-red-600',
        color: 'text-red-600',
        bgColor: 'bg-red-600/10',
        characterLimit: 5000,
        contentStyle: 'long',
    },
};

/**
 * Array of all platforms for mapping/iteration
 */
export const ALL_PLATFORMS: PlatformConfig[] = Object.values(PLATFORM_CONFIG);

/**
 * Get platform icon class name
 */
export function getPlatformIcon(platform: SocialPlatform): string {
    return PLATFORM_ICONS[platform] || 'fa-solid fa-duotone fa-mobile';
}

/**
 * Get platform color class name
 */
export function getPlatformColor(platform: SocialPlatform): string {
    return PLATFORM_COLORS[platform] || 'text-base-content';
}

/**
 * Get platform background color class name
 */
export function getPlatformBgColor(platform: SocialPlatform): string {
    return PLATFORM_BG_COLORS[platform] || 'bg-base-300';
}

/**
 * Get platform display name
 */
export function getPlatformName(platform: SocialPlatform): string {
    return PLATFORM_NAMES[platform] || platform;
}

/**
 * Get complete platform configuration
 */
export function getPlatformConfig(platform: SocialPlatform): PlatformConfig {
    return PLATFORM_CONFIG[platform] || {
        id: platform,
        name: platform,
        icon: 'fa-solid fa-duotone fa-mobile',
        color: 'text-base-content',
        bgColor: 'bg-base-300',
    };
}
