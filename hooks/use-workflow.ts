/**
 * Custom hook for workflow and approval management
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
    ApprovalWorkflow,
    WorkflowComment,
    WorkflowActivity,
    WorkflowStats,
    WorkflowStatus,
} from '@/types/workflow';
import {
    mockWorkflows,
    mockWorkflowStats,
    getWorkflowActivities,
} from '@/data/workflow';
import { apiClient } from '@/lib/api-client';

export function useWorkflow() {
    const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([]);
    const [stats, setStats] = useState<WorkflowStats>(mockWorkflowStats);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedWorkflow, setSelectedWorkflow] = useState<ApprovalWorkflow | null>(null);

    // Load workflows
    useEffect(() => {
        const loadWorkflows = async () => {
            setIsLoading(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            setWorkflows(mockWorkflows);
            setStats(mockWorkflowStats);
            setIsLoading(false);
        };

        loadWorkflows();
    }, []);

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
        if (!workflow) return [];

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
                    organizationId: workflow.post.organizationId,
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
    const approve = useCallback((workflowId: string, comment?: string) => {
        setWorkflows((prev) =>
            prev.map((wf) =>
                wf.id === workflowId
                    ? {
                        ...wf,
                        status: 'approved' as WorkflowStatus,
                        reviewedAt: new Date(),
                    }
                    : wf
            )
        );

        // Update stats
        setStats((prev) => ({
            ...prev,
            pending: prev.pending - 1,
            approved: prev.approved + 1,
        }));

        // In real app, this would call API
        console.log('Approved workflow:', workflowId, comment);
    }, []);

    // Reject workflow
    const reject = useCallback((workflowId: string, reason: string) => {
        setWorkflows((prev) =>
            prev.map((wf) =>
                wf.id === workflowId
                    ? {
                        ...wf,
                        status: 'rejected' as WorkflowStatus,
                        reviewedAt: new Date(),
                    }
                    : wf
            )
        );

        // Update stats
        setStats((prev) => ({
            ...prev,
            pending: prev.pending - 1,
            rejected: prev.rejected + 1,
        }));

        console.log('Rejected workflow:', workflowId, reason);
    }, []);

    // Request changes
    const requestChanges = useCallback((workflowId: string, feedback: string) => {
        setWorkflows((prev) =>
            prev.map((wf) =>
                wf.id === workflowId
                    ? {
                        ...wf,
                        status: 'changes_requested' as WorkflowStatus,
                        reviewedAt: new Date(),
                    }
                    : wf
            )
        );

        // Update stats
        setStats((prev) => ({
            ...prev,
            pending: prev.pending - 1,
            changesRequested: prev.changesRequested + 1,
        }));

        console.log('Requested changes:', workflowId, feedback);
    }, []);

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
