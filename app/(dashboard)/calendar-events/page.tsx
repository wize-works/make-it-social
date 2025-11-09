'use client';

import { ContentCalendarView } from './components/content-calendar-view';

export default function CalendarEventsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Content Calendar</h1>
                <p className="text-base-content/70">
                    View scheduled posts and calendar events
                </p>
            </div>

            <ContentCalendarView />
        </div>
    );
}
