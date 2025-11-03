'use client';

import { formatDistanceToNow } from 'date-fns';

export type ActivityType = 'published' | 'scheduled' | 'ai-generated' | 'approved' | 'failed';

export interface Activity {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    timestamp: Date;
    icon?: string;
    iconColor?: string;
}

interface ActivityItemProps {
    activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
    // Map activity types to default icons and colors
    const activityConfig = {
        published: {
            icon: 'fa-solid fa-duotone fa-circle-check',
            color: 'text-success',
        },
        scheduled: {
            icon: 'fa-solid fa-duotone fa-clock',
            color: 'text-info',
        },
        'ai-generated': {
            icon: 'fa-solid fa-duotone fa-sparkles',
            color: 'text-primary',
        },
        approved: {
            icon: 'fa-solid fa-duotone fa-check-double',
            color: 'text-success',
        },
        failed: {
            icon: 'fa-solid fa-duotone fa-circle-exclamation',
            color: 'text-error',
        },
    };

    const config = activityConfig[activity.type];
    const icon = activity.icon || config.icon;
    const iconColor = activity.iconColor || config.color;

    return (
        <div className="flex items-start gap-4 p-4 bg-base-100 rounded-box border border-base-300 hover:bg-base-300 transition-colors">
            <div className={`text-2xl ${iconColor} mt-1`}>
                <i className={icon}></i>
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold">{activity.title}</p>
                <p className="text-sm opacity-70 line-clamp-2">{activity.description}</p>
                <p className="text-xs opacity-50 mt-1">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
            </div>
        </div>
    );
}
