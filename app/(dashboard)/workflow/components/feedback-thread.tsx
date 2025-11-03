/**
 * Feedback Thread - Comments and discussions
 */

'use client';

import type { WorkflowComment } from '@/types/workflow';
import { formatDistanceToNow } from 'date-fns';

interface FeedbackThreadProps {
    comments: WorkflowComment[];
    newComment: string;
    onCommentChange: (comment: string) => void;
    onAddComment: () => void;
}

export function FeedbackThread({
    comments,
    newComment,
    onCommentChange,
    onAddComment,
}: FeedbackThreadProps) {
    const getCommentIcon = (type: WorkflowComment['type']) => {
        switch (type) {
            case 'approval':
                return <i className="fa-solid fa-duotone fa-circle-check"></i>;
            case 'rejection':
                return <i className="fa-solid fa-duotone fa-circle-xmark"></i>;
            case 'feedback':
                return <i className="fa-solid fa-duotone fa-lightbulb"></i>;
            default:
                return <i className="fa-solid fa-duotone fa-comment"></i>;
        }
    };

    const getCommentBadge = (type: WorkflowComment['type']) => {
        switch (type) {
            case 'approval':
                return 'badge-success';
            case 'rejection':
                return 'badge-error';
            case 'feedback':
                return 'badge-info';
            default:
                return 'badge-ghost';
        }
    };

    return (
        <div className="space-y-4">
            {/* Comment List */}
            {comments.length === 0 ? (
                <div className="text-center py-8 text-base-content/70">
                    <i className="fa-solid fa-duotone fa-comments text-4xl mb-2 opacity-30"></i>
                    <p>No comments yet. Be the first to add feedback!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-base-200 rounded-box p-4">
                            <div className="flex items-start gap-3">
                                <div className="avatar placeholder">
                                    <div className="bg-primary text-primary-content rounded-full w-10">
                                        <span>{comment.author.avatar}</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold">{comment.author.name}</span>
                                        <span className={`badge badge-sm ${getCommentBadge(comment.type)}`}>
                                            {getCommentIcon(comment.type)} {comment.type}
                                        </span>
                                        <span className="text-xs text-base-content/70">
                                            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="whitespace-pre-wrap">{comment.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* New Comment */}
            <div className="border-t border-base-300 pt-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Add Comment</span>
                    </label>
                    <textarea
                        className="textarea textarea-bordered h-24"
                        placeholder="Share your thoughts or feedback..."
                        value={newComment}
                        onChange={(e) => onCommentChange(e.target.value)}
                    />
                    <div className="mt-2 flex justify-end">
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={onAddComment}
                            disabled={!newComment.trim()}
                        >
                            Post Comment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
