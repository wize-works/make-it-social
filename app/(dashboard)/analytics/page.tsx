'use client';

import { useState } from 'react';
import { OverviewMetrics } from './components/overview-metrics';
import { PlatformBreakdown } from './components/platform-breakdown';
import { EngagementChart } from './components/engagement-chart';
import { TopPosts } from './components/top-posts';
import { DateRangeSelector } from './components/date-range-selector';
import { useAnalytics } from '@/hooks/use-analytics';

export default function AnalyticsPage() {
    const [period] = useState<'day' | 'week' | 'month' | 'quarter' | 'year' | 'all'>('month');
    const [platform] = useState<string | undefined>(undefined);
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
        start: new Date(new Date().setDate(new Date().getDate() - 30)),
        end: new Date(),
    });

    const { overview, platforms, trends, topPosts, isLoading, error } = useAnalytics(period, platform);

    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Analytics & Insights</h1>
                        <p className="text-base-content/70">
                            Track performance and optimize your social strategy
                        </p>
                    </div>

                    {/* Date Range Selector */}
                    <DateRangeSelector
                        dateRange={dateRange}
                        onChange={setDateRange}
                    />
                </div>

                {/* Error State */}
                {error && (
                    <div className="alert alert-error mb-8">
                        <i className="fa-solid fa-duotone fa-exclamation-triangle"></i>
                        <div>
                            <h3 className="font-bold">Failed to load analytics</h3>
                            <div className="text-sm">{error.message}</div>
                        </div>
                    </div>
                )}

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="mb-8 text-center py-4">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="mt-2 opacity-70">Loading analytics data...</p>
                    </div>
                )}

                {/* Overview Metrics */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Overview</h2>
                    <OverviewMetrics metrics={overview} isLoading={isLoading} />
                </div>

                {/* Engagement Trend Chart */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Engagement Trends</h2>
                    <EngagementChart data={trends} />
                </div>

                {/* Platform Breakdown */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Platform Performance</h2>
                    <PlatformBreakdown platforms={platforms} />
                </div>

                {/* Top Performing Posts */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Top Performing Posts</h2>
                    <TopPosts posts={topPosts} />
                </div>
            </main>
        </div>
    );
}
