'use client';

import { useState, useEffect, useCallback } from 'react';
import { useContextParams } from '@/hooks/use-context-params';

interface BrandHashtag {
    id: string;
    company_id: string | null;
    product_id: string | null;
    hashtag: string;
    collection_name?: string;
    usage_count: number;
    performance_score?: number;
    notes?: string;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
}

interface HashtagLibraryProps {
    className?: string;
}

export function HashtagLibrary({ className = '' }: HashtagLibraryProps) {
    const { companyId, productId } = useContextParams();
    const [hashtags, setHashtags] = useState<BrandHashtag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newHashtag, setNewHashtag] = useState('');
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const [newCollection, setNewCollection] = useState('');

    // Get unique collections
    const collections = Array.from(new Set(hashtags.map((h) => h.collection_name).filter(Boolean))) as string[];

    // Filter hashtags
    const filteredHashtags = selectedCollection
        ? hashtags.filter((h) => h.collection_name === selectedCollection)
        : hashtags;

    // Fetch hashtags
    const fetchHashtags = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (companyId) params.append('companyId', companyId);
            if (productId) params.append('productId', productId);

            const response = await fetch(`http://localhost:3004/api/v1/brand-hashtags?${params}`);
            if (!response.ok) throw new Error('Failed to load hashtags');

            const data = await response.json();
            setHashtags(data.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load hashtags');
        } finally {
            setIsLoading(false);
        }
    }, [companyId, productId]);

    useEffect(() => {
        fetchHashtags();
    }, [fetchHashtags]);

    // Handle add hashtag
    const handleAddHashtag = async () => {
        if (!newHashtag.trim()) return;

        // Ensure hashtag starts with #
        const formattedHashtag = newHashtag.startsWith('#') ? newHashtag : `#${newHashtag}`;

        try {
            const response = await fetch('http://localhost:3004/api/v1/brand-hashtags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hashtag: formattedHashtag,
                    company_id: companyId,
                    product_id: productId,
                    collection_name: newCollection || selectedCollection || undefined,
                }),
            });

            if (!response.ok) throw new Error('Failed to add hashtag');

            await fetchHashtags();
            setNewHashtag('');
            setNewCollection('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add hashtag');
        }
    };

    // Handle delete
    const handleDelete = async (id: string) => {
        if (!confirm('Delete this hashtag?')) return;

        try {
            const response = await fetch(`http://localhost:3004/api/v1/brand-hashtags/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Delete failed');

            setHashtags(hashtags.filter((h) => h.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Delete failed');
        }
    };

    // Handle toggle primary
    const handleTogglePrimary = async (hashtag: BrandHashtag) => {
        try {
            const response = await fetch(`http://localhost:3004/api/v1/brand-hashtags/${hashtag.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    is_primary: !hashtag.is_primary,
                }),
            });

            if (!response.ok) throw new Error('Update failed');

            setHashtags(hashtags.map((h) => (h.id === hashtag.id ? { ...h, is_primary: !h.is_primary } : h)));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Update failed');
        }
    };

    // Copy hashtags to clipboard
    const handleCopyHashtags = (collection?: string) => {
        const hashtagsToCopy = collection
            ? hashtags.filter((h) => h.collection_name === collection)
            : hashtags;

        const hashtagString = hashtagsToCopy.map((h) => h.hashtag).join(' ');
        navigator.clipboard.writeText(hashtagString);
    };

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
                <button className="btn btn-sm" onClick={fetchHashtags}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 ${className}`}>
            {/* Collections Sidebar */}
            <div className="lg:col-span-1">
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title">
                            <i className="fa-solid fa-duotone fa-folder-open"></i>
                            Collections
                        </h2>

                        <ul className="menu menu-sm p-0 mt-2">
                            <li>
                                <a
                                    className={!selectedCollection ? 'active' : ''}
                                    onClick={() => setSelectedCollection(null)}
                                >
                                    <i className="fa-solid fa-duotone fa-hashtag"></i>
                                    All Hashtags ({hashtags.length})
                                </a>
                            </li>
                            {collections.map((collection) => (
                                <li key={collection}>
                                    <a
                                        className={selectedCollection === collection ? 'active' : ''}
                                        onClick={() => setSelectedCollection(collection)}
                                    >
                                        <i className="fa-solid fa-duotone fa-folder"></i>
                                        {collection} ({hashtags.filter((h) => h.collection_name === collection).length})
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <div className="divider"></div>

                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleCopyHashtags(selectedCollection || undefined)}
                        >
                            <i className="fa-solid fa-duotone fa-copy"></i>
                            Copy All
                        </button>
                    </div>
                </div>
            </div>

            {/* Hashtags Grid */}
            <div className="lg:col-span-3">
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Enter hashtag..."
                                className="input input-bordered flex-1"
                                value={newHashtag}
                                onChange={(e) => setNewHashtag(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddHashtag()}
                            />
                            <input
                                type="text"
                                placeholder="Collection (optional)"
                                className="input input-bordered w-full sm:w-48"
                                value={newCollection}
                                onChange={(e) => setNewCollection(e.target.value)}
                            />
                            <button className="btn btn-primary" onClick={handleAddHashtag} disabled={!newHashtag.trim()}>
                                <i className="fa-solid fa-duotone fa-plus"></i>
                                Add
                            </button>
                        </div>

                        {filteredHashtags.length === 0 ? (
                            <div className="text-center py-12">
                                <i className="fa-solid fa-duotone fa-hashtag text-6xl text-base-content/30 mb-4"></i>
                                <p className="text-base-content/70">No hashtags yet. Add your first hashtag!</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredHashtags.map((hashtag) => (
                                    <div
                                        key={hashtag.id}
                                        className="flex items-center gap-3 p-3 bg-base-100 rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        {/* Primary Star */}
                                        <button
                                            className={`btn btn-xs btn-circle ${hashtag.is_primary ? 'btn-warning' : 'btn-ghost'}`}
                                            onClick={() => handleTogglePrimary(hashtag)}
                                            title={hashtag.is_primary ? 'Remove from primary' : 'Mark as primary'}
                                        >
                                            <i className={`fa-solid fa-duotone fa-star ${hashtag.is_primary ? 'text-warning-content' : 'text-base-content/30'}`}></i>
                                        </button>

                                        {/* Hashtag */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-lg">{hashtag.hashtag}</span>
                                                {hashtag.collection_name && (
                                                    <span className="badge badge-sm badge-outline">{hashtag.collection_name}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-base-content/60 mt-1">
                                                <span>
                                                    <i className="fa-solid fa-duotone fa-chart-line"></i> Used {hashtag.usage_count} times
                                                </span>
                                                {hashtag.performance_score && (
                                                    <span>
                                                        <i className="fa-solid fa-duotone fa-fire"></i> Score: {hashtag.performance_score.toFixed(1)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-sm btn-square btn-ghost"
                                                onClick={() => navigator.clipboard.writeText(hashtag.hashtag)}
                                                title="Copy hashtag"
                                            >
                                                <i className="fa-solid fa-duotone fa-copy"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-square btn-error btn-ghost"
                                                onClick={() => handleDelete(hashtag.id)}
                                                title="Delete hashtag"
                                            >
                                                <i className="fa-solid fa-duotone fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
