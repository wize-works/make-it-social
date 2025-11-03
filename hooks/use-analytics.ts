import { useState, useEffect } from 'react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { apiClient } from '@/lib/api-client';
import {
    mockOverviewMetrics,
    mockPlatformMetrics,
    mockTrendData,
    type OverviewMetrics,
    type PlatformMetrics,
    type TrendDataPoint,
} from '@/data/analytics';
import type { Post } from '@/types';

interface AnalyticsData {
    overview: OverviewMetrics;
    platforms: PlatformMetrics[];
    trends: TrendDataPoint[];
    topPosts: Post[];
    isLoading: boolean;
}

export function useAnalytics(
    dateRange: { start: Date; end: Date }
): AnalyticsData {
    const { organizationId } = useOrganization();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<Omit<AnalyticsData, 'isLoading'>>({
        overview: mockOverviewMetrics,
        platforms: mockPlatformMetrics,
        trends: mockTrendData,
        topPosts: [],
    });

    useEffect(() => {
        const loadAnalytics = async () => {
            if (!organizationId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);

                // Fetch posts from API (analytics mock data used until analytics API is ready)
                const { posts: publishedPosts } = await apiClient.posts.getAll(organizationId, { status: 'published' });

                // Get top 5 posts
                const topPosts = publishedPosts.slice(0, 5);

                setData({
                    overview: mockOverviewMetrics,
                    platforms: mockPlatformMetrics,
                    trends: mockTrendData,
                    topPosts,
                });
            } catch (error) {
                console.error('Failed to load analytics:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAnalytics();
    }, [organizationId, dateRange]);

    return {
        ...data,
        isLoading,
    };
}
