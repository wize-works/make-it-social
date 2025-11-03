/**
 * Approval Queue - List of workflows
 */

'use client';

import type { ApprovalWorkflow } from '@/types/workflow';
import { ApprovalCard } from './approval-card';

interface ApprovalQueueProps {
    workflows: ApprovalWorkflow[];
    isLoading: boolean;
    onSelectWorkflow: (workflow: ApprovalWorkflow) => void;
    onApprove: (workflowId: string, comment?: string) => void;
    onReject: (workflowId: string, reason: string) => void;
    onRequestChanges: (workflowId: string, feedback: string) => void;
}

export function ApprovalQueue({
    workflows,
    isLoading,
    onSelectWorkflow,
    onApprove,
    onReject,
    onRequestChanges,
}: ApprovalQueueProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (workflows.length === 0) {
        return (
            <div className="text-center py-12">
                <i className="fa-solid fa-duotone fa-clipboard-check text-6xl mb-4 text-base-content/30"></i>
                <h3 className="text-xl font-semibold mb-2">No items to review</h3>
                <p className="text-base-content/70">
                    All caught up! Check back later for new submissions.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className='container mx-auto px-4 py-8 space-y-6'>
                {workflows.map((workflow) => (
                    <ApprovalCard
                        key={workflow.id}
                        workflow={workflow}
                        onView={() => onSelectWorkflow(workflow)}
                        onApprove={() => onApprove(workflow.id)}
                        onReject={() => {
                            const reason = prompt('Please provide a reason for rejection:');
                            if (reason) onReject(workflow.id, reason);
                        }}
                        onRequestChanges={() => {
                            const feedback = prompt('Please provide feedback for changes:');
                            if (feedback) onRequestChanges(workflow.id, feedback);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
