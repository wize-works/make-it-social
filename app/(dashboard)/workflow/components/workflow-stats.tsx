/**
 * Workflow Stats - Overview metrics
 */

'use client';

import type { WorkflowStats as WorkflowStatsType } from '@/types/workflow';

interface WorkflowStatsProps {
    stats: WorkflowStatsType;
}

export function WorkflowStats({ stats }: WorkflowStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Pending */}
            <div className="stat bg-base-100 rounded-xl p-4">
                <div className="stat-title">Pending Review</div>
                <div className="stat-value text-warning">{stats.pending}</div>
                <div className="stat-desc">Awaiting approval</div>
            </div>

            {/* Approved */}
            <div className="stat bg-base-100 rounded-xl p-4">
                <div className="stat-title">Approved</div>
                <div className="stat-value text-success">{stats.approved}</div>
                <div className="stat-desc">Ready to publish</div>
            </div>

            {/* Changes Requested */}
            <div className="stat bg-base-100 rounded-xl p-4">
                <div className="stat-title">Changes Needed</div>
                <div className="stat-value text-info">{stats.changesRequested}</div>
                <div className="stat-desc">Needs revision</div>
            </div>

            {/* Rejected */}
            <div className="stat bg-base-100 rounded-xl p-4">
                <div className="stat-title">Rejected</div>
                <div className="stat-value text-error">{stats.rejected}</div>
                <div className="stat-desc">Not approved</div>
            </div>

            {/* Avg Review Time */}
            <div className="stat bg-base-100 rounded-xl p-4">
                <div className="stat-title">Avg Review Time</div>
                <div className="stat-value">{stats.avgReviewTime}h</div>
                <div className="stat-desc">Response time</div>
            </div>

            {/* Overdue */}
            <div className="stat bg-base-100 rounded-xl p-4">
                <div className="stat-title">Overdue</div>
                <div className="stat-value text-error">{stats.overdueCount}</div>
                <div className="stat-desc">Past deadline</div>
            </div>
        </div>
    );
}
