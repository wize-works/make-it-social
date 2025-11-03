// Engagement and comment management types for Make It Social

import { SocialPlatform } from './index';

/**
 * Represents a comment or interaction on a social media post
 */
export interface Comment {
    id: string;
    postId: string;
    platform: SocialPlatform;
    platformCommentId: string; // ID from the social platform

    // Author information
    authorId: string; // Platform-specific user ID
    authorUsername: string;
    authorDisplayName: string;
    authorAvatar?: string;

    // Comment content
    content: string;
    mediaUrls?: string[]; // Some platforms allow media in comments

    // Metadata
    createdAt: Date;
    updatedAt?: Date;
    likeCount: number;

    // Threading support
    parentCommentId?: string; // For nested replies
    replyCount: number;

    // Management
    status: CommentStatus;
    sentiment?: CommentSentiment;
    assignedTo?: string; // Team member ID
    internalNotes?: string; // Private notes for team

    // Organization context
    organizationId: string;
}

export type CommentStatus = 'unread' | 'read' | 'replied' | 'archived' | 'spam';

export type CommentSentiment = 'positive' | 'neutral' | 'negative' | 'question';

/**
 * Represents a reply made by the organization to a comment
 */
export interface CommentReply {
    id: string;
    commentId: string;
    platform: SocialPlatform;
    platformReplyId?: string; // ID from platform (null if not yet published)

    // Reply content
    content: string;
    mediaUrls?: string[];

    // Metadata
    createdBy: string; // Team member who created the reply
    createdAt: Date;
    publishedAt?: Date;
    publishStatus: 'draft' | 'publishing' | 'published' | 'failed';
    errorMessage?: string;

    // Organization context
    organizationId: string;
}

/**
 * Aggregated engagement metrics for a post
 */
export interface PostEngagement {
    postId: string;
    platform: SocialPlatform;

    // Interaction counts
    likes: number;
    comments: number;
    shares: number;
    saves?: number; // Instagram, Pinterest
    retweets?: number; // Twitter
    clicks?: number;

    // Computed metrics
    engagementRate: number;
    responseRate: number; // % of comments we've replied to
    avgResponseTime?: number; // Average time to reply (in minutes)

    // Breakdown
    sentimentBreakdown?: {
        positive: number;
        neutral: number;
        negative: number;
    };

    lastUpdated: Date;
}

/**
 * Filter options for the inbox
 */
export interface InboxFilters {
    platforms?: SocialPlatform[];
    status?: CommentStatus[];
    sentiment?: CommentSentiment[];
    assignedTo?: string | 'unassigned' | 'me';
    dateRange?: {
        start: Date;
        end: Date;
    };
    postId?: string;
    searchQuery?: string;
}

/**
 * Conversation thread (comment + all replies)
 */
export interface CommentThread {
    comment: Comment;
    replies: Comment[]; // Nested replies
    ourReplies: CommentReply[]; // Replies from our team
}

/**
 * Notification for new engagement
 */
export interface EngagementNotification {
    id: string;
    type: 'new_comment' | 'new_reply' | 'mention' | 'high_priority';
    commentId: string;
    postId: string;
    platform: SocialPlatform;
    preview: string;
    createdAt: Date;
    isRead: boolean;
}

/**
 * Action result for operations like reply, assign, etc.
 */
export interface EngagementActionResult {
    success: boolean;
    message?: string;
    error?: string;
}
