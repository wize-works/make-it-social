'use client';

import { useState, useEffect } from 'react';
import { useOrganization, useAuth } from '@clerk/nextjs';
import { useToast } from '@/contexts/toast-context';

export function OrganizationSettings() {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { organization: clerkOrg, isLoaded } = useOrganization();
    const { getToken } = useAuth();
    const { showToast } = useToast();

    // All organization fields (editable)
    const [orgData, setOrgData] = useState({
        name: '',
        slug: '',
        imageUrl: '',
        website: '',
        industry: 'Technology',
        size: '11-50',
        description: '',
    });

    // Load organization data (from Clerk UI state and database)
    useEffect(() => {
        const loadOrgData = async () => {
            if (!clerkOrg?.id) return;

            try {
                const token = await getToken({ template: 'make-it-social-api' });
                const url = `${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/v1/organizations/${clerkOrg.id}`;

                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    // Merge Clerk UI state with database data
                    setOrgData({
                        name: clerkOrg.name,
                        slug: clerkOrg.slug || '',
                        imageUrl: clerkOrg.imageUrl || '',
                        website: data.data.website || '',
                        industry: data.data.industry || 'Technology',
                        size: data.data.size || '11-50',
                        description: data.data.description || '',
                    });
                }
            } catch (error) {
                console.error('Failed to load organization data:', error);
            }
        };

        if (isLoaded && clerkOrg) {
            loadOrgData();
        }
    }, [clerkOrg, isLoaded, getToken]);

    const industries = [
        'Technology',
        'Marketing & Advertising',
        'E-commerce',
        'Healthcare',
        'Finance',
        'Education',
        'Non-profit',
        'Media & Entertainment',
        'Real Estate',
        'Other',
    ];

    const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

    const handleSave = async () => {
        if (!clerkOrg?.id) return;

        setIsSaving(true);
        try {
            const token = await getToken({ template: 'make-it-social-api' });

            // Update organization via auth-api (handles both Clerk and database)
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3002'}/api/v1/organizations/${clerkOrg.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: orgData.name,
                        slug: orgData.slug,
                        imageUrl: orgData.imageUrl,
                        website: orgData.website,
                        industry: orgData.industry,
                        size: orgData.size,
                        description: orgData.description,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to update organization');
            }

            showToast('Organization updated successfully', 'success');
            setIsEditing(false);

            // Refresh the page to update Clerk org context
            window.location.reload();
        } catch (error) {
            console.error('Failed to save organization:', error);
            showToast(error instanceof Error ? error.message : 'Failed to update organization', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isLoaded || !clerkOrg) {
        return (
            <div className="flex items-center justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Organization Settings</h2>
                    <p className="text-base-content/60 mt-1">
                        Manage your workspace and organization details
                    </p>
                </div>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                        <i className="fa-solid fa-duotone fa-pen"></i>
                        Edit Organization
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="btn btn-ghost"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn btn-primary"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-duotone fa-check"></i>
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            <div className="divider"></div>

            {/* Organization Logo */}
            <div className="flex items-start gap-6">
                <div className="shrink-0">
                    {orgData.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={orgData.imageUrl}
                            alt={orgData.name}
                            className="w-24 h-24 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center text-primary-content text-3xl font-bold">
                            {orgData.name.charAt(0) || 'O'}
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold mb-2">Organization Logo</h3>
                    <p className="text-sm text-base-content/60 mb-2">
                        Upload a new logo or provide a URL
                    </p>
                    {isEditing && (
                        <div className="space-y-2">
                            <input
                                type="url"
                                className="input input-bordered input-sm w-full"
                                value={orgData.imageUrl}
                                onChange={(e) => setOrgData({ ...orgData, imageUrl: e.target.value })}
                                placeholder="https://example.com/logo.png"
                            />
                            <p className="text-xs opacity-60">Or upload a file (coming soon)</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="divider"></div>

            {/* Organization Information */}
            <div>
                <h3 className="font-semibold mb-4">Organization Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <fieldset className="fieldset md:col-span-2">
                        <legend className="fieldset-legend">Organization Name</legend>
                        <input
                            type="text"
                            className="input"
                            value={orgData.name}
                            onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                            disabled={!isEditing}
                            placeholder="My Company"
                        />
                    </fieldset>

                    <fieldset className="fieldset md:col-span-2">
                        <legend className="fieldset-legend">Workspace Slug</legend>
                        <div className="join w-full">
                            <span className="join-item btn btn-disabled">
                                app.makeitsocial.com/
                            </span>
                            <input
                                type="text"
                                className="input input-bordered join-item flex-1"
                                value={orgData.slug}
                                onChange={(e) => setOrgData({ ...orgData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                                disabled={!isEditing}
                                placeholder="my-company"
                            />
                        </div>
                        <p className="label text-xs opacity-70">
                            Lowercase letters, numbers, and hyphens only
                        </p>
                    </fieldset>

                    <fieldset className="fieldset md:col-span-2">
                        <legend className="fieldset-legend">Website</legend>
                        <input
                            type="url"
                            className="input"
                            value={orgData.website}
                            onChange={(e) =>
                                setOrgData({ ...orgData, website: e.target.value })
                            }
                            disabled={!isEditing}
                            placeholder="https://example.com"
                        />
                    </fieldset>

                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend">Industry</legend>
                        <select
                            className="select select-bordered w-full"
                            value={orgData.industry}
                            onChange={(e) =>
                                setOrgData({ ...orgData, industry: e.target.value })
                            }
                            disabled={!isEditing}
                        >
                            {industries.map((industry) => (
                                <option key={industry} value={industry}>
                                    {industry}
                                </option>
                            ))}
                        </select>
                    </fieldset>

                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend">Company Size</legend>
                        <select
                            className="select select-bordered w-full"
                            value={orgData.size}
                            onChange={(e) =>
                                setOrgData({ ...orgData, size: e.target.value })
                            }
                            disabled={!isEditing}
                        >
                            {companySizes.map((size) => (
                                <option key={size} value={size}>
                                    {size} employees
                                </option>
                            ))}
                        </select>
                    </fieldset>

                    <fieldset className="fieldset md:col-span-2">
                        <legend className="fieldset-legend">Description</legend>
                        <textarea
                            className="textarea textarea-bordered h-24 w-full"
                            value={orgData.description}
                            onChange={(e) =>
                                setOrgData({ ...orgData, description: e.target.value })
                            }
                            disabled={!isEditing}
                        />
                    </fieldset>
                </div>
            </div>

            <div className="divider"></div>

            {/* Danger Zone */}
            <div className="bg-error/10 rounded-lg p-6 border border-error/20">
                <h3 className="font-semibold text-error mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-duotone fa-triangle-exclamation"></i>
                    Danger Zone
                </h3>
                <p className="text-sm text-base-content/60 mb-4">
                    Irreversible actions that affect your entire organization
                </p>
                <button className="btn btn-error btn-outline">
                    <i className="fa-solid fa-duotone fa-trash"></i>
                    Delete Organization
                </button>
            </div>
        </div>
    );
}
