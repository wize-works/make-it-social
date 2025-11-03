'use client';

import Link from 'next/link';

export interface QuickAction {
    label: string;
    icon: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'accent' | 'outline';
}

interface QuickActionsProps {
    actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
    {
        label: 'Create Post',
        icon: 'fa-solid fa-duotone fa-pen',
        href: '/compose',
        variant: 'primary',
    },
    {
        label: 'View Calendar',
        icon: 'fa-solid fa-duotone fa-calendar-days',
        href: '/calendar',
        variant: 'secondary',
    },
    {
        label: 'AI Assistant',
        icon: 'fa-solid fa-duotone fa-sparkles',
        href: '/ai-assistant',
        variant: 'accent',
    },
    {
        label: 'Analytics',
        icon: 'fa-solid fa-duotone fa-chart-simple',
        href: '/analytics',
        variant: 'outline',
    },
];

export function QuickActions({ actions = defaultActions }: QuickActionsProps) {
    return (
        <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
                <h2 className="card-title mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {actions.map((action, index) => {
                        const buttonClass = `btn ${action.variant === 'outline'
                            ? 'btn-outline'
                            : `btn-${action.variant || 'primary'}`
                            }`;

                        const content = (
                            <>
                                <i className={`${action.icon} mr-2`}></i>
                                {action.label}
                            </>
                        );

                        if (action.href) {
                            return (
                                <Link key={index} href={action.href} className={buttonClass}>
                                    {content}
                                </Link>
                            );
                        }

                        return (
                            <button key={index} onClick={action.onClick} className={buttonClass}>
                                {content}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
