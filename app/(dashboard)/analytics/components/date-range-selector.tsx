import { useState } from 'react';

interface DateRangeSelectorProps {
    dateRange: { start: Date; end: Date };
    onChange: (range: { start: Date; end: Date }) => void;
}

const PRESET_RANGES = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
];

export function DateRangeSelector({ dateRange, onChange }: DateRangeSelectorProps) {
    const [isCustom, setIsCustom] = useState(false);

    const handlePresetClick = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);
        onChange({ start, end });
        setIsCustom(false);
    };

    const handleCustomRange = (start: string, end: string) => {
        if (start && end) {
            onChange({
                start: new Date(start),
                end: new Date(end),
            });
        }
    };

    return (
        <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-outline">
                <i className="fa-solid fa-duotone fa-calendar-range mr-2"></i>
                {dateRange.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {' - '}
                {dateRange.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                <i className="fa-solid fa-duotone fa-chevron-down ml-2"></i>
            </button>
            <div
                tabIndex={0}
                className="dropdown-content menu bg-base-200 rounded-box w-80 p-4 shadow-lg mt-2"
            >
                {/* Preset Ranges */}
                <div className="mb-4">
                    <div className="text-sm font-bold mb-2">Quick Select</div>
                    <div className="flex flex-col gap-2">
                        {PRESET_RANGES.map(preset => (
                            <button
                                key={preset.days}
                                onClick={() => handlePresetClick(preset.days)}
                                className="btn btn-sm btn-ghost justify-start"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Range Toggle */}
                <div className="divider my-2"></div>
                <button
                    onClick={() => setIsCustom(!isCustom)}
                    className="btn btn-sm btn-ghost justify-start mb-2"
                >
                    <i className="fa-solid fa-duotone fa-calendar mr-2"></i>
                    Custom Range
                    <i className={`fa-solid fa-duotone fa-chevron-${isCustom ? 'up' : 'down'} ml-auto`}></i>
                </button>

                {/* Custom Range Inputs */}
                {isCustom && (
                    <div className="space-y-3 mt-2">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-xs">Start Date</span>
                            </label>
                            <input
                                type="date"
                                className="input input-bordered input-sm"
                                defaultValue={dateRange.start.toISOString().split('T')[0]}
                                onChange={(e) =>
                                    handleCustomRange(e.target.value, dateRange.end.toISOString().split('T')[0])
                                }
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-xs">End Date</span>
                            </label>
                            <input
                                type="date"
                                className="input input-bordered input-sm"
                                defaultValue={dateRange.end.toISOString().split('T')[0]}
                                onChange={(e) =>
                                    handleCustomRange(dateRange.start.toISOString().split('T')[0], e.target.value)
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
