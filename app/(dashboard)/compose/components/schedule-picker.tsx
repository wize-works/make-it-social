'use client';

import { useState } from 'react';

interface SchedulePickerProps {
    scheduledTime?: Date;
    onTimeChange: (time: Date | undefined) => void;
}

export function SchedulePicker({ scheduledTime, onTimeChange }: SchedulePickerProps) {
    const [isScheduled, setIsScheduled] = useState(!!scheduledTime);

    const handleToggle = () => {
        if (isScheduled) {
            setIsScheduled(false);
            onTimeChange(undefined);
        } else {
            setIsScheduled(true);
            // Set default to 1 hour from now
            const defaultTime = new Date();
            defaultTime.setHours(defaultTime.getHours() + 1);
            defaultTime.setMinutes(0);
            onTimeChange(defaultTime);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        if (scheduledTime) {
            newDate.setHours(scheduledTime.getHours(), scheduledTime.getMinutes());
        }
        onTimeChange(newDate);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [hours, minutes] = e.target.value.split(':').map(Number);
        const newDate = scheduledTime ? new Date(scheduledTime) : new Date();
        newDate.setHours(hours, minutes);
        onTimeChange(newDate);
    };

    const formatDateForInput = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatTimeForInput = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const minDate = formatDateForInput(new Date());

    return (
        <div className="space-y-4">
            {/* Toggle */}
            <fieldset className="fieldset">
                <legend className="fieldset-legend">
                    {isScheduled ? 'Schedule for later' : 'Publish immediately'}
                </legend>
                <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={isScheduled}
                    onChange={handleToggle}
                />
            </fieldset>

            {/* Date & Time Inputs */}
            {isScheduled && scheduledTime && (
                <div className="space-y-3">
                    {/* Date Input */}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Date</legend>
                        <input
                            type="date"
                            className="input input-bordered w-full"
                            value={formatDateForInput(scheduledTime)}
                            min={minDate}
                            onChange={handleDateChange}
                        />
                    </fieldset>

                    {/* Time Input */}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Time</legend>
                        <input
                            type="time"
                            className="input input-bordered w-full"
                            value={formatTimeForInput(scheduledTime)}
                            onChange={handleTimeChange}
                        />
                    </fieldset>

                    {/* Timezone Info */}
                    <div className="alert alert-info">
                        <i className="fa-solid fa-duotone fa-clock"></i>
                        <div className="text-xs">
                            <p className="font-medium">
                                {scheduledTime.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                            <p className="opacity-70">
                                {scheduledTime.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    timeZoneName: 'short'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="divider text-xs">Quick Select</div>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { label: '+1 hour', hours: 1 },
                            { label: '+3 hours', hours: 3 },
                            { label: 'Tomorrow 9am', hours: null, time: '09:00', addDays: 1 },
                            { label: 'Next week', hours: null, addDays: 7 },
                        ].map((preset) => (
                            <button
                                key={preset.label}
                                className="btn btn-sm btn-outline"
                                onClick={() => {
                                    const newDate = new Date();
                                    if (preset.hours) {
                                        newDate.setHours(newDate.getHours() + preset.hours);
                                    } else if (preset.addDays) {
                                        newDate.setDate(newDate.getDate() + preset.addDays);
                                        if (preset.time) {
                                            const [hours, minutes] = preset.time.split(':').map(Number);
                                            newDate.setHours(hours, minutes, 0, 0);
                                        }
                                    }
                                    onTimeChange(newDate);
                                }}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
