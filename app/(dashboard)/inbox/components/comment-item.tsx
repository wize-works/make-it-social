'use client';

import { useState } from 'react';
import type { Comment } from '@/types/engagement';
import { formatDistanceToNow } from 'date-fns';
import { getPlatformIcon } from '@/lib/platform-config';
import CommentAvatar from './comment-avatar';

interface CommentItemProps {
    comment: Comment;
    onReply?: (commentId: string) => void;
    onMarkAsRead?: (commentId: string) => void;
    onArchive?: (commentId: string) => void;
    onAssign?: (commentId: string, userId?: string) => void;
    isExpanded?: boolean;
    onExpand?: (commentId: string) => void;
}

const SENTIMENT_COLORS: Record<string, string> = {
    positive: 'badge-success',
    neutral: 'badge-info',
    negative: 'badge-error',
    question: 'badge-warning',
};

export function CommentItem({
    comment,
    onReply,
    onMarkAsRead,
    onArchive,
    onAssign,
    isExpanded = false,
    onExpand,
}: CommentItemProps) {
    const [showActions, setShowActions] = useState(false);

    const platformIcon = getPlatformIcon(comment.platform);
    const sentimentColor = comment.sentiment ? SENTIMENT_COLORS[comment.sentiment] : '';

    const handleReply = () => {
        if (onReply) onReply(comment.id);
    };

    const handleMarkAsRead = () => {
        if (onMarkAsRead) onMarkAsRead(comment.id);
    };

    const handleArchive = () => {
        if (onArchive) onArchive(comment.id);
    };

    const handleExpand = () => {
        if (onExpand) onExpand(comment.id);
    };

    return (
        <div
            className={`card bg-base-100 shadow-md hover:shadow-lg transition-shadow ${comment.status === 'unread' ? 'border-l-4 border-primary' : ''
                }`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="card-body p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1">
                        {/* Avatar */}
                        <div className="avatar avatar-placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-10 h-10">
                                <span className="text-lg">
                                    <CommentAvatar authorAvatar={comment.authorAvatar ?? ""} authorDisplayName={comment.authorDisplayName} />
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            {/* Author and platform */}
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{comment.authorDisplayName}</span>
                                <span className="text-sm text-base-content/60">@{comment.authorUsername}</span>
                                <i className={platformIcon}></i>
                            </div>

                            {/* Comment text */}
                            <p className={`text-base-content/80 ${isExpanded ? '' : 'line-clamp-2'}`}>
                                {comment.content}
                            </p>

                            {/* Metadata */}
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                                <span className="text-sm text-base-content/60">
                                    {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                                </span>

                                {comment.likeCount > 0 && (
                                    <span className="text-sm text-base-content/60 flex items-center gap-1">
                                        <i className="fa-solid fa-duotone fa-heart"></i>
                                        {comment.likeCount}
                                    </span>
                                )}

                                {comment.sentiment && (
                                    <div className={`badge badge-sm ${sentimentColor}`}>
                                        {comment.sentiment}
                                    </div>
                                )}

                                {comment.status === 'unread' && (
                                    <div className="badge badge-sm badge-primary">Unread</div>
                                )}

                                {comment.status === 'replied' && (
                                    <div className="badge badge-sm badge-success">Replied</div>
                                )}

                                {comment.assignedTo && (
                                    <div className="badge badge-sm badge-accent">
                                        Assigned
                                    </div>
                                )}
                            </div>

                            {/* Internal notes */}
                            {comment.internalNotes && isExpanded && (
                                <div className="mt-2 p-2 bg-warning/10 rounded-md border border-warning/20">
                                    <span className="text-xs font-semibold text-warning">Internal Note:</span>
                                    <p className="text-sm text-base-content/70 mt-1">{comment.internalNotes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status indicator */}
                    {comment.status === 'unread' && (
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                    )}
                </div>

                {/* Actions */}
                {(showActions || isExpanded) && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-base-300">
                        <button
                            className="btn btn-sm btn-primary btn-outline"
                            onClick={handleReply}
                        >
                            Reply
                        </button>

                        {comment.status === 'unread' && (
                            <button
                                className="btn btn-sm btn-ghost"
                                onClick={handleMarkAsRead}
                            >
                                Mark Read
                            </button>
                        )}

                        <button
                            className="btn btn-sm btn-ghost"
                            onClick={handleArchive}
                        >
                            Archive
                        </button>

                        <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => onAssign?.(comment.id, comment.assignedTo ? undefined : 'user-1')}
                        >
                            {comment.assignedTo ? 'Unassign' : 'Assign'}
                        </button>

                        {!isExpanded && (
                            <button
                                className="btn btn-sm btn-ghost ml-auto"
                                onClick={handleExpand}
                            >
                                View Details
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
