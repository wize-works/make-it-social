'use client';

import { StatsGrid } from './components/stats-grid';
import { QuickActions } from './components/quick-actions';
import { ActivityFeed } from './components/activity-feed';
import { RecentEngagement } from './components/recent-engagement';
import { useDashboard } from '@/hooks/use-dashboard';
import { mockComments } from '@/data/engagement';

export default function DashboardPage() {
    const { stats, activities, isLoading } = useDashboard();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 opacity-70">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Stats Grid */}
            <div className="mb-8">
                <StatsGrid stats={stats} />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <QuickActions />
            </div>

            {/* Two Column Layout for Activity and Engagement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <ActivityFeed activities={activities} maxItems={5} />

                {/* Recent Engagement */}
                <RecentEngagement comments={mockComments} maxItems={5} />
            </div>
        </div>
    );
}
