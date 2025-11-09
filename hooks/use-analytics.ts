import { useState, useEffect } from 'react';
import { useOrganization } from '@/contexts/organization-context';
import { useContextParams } from './use-context-params';
import { apiClient } from '@/lib/api-client';
import type {
    OverviewMetricsResponse,
    PlatformMetricsResponse,
    TrendDataResponse,
    TopPostResponse
} from '@/types';

interface AnalyticsData {
    overview: OverviewMetricsResponse | null;
    platforms: PlatformMetricsResponse[];
    trends: TrendDataResponse[];
    topPosts: TopPostResponse[];
    isLoading: boolean;
    error: Error | null;
}

/**
 * Hook to fetch and manage analytics data
 * 
 * @param period - Time period for analytics ('day', 'week', 'month', 'quarter', 'year', 'all')
 * @param platform - Optional platform filter
 */
export function useAnalytics(
    period: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all' = 'month',
    platform?: string
): AnalyticsData {
    const { organizationId } = useOrganization();
    const { companyId, productId } = useContextParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<Omit<AnalyticsData, 'isLoading' | 'error'>>({
        overview: null,
        platforms: [],
        trends: [],
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
                setError(null);

                // Fetch overview metrics from Analytics API with context filtering
                const overview = await apiClient.analytics.getOverview(
                    organizationId,
                    period,
                    platform,
                    companyId,
                    productId
                );

                setData({
                    overview,
                    platforms: overview.platformBreakdown,
                    trends: overview.trends,
                    topPosts: overview.topPosts,
                });
            } catch (err) {
                console.error('Failed to load analytics:', err);
                setError(err instanceof Error ? err : new Error('Failed to load analytics'));
            } finally {
                setIsLoading(false);
            }
        };

        loadAnalytics();
    }, [organizationId, period, platform, companyId, productId]);

    return {
        ...data,
        isLoading,
        error,
    };
}
