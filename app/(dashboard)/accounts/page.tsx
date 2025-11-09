'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSocialAccounts } from '@/hooks/use-social-accounts';
import { AccountCard } from './components/account-card';
import { AddAccountModal } from './components/add-account-modal';
import { DisconnectModal } from './components/disconnect-modal';
import { useToast } from '@/contexts/toast-context';

export default function AccountsPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [accountToDisconnect, setAccountToDisconnect] = useState<string | null>(null);
    const searchParams = useSearchParams();

    const {
        activeAccounts,
        expiredAccounts,
        disconnectedAccounts,
        metrics,
        isLoading,
        disconnectAccount,
        reconnectAccount,
        refetch
    } = useSocialAccounts();

    const { showToast } = useToast();

    // Handle OAuth callback
    useEffect(() => {
        const success = searchParams.get('success');
        const error = searchParams.get('error');

        if (success === 'true') {
            showToast('Account connected successfully!', 'success');
            // Refetch accounts to show the new one
            refetch();
            // Clean up URL params
            window.history.replaceState({}, '', '/accounts');
        } else if (error) {
            showToast(`Failed to connect account: ${error}`, 'error');
            // Clean up URL params
            window.history.replaceState({}, '', '/accounts');
        }
    }, [searchParams, showToast, refetch]);

    const handleDisconnect = (accountId: string) => {
        setAccountToDisconnect(accountId);
    };

    const confirmDisconnect = () => {
        if (accountToDisconnect) {
            disconnectAccount(accountToDisconnect);
            showToast('Account disconnected successfully', 'success');
            setAccountToDisconnect(null);
        }
    };

    const handleReconnect = (accountId: string) => {
        reconnectAccount(accountId);
        showToast('Account reconnected successfully', 'success');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <main className="max-w-7xl mx-auto p-6">
                {/* Page Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Social Accounts</h1>
                        <p className="text-base-content/70">
                            Manage your connected social media accounts
                        </p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAddModal(true)}
                    >
                        <i className="fa-solid fa-duotone fa-plus"></i>
                        Connect Account
                    </button>
                </div>

                {/* Active Accounts */}
                {activeAccounts.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            Active Accounts ({activeAccounts.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activeAccounts.map(account => (
                                <AccountCard
                                    key={account.id}
                                    account={account}
                                    metrics={metrics.get(account.id)}
                                    onDisconnect={handleDisconnect}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Expired Accounts */}
                {expiredAccounts.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-warning">
                            <i className="fa-solid fa-duotone fa-triangle-exclamation mr-2"></i>
                            Expired Accounts ({expiredAccounts.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {expiredAccounts.map(account => (
                                <AccountCard
                                    key={account.id}
                                    account={account}
                                    metrics={metrics.get(account.id)}
                                    onReconnect={handleReconnect}
                                    isExpired
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Disconnected Accounts */}
                {disconnectedAccounts.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-base-content/50">
                            Disconnected Accounts ({disconnectedAccounts.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {disconnectedAccounts.map(account => (
                                <AccountCard
                                    key={account.id}
                                    account={account}
                                    metrics={metrics.get(account.id)}
                                    onReconnect={handleReconnect}
                                    isDisconnected
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {activeAccounts.length === 0 &&
                    expiredAccounts.length === 0 &&
                    disconnectedAccounts.length === 0 && (
                        <div className="card bg-base-200 shadow-lg">
                            <div className="card-body items-center text-center py-16">
                                <i className="fa-solid fa-duotone fa-link-slash text-6xl text-base-content/30 mb-4"></i>
                                <h3 className="text-xl font-semibold mb-2">No Accounts Connected</h3>
                                <p className="text-base-content/70 mb-6">
                                    Connect your first social media account to start posting
                                </p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowAddModal(true)}
                                >
                                    <i className="fa-solid fa-duotone fa-plus"></i>
                                    Connect Account
                                </button>
                            </div>
                        </div>
                    )}
            </main>

            {/* Modals */}
            {showAddModal && (
                <AddAccountModal onClose={() => setShowAddModal(false)} />
            )}

            {accountToDisconnect && (
                <DisconnectModal
                    onConfirm={confirmDisconnect}
                    onCancel={() => setAccountToDisconnect(null)}
                />
            )}
        </div>
    );
}
