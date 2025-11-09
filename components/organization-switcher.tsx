'use client';

import { useOrganization, useOrganizationList, useClerk } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export function OrganizationSwitcher() {
    const { organization: currentOrg } = useOrganization();
    const { userMemberships, isLoaded } = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    });
    const { setActive } = useClerk();
    const [isOpen, setIsOpen] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.org-switcher-dropdown')) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isOpen]);

    const handleSwitchOrganization = async (orgId: string) => {
        await setActive({ organization: orgId });
        setIsOpen(false);
    };

    if (!isLoaded || !currentOrg) {
        return (
            <div className="btn btn-ghost btn-sm">
                <span className="loading loading-spinner loading-xs"></span>
            </div>
        );
    }

    const organizations = userMemberships.data || [];

    return (
        <div className="dropdown dropdown-end org-switcher-dropdown">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-ghost btn-sm gap-2 normal-case"
            >
                {/* Organization Logo/Icon */}
                {currentOrg.imageUrl ? (
                    <div className="avatar">
                        <div className="w-6 h-6 rounded">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={currentOrg.imageUrl} alt={currentOrg.name} />
                        </div>
                    </div>
                ) : (
                    <div className="w-6 h-6 rounded bg-linear-to-br from-primary to-secondary flex items-center justify-center text-primary-content text-xs font-bold">
                        {currentOrg.name.charAt(0)}
                    </div>
                )}

                {/* Organization Name */}
                <span className="hidden md:inline font-medium max-w-[120px] truncate">
                    {currentOrg.name}
                </span>

                {/* Dropdown Icon */}
                <i className={`fa-solid fa-duotone fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isOpen && (
                <div className="dropdown-content z-50 mt-2 w-72 rounded-box bg-base-100 shadow-2xl border border-base-300 overflow-hidden">
                    {/* Current Organization */}
                    <div className="p-3 bg-base-200 border-b border-base-300">
                        <div className="flex items-center gap-3">
                            {currentOrg.imageUrl ? (
                                <div className="avatar">
                                    <div className="w-10 h-10 rounded-lg">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={currentOrg.imageUrl} alt={currentOrg.name} />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center text-primary-content text-lg font-bold">
                                    {currentOrg.name.charAt(0)}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold truncate">{currentOrg.name}</div>
                                <div className="text-xs opacity-60 truncate">{currentOrg.slug}</div>
                            </div>
                            <div className="badge badge-primary badge-sm">Active</div>
                        </div>
                    </div>

                    {/* Organization List */}
                    {organizations.length > 1 && (
                        <>
                            <div className="p-2">
                                <div className="text-xs font-semibold opacity-60 px-3 py-2">
                                    Switch Organization
                                </div>
                                <ul className="menu menu-sm p-0">
                                    {organizations
                                        .filter((membership) => membership.organization.id !== currentOrg.id)
                                        .map((membership) => (
                                            <li key={membership.organization.id}>
                                                <button
                                                    onClick={() => handleSwitchOrganization(membership.organization.id)}
                                                    className="gap-3 py-3"
                                                >
                                                    {membership.organization.imageUrl ? (
                                                        <div className="avatar">
                                                            <div className="w-8 h-8 rounded">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img
                                                                    src={membership.organization.imageUrl}
                                                                    alt={membership.organization.name}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded bg-linear-to-br from-primary to-secondary flex items-center justify-center text-primary-content text-sm font-bold">
                                                            {membership.organization.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div className="flex-1 text-left">
                                                        <div className="font-medium truncate">
                                                            {membership.organization.name}
                                                        </div>
                                                        <div className="text-xs opacity-60 truncate">
                                                            {membership.organization.slug}
                                                        </div>
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                            <div className="divider my-0"></div>
                        </>
                    )}

                    {/* Actions */}
                    <div className="p-2">
                        <button
                            onClick={() => {
                                // TODO: Open create organization modal
                                setIsOpen(false);
                            }}
                            className="btn btn-ghost btn-sm btn-block justify-start gap-3"
                        >
                            <i className="fa-solid fa-duotone fa-plus"></i>
                            <span>Create Organization</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
