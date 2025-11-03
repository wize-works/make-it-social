import type { Comment, CommentReply, PostEngagement, CommentThread } from '@/types/engagement';

/**
 * Mock comments data representing social media interactions
 */
export const mockComments: Comment[] = [
    // Recent Instagram comments (post-3: 10K followers celebration)
    {
        id: 'comment-1',
        postId: 'post-3',
        platform: 'instagram',
        platformCommentId: 'ig-comment-1',
        authorId: 'ig-user-1',
        authorUsername: 'sarah_designs',
        authorDisplayName: 'Sarah Martinez',
        authorAvatar: '/mock-images/avatar-1.jpg',
        content: 'Congratulations! 🎉 You totally deserve it! Your content is always so inspiring! ❤️',
        createdAt: new Date('2025-10-27T10:30:00Z'),
        likeCount: 12,
        replyCount: 0,
        status: 'unread',
        sentiment: 'positive',
        organizationId: 'org-1',
    },
    {
        id: 'comment-2',
        postId: 'post-3',
        platform: 'instagram',
        platformCommentId: 'ig-comment-2',
        authorId: 'ig-user-2',
        authorUsername: 'tech_enthusiast',
        authorDisplayName: 'Tech Enthusiast',
        authorAvatar: '/mock-images/avatar-2.jpg',
        content: 'This is amazing! How long did it take you to reach 10K? Any tips for growing an account?',
        createdAt: new Date('2025-10-27T09:15:00Z'),
        likeCount: 5,
        replyCount: 0,
        status: 'read',
        sentiment: 'question',
        assignedTo: 'user-1',
        organizationId: 'org-1',
    },
    {
        id: 'comment-3',
        postId: 'post-3',
        platform: 'facebook',
        platformCommentId: 'fb-comment-1',
        authorId: 'fb-user-1',
        authorUsername: 'john_marketing',
        authorDisplayName: 'John Anderson',
        authorAvatar: '/mock-images/avatar-3.jpg',
        content: 'Well deserved! Been following since day one. Can\'t wait to see what\'s next! 🚀',
        createdAt: new Date('2025-10-27T08:45:00Z'),
        likeCount: 8,
        replyCount: 0,
        status: 'replied',
        sentiment: 'positive',
        organizationId: 'org-1',
    },

    // Older comments with varying sentiments
    {
        id: 'comment-4',
        postId: 'post-3',
        platform: 'instagram',
        platformCommentId: 'ig-comment-4',
        authorId: 'ig-user-4',
        authorUsername: 'creative_studio',
        authorDisplayName: 'Creative Studio Co.',
        authorAvatar: '/mock-images/avatar-4.jpg',
        content: 'Would love to collaborate with you! DM us if interested 💼',
        createdAt: new Date('2025-10-26T16:20:00Z'),
        likeCount: 3,
        replyCount: 0,
        status: 'read',
        sentiment: 'neutral',
        assignedTo: 'user-2',
        internalNotes: 'Potential partnership opportunity - follow up',
        organizationId: 'org-1',
    },
    {
        id: 'comment-5',
        postId: 'post-3',
        platform: 'instagram',
        platformCommentId: 'ig-comment-5',
        authorId: 'ig-user-5',
        authorUsername: 'disappointed_user',
        authorDisplayName: 'Alex Thompson',
        content: 'Your recent product has been buggy for me. Not working properly on mobile 😞',
        createdAt: new Date('2025-10-26T14:30:00Z'),
        likeCount: 2,
        replyCount: 1,
        status: 'replied',
        sentiment: 'negative',
        assignedTo: 'user-1',
        internalNotes: 'Bug report - escalated to support team',
        organizationId: 'org-1',
    },
    {
        id: 'comment-6',
        postId: 'post-3',
        platform: 'facebook',
        platformCommentId: 'fb-comment-2',
        authorId: 'fb-user-2',
        authorUsername: 'emily_blogger',
        authorDisplayName: 'Emily Chen',
        authorAvatar: '/mock-images/avatar-5.jpg',
        content: 'Love your content strategy! Do you offer consulting services? 📊',
        createdAt: new Date('2025-10-26T12:00:00Z'),
        likeCount: 6,
        replyCount: 0,
        status: 'read',
        sentiment: 'question',
        organizationId: 'org-1',
    },

    // Comments from scheduled posts (future engagement simulation)
    {
        id: 'comment-7',
        postId: 'post-1',
        platform: 'instagram',
        platformCommentId: 'ig-comment-7',
        authorId: 'ig-user-7',
        authorUsername: 'early_adopter',
        authorDisplayName: 'Michael Roberts',
        content: 'When will this be available? I need this in my life! 🙏',
        createdAt: new Date('2025-10-27T11:00:00Z'),
        likeCount: 4,
        replyCount: 0,
        status: 'unread',
        sentiment: 'question',
        organizationId: 'org-1',
    },
    {
        id: 'comment-8',
        postId: 'post-1',
        platform: 'twitter',
        platformCommentId: 'tw-comment-1',
        authorId: 'tw-user-1',
        authorUsername: 'ProductHuntFan',
        authorDisplayName: 'Product Hunt Fan',
        authorAvatar: '/mock-images/avatar-6.jpg',
        content: 'This looks incredible! Will you be launching on Product Hunt? 🚀',
        createdAt: new Date('2025-10-27T09:30:00Z'),
        likeCount: 15,
        replyCount: 0,
        status: 'unread',
        sentiment: 'positive',
        organizationId: 'org-1',
    },

    // Spam example
    {
        id: 'comment-9',
        postId: 'post-3',
        platform: 'instagram',
        platformCommentId: 'ig-comment-9',
        authorId: 'ig-user-9',
        authorUsername: 'get_followers_fast',
        authorDisplayName: 'Grow Your Account',
        content: 'Get 10K followers in 24 hours! Click link in bio! 🔥🔥🔥',
        createdAt: new Date('2025-10-26T10:00:00Z'),
        likeCount: 0,
        replyCount: 0,
        status: 'spam',
        sentiment: 'neutral',
        organizationId: 'org-1',
    },

    // More recent interactions
    {
        id: 'comment-10',
        postId: 'post-3',
        platform: 'linkedin',
        platformCommentId: 'li-comment-1',
        authorId: 'li-user-1',
        authorUsername: 'professional_sarah',
        authorDisplayName: 'Sarah Williams',
        authorAvatar: '/mock-images/avatar-7.jpg',
        content: 'Impressive growth! What has been your most effective strategy for building a community?',
        createdAt: new Date('2025-10-27T07:00:00Z'),
        likeCount: 20,
        replyCount: 0,
        status: 'read',
        sentiment: 'question',
        assignedTo: 'user-1',
        organizationId: 'org-1',
    },
];

/**
 * Mock comment replies from the organization
 */
export const mockCommentReplies: CommentReply[] = [
    {
        id: 'reply-1',
        commentId: 'comment-3',
        platform: 'facebook',
        platformReplyId: 'fb-reply-1',
        content: 'Thank you so much! We have some exciting updates coming soon. Stay tuned! 🎉',
        createdBy: 'user-1',
        createdAt: new Date('2025-10-27T09:00:00Z'),
        publishedAt: new Date('2025-10-27T09:00:15Z'),
        publishStatus: 'published',
        organizationId: 'org-1',
    },
    {
        id: 'reply-2',
        commentId: 'comment-5',
        platform: 'instagram',
        platformReplyId: 'ig-reply-1',
        content: 'We\'re so sorry to hear that! Our support team has been notified and will reach out to help resolve this ASAP. Thank you for bringing this to our attention! 🙏',
        createdBy: 'user-1',
        createdAt: new Date('2025-10-26T15:00:00Z'),
        publishedAt: new Date('2025-10-26T15:00:20Z'),
        publishStatus: 'published',
        organizationId: 'org-1',
    },
    {
        id: 'reply-3',
        commentId: 'comment-5',
        platform: 'instagram',
        platformReplyId: 'ig-reply-2',
        content: 'Just following up - our team should have contacted you. Let us know if you need any other assistance!',
        createdBy: 'user-2',
        createdAt: new Date('2025-10-27T10:00:00Z'),
        publishedAt: new Date('2025-10-27T10:00:10Z'),
        publishStatus: 'published',
        organizationId: 'org-1',
    },
];

/**
 * Mock post engagement metrics
 */
export const mockPostEngagement: PostEngagement[] = [
    {
        postId: 'post-3',
        platform: 'instagram',
        likes: 1247,
        comments: 45,
        shares: 23,
        saves: 89,
        clicks: 156,
        engagementRate: 5.2,
        responseRate: 65, // 65% of comments have been replied to
        avgResponseTime: 45, // 45 minutes average
        sentimentBreakdown: {
            positive: 32,
            neutral: 8,
            negative: 5,
        },
        lastUpdated: new Date('2025-10-27T11:00:00Z'),
    },
    {
        postId: 'post-3',
        platform: 'facebook',
        likes: 892,
        comments: 28,
        shares: 67,
        clicks: 234,
        engagementRate: 4.8,
        responseRate: 50,
        avgResponseTime: 60,
        sentimentBreakdown: {
            positive: 20,
            neutral: 6,
            negative: 2,
        },
        lastUpdated: new Date('2025-10-27T11:00:00Z'),
    },
    {
        postId: 'post-1',
        platform: 'instagram',
        likes: 234,
        comments: 12,
        shares: 8,
        saves: 45,
        clicks: 67,
        engagementRate: 3.2,
        responseRate: 0, // No replies yet
        avgResponseTime: undefined,
        sentimentBreakdown: {
            positive: 10,
            neutral: 1,
            negative: 1,
        },
        lastUpdated: new Date('2025-10-27T11:30:00Z'),
    },
];

/**
 * Helper function to get comments for a specific post
 */
export function getCommentsByPost(postId: string): Comment[] {
    return mockComments.filter(comment => comment.postId === postId);
}

/**
 * Helper function to get comments by status
 */
export function getCommentsByStatus(status: Comment['status']): Comment[] {
    return mockComments.filter(comment => comment.status === status);
}

/**
 * Helper function to get unread comment count
 */
export function getUnreadCount(organizationId: string): number {
    return mockComments.filter(
        comment => comment.organizationId === organizationId && comment.status === 'unread'
    ).length;
}

/**
 * Helper function to get comments assigned to a user
 */
export function getCommentsByAssignee(userId: string): Comment[] {
    return mockComments.filter(comment => comment.assignedTo === userId);
}

/**
 * Helper function to get replies for a comment
 */
export function getRepliesByComment(commentId: string): CommentReply[] {
    return mockCommentReplies.filter(reply => reply.commentId === commentId);
}

/**
 * Helper function to build a comment thread
 */
export function getCommentThread(commentId: string): CommentThread | null {
    const comment = mockComments.find(c => c.id === commentId);
    if (!comment) return null;

    // Find all replies to this comment (nested comments)
    const replies = mockComments.filter(c => c.parentCommentId === commentId);

    // Find our organization's replies
    const ourReplies = mockCommentReplies.filter(r => r.commentId === commentId);

    return {
        comment,
        replies,
        ourReplies,
    };
}

/**
 * Helper function to get engagement metrics for a post
 */
export function getPostEngagementMetrics(postId: string, platform?: string): PostEngagement | null {
    if (platform) {
        return mockPostEngagement.find(
            e => e.postId === postId && e.platform === platform
        ) || null;
    }
    return mockPostEngagement.find(e => e.postId === postId) || null;
}

/**
 * Helper function to get all comments for an organization with filters
 */
export function getFilteredComments(
    organizationId: string,
    filters?: {
        platform?: string;
        status?: Comment['status'];
        assignedTo?: string;
        sentiment?: Comment['sentiment'];
    }
): Comment[] {
    let filtered = mockComments.filter(c => c.organizationId === organizationId);

    if (filters?.platform) {
        filtered = filtered.filter(c => c.platform === filters.platform);
    }

    if (filters?.status) {
        filtered = filtered.filter(c => c.status === filters.status);
    }

    if (filters?.assignedTo) {
        if (filters.assignedTo === 'unassigned') {
            filtered = filtered.filter(c => !c.assignedTo);
        } else {
            filtered = filtered.filter(c => c.assignedTo === filters.assignedTo);
        }
    }

    if (filters?.sentiment) {
        filtered = filtered.filter(c => c.sentiment === filters.sentiment);
    }

    // Sort by most recent first
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
