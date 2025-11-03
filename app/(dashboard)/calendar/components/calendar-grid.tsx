import { Post } from '@/types';
import { DayCell } from './day-cell';

interface CalendarGridProps {
    currentMonth: Date;
    getPostsForDate: (date: Date) => Post[];
    onPostClick: (post: Post) => void;
    onReschedulePost?: (postId: string, date: Date, preserveTime?: boolean) => void;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function CalendarGrid({ currentMonth, getPostsForDate, onPostClick, onReschedulePost }: CalendarGridProps) {
    // Get the first day of the month
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    // Calculate days to show
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const endDate = new Date(lastDay);
    const daysToAdd = 6 - lastDay.getDay();
    endDate.setDate(endDate.getDate() + daysToAdd); // End on Saturday

    // Generate calendar days
    const days: Date[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Today's date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday = (date: Date): boolean => {
        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0);
        return compareDate.getTime() === today.getTime();
    };

    const isCurrentMonth = (date: Date): boolean => {
        return date.getMonth() === currentMonth.getMonth();
    };

    return (
        <div className="bg-base-200 rounded-box overflow-hidden shadow-lg">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 bg-base-300">
                {WEEKDAYS.map(day => (
                    <div key={day} className="p-3 text-center font-bold text-sm">
                        {day.substring(0, 3)}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
                {days.map((date, index) => (
                    <DayCell
                        key={index}
                        date={date}
                        posts={getPostsForDate(date)}
                        isCurrentMonth={isCurrentMonth(date)}
                        isToday={isToday(date)}
                        onPostClick={onPostClick}
                        onDropPost={(postId: string, preserveTime = true) => onReschedulePost?.(postId, date, preserveTime)}
                    />
                ))}
            </div>
        </div>
    );
}
