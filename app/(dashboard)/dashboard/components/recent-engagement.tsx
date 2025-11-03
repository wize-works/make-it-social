'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { Comment } from '@/types/engagement';
import { getPlatformIcon } from '@/lib/platform-config';

interface RecentEngagementProps {
    comments: Comment[];
    maxItems?: number;
}

export function RecentEngagement({ comments, maxItems = 5 }: RecentEngagementProps) {
    const recentComments = comments
        .filter(c => c.status === 'unread' || c.status === 'read')
        .slice(0, maxItems);

    const unreadCount = comments.filter(c => c.status === 'unread').length;

    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="card-title">
                        <i className="fa-solid fa-duotone fa-inbox text-primary"></i>
                        Recent Engagement
                    </h2>
                    <Link href="/inbox" className="btn btn-sm btn-ghost">
                        View All
                        <i className="fa-solid fa-duotone fa-arrow-right ml-2"></i>
                    </Link>
                </div>

                {/* Unread count badge */}
                {unreadCount > 0 && (
                    <div className="alert alert-info mb-4">
                        <i className="fa-solid fa-duotone fa-bell"></i>
                        <span>
                            <strong>{unreadCount}</strong> unread {unreadCount === 1 ? 'comment' : 'comments'}
                        </span>
                    </div>
                )}

                {/* Comments List */}
                {recentComments.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-3">
                            <i className="fa-solid fa-duotone fa-inbox"></i>
                        </div>
                        <p className="text-base-content/60">No recent comments</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentComments.map((comment) => (
                            <Link
                                key={comment.id}
                                href="/inbox"
                                className="block border border-base-300 p-3 rounded-lg hover:bg-base-300 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Platform icon */}
                                    <div className="text-2xl shrink-0">
                                        <i className={getPlatformIcon(comment.platform)}></i>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        {/* Author */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-sm truncate">
                                                @{comment.authorUsername}
                                            </span>
                                            {comment.status === 'unread' && (
                                                <div className="badge badge-xs badge-primary">New</div>
                                            )}
                                        </div>

                                        {/* Comment text */}
                                        <p className="text-sm text-base-content/70 line-clamp-2">
                                            {comment.content}
                                        </p>

                                        {/* Timestamp */}
                                        <span className="text-xs text-base-content/50 mt-1 inline-block">
                                            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                                        </span>
                                    </div>

                                    {/* Quick reply button */}
                                    <button
                                        className="btn btn-xs btn-ghost shrink-0"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // Navigate to inbox with this comment selected
                                            window.location.href = '/inbox';
                                        }}
                                    >
                                        Reply
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* View all link */}
                {recentComments.length > 0 && (
                    <div className="text-center mt-4 pt-4 border-t border-base-300">
                        <Link href="/inbox" className="link link-hover text-sm">
                            View all {comments.length} comments →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
