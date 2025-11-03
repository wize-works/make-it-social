'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '@/types';
import { getCommentsByPost, getPostEngagementMetrics } from '@/data/engagement';
import { ReplyBox } from '@/app/(dashboard)/inbox/components/reply-box';
import { getPlatformIcon } from '@/lib/platform-config';

interface PostEngagementModalProps {
    post: Post;
    isOpen: boolean;
    onClose: () => void;
}

const SENTIMENT_COLORS: Record<string, string> = {
    positive: 'badge-success',
    neutral: 'badge-info',
    negative: 'badge-error',
    question: 'badge-warning',
};

export function PostEngagementModal({ post, isOpen, onClose }: PostEngagementModalProps) {
    const [activeTab, setActiveTab] = useState<'preview' | 'engagement'>('engagement');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    if (!isOpen) return null;

    const comments = getCommentsByPost(post.id);
    const engagement = post.targets[0] ? getPostEngagementMetrics(post.id, post.targets[0].socialAccountId) : null;

    const handleSendReply = async (commentId: string, content: string) => {
        console.log('Sending reply to', commentId, content);
        setReplyingTo(null);
        // In real app, call API to send reply
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-4xl max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-2xl">Post Details</h3>
                    <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Tabs */}
                <div className="tabs tabs-boxed mb-4">
                    <button
                        className={`tab ${activeTab === 'preview' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('preview')}
                    >
                        Preview
                    </button>
                    <button
                        className={`tab ${activeTab === 'engagement' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('engagement')}
                    >
                        Engagement
                        {comments.length > 0 && (
                            <span className="badge badge-sm badge-primary ml-2">{comments.length}</span>
                        )}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="overflow-y-auto max-h-[60vh]">
                    {activeTab === 'preview' ? (
                        /* Preview Tab */
                        <div className="space-y-4">
                            <div className="card bg-base-200">
                                <div className="card-body">
                                    <p className="text-base">{post.content}</p>
                                    {post.mediaUrls.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 gap-2">
                                            {post.mediaUrls.map((url, idx) => (
                                                <div key={idx} className="aspect-square bg-base-300 rounded-lg"></div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-2 mt-4">
                                        {post.targets.map((target) => (
                                            <div key={target.id} className="badge badge-outline">
                                                Target platform
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Engagement Tab */
                        <div className="space-y-4">
                            {/* Engagement Metrics Summary */}
                            {engagement && (
                                <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                                    <div className="stat">
                                        <div className="stat-title">Likes</div>
                                        <div className="stat-value text-primary">{engagement.likes}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">Comments</div>
                                        <div className="stat-value text-secondary">{engagement.comments}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">Shares</div>
                                        <div className="stat-value text-accent">{engagement.shares}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">Engagement Rate</div>
                                        <div className="stat-value text-success">{engagement.engagementRate}%</div>
                                    </div>
                                </div>
                            )}

                            {/* Comments Section */}
                            <div>
                                <h4 className="font-semibold text-lg mb-3">
                                    Comments ({comments.length})
                                </h4>

                                {comments.length === 0 ? (
                                    <div className="card bg-base-200">
                                        <div className="card-body text-center">
                                            <div className="text-4xl mb-2">
                                                <i className="fa-solid fa-comments"></i>
                                            </div>
                                            <p className="text-base-content/60">No comments yet</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {comments.map((comment) => (
                                            <div key={comment.id}>
                                                <div className="card bg-base-200 hover:bg-base-300 transition-colors">
                                                    <div className="card-body p-4">
                                                        <div className="flex items-start gap-3">
                                                            {/* Avatar */}
                                                            <div className="avatar placeholder">
                                                                <div className="bg-neutral text-neutral-content rounded-full w-10 h-10">
                                                                    <span>{comment.authorDisplayName[0]}</span>
                                                                </div>
                                                            </div>

                                                            {/* Content */}
                                                            <div className="flex-1">
                                                                {/* Author and platform */}
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-semibold text-sm">
                                                                        {comment.authorDisplayName}
                                                                    </span>
                                                                    <span className="text-xs text-base-content/60">
                                                                        @{comment.authorUsername}
                                                                    </span>
                                                                    <i className={getPlatformIcon(comment.platform)}></i>
                                                                </div>

                                                                {/* Comment text */}
                                                                <p className="text-sm text-base-content/80">
                                                                    {comment.content}
                                                                </p>

                                                                {/* Metadata */}
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <span className="text-xs text-base-content/50">
                                                                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                                                                    </span>

                                                                    {comment.sentiment && (
                                                                        <div className={`badge badge-xs ${SENTIMENT_COLORS[comment.sentiment]}`}>
                                                                            {comment.sentiment}
                                                                        </div>
                                                                    )}

                                                                    {comment.status === 'unread' && (
                                                                        <div className="badge badge-xs badge-primary">Unread</div>
                                                                    )}

                                                                    {comment.status === 'replied' && (
                                                                        <div className="badge badge-xs badge-success">Replied</div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Reply button */}
                                                            <button
                                                                className="btn btn-xs btn-primary btn-outline"
                                                                onClick={() => setReplyingTo(comment.id)}
                                                            >
                                                                Reply
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Reply box */}
                                                {replyingTo === comment.id && (
                                                    <div className="ml-12 mt-2">
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
                                )}
                            </div>

                            {/* View in Inbox Link */}
                            {comments.length > 0 && (
                                <div className="text-center pt-4 border-t border-base-300">
                                    <a href="/inbox" className="link link-hover">
                                        View all comments in Inbox →
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="modal-action">
                    <button className="btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>

            {/* Backdrop */}
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
}
