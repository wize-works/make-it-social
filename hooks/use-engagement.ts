import { useState, useEffect, useCallback } from 'react';
import type { Comment, CommentThread, InboxFilters, EngagementActionResult, CommentReply } from '@/types/engagement';
import { apiClient } from '@/lib/api-client';
import { useContextParams } from './use-context-params';

/**
 * Custom hook for managing engagement/inbox functionality
 */
export function useEngagement(organizationId: string) {
    const { companyId, productId } = useContextParams();
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<InboxFilters>({});
    const [selectedComment, setSelectedComment] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    // Load comments based on filters
    useEffect(() => {
        let isMounted = true;

        const fetchEngagements = async () => {
            try {
                setIsLoading(true);

                // Convert frontend filters to API format
                const apiFilters: Record<string, string | number> = {};

                // Add context filters
                if (companyId) apiFilters.companyId = companyId;
                if (productId) apiFilters.productId = productId;

                if (filters.platforms?.length) {
                    apiFilters.platform = filters.platforms[0];
                }
                if (filters.status?.length) {
                    apiFilters.status = filters.status[0];
                }
                if (filters.sentiment?.length) {
                    apiFilters.sentiment = filters.sentiment[0];
                }
                if (filters.assignedTo) {
                    apiFilters.assignedTo = filters.assignedTo;
                }
                if (filters.searchQuery) {
                    apiFilters.search = filters.searchQuery;
                }
                if (filters.postId) {
                    apiFilters.postId = filters.postId;
                }

                const response = await apiClient.engagement.getEngagements(apiFilters);

                if (!isMounted) return;

                setComments(response.data);
                setUnreadCount(response.meta.unreadCount);
            } catch (error) {
                console.error('Failed to fetch engagements:', error);
                setComments([]);
                setUnreadCount(0);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchEngagements();

        return () => {
            isMounted = false;
        };
    }, [organizationId, filters, companyId, productId]);

    /**
     * Update filters
     */
    const updateFilters = useCallback((newFilters: Partial<InboxFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    /**
     * Clear all filters
     */
    const clearFilters = useCallback(() => {
        setFilters({});
    }, []);

    /**
     * Mark comment as read
     */
    const markAsRead = useCallback(async (commentId: string): Promise<EngagementActionResult> => {
        try {
            await apiClient.engagement.updateEngagement(commentId, { status: 'read' });

            // Update local state
            setComments(prev =>
                prev.map(c =>
                    c.id === commentId ? { ...c, status: 'read' } : c
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));

            return { success: true, message: 'Comment marked as read' };
        } catch (error) {
            console.error('Failed to mark as read:', error);
            return { success: false, error: 'Failed to mark as read' };
        }
    }, []);

    /**
     * Mark multiple comments as read
     */
    const markMultipleAsRead = useCallback(async (commentIds: string[]): Promise<EngagementActionResult> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                setComments(prev =>
                    prev.map(c =>
                        commentIds.includes(c.id) ? { ...c, status: 'read' } : c
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - commentIds.length));
                resolve({ success: true, message: `${commentIds.length} comments marked as read` });
            }, 300);
        });
    }, []);

    /**
     * Archive a comment
     */
    const archiveComment = useCallback(async (commentId: string): Promise<EngagementActionResult> => {
        try {
            await apiClient.engagement.updateEngagement(commentId, { status: 'archived' });

            // Update local state
            setComments(prev =>
                prev.map(c =>
                    c.id === commentId ? { ...c, status: 'archived' } : c
                )
            );

            return { success: true, message: 'Comment archived' };
        } catch (error) {
            console.error('Failed to archive comment:', error);
            return { success: false, error: 'Failed to archive comment' };
        }
    }, []);

    /**
     * Mark comment as spam
     */
    const markAsSpam = useCallback(async (commentId: string): Promise<EngagementActionResult> => {
        try {
            await apiClient.engagement.updateEngagement(commentId, { status: 'spam' });

            // Update local state
            setComments(prev =>
                prev.map(c =>
                    c.id === commentId ? { ...c, status: 'spam' } : c
                )
            );

            return { success: true, message: 'Comment marked as spam' };
        } catch (error) {
            console.error('Failed to mark as spam:', error);
            return { success: false, error: 'Failed to mark as spam' };
        }
    }, []);

    /**
     * Assign comment to team member
     */
    const assignComment = useCallback(async (
        commentId: string,
        userId: string | undefined
    ): Promise<EngagementActionResult> => {
        try {
            await apiClient.engagement.updateEngagement(commentId, {
                assignedTo: userId || null,
            });

            // Update local state
            setComments(prev =>
                prev.map(c =>
                    c.id === commentId ? { ...c, assignedTo: userId } : c
                )
            );

            const message = userId ? 'Comment assigned' : 'Comment unassigned';
            return { success: true, message };
        } catch (error) {
            console.error('Failed to assign comment:', error);
            return { success: false, error: 'Failed to assign comment' };
        }
    }, []);

    /**
     * Reply to a comment
     */
    const replyToComment = useCallback(async (
        commentId: string,
        content: string
    ): Promise<EngagementActionResult> => {
        try {
            await apiClient.engagement.replyToEngagement(commentId, { content });

            // Update comment status to 'replied'
            setComments(prev =>
                prev.map(c =>
                    c.id === commentId ? { ...c, status: 'replied' } : c
                )
            );

            return { success: true, message: 'Reply sent successfully' };
        } catch (error) {
            console.error('Failed to send reply:', error);
            return { success: false, error: 'Failed to send reply' };
        }
    }, []);

    /**
     * Add internal note to comment
     */
    const addInternalNote = useCallback(async (
        commentId: string,
        note: string
    ): Promise<EngagementActionResult> => {
        try {
            await apiClient.engagement.updateEngagement(commentId, { internalNotes: note });

            // Update local state
            setComments(prev =>
                prev.map(c =>
                    c.id === commentId ? { ...c, internalNotes: note } : c
                )
            );

            return { success: true, message: 'Note added' };
        } catch (error) {
            console.error('Failed to add note:', error);
            return { success: false, error: 'Failed to add note' };
        }
    }, []);

    /**
     * Get full comment thread
     */
    const getThread = useCallback(async (commentId: string): Promise<CommentThread | null> => {
        try {
            const response = await apiClient.engagement.getEngagementThread(commentId);
            // Map API response to CommentThread type
            return {
                comment: response.engagement,
                replies: response.childEngagements,
                ourReplies: response.ourResponses,
            };
        } catch (error) {
            console.error('Failed to fetch thread:', error);
            return null;
        }
    }, []);

    /**
     * Select/deselect a comment
     */
    const selectComment = useCallback((commentId: string | null) => {
        setSelectedComment(commentId);
    }, []);

    return {
        // State
        comments,
        isLoading,
        filters,
        selectedComment,
        unreadCount,

        // Filter actions
        updateFilters,
        clearFilters,

        // Comment actions
        markAsRead,
        markMultipleAsRead,
        archiveComment,
        markAsSpam,
        assignComment,
        replyToComment,
        addInternalNote,
        selectComment,
        getThread,
    };
}

/**
 * Hook for managing a single comment thread
 */
export function useCommentThread(commentId: string) {
    const [thread, setThread] = useState<CommentThread | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isReplying, setIsReplying] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchThread = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.engagement.getEngagementThread(commentId);

                if (isMounted) {
                    // Map API response to CommentThread type
                    setThread({
                        comment: response.engagement,
                        replies: response.childEngagements,
                        ourReplies: response.ourResponses,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch thread:', error);
                if (isMounted) {
                    setThread(null);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchThread();

        return () => {
            isMounted = false;
        };
    }, [commentId]);

    /**
     * Send a reply to this thread
     */
    const sendReply = useCallback(async (content: string): Promise<EngagementActionResult> => {
        try {
            setIsReplying(true);
            await apiClient.engagement.replyToEngagement(commentId, { content });
            return { success: true, message: 'Reply sent' };
        } catch (error) {
            console.error('Failed to send reply:', error);
            return { success: false, error: 'Failed to send reply' };
        } finally {
            setIsReplying(false);
        }
    }, [commentId]);

    return {
        thread,
        isLoading,
        isReplying,
        sendReply,
    };
}

/**
 * Hook for getting replies to a specific comment
 */
export function useCommentReplies(commentId: string) {
    const [replies, setReplies] = useState<CommentReply[]>([]);

    useEffect(() => {
        let isMounted = true;

        const fetchReplies = async () => {
            try {
                const response = await apiClient.engagement.getEngagementThread(commentId);

                if (isMounted && response) {
                    setReplies(response.ourResponses);
                }
            } catch (error) {
                console.error('Failed to fetch replies:', error);
                if (isMounted) {
                    setReplies([]);
                }
            }
        };

        fetchReplies();

        return () => {
            isMounted = false;
        };
    }, [commentId]);

    return replies;
}
