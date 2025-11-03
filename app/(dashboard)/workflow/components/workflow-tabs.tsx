/**
 * Workflow Tabs - Filter by status
 */

'use client';

import type { WorkflowStatus } from '@/types/workflow';
import type { WorkflowStats } from '@/types/workflow';

interface WorkflowTabsProps {
    activeTab: WorkflowStatus | 'all';
    onTabChange: (tab: WorkflowStatus | 'all') => void;
    stats: WorkflowStats;
}

export function WorkflowTabs({ activeTab, onTabChange, stats }: WorkflowTabsProps) {
    const tabs = [
        { id: 'all', label: 'All', count: stats.pending + stats.approved + stats.rejected + stats.changesRequested, badge: '' },
        { id: 'pending', label: 'Pending', count: stats.pending, badge: 'badge-warning' },
        { id: 'changes_requested', label: 'Changes Requested', count: stats.changesRequested, badge: 'badge-info' },
        { id: 'approved', label: 'Approved', count: stats.approved, badge: 'badge-success' },
        { id: 'rejected', label: 'Rejected', count: stats.rejected, badge: 'badge-error' },
    ];

    return (
        <div className="bg-base-200 border-b border-base-300">
            <div className="tabs tabs-boxed bg-transparent p-4 gap-2 flex-wrap">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab tab-lg gap-2 ${activeTab === tab.id ? 'tab-active' : ''
                            }`}
                        onClick={() => onTabChange(tab.id as WorkflowStatus | 'all')}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className={`badge badge-sm ${tab.badge || ''}`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
