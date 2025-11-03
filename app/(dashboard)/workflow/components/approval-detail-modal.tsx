/**
 * Approval Detail Modal - Full workflow details with comments
 */

'use client';

import { useState, useEffect } from 'react';
import type { ApprovalWorkflow, WorkflowComment } from '@/types/workflow';
import { useWorkflow } from '@/hooks/use-workflow';
import { formatDistanceToNow, format } from 'date-fns';
import { FeedbackThread } from './feedback-thread';
import { ActivityTimeline } from './activity-timeline';

interface ApprovalDetailModalProps {
    workflow: ApprovalWorkflow;
    onClose: () => void;
    onApprove: (workflowId: string, comment?: string) => void;
    onReject: (workflowId: string, reason: string) => void;
    onRequestChanges: (workflowId: string, feedback: string) => void;
}

export function ApprovalDetailModal({
    workflow,
    onClose,
    onApprove,
    onReject,
    onRequestChanges,
}: ApprovalDetailModalProps) {
    const { getComments, getActivities, addComment } = useWorkflow();
    const [activeTab, setActiveTab] = useState<'preview' | 'comments' | 'activity'>('preview');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<WorkflowComment[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);

    const activities = getActivities(workflow.id);

    // Load comments from API
    useEffect(() => {
        let isMounted = true;

        const loadComments = async () => {
            setIsLoadingComments(true);
            try {
                const fetchedComments = await getComments(workflow.id);
                if (isMounted) {
                    setComments(fetchedComments);
                }
            } catch (error) {
                console.error('Failed to load comments:', error);
            } finally {
                if (isMounted) {
                    setIsLoadingComments(false);
                }
            }
        };

        loadComments();

        return () => {
            isMounted = false;
        };
    }, [workflow.id, getComments]);

    const handleApprove = () => {
        const approvalComment = prompt('Optional: Add an approval comment');
        onApprove(workflow.id, approvalComment || undefined);
        onClose();
    };

    const handleReject = () => {
        const reason = prompt('Please provide a reason for rejection:');
        if (reason) {
            onReject(workflow.id, reason);
            onClose();
        }
    };

    const handleRequestChanges = () => {
        const feedback = prompt('Please provide feedback for changes:');
        if (feedback) {
            onRequestChanges(workflow.id, feedback);
            onClose();
        }
    };

    const handleAddComment = async () => {
        if (comment.trim()) {
            setIsLoadingComments(true);
            const success = await addComment(workflow.id, comment);
            if (success) {
                setComment('');
                // Refresh comments after adding
                const updatedComments = await getComments(workflow.id);
                setComments(updatedComments);
            }
            setIsLoadingComments(false);
        }
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-4xl">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="font-bold text-2xl mb-2">Approval Request</h3>
                        <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                                <div className="bg-primary text-primary-content rounded-full w-8">
                                    <span>{workflow.submittedBy.avatar}</span>
                                </div>
                            </div>
                            <div className="text-sm">
                                <div className="font-semibold">{workflow.submittedBy.name}</div>
                                <div className="text-base-content/70">
                                    {formatDistanceToNow(workflow.submittedAt, { addSuffix: true })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* Status Badges */}
                <div className="flex gap-2 mb-6">
                    <span className={`badge ${workflow.priority === 'urgent' ? 'badge-error' :
                        workflow.priority === 'high' ? 'badge-warning' :
                            workflow.priority === 'normal' ? 'badge-info' : 'badge-success'
                        }`}>
                        {workflow.priority.toUpperCase()}
                    </span>
                    <span className={`badge ${workflow.status === 'pending' ? 'badge-warning' :
                        workflow.status === 'approved' ? 'badge-success' :
                            workflow.status === 'rejected' ? 'badge-error' : 'badge-info'
                        }`}>
                        {workflow.status.replace('_', ' ').toUpperCase()}
                    </span>
                    {workflow.dueDate && (
                        <span className="badge badge-outline">
                            Due {format(workflow.dueDate, 'MMM d, h:mm a')}
                        </span>
                    )}
                </div>

                {/* Tabs */}
                <div className="tabs tabs-boxed mb-6">
                    <button
                        className={`tab ${activeTab === 'preview' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('preview')}
                    >
                        <i className="fa-solid fa-duotone fa-file-lines mr-2"></i> Preview
                    </button>
                    <button
                        className={`tab ${activeTab === 'comments' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('comments')}
                    >
                        <i className="fa-solid fa-duotone fa-comments mr-2"></i> Comments ({comments.length})
                    </button>
                    <button
                        className={`tab ${activeTab === 'activity' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('activity')}
                    >
                        <i className="fa-solid fa-duotone fa-clock-rotate-left mr-2"></i> Activity ({activities.length})
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mb-6">
                    {activeTab === 'preview' && (
                        <div className="space-y-4">
                            {/* Post Content */}
                            <div className="bg-base-200 rounded-box p-6">
                                <div className="prose max-w-none">
                                    <p className="whitespace-pre-wrap">{workflow.post.content}</p>
                                </div>
                            </div>

                            {/* Media */}
                            {workflow.post.mediaUrls && workflow.post.mediaUrls.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-3">Media ({workflow.post.mediaUrls.length})</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {workflow.post.mediaUrls.map((url, index) => (
                                            <div
                                                key={index}
                                                className="aspect-square bg-base-300 rounded-lg flex items-center justify-center"
                                            >
                                                <i className="fa-solid fa-duotone fa-image text-4xl text-base-content/30"></i>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Targets */}
                            <div>
                                <h4 className="font-semibold mb-3">
                                    Target Accounts ({workflow.post.targets.length})
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {workflow.post.targets.map((target) => (
                                        <span key={target.id} className="badge badge-lg badge-outline">
                                            Account {target.socialAccountId.slice(0, 8)}...
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Scheduled Time */}
                            {workflow.post.scheduledTime && (
                                <div className="bg-base-200 rounded-box p-4">
                                    <div className="text-sm text-base-content/70">Scheduled for</div>
                                    <div className="font-semibold">
                                        {format(workflow.post.scheduledTime, 'EEEE, MMMM d, yyyy \'at\' h:mm a')}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'comments' && (
                        <>
                            {isLoadingComments && comments.length === 0 ? (
                                <div className="flex justify-center items-center py-12">
                                    <span className="loading loading-spinner loading-lg"></span>
                                </div>
                            ) : (
                                <FeedbackThread
                                    comments={comments}
                                    newComment={comment}
                                    onCommentChange={setComment}
                                    onAddComment={handleAddComment}
                                />
                            )}
                        </>
                    )}

                    {activeTab === 'activity' && (
                        <ActivityTimeline activities={activities} />
                    )}
                </div>

                {/* Actions */}
                {workflow.status === 'pending' && (
                    <div className="modal-action">
                        <button className="btn btn-error" onClick={handleReject}>
                            ✕ Reject
                        </button>
                        <button className="btn btn-info" onClick={handleRequestChanges}>
                            <i className="fa-solid fa-duotone fa-comment-dots"></i> Request Changes
                        </button>
                        <button className="btn btn-success" onClick={handleApprove}>
                            ✓ Approve
                        </button>
                    </div>
                )}

                {workflow.status !== 'pending' && (
                    <div className="modal-action">
                        <button className="btn" onClick={onClose}>
                            Close
                        </button>
                    </div>
                )}
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
}
