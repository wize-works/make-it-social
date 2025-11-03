/**
 * Workflow Page - Approval queue and team collaboration
 */

'use client';

import { useState } from 'react';
import { useWorkflow } from '@/hooks/use-workflow';
import type { WorkflowStatus } from '@/types/workflow';
import { WorkflowHeader } from './components/workflow-header';
import { WorkflowStats } from './components/workflow-stats';
import { WorkflowTabs } from './components/workflow-tabs';
import { ApprovalQueue } from './components/approval-queue';
import { ApprovalDetailModal } from './components/approval-detail-modal';

export default function WorkflowPage() {
    const {
        workflows,
        stats,
        isLoading,
        selectedWorkflow,
        setSelectedWorkflow,
        getByStatus,
        approve,
        reject,
        requestChanges,
    } = useWorkflow();

    const [activeTab, setActiveTab] = useState<WorkflowStatus | 'all'>('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');

    // Filter workflows
    const filteredWorkflows = getByStatus(activeTab).filter((wf) => {
        const matchesSearch =
            searchQuery === '' ||
            wf.post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            wf.submittedBy.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPriority =
            priorityFilter === 'all' || wf.priority === priorityFilter;

        return matchesSearch && matchesPriority;
    });

    return (
        <div className="min-h-screen">

            <div className='container mx-auto px-4 py-8 space-y-6'>
                {/* Header */}
                <WorkflowHeader
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    priorityFilter={priorityFilter}
                    onPriorityChange={setPriorityFilter}
                />

                {/* Stats Overview */}
                <div className="border-b border-base-300">
                    <WorkflowStats stats={stats} />
                </div>

                {/* Tabs */}
                <WorkflowTabs activeTab={activeTab} onTabChange={setActiveTab} stats={stats} />

                {/* Approval Queue */}
                <div>
                    <ApprovalQueue
                        workflows={filteredWorkflows}
                        isLoading={isLoading}
                        onSelectWorkflow={setSelectedWorkflow}
                        onApprove={approve}
                        onReject={reject}
                        onRequestChanges={requestChanges}
                    />
                </div>

                {/* Approval Detail Modal */}
                {selectedWorkflow && (
                    <ApprovalDetailModal
                        workflow={selectedWorkflow}
                        onClose={() => setSelectedWorkflow(null)}
                        onApprove={approve}
                        onReject={reject}
                        onRequestChanges={requestChanges}
                    />
                )}
            </div>
        </div>
    );
}
