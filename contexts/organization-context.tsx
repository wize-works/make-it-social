'use client';

/**
 * Organization Context
 * Provides current organization ID and organization switching functionality
 */

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import type { Organization } from '@/types';

interface OrganizationContextValue {
    organizationId: string | null;
    organization: Organization | null;
    isLoading: boolean;
    setOrganizationId: (id: string) => void;
}

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

export function OrganizationProvider({ children }: { children: ReactNode }) {
    const { user, isLoaded } = useUser();
    const [manualOrgId, setManualOrgId] = useState<string | null>(null);

    // Derive organization ID from user metadata or manual override
    const organizationId = useMemo(() => {
        if (manualOrgId) {
            return manualOrgId;
        }
        return (user?.publicMetadata?.organizationId as string) || null;
    }, [user?.publicMetadata?.organizationId, manualOrgId]);

    // TODO: Fetch organization details from API when organizationId changes
    const organization = null;

    const contextValue = useMemo(
        () => ({
            organizationId,
            organization,
            isLoading: !isLoaded,
            setOrganizationId: setManualOrgId,
        }),
        [organizationId, organization, isLoaded]
    );

    return (
        <OrganizationContext.Provider value={contextValue}>
            {children}
        </OrganizationContext.Provider>
    );
}

export function useOrganization() {
    const context = useContext(OrganizationContext);

    if (!context) {
        throw new Error('useOrganization must be used within OrganizationProvider');
    }

    return context;
}
