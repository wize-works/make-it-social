'use client';

import { useState, useEffect, useCallback } from 'react';
import { useContextParams } from '@/hooks/use-context-params';

interface Campaign {
    id: string;
    organization_id: string;
    company_id: string | null;
    product_id: string | null;
    name: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    status: 'planning' | 'active' | 'completed' | 'paused';
    goals?: string;
    budget?: number;
    tags?: string[];
    created_at: string;
    updated_at: string;
}

interface PostProduct {
    id: string;
    scheduled_post_id: string;
    product_id: string;
    campaign_id?: string;
    is_primary: boolean;
    notes?: string;
    created_at: string;
    updated_at: string;
    post?: {
        id: string;
        title?: string;
        content: string;
        status: string;
        scheduled_time?: string;
    };
}

interface CampaignTimelineProps {
    className?: string;
}

export function CampaignTimeline({ className = '' }: CampaignTimelineProps) {
    const { companyId, productId } = useContextParams();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [campaignPosts, setCampaignPosts] = useState<Record<string, PostProduct[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);

    // Fetch campaigns and their posts
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Fetch campaigns
            const campaignParams = new URLSearchParams();
            if (companyId) campaignParams.append('companyId', companyId);
            if (productId) campaignParams.append('productId', productId);

            const campaignsResponse = await fetch(`http://localhost:3004/api/v1/campaigns?${campaignParams}`);
            if (!campaignsResponse.ok) throw new Error('Failed to load campaigns');

            const campaignsData = await campaignsResponse.json();
            const loadedCampaigns = campaignsData.data || [];
            setCampaigns(loadedCampaigns);

            // Fetch posts for each campaign
            const postsMap: Record<string, PostProduct[]> = {};
            for (const campaign of loadedCampaigns) {
                const postsParams = new URLSearchParams();
                postsParams.append('campaignId', campaign.id);
                if (productId) postsParams.append('productId', productId);

                const postsResponse = await fetch(`http://localhost:3004/api/v1/campaign-posts?${postsParams}`);
                if (postsResponse.ok) {
                    const postsData = await postsResponse.json();
                    postsMap[campaign.id] = postsData.data || [];
                } else {
                    postsMap[campaign.id] = [];
                }
            }

            setCampaignPosts(postsMap);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load campaigns');
        } finally {
            setIsLoading(false);
        }
    }, [companyId, productId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Get status color
    const getStatusColor = (status: Campaign['status']) => {
        switch (status) {
            case 'planning':
                return 'badge-info';
            case 'active':
                return 'badge-success';
            case 'completed':
                return 'badge-neutral';
            case 'paused':
                return 'badge-warning';
            default:
                return 'badge-ghost';
        }
    };

    // Get post status color
    const getPostStatusColor = (status: string) => {
        switch (status) {
            case 'published':
                return 'badge-success';
            case 'scheduled':
                return 'badge-primary';
            case 'draft':
                return 'badge-ghost';
            case 'failed':
                return 'badge-error';
            default:
                return 'badge-ghost';
        }
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
                <button className="btn btn-sm" onClick={fetchData}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={className}>
            {campaigns.length === 0 ? (
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body text-center py-12">
                        <i className="fa-solid fa-duotone fa-bullhorn text-6xl text-base-content/30 mb-4"></i>
                        <p className="text-base-content/70">No campaigns yet. Create your first campaign!</p>
                        <button className="btn btn-primary mt-4">
                            <i className="fa-solid fa-duotone fa-plus"></i>
                            Create Campaign
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {campaigns.map((campaign) => {
                        const posts = campaignPosts[campaign.id] || [];
                        const isExpanded = expandedCampaign === campaign.id;

                        return (
                            <div key={campaign.id} className="card bg-base-200 shadow-lg">
                                <div className="card-body">
                                    {/* Campaign Header */}
                                    <div
                                        className="flex items-start gap-4 cursor-pointer"
                                        onClick={() => setExpandedCampaign(isExpanded ? null : campaign.id)}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <i className="fa-solid fa-duotone fa-bullhorn text-2xl text-primary"></i>
                                                <h3 className="text-xl font-bold">{campaign.name}</h3>
                                                <span className={`badge ${getStatusColor(campaign.status)}`}>{campaign.status}</span>
                                                <span className="badge badge-outline">
                                                    <i className="fa-solid fa-duotone fa-file"></i>
                                                    {posts.length} posts
                                                </span>
                                            </div>

                                            {campaign.description && (
                                                <p className="text-base-content/70 mb-2">{campaign.description}</p>
                                            )}

                                            <div className="flex flex-wrap gap-4 text-sm text-base-content/60">
                                                {campaign.start_date && (
                                                    <span>
                                                        <i className="fa-solid fa-duotone fa-calendar-days"></i> {new Date(campaign.start_date).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {campaign.end_date && (
                                                    <span>
                                                        <i className="fa-solid fa-duotone fa-calendar-check"></i> {new Date(campaign.end_date).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {campaign.budget && (
                                                    <span>
                                                        <i className="fa-solid fa-duotone fa-dollar-sign"></i> ${campaign.budget.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>

                                            {campaign.tags && campaign.tags.length > 0 && (
                                                <div className="flex gap-2 mt-3">
                                                    {campaign.tags.map((tag) => (
                                                        <span key={tag} className="badge badge-sm">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Expand/Collapse Button */}
                                        <button className="btn btn-square btn-ghost">
                                            <i className={`fa-solid fa-duotone fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                                        </button>
                                    </div>

                                    {/* Campaign Posts */}
                                    {isExpanded && (
                                        <div className="mt-6">
                                            <div className="divider"></div>

                                            {posts.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <i className="fa-solid fa-duotone fa-file-circle-plus text-4xl text-base-content/30 mb-3"></i>
                                                    <p className="text-base-content/70">No posts in this campaign yet</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {posts.map((postProduct) => {
                                                        const post = postProduct.post;
                                                        if (!post) return null;

                                                        return (
                                                            <div key={postProduct.id} className="flex items-center gap-4 p-4 bg-base-100 rounded-lg">
                                                                <div className="flex-1">
                                                                    {post.title && <h4 className="font-semibold mb-1">{post.title}</h4>}
                                                                    <p className="text-sm text-base-content/70 line-clamp-2">{post.content}</p>
                                                                    <div className="flex items-center gap-3 mt-2 text-xs">
                                                                        <span className={`badge badge-sm ${getPostStatusColor(post.status)}`}>{post.status}</span>
                                                                        {post.scheduled_time && (
                                                                            <span className="text-base-content/60">
                                                                                <i className="fa-solid fa-duotone fa-clock"></i>{' '}
                                                                                {new Date(post.scheduled_time).toLocaleString()}
                                                                            </span>
                                                                        )}
                                                                        {postProduct.is_primary && (
                                                                            <span className="badge badge-sm badge-primary">
                                                                                <i className="fa-solid fa-duotone fa-star"></i> Primary
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <a href={`/dashboard/calendar?postId=${post.id}`} className="btn btn-sm btn-ghost">
                                                                    <i className="fa-solid fa-duotone fa-arrow-right"></i>
                                                                </a>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
