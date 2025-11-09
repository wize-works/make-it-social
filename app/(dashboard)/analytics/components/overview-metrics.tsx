import type { OverviewMetricsResponse } from '@/types';

interface OverviewMetricsProps {
    metrics: OverviewMetricsResponse | null;
    isLoading?: boolean;
}

export function OverviewMetrics({ metrics, isLoading }: OverviewMetricsProps) {
    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    // Show loading skeletons only when explicitly loading
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="stat bg-base-100 rounded-box shadow-lg">
                        <div className="skeleton h-12 w-12 mb-4"></div>
                        <div className="skeleton h-4 w-24 mb-2"></div>
                        <div className="skeleton h-8 w-32 mb-2"></div>
                        <div className="skeleton h-3 w-40"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Show empty state when no data (but not loading)
    if (!metrics) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Show zero states instead of skeletons */}
                <div className="stat bg-base-100 rounded-box shadow-lg">
                    <div className="stat-figure text-primary opacity-30">
                        <i className="fa-solid fa-duotone fa-eye text-3xl"></i>
                    </div>
                    <div className="stat-title">Total Reach</div>
                    <div className="stat-value text-primary">0</div>
                    <div className="stat-desc text-base-content/70">
                        No data yet
                    </div>
                </div>

                <div className="stat bg-base-100 rounded-box shadow-lg">
                    <div className="stat-figure text-secondary opacity-30">
                        <i className="fa-solid fa-duotone fa-chart-line text-3xl"></i>
                    </div>
                    <div className="stat-title">Total Impressions</div>
                    <div className="stat-value text-secondary">0</div>
                    <div className="stat-desc text-base-content/70">
                        No data yet
                    </div>
                </div>

                <div className="stat bg-base-100 rounded-box shadow-lg">
                    <div className="stat-figure text-accent opacity-30">
                        <i className="fa-solid fa-duotone fa-heart text-3xl"></i>
                    </div>
                    <div className="stat-title">Engagement Rate</div>
                    <div className="stat-value text-accent">0%</div>
                    <div className="stat-desc text-base-content/70">
                        No data yet
                    </div>
                </div>

                <div className="stat bg-base-100 rounded-box shadow-lg">
                    <div className="stat-figure text-info opacity-30">
                        <i className="fa-solid fa-duotone fa-file-lines text-3xl"></i>
                    </div>
                    <div className="stat-title">Total Posts</div>
                    <div className="stat-value text-info">0</div>
                    <div className="stat-desc text-base-content/70">
                        No data yet
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Reach */}
            <div className="stat bg-base-100 rounded-box shadow-lg">
                <div className="stat-figure text-primary">
                    <i className="fa-solid fa-duotone fa-eye text-3xl"></i>
                </div>
                <div className="stat-title">Total Reach</div>
                <div className="stat-value text-primary">{formatNumber(metrics.totalReach)}</div>
                <div className="stat-desc text-base-content/70">
                    Unique users reached
                </div>
            </div>

            {/* Total Impressions */}
            <div className="stat bg-base-100 rounded-box shadow-lg">
                <div className="stat-figure text-secondary">
                    <i className="fa-solid fa-duotone fa-chart-line text-3xl"></i>
                </div>
                <div className="stat-title">Total Impressions</div>
                <div className="stat-value text-secondary">{formatNumber(metrics.totalImpressions)}</div>
                <div className="stat-desc text-base-content/70">
                    Times content displayed
                </div>
            </div>

            {/* Engagement Rate */}
            <div className="stat bg-base-100 rounded-box shadow-lg">
                <div className="stat-figure text-accent">
                    <i className="fa-solid fa-duotone fa-heart text-3xl"></i>
                </div>
                <div className="stat-title">Engagement Rate</div>
                <div className="stat-value text-accent">{metrics.avgEngagementRate.toFixed(2)}%</div>
                <div className="stat-desc text-base-content/70">
                    {formatNumber(metrics.totalEngagement)} total engagements
                </div>
            </div>

            {/* Total Posts */}
            <div className="stat bg-base-100 rounded-box shadow-lg">
                <div className="stat-figure text-info">
                    <i className="fa-solid fa-duotone fa-file-lines text-3xl"></i>
                </div>
                <div className="stat-title">Total Posts</div>
                <div className="stat-value text-info">{metrics.totalPosts}</div>
                <div className="stat-desc text-base-content/70">
                    Published in {metrics.period}
                </div>
            </div>
        </div>
    );
}
