'use client';

import type { SocialAccount } from '@/types';
import { PLATFORM_ICONS, PLATFORM_COLORS } from '@/lib/platform-config';

interface PlatformSelectorProps {
    accounts: SocialAccount[];
    selectedAccounts: string[];
    onSelectionChange: (accountIds: string[]) => void;
}

const platformIcons = PLATFORM_ICONS;
const platformColors = PLATFORM_COLORS;

export function PlatformSelector({
    accounts,
    selectedAccounts,
    onSelectionChange
}: PlatformSelectorProps) {
    const toggleAccount = (accountId: string) => {
        if (selectedAccounts.includes(accountId)) {
            onSelectionChange(selectedAccounts.filter(id => id !== accountId));
        } else {
            onSelectionChange([...selectedAccounts, accountId]);
        }
    };

    const toggleAll = () => {
        if (selectedAccounts.length === accounts.length) {
            onSelectionChange([]);
        } else {
            onSelectionChange(accounts.map(acc => acc.id));
        }
    };

    const allSelected = accounts.length > 0 && selectedAccounts.length === accounts.length;

    return (
        <div className="space-y-3">
            {/* Select All */}
            {accounts.length > 1 && (
                <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-3 p-3 rounded-lg hover:bg-base-300 transition-colors">
                        <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            checked={allSelected}
                            onChange={toggleAll}
                        />
                        <span className="label-text font-semibold">
                            {allSelected ? 'Deselect All' : 'Select All'}
                        </span>
                    </label>
                </div>
            )}

            {/* Individual Accounts */}
            {accounts.length === 0 ? (
                <div className="text-center py-6 text-base-content/60">
                    <i className="fa-solid fa-duotone fa-link-slash text-3xl mb-2"></i>
                    <p className="text-sm">No social accounts connected</p>
                    <button className="btn btn-sm btn-primary mt-3">
                        <i className="fa-solid fa-duotone fa-plus"></i>
                        Connect Account
                    </button>
                </div>
            ) : (
                accounts.map(account => (
                    <div key={account.id} className="form-control">
                        <label className="label cursor-pointer justify-start gap-3 p-3 rounded-lg hover:bg-base-300 transition-colors">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-primary"
                                checked={selectedAccounts.includes(account.id)}
                                onChange={() => toggleAccount(account.id)}
                            />
                            <div className="flex items-center gap-3 flex-1">
                                <i
                                    className={`${platformIcons[account.platform] || 'fa-solid fa-duotone fa-globe'} text-xl ${platformColors[account.platform] || 'text-base-content'}`}
                                ></i>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{account.displayName}</p>
                                    <p className="text-xs opacity-60">{account.username}</p>
                                </div>
                            </div>
                        </label>
                    </div>
                ))
            )}

            {/* Selection Summary */}
            {selectedAccounts.length > 0 && (
                <div className="alert alert-info">
                    <i className="fa-solid fa-duotone fa-circle-info"></i>
                    <span className="text-sm">
                        {selectedAccounts.length} platform{selectedAccounts.length !== 1 ? 's' : ''} selected
                    </span>
                </div>
            )}
        </div>
    );
}
