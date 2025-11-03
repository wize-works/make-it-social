'use client';

export interface StatCardData {
    label: string;
    value: string | number;
    icon: string;
    iconColor: 'primary' | 'secondary' | 'accent' | 'success' | 'info' | 'warning' | 'error';
    trend?: {
        value: number;
        direction: 'up' | 'down';
    };
}

interface StatCardProps {
    data: StatCardData;
}

function StatCard({ data }: StatCardProps) {
    const iconColorClass = `text-${data.iconColor}`;

    return (
        <div className="stats bg-base-100 border-base-300 border shadow-md">
            <div className="stat">
                {/* Icon */}
                <div className={`stat-figure ${iconColorClass}`}>
                    <i className={`${data.icon} text-4xl`}></i>
                </div>

                {/* Title */}
                <div className="stat-title">{data.label}</div>

                {/* Value */}
                <div className={`stat-value ${iconColorClass}`}>{data.value}</div>

                {/* Trend */}
                {data.trend && (
                    <div
                        className={`stat-desc ${data.trend.direction === 'up' ? 'text-success' : 'text-error'
                            }`}
                    >
                        <i
                            className={`fa-solid fa-duotone fa-arrow-${data.trend.direction === 'up' ? 'up' : 'down'
                                } mr-1`}
                        ></i>
                        {Math.abs(data.trend.value)}% {data.trend.direction === 'up' ? 'increase' : 'decrease'}
                    </div>
                )}
            </div>
        </div>
    );
}

interface StatsGridProps {
    stats: StatCardData[];
}

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <StatCard key={index} data={stat} />
            ))}
        </div>
    );
}
