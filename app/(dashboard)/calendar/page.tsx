'use client';

import { useState } from 'react';
import { Post } from '@/types';
import { CalendarHeader } from './components/calendar-header';
import { CalendarGrid } from './components/calendar-grid';
import { PostDetailModal } from './components/post-detail-modal';
import { useCalendar } from '@/hooks/use-calendar';
import { useToast } from '@/contexts/ToastContext';

export default function CalendarPage() {
    const {
        posts,
        isLoading,
        currentMonth,
        filters,
        getPostsForDate,
        goToPreviousMonth,
        goToNextMonth,
        goToToday,
        togglePlatformFilter,
        toggleStatusFilter,
        clearFilters,
        reschedulePost,
    } = useCalendar();

    const { showToast } = useToast();
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const handlePostClick = (post: Post) => {
        setSelectedPost(post);
    };

    const handleCloseModal = () => {
        setSelectedPost(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 opacity-70">Loading calendar...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">

            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Content Calendar</h1>
                    <p className="text-base-content/70">
                        View and manage your scheduled social media posts
                    </p>
                </div>

                {/* Calendar Controls */}
                <CalendarHeader
                    currentMonth={currentMonth}
                    onPreviousMonth={goToPreviousMonth}
                    onNextMonth={goToNextMonth}
                    onToday={goToToday}
                    filters={filters}
                    onTogglePlatform={togglePlatformFilter}
                    onToggleStatus={toggleStatusFilter}
                    onClearFilters={clearFilters}
                />

                {/* Calendar Grid */}
                <CalendarGrid
                    currentMonth={currentMonth}
                    getPostsForDate={getPostsForDate}
                    onReschedulePost={(postId: string, date: Date, preserveTime = true) => {
                        reschedulePost(postId, date, preserveTime);
                        const formattedDate = date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        });
                        showToast(`Post rescheduled to ${formattedDate}`, 'success');
                    }}
                    onPostClick={handlePostClick}
                />

                {/* Stats Summary */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="stat bg-base-100 rounded-xl">
                        <div className="stat-title">Total Posts</div>
                        <div className="stat-value text-primary">{posts.length}</div>
                    </div>
                    <div className="stat bg-base-100 rounded-xl">
                        <div className="stat-title">Scheduled</div>
                        <div className="stat-value text-info">
                            {posts.filter(p => p.status === 'scheduled').length}
                        </div>
                    </div>
                    <div className="stat bg-base-100 rounded-xl">
                        <div className="stat-title">Published</div>
                        <div className="stat-value text-success">
                            {posts.filter(p => p.status === 'published').length}
                        </div>
                    </div>
                    <div className="stat bg-base-100 rounded-xl">
                        <div className="stat-title">Drafts</div>
                        <div className="stat-value text-neutral">
                            {posts.filter(p => p.status === 'draft').length}
                        </div>
                    </div>
                </div>
            </main>

            {/* Post Detail Modal */}
            <PostDetailModal
                post={selectedPost}
                onClose={handleCloseModal}
                onReschedule={(postId: string, newTime: Date) => {
                    reschedulePost(postId, newTime, false);
                    const formattedDateTime = newTime.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                    });
                    showToast(`Post rescheduled to ${formattedDateTime}`, 'success');
                    handleCloseModal();
                }}
            />
        </div>
    );
}
