/**
 * Hook for fetching and managing brand profile, companies, and products
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';
import { mockCompanies } from '@/data/companies';
import { mockProducts } from '@/data/products';
import type { BrandProfile, Company, Product } from '@/types';

export function useBrandProfile(organizationId?: string) {
    const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // TODO: Replace with API calls when Company/Product APIs are ready
    // For now, use mock data filtered by organization
    const companies = useMemo(() => {
        if (!organizationId) return [];
        return mockCompanies.filter(c => c.organizationId === organizationId);
    }, [organizationId]);

    const products = useMemo(() => {
        if (!organizationId) return [];
        return mockProducts.filter(p =>
            companies.some(c => c.id === p.companyId)
        );
    }, [organizationId, companies]);

    const fetchBrandProfile = useCallback(async () => {
        if (!organizationId) return;

        try {
            setIsLoading(true);
            setError(null);

            const data = await apiClient.brandProfile.get(organizationId);
            setBrandProfile(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch brand profile'));
            console.error('Error fetching brand profile:', err);
        } finally {
            setIsLoading(false);
        }
    }, [organizationId]);

    useEffect(() => {
        fetchBrandProfile();
    }, [fetchBrandProfile]);

    const updateBrandProfile = useCallback(async (data: Partial<BrandProfile>) => {
        try {
            if (!brandProfile?.id) {
                // Create new profile
                const newProfile = await apiClient.brandProfile.create(data);
                setBrandProfile(newProfile);
                return newProfile;
            } else {
                // Update existing profile
                const updatedProfile = await apiClient.brandProfile.update(brandProfile.id, data);
                setBrandProfile(updatedProfile);
                return updatedProfile;
            }
        } catch (err) {
            console.error('Error updating brand profile:', err);
            throw err;
        }
    }, [brandProfile]);

    return {
        brandProfile,
        companies,
        products,
        isLoading,
        error,
        refetch: fetchBrandProfile,
        updateBrandProfile,
    };
}
