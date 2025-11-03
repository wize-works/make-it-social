import type { OverviewMetrics as OverviewMetricsType } from '@/data/analytics';

interface OverviewMetricsProps {
    metrics: OverviewMetricsType;
}

export function OverviewMetrics({ metrics }: OverviewMetricsProps) {
    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const formatPercentage = (num: number): string => {
        const sign = num >= 0 ? '+' : '';
        return `${sign}${num.toFixed(1)}%`;
    };

    const getChangeColor = (change: number): string => {
        if (change > 0) return 'text-success';
        if (change < 0) return 'text-error';
        return 'text-base-content';
    };

    const getChangeIcon = (change: number): string => {
        if (change > 0) return 'fa-arrow-up';
        if (change < 0) return 'fa-arrow-down';
        return 'fa-minus';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Reach */}
            <div className="stat bg-base-100 rounded-box shadow-lg">
                <div className="stat-figure text-primary">
                    <i className="fa-solid fa-duotone fa-eye text-3xl"></i>
                </div>
                <div className="stat-title">Total Reach</div>
                <div className="stat-value text-primary">{formatNumber(metrics.totalReach)}</div>
                <div className={`stat-desc ${getChangeColor(metrics.periodComparison.reach)}`}>
                    <i className={`fa-solid fa-duotone ${getChangeIcon(metrics.periodComparison.reach)} mr-1`}></i>
                    {formatPercentage(metrics.periodComparison.reach)} from last period
                </div>
            </div>

            {/* Engagement Rate */}
            <div className="stat bg-base-100 rounded-box shadow-lg">
                <div className="stat-figure text-secondary">
                    <i className="fa-solid fa-duotone fa-heart text-3xl"></i>
                </div>
                <div className="stat-title">Engagement Rate</div>
                <div className="stat-value text-secondary">{metrics.engagementRate}%</div>
                <div className={`stat-desc ${getChangeColor(metrics.periodComparison.engagement)}`}>
                    <i className={`fa-solid fa-duotone ${getChangeIcon(metrics.periodComparison.engagement)} mr-1`}></i>
                    {formatPercentage(metrics.periodComparison.engagement)} from last period
                </div>
            </div>

            {/* Follower Growth */}
            <div className="stat bg-base-100 rounded-box shadow-lg">
                <div className="stat-figure text-accent">
                    <i className="fa-solid fa-duotone fa-user-plus text-3xl"></i>
                </div>
                <div className="stat-title">Follower Growth</div>
                <div className="stat-value text-accent">{formatNumber(metrics.followerGrowth)}</div>
                <div className={`stat-desc ${getChangeColor(metrics.periodComparison.followers)}`}>
                    <i className={`fa-solid fa-duotone ${getChangeIcon(metrics.periodComparison.followers)} mr-1`}></i>
                    {formatPercentage(metrics.periodComparison.followers)} from last period
                </div>
            </div>

            {/* Total Posts */}
            <div className="stat bg-base-100 rounded-box shadow-lg">
                <div className="stat-figure text-info">
                    <i className="fa-solid fa-duotone fa-file-lines text-3xl"></i>
                </div>
                <div className="stat-title">Total Posts</div>
                <div className="stat-value text-info">{metrics.totalPosts}</div>
                <div className="stat-desc">
                    {formatNumber(metrics.totalEngagement)} total engagements
                </div>
            </div>
        </div>
    );
}
