/**
 * Hook for fetching and managing brand profile, companies, and products
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { BrandProfile, Product } from '@/types';
import type { Company } from '@/types/company';

export function useBrandProfile(organizationId?: string) {
    const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchBrandProfile = useCallback(async () => {
        if (!organizationId) {
            setCompanies([]);
            setProducts([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Fetch companies and products in parallel
            // Note: Brand profile API not implemented yet, so we skip it
            const [companiesData, productsData] = await Promise.allSettled([
                apiClient.companies.getAll(organizationId),
                apiClient.products.getAll({ organizationId }),
            ]);

            // Set companies
            if (companiesData.status === 'fulfilled') {
                setCompanies(companiesData.value);
            } else {
                console.error('Error fetching companies:', companiesData.reason);
                setCompanies([]);
            }

            // Set products
            if (productsData.status === 'fulfilled') {
                setProducts(productsData.value);
            } else {
                console.error('Error fetching products:', productsData.reason);
                setProducts([]);
            }

            // Brand profile will be null until API is implemented
            setBrandProfile(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch brand data'));
            console.error('Error fetching brand data:', err);
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
