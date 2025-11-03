/**
 * Activity Timeline - Workflow history
 */

'use client';

import type { WorkflowActivity } from '@/types/workflow';
import { formatDistanceToNow, format } from 'date-fns';

interface ActivityTimelineProps {
    activities: WorkflowActivity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
    const getActivityIcon = (action: WorkflowActivity['action']) => {
        switch (action) {
            case 'submitted':
                return <i className="fa-solid fa-duotone fa-paper-plane"></i>;
            case 'approved':
                return <i className="fa-solid fa-duotone fa-circle-check"></i>;
            case 'rejected':
                return <i className="fa-solid fa-duotone fa-circle-xmark"></i>;
            case 'changes_requested':
                return <i className="fa-solid fa-duotone fa-lightbulb"></i>;
            case 'commented':
                return <i className="fa-solid fa-duotone fa-comment"></i>;
            case 'updated':
                return <i className="fa-solid fa-duotone fa-pen"></i>;
            default:
                return <i className="fa-solid fa-duotone fa-file"></i>;
        }
    };

    const getActivityColor = (action: WorkflowActivity['action']) => {
        switch (action) {
            case 'submitted':
                return 'bg-info';
            case 'approved':
                return 'bg-success';
            case 'rejected':
                return 'bg-error';
            case 'changes_requested':
                return 'bg-warning';
            case 'commented':
                return 'bg-base-300';
            case 'updated':
                return 'bg-primary';
            default:
                return 'bg-base-300';
        }
    };

    const getActivityLabel = (action: WorkflowActivity['action']) => {
        return action.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    if (activities.length === 0) {
        return (
            <div className="text-center py-8 text-base-content/70">
                <i className="fa-solid fa-duotone fa-clock-rotate-left text-4xl mb-2 opacity-30"></i>
                <p>No activity yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activities.map((activity, index) => (
                <div key={activity.id} className="flex gap-4">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full ${getActivityColor(activity.action)} flex items-center justify-center text-xl`}>
                            {getActivityIcon(activity.action)}
                        </div>
                        {index < activities.length - 1 && (
                            <div className="w-0.5 flex-1 bg-base-300 my-2"></div>
                        )}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 pb-8">
                        <div className="bg-base-200 rounded-box p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">{activity.actor.name}</span>
                                <span className="badge badge-sm">{getActivityLabel(activity.action)}</span>
                            </div>
                            <div className="text-sm text-base-content/70 mb-2">
                                {format(activity.timestamp, 'MMM d, yyyy \'at\' h:mm a')} •{' '}
                                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                            </div>
                            {activity.metadata?.comment && (
                                <div className="mt-2 p-3 bg-base-300 rounded-lg">
                                    <p className="text-sm italic">&ldquo;{activity.metadata.comment}&rdquo;</p>
                                </div>
                            )}
                            {activity.metadata?.previousStatus && activity.metadata?.newStatus && (
                                <div className="mt-2 text-sm">
                                    Status changed from{' '}
                                    <span className="font-semibold">{activity.metadata.previousStatus}</span>
                                    {' '}to{' '}
                                    <span className="font-semibold">{activity.metadata.newStatus}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
