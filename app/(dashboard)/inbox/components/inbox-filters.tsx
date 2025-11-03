'use client';

import { useState } from 'react';
import type { InboxFilters, CommentStatus, CommentSentiment } from '@/types/engagement';
import type { SocialPlatform } from '@/types';
import { PLATFORM_CONFIG } from '@/lib/platform-config';

interface InboxFiltersProps {
    filters: InboxFilters;
    onFiltersChange: (filters: Partial<InboxFilters>) => void;
    onClearFilters: () => void;
}

const PLATFORMS: { value: SocialPlatform; label: string; icon: string }[] = [
    { value: 'instagram', label: PLATFORM_CONFIG.instagram.name, icon: PLATFORM_CONFIG.instagram.icon },
    { value: 'facebook', label: PLATFORM_CONFIG.facebook.name, icon: PLATFORM_CONFIG.facebook.icon },
    { value: 'twitter', label: PLATFORM_CONFIG.twitter.name, icon: PLATFORM_CONFIG.twitter.icon },
    { value: 'linkedin', label: PLATFORM_CONFIG.linkedin.name, icon: PLATFORM_CONFIG.linkedin.icon },
    { value: 'pinterest', label: PLATFORM_CONFIG.pinterest.name, icon: PLATFORM_CONFIG.pinterest.icon },
    { value: 'tiktok', label: PLATFORM_CONFIG.tiktok.name, icon: PLATFORM_CONFIG.tiktok.icon },
    { value: 'youtube', label: PLATFORM_CONFIG.youtube.name, icon: PLATFORM_CONFIG.youtube.icon },
];

const STATUSES = [
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
    { value: 'replied', label: 'Replied' },
    { value: 'archived', label: 'Archived' },
    { value: 'spam', label: 'Spam' },
];

const SENTIMENTS = [
    { value: 'positive', label: 'Positive', color: 'badge-success', icon: 'fa-solid fa-duotone fa-face-smile text-success' },
    { value: 'neutral', label: 'Neutral', color: 'badge-info', icon: 'fa-solid fa-duotone fa-face-meh text-info' },
    { value: 'negative', label: 'Negative', color: 'badge-error', icon: 'fa-solid fa-duotone fa-face-frown text-error' },
    { value: 'question', label: 'Question', color: 'badge-warning', icon: 'fa-solid fa-duotone fa-circle-question text-warning' },
];

export function InboxFilters({ filters, onFiltersChange, onClearFilters }: InboxFiltersProps) {
    const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
    };

    const handleSearchSubmit = () => {
        onFiltersChange({ searchQuery });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    const togglePlatform = (platform: SocialPlatform) => {
        const current = filters.platforms || [];
        const newPlatforms = current.includes(platform)
            ? current.filter(p => p !== platform)
            : [...current, platform];

        onFiltersChange({ platforms: newPlatforms.length > 0 ? newPlatforms : undefined });
    };

    const toggleStatus = (status: string) => {
        const current = filters.status || [];
        const statusValue = status as CommentStatus;
        const newStatus = current.includes(statusValue)
            ? current.filter(s => s !== statusValue)
            : [...current, statusValue];

        onFiltersChange({ status: newStatus.length > 0 ? newStatus : undefined });
    };

    const toggleSentiment = (sentiment: string) => {
        const current = filters.sentiment || [];
        const sentimentValue = sentiment as CommentSentiment;
        const newSentiment = current.includes(sentimentValue)
            ? current.filter(s => s !== sentimentValue)
            : [...current, sentimentValue];

        onFiltersChange({ sentiment: newSentiment.length > 0 ? newSentiment : undefined });
    };

    const hasActiveFilters =
        (filters.platforms?.length ?? 0) > 0 ||
        (filters.status?.length ?? 0) > 0 ||
        (filters.sentiment?.length ?? 0) > 0 ||
        filters.searchQuery ||
        filters.assignedTo;

    return (
        <div className="card bg-base-100 rounded-box p-4 space-y-4 shadow-xl mb-6">
            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search comments, authors, or content..."
                        className="input input-bordered w-full"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleSearchSubmit}
                >
                    Search
                </button>
                {hasActiveFilters && (
                    <button
                        className="btn btn-ghost"
                        onClick={onClearFilters}
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Platform Filters */}
            <div>
                <label className="label">
                    <span className="label-text font-semibold">Platforms</span>
                </label>
                <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map(platform => (
                        <button
                            key={platform.value}
                            className={`btn btn-sm ${filters.platforms?.includes(platform.value)
                                ? 'btn-primary'
                                : 'btn-outline'
                                }`}
                            onClick={() => togglePlatform(platform.value)}
                        >
                            <i className={`${platform.icon} mr-2`}></i>
                            {platform.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Status Filters */}
            <div>
                <label className="label">
                    <span className="label-text font-semibold">Status</span>
                </label>
                <div className="flex flex-wrap gap-2">
                    {STATUSES.map(status => (
                        <button
                            key={status.value}
                            className={`btn btn-sm ${filters.status?.includes(status.value as CommentStatus)
                                ? 'btn-accent'
                                : 'btn-outline'
                                }`}
                            onClick={() => toggleStatus(status.value)}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sentiment Filters */}
            <div>
                <label className="label">
                    <span className="label-text font-semibold">Sentiment</span>
                </label>
                <div className="flex flex-wrap gap-2">
                    {SENTIMENTS.map(sentiment => {
                        const isSelected = filters.sentiment?.includes(sentiment.value as CommentSentiment);
                        return (
                            <div
                                key={sentiment.value}
                                className={`badge badge-lg cursor-pointer ${isSelected
                                    ? sentiment.color
                                    : 'badge-outline'
                                    }`}
                                onClick={() => toggleSentiment(sentiment.value)}
                            >
                                <i className={`${isSelected ? sentiment.icon.replace(/text-\w+/, '') : sentiment.icon} mr-1`}></i>
                                {sentiment.label}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Assignment Filter */}
            <div>
                <label className="label">
                    <span className="label-text font-semibold">Assigned To</span>
                </label>
                <select
                    className="select select-bordered w-full max-w-xs"
                    value={filters.assignedTo || ''}
                    onChange={(e) => onFiltersChange({ assignedTo: e.target.value || undefined })}
                >
                    <option value="">All</option>
                    <option value="me">Assigned to Me</option>
                    <option value="unassigned">Unassigned</option>
                    <option value="user-1">User 1</option>
                    <option value="user-2">User 2</option>
                </select>
            </div>
        </div>
    );
}
