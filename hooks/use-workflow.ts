/**
 * Custom hook for workflow and approval management
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
    WorkflowComment,
    WorkflowActivity,
    WorkflowStats,
    WorkflowStatus,
} from '@/types/workflow';
import type { ApprovalWorkflow } from '@/types/index';
import { getWorkflowActivities } from '@/data/workflow';
import { apiClient } from '@/lib/api-client';
import { useOrganization } from '@/contexts/organization-context';
import { useContextParams } from './use-context-params';

export function useWorkflow() {
    const { organizationId } = useOrganization();
    const { companyId, productId } = useContextParams();
    const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([]);
    const [stats, setStats] = useState<WorkflowStats>({
        pending: 0,
        approved: 0,
        rejected: 0,
        changesRequested: 0,
        avgReviewTime: 0,
        overdueCount: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedWorkflow, setSelectedWorkflow] = useState<ApprovalWorkflow | null>(null);

    // Load workflows
    useEffect(() => {
        const loadWorkflows = async () => {
            if (!organizationId) {
                setWorkflows([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // Try to fetch from API (Note: workflow API would need context params added)
                const data = await apiClient.workflow.getWorkflows(organizationId);
                setWorkflows(data);

                // Calculate stats from real data
                const calculatedStats: WorkflowStats = {
                    pending: data.filter(w => w.status === 'pending').length,
                    approved: data.filter(w => w.status === 'approved').length,
                    rejected: data.filter(w => w.status === 'rejected').length,
                    changesRequested: data.filter(w => w.status === 'changes_requested').length,
                    avgReviewTime: 0, // TODO: Calculate from reviewedAt - submittedAt
                    overdueCount: 0, // TODO: Calculate based on due dates
                };
                setStats(calculatedStats);
            } catch (error) {
                console.error('Failed to load workflows from API:', error);
                setWorkflows([]);
                setStats({
                    pending: 0,
                    approved: 0,
                    rejected: 0,
                    changesRequested: 0,
                    avgReviewTime: 0,
                    overdueCount: 0,
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadWorkflows();
    }, [organizationId, companyId, productId]);

    // Get workflows by status
    const getByStatus = useCallback((status: WorkflowStatus | 'all') => {
        if (status === 'all') {
            return workflows;
        }
        return workflows.filter((wf) => wf.status === status);
    }, [workflows]);

    // Get workflow comments (fetches comments for the post associated with the workflow)
    const getComments = useCallback(async (workflowId: string): Promise<WorkflowComment[]> => {
        const workflow = workflows.find(wf => wf.id === workflowId);
        if (!workflow || !workflow.post) return [];

        try {
            const { comments } = await apiClient.comments.getAll(workflow.postId, {
                is_internal: true,
            });

            // Transform API comments to WorkflowComment format
            return comments.map((comment): WorkflowComment => ({
                id: comment.id,
                workflowId: workflowId,
                author: {
                    id: comment.user_id,
                    userId: comment.user_id,
                    name: comment.user_email.split('@')[0], // Extract name from email
                    email: comment.user_email,
                    role: 'editor', // Default role, would need to fetch from team members API
                    organizationId: workflow.organizationId,
                    joinedAt: new Date(),
                },
                content: comment.comment,
                createdAt: new Date(comment.created_at),
                updatedAt: comment.updated_at ? new Date(comment.updated_at) : undefined,
                type: 'comment', // Default type, could be enhanced based on content
            }));
        } catch (error) {
            console.error('Failed to fetch workflow comments:', error);
            return [];
        }
    }, [workflows]);

    // Get workflow activities
    const getActivities = useCallback((workflowId: string): WorkflowActivity[] => {
        return getWorkflowActivities(workflowId);
    }, []);

    // Approve workflow
    const approve = useCallback(async (workflowId: string, comment?: string): Promise<boolean> => {
        const workflow = workflows.find(w => w.id === workflowId);
        if (!workflow) return false;

        try {
            await apiClient.workflow.approvePost(workflow.postId, comment);

            // Update local state
            setWorkflows((prev) =>
                prev.map((wf) =>
                    wf.id === workflowId
                        ? {
                            ...wf,
                            status: 'approved' as const,
                            reviewedAt: new Date(),
                        }
                        : wf
                )
            );

            // Update stats
            setStats((prev) => ({
                ...prev,
                pending: Math.max(0, prev.pending - 1),
                approved: prev.approved + 1,
            }));

            return true;
        } catch (error) {
            console.error('Failed to approve workflow:', error);
            return false;
        }
    }, [workflows]);

    // Reject workflow
    const reject = useCallback(async (workflowId: string, reason: string): Promise<boolean> => {
        const workflow = workflows.find(w => w.id === workflowId);
        if (!workflow) return false;

        try {
            await apiClient.workflow.rejectPost(workflow.postId, reason);

            // Update local state
            setWorkflows((prev) =>
                prev.map((wf) =>
                    wf.id === workflowId
                        ? {
                            ...wf,
                            status: 'rejected' as const,
                            reviewedAt: new Date(),
                        }
                        : wf
                )
            );

            // Update stats
            setStats((prev) => ({
                ...prev,
                pending: Math.max(0, prev.pending - 1),
                rejected: prev.rejected + 1,
            }));

            return true;
        } catch (error) {
            console.error('Failed to reject workflow:', error);
            return false;
        }
    }, [workflows]);

    // Request changes
    const requestChanges = useCallback(async (workflowId: string, feedback: string): Promise<boolean> => {
        // Note: The workflow API doesn't have a specific "request changes" endpoint
        // We'll reject with feedback for now. This should be enhanced in the backend.
        const workflow = workflows.find(w => w.id === workflowId);
        if (!workflow) return false;

        try {
            await apiClient.workflow.rejectPost(workflow.postId, feedback);

            // Update local state
            setWorkflows((prev) =>
                prev.map((wf) =>
                    wf.id === workflowId
                        ? {
                            ...wf,
                            status: 'changes_requested' as const,
                            reviewedAt: new Date(),
                        }
                        : wf
                )
            );

            // Update stats
            setStats((prev) => ({
                ...prev,
                pending: Math.max(0, prev.pending - 1),
                changesRequested: prev.changesRequested + 1,
            }));

            return true;
        } catch (error) {
            console.error('Failed to request changes:', error);
            return false;
        }
    }, [workflows]);

    // Add comment
    const addComment = useCallback(async (workflowId: string, content: string): Promise<boolean> => {
        const workflow = workflows.find(wf => wf.id === workflowId);
        if (!workflow) {
            console.error('Workflow not found:', workflowId);
            return false;
        }

        try {
            await apiClient.comments.create(workflow.postId, {
                comment: content,
                is_internal: true,
            });
            console.log('Added comment to workflow:', workflowId, content);
            return true;
        } catch (error) {
            console.error('Failed to add comment:', error);
            return false;
        }
    }, [workflows]);

    return {
        workflows,
        stats,
        isLoading,
        selectedWorkflow,
        setSelectedWorkflow,
        getByStatus,
        getComments,
        getActivities,
        approve,
        reject,
        requestChanges,
        addComment,
    };
}
