'use client';

import { useState, useEffect, useMemo } from 'react';
import { useOrganization } from '@/contexts/organization-context';
import { apiClient } from '@/lib/api-client';
import type { SocialAccount, AccountMetricsResponse } from '@/types';

interface UseSocialAccountsOptions {
    companyId?: string;
    productId?: string;
}

interface UseSocialAccountsReturn {
    accounts: SocialAccount[];
    metrics: Map<string, AccountMetricsResponse>;
    isLoading: boolean;
    activeAccounts: SocialAccount[];
    expiredAccounts: SocialAccount[];
    disconnectedAccounts: SocialAccount[];
    disconnectAccount: (accountId: string) => void;
    reconnectAccount: (accountId: string) => void;
    refetch: () => Promise<void>;
}

export function useSocialAccounts(orgId?: string, options?: UseSocialAccountsOptions): UseSocialAccountsReturn {
    const { organizationId: contextOrgId } = useOrganization();
    const organizationId = orgId || contextOrgId;

    const [accounts, setAccounts] = useState<SocialAccount[]>([]);
    const [accountMetrics, setAccountMetrics] = useState<Map<string, AccountMetricsResponse>>(new Map());
    const [isLoading, setIsLoading] = useState(true);

    const loadAccounts = async () => {
        if (!organizationId) {
            setAccounts([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);

            // Load accounts with context filtering
            const data = await apiClient.socialAccounts.getAll(organizationId, {
                companyId: options?.companyId,
                productId: options?.productId,
            });
            setAccounts(data);

            // Load metrics for each account
            const metricsMap = new Map<string, AccountMetricsResponse>();
            await Promise.allSettled(
                data.map(async (account) => {
                    try {
                        const metrics = await apiClient.analytics.getAccountMetrics(account.id);
                        metricsMap.set(account.id, metrics);
                    } catch (error) {
                        console.warn(`Failed to load metrics for account ${account.id}:`, error);
                        // Continue even if metrics fail for individual accounts
                    }
                })
            );
            setAccountMetrics(metricsMap);
        } catch (error) {
            console.error('Error loading social accounts:', error);
            setAccounts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAccounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [organizationId, options?.companyId, options?.productId]);

    // Create metrics map (already loaded from API above)
    const metrics = useMemo(() => {
        return accountMetrics;
    }, [accountMetrics]);

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
        refetch: loadAccounts,
    };
}
