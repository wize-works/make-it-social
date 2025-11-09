import { useState, useEffect, useMemo } from 'react';
import { Post, SocialPlatform } from '@/types';
import { apiClient } from '@/lib/api-client';
import { useOrganization } from '@/contexts/organization-context';
import { useContextParams } from './use-context-params';

interface CalendarFilters {
    platforms: SocialPlatform[];
    statuses: string[];
}

export function useCalendar() {
    const { organizationId } = useOrganization();
    const { companyId, productId } = useContextParams();
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [filters, setFilters] = useState<CalendarFilters>({
        platforms: [],
        statuses: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load posts from API
        const loadPosts = async () => {
            if (!organizationId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const { posts: fetchedPosts } = await apiClient.posts.getAll(organizationId, {
                    companyId,
                    productId,
                });
                setPosts(fetchedPosts);
            } catch (error) {
                console.error('Failed to load posts:', error);
                setPosts([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadPosts();
    }, [organizationId, companyId, productId]);

    // Filter posts based on selected filters
    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            // Filter by status
            if (filters.statuses.length > 0 && !filters.statuses.includes(post.status)) {
                return false;
            }

            // Filter by platform (check if any target matches selected platforms)
            if (filters.platforms.length > 0) {
                // We'll need to cross-reference with social accounts
                // For now, return true (will implement when we have account data)
                return true;
            }

            return true;
        });
    }, [posts, filters]);

    // Get posts for a specific date
    const getPostsForDate = (date: Date): Post[] => {
        return filteredPosts.filter(post => {
            if (!post.scheduledTime) return false;

            const postDate = new Date(post.scheduledTime);
            return (
                postDate.getDate() === date.getDate() &&
                postDate.getMonth() === date.getMonth() &&
                postDate.getFullYear() === date.getFullYear()
            );
        });
    };

    // Navigate months
    const goToPreviousMonth = () => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() - 1);
            return newDate;
        });
    };

    const goToNextMonth = () => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + 1);
            return newDate;
        });
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
    };

    // Update filters
    const togglePlatformFilter = (platform: SocialPlatform) => {
        setFilters(prev => ({
            ...prev,
            platforms: prev.platforms.includes(platform)
                ? prev.platforms.filter(p => p !== platform)
                : [...prev.platforms, platform],
        }));
    };

    const toggleStatusFilter = (status: string) => {
        setFilters(prev => ({
            ...prev,
            statuses: prev.statuses.includes(status)
                ? prev.statuses.filter(s => s !== status)
                : [...prev.statuses, status],
        }));
    };

    const clearFilters = () => {
        setFilters({ platforms: [], statuses: [] });
    };

    // Reschedule a post to a new date (preserves time if provided)
    const reschedulePost = (postId: string, newDate: Date, preserveTime = true) => {
        setPosts(prev =>
            prev.map(p => {
                if (p.id !== postId) return p;

                const scheduled = new Date(newDate);
                if (preserveTime && p.scheduledTime) {
                    const old = new Date(p.scheduledTime);
                    scheduled.setHours(old.getHours(), old.getMinutes(), old.getSeconds(), old.getMilliseconds());
                } else if (!preserveTime) {
                    // ensure a sensible default time (09:00)
                    scheduled.setHours(9, 0, 0, 0);
                }

                return {
                    ...p,
                    scheduledTime: scheduled,
                    status: p.status === 'draft' ? 'scheduled' : p.status,
                    updatedAt: new Date(),
                };
            })
        );
    };

    return {
        posts: filteredPosts,
        isLoading,
        currentMonth,
        filters,
        getPostsForDate,
        goToPreviousMonth,
        goToNextMonth,
        goToToday,
        togglePlatformFilter,
        toggleStatusFilter,
        clearFilters,
        reschedulePost,
    };
}
