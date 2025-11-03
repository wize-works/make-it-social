/**
 * Approval Card - Individual workflow item
 */

'use client';

import type { ApprovalWorkflow } from '@/types/workflow';
import { formatDistanceToNow } from 'date-fns';

interface ApprovalCardProps {
    workflow: ApprovalWorkflow;
    onView: () => void;
    onApprove: () => void;
    onReject: () => void;
    onRequestChanges: () => void;
}

export function ApprovalCard({
    workflow,
    onView,
    onApprove,
    onReject,
    onRequestChanges,
}: ApprovalCardProps) {
    const { post, status, submittedBy, submittedAt, priority, dueDate, reviewedBy, reviewedAt } = workflow;

    // Priority badge styles
    const priorityStyles = {
        urgent: 'badge-error',
        high: 'badge-warning',
        normal: 'badge-info',
        low: 'badge-success',
    };

    // Status badge styles
    const statusStyles = {
        pending: 'badge-warning',
        approved: 'badge-success',
        rejected: 'badge-error',
        changes_requested: 'badge-info',
    };

    const statusLabels = {
        pending: 'Pending Review',
        approved: 'Approved',
        rejected: 'Rejected',
        changes_requested: 'Changes Requested',
    };

    // Check if overdue
    const isOverdue = dueDate && dueDate < new Date() && status === 'pending';

    return (
        <div className="card bg-base-100 shadow-lg hover:shadow-lg-hover transition-shadow">
            <div className="card-body p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Left: Post Preview */}
                    <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3">
                                <div className="avatar avatar-placeholder">
                                    <div className="bg-primary text-primary-content rounded-full w-10">
                                        <span className="text-lg">{submittedBy.avatar}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-semibold">{submittedBy.name}</div>
                                    <div className="text-sm text-base-content/70">
                                        Submitted {formatDistanceToNow(submittedAt, { addSuffix: true })}
                                    </div>
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="flex gap-2">
                                <span className={`badge ${priorityStyles[priority]}`}>
                                    {priority.toUpperCase()}
                                </span>
                                <span className={`badge ${statusStyles[status]}`}>
                                    {statusLabels[status]}
                                </span>
                                {isOverdue && (
                                    <span className="badge badge-error">OVERDUE</span>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mb-3">
                            <p className="line-clamp-3">{post.content}</p>
                        </div>

                        {/* Targets */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="text-sm text-base-content/70">
                                Targets: {post.targets.length} {post.targets.length === 1 ? 'account' : 'accounts'}
                            </span>
                        </div>

                        {/* Media Preview */}
                        {post.mediaUrls && post.mediaUrls.length > 0 && (
                            <div className="flex gap-2 mb-3">
                                {post.mediaUrls.slice(0, 3).map((url, index) => (
                                    <div
                                        key={index}
                                        className="w-20 h-20 bg-base-300 rounded-lg flex items-center justify-center"
                                    >
                                        <i className="fa-solid fa-duotone fa-image text-2xl text-base-content/30"></i>
                                    </div>
                                ))}
                                {post.mediaUrls.length > 3 && (
                                    <div className="w-20 h-20 bg-base-300 rounded-lg flex items-center justify-center">
                                        <span className="text-sm">+{post.mediaUrls.length - 3}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Review Info */}
                        {reviewedBy && reviewedAt && (
                            <div className="text-sm text-base-content/70 mt-3 pt-3 border-t border-base-300">
                                Reviewed by {reviewedBy.name} • {formatDistanceToNow(reviewedAt, { addSuffix: true })}
                            </div>
                        )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-row lg:flex-col gap-2 lg:w-48">
                        <button className="btn btn-outline btn-sm" onClick={onView}>
                            <i className="fa-solid fa-duotone fa-eye mr-2"></i>
                            View Details
                        </button>

                        {status === 'pending' && (
                            <>
                                <button className="btn btn-success btn-sm" onClick={onApprove}>
                                    <i className="fa-solid fa-duotone fa-check mr-2"></i>
                                    Approve
                                </button>
                                <button className="btn btn-info btn-sm" onClick={onRequestChanges}>
                                    <i className="fa-solid fa-duotone fa-comment-dots"></i> Request Changes
                                </button>
                                <button className="btn btn-error btn-sm" onClick={onReject}>
                                    <i className="fa-solid fa-duotone fa-xmark mr-2"></i>
                                    Reject
                                </button>
                            </>
                        )}

                        {status === 'changes_requested' && (
                            <button className="btn btn-success btn-sm" onClick={onApprove}>
                                <i className="fa-solid fa-duotone fa-check mr-2"></i>
                                Approve
                            </button>
                        )}

                        {dueDate && (
                            <div className="text-xs text-center text-base-content/70 mt-2">
                                Due {formatDistanceToNow(dueDate, { addSuffix: true })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
