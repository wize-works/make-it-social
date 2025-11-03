'use client';

import { ActivityItem, type Activity } from './activity-item';

interface ActivityFeedProps {
    activities: Activity[];
    maxItems?: number;
}

export function ActivityFeed({ activities, maxItems = 10 }: ActivityFeedProps) {
    const displayedActivities = activities.slice(0, maxItems);

    if (activities.length === 0) {
        return (
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title mb-4">Recent Activity</h2>
                    <div className="text-center py-8 opacity-70">
                        <i className="fa-solid fa-duotone fa-inbox text-4xl mb-4"></i>
                        <p>No recent activity</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="card-title">Recent Activity</h2>
                    {activities.length > maxItems && (
                        <a href="/activity" className="text-sm link link-primary">
                            View all ({activities.length})
                        </a>
                    )}
                </div>
                <div className="space-y-3">
                    {displayedActivities.map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                    ))}
                </div>
            </div>
        </div>
    );
}
