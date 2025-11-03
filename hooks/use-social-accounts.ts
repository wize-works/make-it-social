'use client';

import { useState, useEffect, useMemo } from 'react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { apiClient } from '@/lib/api-client';
import { mockAccountMetrics, type AccountMetrics } from '@/data/social-accounts';
import type { SocialAccount } from '@/types';

interface UseSocialAccountsReturn {
    accounts: SocialAccount[];
    metrics: Map<string, AccountMetrics>;
    isLoading: boolean;
    activeAccounts: SocialAccount[];
    expiredAccounts: SocialAccount[];
    disconnectedAccounts: SocialAccount[];
    disconnectAccount: (accountId: string) => void;
    reconnectAccount: (accountId: string) => void;
}

export function useSocialAccounts(orgId?: string): UseSocialAccountsReturn {
    const { organizationId: contextOrgId } = useOrganization();
    const organizationId = orgId || contextOrgId;

    const [accounts, setAccounts] = useState<SocialAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAccounts = async () => {
            if (!organizationId) {
                setAccounts([]);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const data = await apiClient.socialAccounts.getAll(organizationId);
                setAccounts(data);
            } catch (error) {
                console.error('Error loading social accounts:', error);
                setAccounts([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadAccounts();
    }, [organizationId]);

    // Create metrics map
    const metrics = useMemo(() => {
        const map = new Map<string, AccountMetrics>();
        mockAccountMetrics.forEach(metric => {
            map.set(metric.accountId, metric);
        });
        return map;
    }, []);

    // Categorize accounts
    const activeAccounts = useMemo(() => {
        return accounts.filter(account => {
            if (!account.isActive) return false;
            if (!account.expiresAt) return true;
            return account.expiresAt > new Date();
        });
    }, [accounts]);

    const expiredAccounts = useMemo(() => {
        return accounts.filter(account => {
            return account.isActive &&
                account.expiresAt &&
                account.expiresAt <= new Date();
        });
    }, [accounts]);

    const disconnectedAccounts = useMemo(() => {
        return accounts.filter(account => !account.isActive);
    }, [accounts]);

    // Disconnect account
    const disconnectAccount = (accountId: string) => {
        setAccounts(prev => prev.map(account =>
            account.id === accountId
                ? { ...account, isActive: false }
                : account
        ));
    };

    // Reconnect account (simulated)
    const reconnectAccount = (accountId: string) => {
        setAccounts(prev => prev.map(account =>
            account.id === accountId
                ? {
                    ...account,
                    isActive: true,
                    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
                }
                : account
        ));
    };

    return {
        accounts,
        metrics,
        isLoading,
        activeAccounts,
        expiredAccounts,
        disconnectedAccounts,
        disconnectAccount,
        reconnectAccount,
    };
}
