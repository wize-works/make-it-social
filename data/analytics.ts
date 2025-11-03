import type { AnalyticsMetrics } from '@/types';

export const mockAnalytics: AnalyticsMetrics[] = [
    {
        id: 'analytics-1',
        postId: 'post-3',
        socialAccountId: 'account-1',
        impressions: 15420,
        reach: 12350,
        likes: 847,
        comments: 32,
        shares: 18,
        clicks: 124,
        engagementRate: 5.8,
        fetchedAt: new Date('2025-10-26T12:00:00Z'),
    },
    {
        id: 'analytics-2',
        postId: 'post-3',
        socialAccountId: 'account-4',
        impressions: 8920,
        reach: 7100,
        likes: 312,
        comments: 15,
        shares: 42,
        clicks: 89,
        engagementRate: 4.2,
        fetchedAt: new Date('2025-10-26T12:00:00Z'),
    },
    {
        id: 'analytics-3',
        postId: 'post-1',
        socialAccountId: 'account-1',
        impressions: 0,
        reach: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        clicks: 0,
        engagementRate: 0,
        fetchedAt: new Date('2025-10-27T10:00:00Z'),
    },
    {
        id: 'analytics-4',
        postId: 'post-2',
        socialAccountId: 'account-2',
        impressions: 0,
        reach: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        clicks: 0,
        engagementRate: 0,
        fetchedAt: new Date('2025-10-27T10:00:00Z'),
    },
];

// Overview metrics for organization
export interface OverviewMetrics {
    totalReach: number;
    totalEngagement: number;
    engagementRate: number;
    followerGrowth: number;
    totalPosts: number;
    periodComparison: {
        reach: number; // percentage change
        engagement: number;
        followers: number;
    };
}

export interface PlatformMetrics {
    platform: string;
    posts: number;
    reach: number;
    engagement: number;
    engagementRate: number;
    topPost: {
        id: string;
        content: string;
        engagement: number;
    };
}

export interface TrendDataPoint {
    date: string;
    reach: number;
    engagement: number;
    posts: number;
}

export const mockOverviewMetrics: OverviewMetrics = {
    totalReach: 87450,
    totalEngagement: 3247,
    engagementRate: 3.71,
    followerGrowth: 1284,
    totalPosts: 24,
    periodComparison: {
        reach: 15.3, // 15.3% increase
        engagement: 8.7,
        followers: 12.4,
    },
};

export const mockPlatformMetrics: PlatformMetrics[] = [
    {
        platform: 'instagram',
        posts: 12,
        reach: 45230,
        engagement: 1847,
        engagementRate: 4.08,
        topPost: {
            id: 'post-3',
            content: '🎉 Thank you for 10K followers!',
            engagement: 897,
        },
    },
    {
        platform: 'facebook',
        posts: 8,
        reach: 28910,
        engagement: 982,
        engagementRate: 3.39,
        topPost: {
            id: 'post-3',
            content: '🎉 Thank you for 10K followers!',
            engagement: 369,
        },
    },
    {
        platform: 'twitter',
        posts: 4,
        reach: 13310,
        engagement: 418,
        engagementRate: 3.14,
        topPost: {
            id: 'post-2',
            content: '💡 Pro tip: Did you know that posting at optimal times...',
            engagement: 124,
        },
    },
];

export const mockTrendData: TrendDataPoint[] = [
    { date: '2025-10-20', reach: 12400, engagement: 456, posts: 3 },
    { date: '2025-10-21', reach: 15200, engagement: 578, posts: 4 },
    { date: '2025-10-22', reach: 13800, engagement: 492, posts: 3 },
    { date: '2025-10-23', reach: 18600, engagement: 687, posts: 5 },
    { date: '2025-10-24', reach: 16900, engagement: 621, posts: 4 },
    { date: '2025-10-25', reach: 21300, engagement: 812, posts: 6 },
    { date: '2025-10-26', reach: 24200, engagement: 934, posts: 5 },
];

export function getAnalyticsByPost(postId: string): AnalyticsMetrics[] {
    return mockAnalytics.filter(analytics => analytics.postId === postId);
}

export function getAnalyticsBySocialAccount(accountId: string): AnalyticsMetrics[] {
    return mockAnalytics.filter(analytics => analytics.socialAccountId === accountId);
}

export function getTotalEngagement(postId: string): number {
    const postAnalytics = mockAnalytics.filter(a => a.postId === postId);
    return postAnalytics.reduce((sum, a) => sum + a.likes + a.comments + a.shares, 0);
}
