'use client';

import { useState, useEffect, useCallback } from 'react';
import { useContextParams } from '@/hooks/use-context-params';

interface CalendarEvent {
    id: string;
    organization_id: string;
    company_id?: string;
    product_id?: string;
    title: string;
    description?: string;
    event_date: string;
    event_type: 'post' | 'campaign' | 'meeting' | 'deadline' | 'other';
    is_all_day: boolean;
    reminder_enabled: boolean;
    reminder_minutes_before?: number;
    related_post_id?: string;
    related_campaign_id?: string;
    color?: string;
    created_by: string;
    created_at: string;
    updated_at: string;
}

interface ContentCalendarViewProps {
    className?: string;
}

export function ContentCalendarView({ className = '' }: ContentCalendarViewProps) {
    const { companyId, productId } = useContextParams();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [viewType, setViewType] = useState<'list' | 'calendar'>('list');

    // Fetch events
    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (companyId) params.append('company_id', companyId);
            if (productId) params.append('product_id', productId);

            const response = await fetch(`http://localhost:3005/api/v1/calendar-events?${params}`);
            if (!response.ok) throw new Error('Failed to load events');

            const data = await response.json();
            setEvents(data.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load events');
        } finally {
            setIsLoading(false);
        }
    }, [companyId, productId]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Get event type icon
    const getEventIcon = (type: CalendarEvent['event_type']) => {
        switch (type) {
            case 'post':
                return 'fa-file';
            case 'campaign':
                return 'fa-bullhorn';
            case 'meeting':
                return 'fa-users';
            case 'deadline':
                return 'fa-flag';
            default:
                return 'fa-calendar';
        }
    };

    // Get event type color
    const getEventColor = (type: CalendarEvent['event_type']) => {
        switch (type) {
            case 'post':
                return 'badge-primary';
            case 'campaign':
                return 'badge-success';
            case 'meeting':
                return 'badge-info';
            case 'deadline':
                return 'badge-error';
            default:
                return 'badge-neutral';
        }
    };

    // Group events by date
    const eventsByDate = events.reduce((acc, event) => {
        const date = new Date(event.event_date).toDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
    }, {} as Record<string, CalendarEvent[]>);

    // Sort dates
    const sortedDates = Object.keys(eventsByDate).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <i className="fa-solid fa-duotone fa-exclamation-triangle"></i>
                <span>{error}</span>
                <button className="btn btn-sm" onClick={fetchEvents}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* View Controls */}
            <div className="flex justify-between items-center">
                <div className="tabs tabs-boxed">
                    <a
                        className={`tab ${viewType === 'list' ? 'tab-active' : ''}`}
                        onClick={() => setViewType('list')}
                    >
                        <i className="fa-solid fa-duotone fa-list mr-2"></i>
                        List
                    </a>
                    <a
                        className={`tab ${viewType === 'calendar' ? 'tab-active' : ''}`}
                        onClick={() => setViewType('calendar')}
                    >
                        <i className="fa-solid fa-duotone fa-calendar-days mr-2"></i>
                        Calendar
                    </a>
                </div>

                <button className="btn btn-primary">
                    <i className="fa-solid fa-duotone fa-plus"></i>
                    Add Event
                </button>
            </div>

            {/* List View */}
            {viewType === 'list' && (
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        {events.length === 0 ? (
                            <div className="text-center py-12">
                                <i className="fa-solid fa-duotone fa-calendar text-6xl text-base-content/30 mb-4"></i>
                                <p className="text-base-content/70">No events scheduled</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {sortedDates.map((dateString) => {
                                    const date = new Date(dateString);
                                    const dayEvents = eventsByDate[dateString];

                                    return (
                                        <div key={dateString}>
                                            {/* Date Header */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="flex flex-col items-center bg-base-100 rounded-lg p-3 min-w-[60px]">
                                                    <span className="text-2xl font-bold">{date.getDate()}</span>
                                                    <span className="text-xs text-base-content/60">
                                                        {date.toLocaleDateString('en-US', { month: 'short' })}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">
                                                        {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </h3>
                                                    <p className="text-sm text-base-content/60">{dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}</p>
                                                </div>
                                            </div>

                                            {/* Events for this date */}
                                            <div className="space-y-2 ml-[76px]">
                                                {dayEvents.map((event) => (
                                                    <div key={event.id} className="card bg-base-100 shadow">
                                                        <div className="card-body p-4">
                                                            <div className="flex items-start gap-3">
                                                                <i
                                                                    className={`fa-solid fa-duotone ${getEventIcon(event.event_type)} text-xl`}
                                                                    style={{ color: event.color || undefined }}
                                                                ></i>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <h4 className="font-semibold">{event.title}</h4>
                                                                        <span className={`badge badge-sm ${getEventColor(event.event_type)}`}>
                                                                            {event.event_type}
                                                                        </span>
                                                                        {event.is_all_day && (
                                                                            <span className="badge badge-sm badge-outline">All Day</span>
                                                                        )}
                                                                        {event.reminder_enabled && (
                                                                            <span className="badge badge-sm badge-ghost">
                                                                                <i className="fa-solid fa-duotone fa-bell"></i>
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {event.description && (
                                                                        <p className="text-sm text-base-content/70 mb-2">{event.description}</p>
                                                                    )}

                                                                    {!event.is_all_day && (
                                                                        <p className="text-xs text-base-content/60">
                                                                            <i className="fa-solid fa-duotone fa-clock"></i>{' '}
                                                                            {new Date(event.event_date).toLocaleTimeString([], {
                                                                                hour: '2-digit',
                                                                                minute: '2-digit',
                                                                            })}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Calendar View (Simple Grid) */}
            {viewType === 'calendar' && (
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <div className="text-center py-12">
                            <i className="fa-solid fa-duotone fa-calendar-days text-6xl text-base-content/30 mb-4"></i>
                            <p className="text-base-content/70">Calendar grid view coming soon</p>
                            <p className="text-sm text-base-content/50 mt-2">
                                For now, use the list view to see all events
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
