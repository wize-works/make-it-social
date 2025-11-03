import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Comment, CommentThread, InboxFilters, EngagementActionResult } from '@/types/engagement';
import {
    getFilteredComments,
    getCommentThread,
    getUnreadCount,
    getRepliesByComment
} from '@/data/engagement';

/**
 * Custom hook for managing engagement/inbox functionality
 */
export function useEngagement(organizationId: string) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<InboxFilters>({});
    const [selectedComment, setSelectedComment] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    // Load comments based on filters
    useEffect(() => {
        let isMounted = true;

        // Simulate API call delay
        setTimeout(() => {
            if (!isMounted) return;

            const filtered = getFilteredComments(organizationId, {
                platform: filters.platforms?.[0],
                status: filters.status?.[0],
                assignedTo: filters.assignedTo === 'me' ? 'user-1' : filters.assignedTo,
                sentiment: filters.sentiment?.[0],
            });

            // Apply search filter if present
            let result = filtered;
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                result = filtered.filter(comment =>
                    comment.content.toLowerCase().includes(query) ||
                    comment.authorUsername.toLowerCase().includes(query) ||
                    comment.authorDisplayName.toLowerCase().includes(query)
                );
            }

            setComments(result);
            setUnreadCount(getUnreadCount(organizationId));
            setIsLoading(false);
        }, 300);

        return () => {
            isMounted = false;
        };
    }, [organizationId, filters]);

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
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                setComments(prev =>
                    prev.map(c =>
                        c.id === commentId ? { ...c, status: 'read' } : c
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
                resolve({ success: true, message: 'Comment marked as read' });
            }, 200);
        });
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
        return new Promise((resolve) => {
            setTimeout(() => {
                setComments(prev =>
                    prev.map(c =>
                        c.id === commentId ? { ...c, status: 'archived' } : c
                    )
                );
                resolve({ success: true, message: 'Comment archived' });
            }, 200);
        });
    }, []);

    /**
     * Mark comment as spam
     */
    const markAsSpam = useCallback(async (commentId: string): Promise<EngagementActionResult> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                setComments(prev =>
                    prev.map(c =>
                        c.id === commentId ? { ...c, status: 'spam' } : c
                    )
                );
                resolve({ success: true, message: 'Comment marked as spam' });
            }, 200);
        });
    }, []);

    /**
     * Assign comment to team member
     */
    const assignComment = useCallback(async (
        commentId: string,
        userId: string | undefined
    ): Promise<EngagementActionResult> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                setComments(prev =>
                    prev.map(c =>
                        c.id === commentId ? { ...c, assignedTo: userId } : c
                    )
                );
                const message = userId ? 'Comment assigned' : 'Comment unassigned';
                resolve({ success: true, message });
            }, 200);
        });
    }, []);

    /**
     * Reply to a comment
     */
    const replyToComment = useCallback(async (
        commentId: string,
        _content: string
    ): Promise<EngagementActionResult> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Update comment status to 'replied'
                setComments(prev =>
                    prev.map(c =>
                        c.id === commentId ? { ...c, status: 'replied' } : c
                    )
                );

                // In a real app, this would create a new reply via API
                // For now, we just update the status
                resolve({ success: true, message: 'Reply sent successfully' });
            }, 500);
        });
    }, []);

    /**
     * Add internal note to comment
     */
    const addInternalNote = useCallback(async (
        commentId: string,
        note: string
    ): Promise<EngagementActionResult> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                setComments(prev =>
                    prev.map(c =>
                        c.id === commentId ? { ...c, internalNotes: note } : c
                    )
                );
                resolve({ success: true, message: 'Note added' });
            }, 200);
        });
    }, []);

    /**
     * Get full comment thread
     */
    const getThread = useCallback((commentId: string): CommentThread | null => {
        return getCommentThread(commentId);
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

        // Simulate API call
        setTimeout(() => {
            if (!isMounted) return;

            const threadData = getCommentThread(commentId);
            setThread(threadData);
            setIsLoading(false);
        }, 200);

        return () => {
            isMounted = false;
        };
    }, [commentId]);

    /**
     * Send a reply to this thread
     */
    const sendReply = useCallback(async (_content: string): Promise<EngagementActionResult> => {
        setIsReplying(true);

        return new Promise((resolve) => {
            setTimeout(() => {
                // In real app, this would call the API and update the thread
                setIsReplying(false);
                resolve({ success: true, message: 'Reply sent' });
            }, 500);
        });
    }, []);

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
    const replies = useMemo(() => getRepliesByComment(commentId), [commentId]);
    return replies;
}
