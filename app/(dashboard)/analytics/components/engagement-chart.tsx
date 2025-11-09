import type { TrendDataResponse } from '@/types';

interface EngagementChartProps {
    data: TrendDataResponse[];
}

export function EngagementChart({ data }: EngagementChartProps) {
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    // Handle empty data
    if (!data || data.length === 0) {
        return (
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body text-center py-12">
                    <i className="fa-solid fa-duotone fa-chart-line text-6xl opacity-20 mb-4"></i>
                    <h3 className="font-bold text-xl mb-2">No Trend Data Yet</h3>
                    <p className="opacity-70">
                        Publish posts and collect analytics to see engagement trends over time
                    </p>
                </div>
            </div>
        );
    }

    // Calculate max values for scaling
    const maxReach = Math.max(...data.map(d => d.reach), 1);
    const maxEngagement = Math.max(...data.map(d => d.engagement), 1);

    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
                {/* Chart Legend */}
                <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-sm">Reach</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-secondary"></div>
                        <span className="text-sm">Engagement</span>
                    </div>
                </div>

                {/* Simple Bar Chart */}
                <div className="relative h-64">
                    <div className="absolute inset-0 flex items-end justify-between gap-2">
                        {data.map((point, index) => {
                            const reachHeight = (point.reach / maxReach) * 100;
                            const engagementHeight = (point.engagement / maxEngagement) * 100;

                            return (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    {/* Bars Container */}
                                    <div className="w-full flex items-end justify-center gap-1 h-48">
                                        {/* Reach Bar */}
                                        <div
                                            className="w-full bg-primary rounded-t hover:opacity-80 transition-opacity cursor-pointer relative group"
                                            style={{ height: `${reachHeight}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-base-100 px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                {formatNumber(point.reach)} reach
                                            </div>
                                        </div>

                                        {/* Engagement Bar */}
                                        <div
                                            className="w-full bg-secondary rounded-t hover:opacity-80 transition-opacity cursor-pointer relative group"
                                            style={{ height: `${engagementHeight}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-base-100 px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                {formatNumber(point.engagement)} eng.
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date Label */}
                                    <div className="text-xs opacity-70">{formatDate(point.date)}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-base-300">
                    <div>
                        <div className="text-sm opacity-70">Total Reach</div>
                        <div className="text-2xl font-bold text-primary">
                            {formatNumber(data.reduce((sum, d) => sum + d.reach, 0))}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm opacity-70">Total Engagement</div>
                        <div className="text-2xl font-bold text-secondary">
                            {formatNumber(data.reduce((sum, d) => sum + d.engagement, 0))}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm opacity-70">Total Posts</div>
                        <div className="text-2xl font-bold">
                            {data.reduce((sum, d) => sum + d.posts, 0)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
