/**
 * Hook for fetching and managing organization data
 */

'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import type { Organization } from '@/types';

export function useOrganization(organizationId?: string) {
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchOrganization = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const data = organizationId
                    ? await apiClient.organizations.getById(organizationId)
                    : await apiClient.organizations.getCurrent();

                setOrganization(data);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch organization'));
                console.error('Error fetching organization:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrganization();
    }, [organizationId]);

    return {
        organization,
        isLoading,
        error,
        refetch: () => {
            setIsLoading(true);
            // Re-trigger useEffect
        },
    };
}
