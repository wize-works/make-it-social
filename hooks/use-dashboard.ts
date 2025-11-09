'use client';

import { useMemo } from 'react';
import { usePosts } from './use-posts';
import { useSocialAccounts } from './use-social-accounts';
import { useOrganization } from '@/contexts/organization-context';
import { useContextParams } from './use-context-params';
import type { StatCardData } from '@/app/(dashboard)/dashboard/components/stats-grid';
import type { Activity } from '@/app/(dashboard)/dashboard/components/activity-item';

interface DashboardData {
    stats: StatCardData[];
    activities: Activity[];
    isLoading: boolean;
}

export function useDashboard(): DashboardData {
    const { organizationId } = useOrganization();
    const { companyId, productId } = useContextParams();

    // Fetch data from API (only if we have an org ID)
    const { posts, isLoading: postsLoading } = usePosts(organizationId ?? undefined, {
        companyId,
        productId,
    });
    const { accounts, isLoading: accountsLoading } = useSocialAccounts(organizationId ?? undefined, {
        companyId,
        productId,
    });

    const isLoading = postsLoading || accountsLoading;

    // Memoize stats calculation
    const stats = useMemo(() => {
        if (!posts || !accounts) return [];

        const scheduledPosts = posts.filter(p => p.status === 'scheduled');
        const publishedPosts = posts.filter(p => p.status === 'published');

        return [
            {
                label: 'Scheduled Posts',
                value: scheduledPosts.length,
                icon: 'fa-solid fa-duotone fa-calendar-check',
                iconColor: 'primary' as const,
                trend: {
                    value: 12,
                    direction: 'up' as const,
                },
            },
            {
                label: 'Total Posts',
                value: posts.length,
                icon: 'fa-solid fa-duotone fa-file-lines',
                iconColor: 'secondary' as const,
                trend: {
                    value: 8,
                    direction: 'up' as const,
                },
            },
            {
                label: 'Connected Accounts',
                value: accounts.filter(a => a.isActive).length,
                icon: 'fa-solid fa-duotone fa-share-nodes',
                iconColor: 'accent' as const,
            },
            {
                label: 'Published Posts',
                value: publishedPosts.length,
                icon: 'fa-solid fa-duotone fa-chart-line',
                iconColor: 'success' as const,
                trend: {
                    value: 3.2,
                    direction: 'up' as const,
                },
            },
        ];
    }, [posts, accounts]);

    // Memoize activities calculation
    const activities = useMemo(() => {
        if (!posts) return [];

        return posts
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5)
            .map(post => {
                const activityMap: Record<string, { type: Activity['type']; title: string }> = {
                    published: {
                        type: 'published',
                        title: 'Post published successfully',
                    },
                    scheduled: {
                        type: 'scheduled',
                        title: 'Post scheduled',
                    },
                    pending: {
                        type: 'scheduled',
                        title: 'Post pending approval',
                    },
                    approved: {
                        type: 'approved',
                        title: 'Post approved',
                    },
                    draft: {
                        type: 'ai-generated',
                        title: 'Draft saved',
                    },
                    failed: {
                        type: 'failed',
                        title: 'Post failed to publish',
                    },
                };

                const activity = activityMap[post.status] || activityMap.draft;

                return {
                    id: post.id,
                    type: activity.type,
                    title: activity.title,
                    description: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
                    timestamp: new Date(post.updatedAt),
                };
            });
    }, [posts]); return {
        stats,
        activities,
        isLoading,
    };
}
