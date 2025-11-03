/**
 * Hook for fetching and managing campaigns
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

// Campaign type definition (to be added to types/index.ts later)
interface Campaign {
    id: string;
    organizationId: string;
    name: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'completed' | 'scheduled';
    postsCount?: number;
    createdAt: Date;
    updatedAt: Date;
}

export function useCampaigns(organizationId: string) {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchCampaigns = useCallback(async () => {
        if (!organizationId) return;

        try {
            setIsLoading(true);
            setError(null);

            const data = await apiClient.campaigns.getAll(organizationId);
            setCampaigns(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch campaigns'));
            console.error('Error fetching campaigns:', err);
        } finally {
            setIsLoading(false);
        }
    }, [organizationId]);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    const createCampaign = useCallback(async (data: Partial<Campaign>) => {
        try {
            const newCampaign = await apiClient.campaigns.create(data);
            setCampaigns((prev) => [...prev, newCampaign]);
            return newCampaign;
        } catch (err) {
            console.error('Error creating campaign:', err);
            throw err;
        }
    }, []);

    const updateCampaign = useCallback(async (campaignId: string, data: Partial<Campaign>) => {
        try {
            const updatedCampaign = await apiClient.campaigns.update(campaignId, data);
            setCampaigns((prev) =>
                prev.map((campaign) => (campaign.id === campaignId ? updatedCampaign : campaign))
            );
            return updatedCampaign;
        } catch (err) {
            console.error('Error updating campaign:', err);
            throw err;
        }
    }, []);

    return {
        campaigns,
        isLoading,
        error,
        refetch: fetchCampaigns,
        createCampaign,
        updateCampaign,
    };
}

// Hook for fetching a single campaign
export function useCampaign(campaignId: string) {
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchCampaign = useCallback(async () => {
        if (!campaignId) return;

        try {
            setIsLoading(true);
            setError(null);

            const data = await apiClient.campaigns.getById(campaignId);
            setCampaign(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch campaign'));
            console.error('Error fetching campaign:', err);
        } finally {
            setIsLoading(false);
        }
    }, [campaignId]);

    useEffect(() => {
        fetchCampaign();
    }, [fetchCampaign]);

    return {
        campaign,
        isLoading,
        error,
        refetch: fetchCampaign,
    };
}
