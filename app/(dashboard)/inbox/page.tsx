'use client';

import { useState } from 'react';
import { useEngagement } from '@/hooks/use-engagement';
import { InboxFilters } from './components/inbox-filters';
import { CommentItem } from './components/comment-item';
import { ReplyBox } from './components/reply-box';
import type { Comment } from '@/types/engagement';

export default function InboxPage() {
    const {
        comments,
        isLoading,
        filters,
        unreadCount,
        updateFilters,
        clearFilters,
        markAsRead,
        archiveComment,
        assignComment,
        replyToComment,
    } = useEngagement('org-1');

    const [expandedComment, setExpandedComment] = useState<string | null>(null);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const handleReply = (commentId: string) => {
        setReplyingTo(commentId);
        setExpandedComment(commentId);
    };

    const handleSendReply = async (commentId: string, content: string) => {
        const result = await replyToComment(commentId, content);
        if (result.success) {
            setReplyingTo(null);
            // Show success toast
            console.log('Reply sent successfully');
        }
    };

    const handleMarkAsRead = async (commentId: string) => {
        await markAsRead(commentId);
    };

    const handleArchive = async (commentId: string) => {
        await archiveComment(commentId);
    };

    const handleAssign = async (commentId: string, userId?: string) => {
        await assignComment(commentId, userId);
    };

    const handleExpand = (commentId: string) => {
        setExpandedComment(expandedComment === commentId ? null : commentId);
    };

    // Group comments by date
    const groupedComments = comments.reduce((groups, comment) => {
        const date = new Date(comment.createdAt);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let groupLabel: string;
        if (date.toDateString() === today.toDateString()) {
            groupLabel = 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            groupLabel = 'Yesterday';
        } else {
            groupLabel = date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
            });
        }

        if (!groups[groupLabel]) {
            groups[groupLabel] = [];
        }
        groups[groupLabel].push(comment);
        return groups;
    }, {} as Record<string, Comment[]>);

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Inbox</h1>
                        <p className="text-base-content/60 mt-1">
                            Manage all your social media engagement in one place
                        </p>
                    </div>

                    {/* Unread count */}
                    {unreadCount > 0 && (
                        <div className="badge badge-primary badge-lg">
                            {unreadCount} unread
                        </div>
                    )}
                </div>

                {/* Filters */}
                <InboxFilters
                    filters={filters}
                    onFiltersChange={updateFilters}
                    onClearFilters={clearFilters}
                />

                {/* Comments List */}
                <div className="space-y-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="card bg-base-200">
                            <div className="card-body items-center text-center">
                                <div className="text-6xl mb-4">
                                    <i className="fa-solid fa-inbox"></i>
                                </div>
                                <h2 className="card-title">No comments found</h2>
                                <p className="text-base-content/60">
                                    {Object.keys(filters).length > 0
                                        ? 'Try adjusting your filters to see more results'
                                        : 'When people comment on your posts, they\'ll appear here'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        Object.entries(groupedComments).map(([dateLabel, dateComments]) => (
                            <div key={dateLabel}>
                                {/* Date header */}
                                <div className="flex items-center gap-4 mb-4">
                                    <h2 className="text-xl font-semibold">{dateLabel}</h2>
                                    <div className="flex-1 h-px bg-base-300"></div>
                                    <span className="text-sm text-base-content/60">
                                        {dateComments.length} {dateComments.length === 1 ? 'comment' : 'comments'}
                                    </span>
                                </div>

                                {/* Comments for this date */}
                                <div className="space-y-4">
                                    {dateComments.map((comment) => (
                                        <div key={comment.id}>
                                            <CommentItem
                                                comment={comment}
                                                onReply={handleReply}
                                                onMarkAsRead={handleMarkAsRead}
                                                onArchive={handleArchive}
                                                onAssign={handleAssign}
                                                isExpanded={expandedComment === comment.id}
                                                onExpand={handleExpand}
                                            />

                                            {/* Reply box */}
                                            {replyingTo === comment.id && (
                                                <div className="mt-4 ml-12">
                                                    <ReplyBox
                                                        platform={comment.platform}
                                                        onSend={(content) => handleSendReply(comment.id, content)}
                                                        onCancel={() => setReplyingTo(null)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Load more placeholder */}
                {comments.length > 0 && (
                    <div className="flex justify-center py-6">
                        <button className="btn btn-outline">Load More</button>
                    </div>
                )}
            </div>
        </div>
    );
}
