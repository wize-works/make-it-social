import { SocialPlatform } from '@/types';

interface CalendarHeaderProps {
    currentMonth: Date;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onToday: () => void;
    filters: {
        platforms: SocialPlatform[];
        statuses: string[];
    };
    onTogglePlatform: (platform: SocialPlatform) => void;
    onToggleStatus: (status: string) => void;
    onClearFilters: () => void;
}

const PLATFORMS: { value: SocialPlatform; label: string; icon: string }[] = [
    { value: 'instagram', label: 'Instagram', icon: 'fa-instagram' },
    { value: 'facebook', label: 'Facebook', icon: 'fa-facebook' },
    { value: 'twitter', label: 'Twitter', icon: 'fa-twitter' },
    { value: 'linkedin', label: 'LinkedIn', icon: 'fa-linkedin' },
];

const STATUSES = [
    { value: 'draft', label: 'Draft', color: 'badge-neutral' },
    { value: 'pending', label: 'Pending', color: 'badge-warning' },
    { value: 'scheduled', label: 'Scheduled', color: 'badge-info' },
    { value: 'published', label: 'Published', color: 'badge-success' },
    { value: 'failed', label: 'Failed', color: 'badge-error' },
];

export function CalendarHeader({
    currentMonth,
    onPreviousMonth,
    onNextMonth,
    onToday,
    filters,
    onTogglePlatform,
    onToggleStatus,
    onClearFilters,
}: CalendarHeaderProps) {
    const monthName = currentMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    const hasActiveFilters = filters.platforms.length > 0 || filters.statuses.length > 0;

    return (
        <div className="mb-6 space-y-4 card bg-base-100 shadow-xl p-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold">{monthName}</h2>
                    <button onClick={onToday} className="btn btn-sm btn-outline">
                        <i className="fa-solid fa-duotone fa-calendar-day mr-2"></i>
                        Today
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onPreviousMonth}
                        className="btn btn-square btn-ghost"
                        aria-label="Previous month"
                    >
                        <i className="fa-solid fa-duotone fa-chevron-left"></i>
                    </button>
                    <button
                        onClick={onNextMonth}
                        className="btn btn-square btn-ghost"
                        aria-label="Next month"
                    >
                        <i className="fa-solid fa-duotone fa-chevron-right"></i>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="">
                <div className="">
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Platform Filters */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium opacity-70">Platforms:</span>
                            <div className="flex gap-2">
                                {PLATFORMS.map(platform => (
                                    <button
                                        key={platform.value}
                                        onClick={() => onTogglePlatform(platform.value)}
                                        className={`btn btn-sm ${filters.platforms.includes(platform.value)
                                            ? 'btn-primary'
                                            : 'btn-ghost'
                                            }`}
                                    >
                                        <i className={`fa-brands ${platform.icon}`}></i>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="divider divider-horizontal mx-0"></div>

                        {/* Status Filters */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium opacity-70">Status:</span>
                            <div className="flex gap-2 flex-wrap">
                                {STATUSES.map(status => (
                                    <button
                                        key={status.value}
                                        onClick={() => onToggleStatus(status.value)}
                                        className={`badge ${filters.statuses.includes(status.value)
                                            ? status.color
                                            : 'badge-ghost'
                                            } cursor-pointer`}
                                    >
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <>
                                <div className="divider divider-horizontal mx-0"></div>
                                <button
                                    onClick={onClearFilters}
                                    className="btn btn-sm btn-ghost"
                                >
                                    <i className="fa-solid fa-duotone fa-xmark mr-2"></i>
                                    Clear
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
