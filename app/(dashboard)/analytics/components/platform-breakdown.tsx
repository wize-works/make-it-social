import type { PlatformMetricsResponse } from '@/types';

interface PlatformBreakdownProps {
    platforms: PlatformMetricsResponse[];
}

const PLATFORM_ICONS: Record<string, string> = {
    instagram: 'fa-instagram',
    facebook: 'fa-facebook',
    twitter: 'fa-twitter',
    linkedin: 'fa-linkedin',
    pinterest: 'fa-pinterest',
    tiktok: 'fa-tiktok',
    youtube: 'fa-youtube',
};

const PLATFORM_COLORS: Record<string, string> = {
    instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
    facebook: 'bg-blue-600',
    twitter: 'bg-sky-500',
    linkedin: 'bg-blue-700',
    pinterest: 'bg-red-600',
    tiktok: 'bg-black',
    youtube: 'bg-red-600',
};

export function PlatformBreakdown({ platforms }: PlatformBreakdownProps) {
    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    // Handle empty data
    if (!platforms || platforms.length === 0) {
        return (
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body text-center py-12">
                    <i className="fa-solid fa-duotone fa-share-nodes text-6xl opacity-20 mb-4"></i>
                    <h3 className="font-bold text-xl mb-2">No Platform Data Yet</h3>
                    <p className="opacity-70">
                        Connect social accounts and publish posts to see platform-specific performance
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map(platform => (
                <div key={platform.platform} className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        {/* Platform Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 rounded-lg ${PLATFORM_COLORS[platform.platform]} flex items-center justify-center text-white`}>
                                <i className={`fa-brands ${PLATFORM_ICONS[platform.platform]} text-2xl`}></i>
                            </div>
                            <div>
                                <h3 className="font-bold capitalize">{platform.platform}</h3>
                                <p className="text-sm opacity-70">{platform.posts} posts</p>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-base-300 p-3 rounded-lg">
                                <div className="text-xs opacity-70 mb-1">Reach</div>
                                <div className="font-bold text-lg">{formatNumber(platform.reach)}</div>
                            </div>
                            <div className="bg-base-300 p-3 rounded-lg">
                                <div className="text-xs opacity-70 mb-1">Engagement</div>
                                <div className="font-bold text-lg">{formatNumber(platform.engagement)}</div>
                            </div>
                        </div>

                        {/* Engagement Rate */}
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm opacity-70">Engagement Rate</span>
                                <span className="font-bold text-primary">{platform.engagementRate.toFixed(2)}%</span>
                            </div>
                            <progress
                                className="progress progress-primary w-full"
                                value={platform.engagementRate}
                                max="10"
                            ></progress>
                        </div>

                        {/* Impressions */}
                        <div className="mt-3 pt-3 border-t border-base-300">
                            <div className="text-xs opacity-70 mb-1">Total Impressions</div>
                            <div className="text-lg font-bold">{formatNumber(platform.impressions)}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
