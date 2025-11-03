'use client';

import { useState } from 'react';

export function OrganizationSettings() {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Mock organization data
    const [organization, setOrganization] = useState({
        name: 'Acme Corporation',
        slug: 'acme-corp',
        website: 'https://acme.com',
        industry: 'Technology',
        size: '11-50',
        description: 'Leading provider of innovative software solutions.',
        logo: '',
    });

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
        setIsSaving(true);
        // TODO: Save to database
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSaving(false);
        setIsEditing(false);
    };

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
                    <div className="w-24 h-24 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center text-primary-content text-3xl font-bold">
                        {organization.name.charAt(0)}
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold mb-2">Organization Logo</h3>
                    <p className="text-sm text-base-content/60 mb-4">
                        Upload your organization logo (recommended 400x400px)
                    </p>
                    <div className="flex gap-2">
                        <button className="btn btn-sm btn-outline" disabled={!isEditing}>
                            <i className="fa-solid fa-duotone fa-upload"></i>
                            Upload Logo
                        </button>
                        {organization.logo && (
                            <button className="btn btn-sm btn-ghost btn-error" disabled={!isEditing}>
                                <i className="fa-solid fa-duotone fa-trash"></i>
                                Remove
                            </button>
                        )}
                    </div>
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
                            value={organization.name}
                            onChange={(e) =>
                                setOrganization({ ...organization, name: e.target.value })
                            }
                            disabled={!isEditing}
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
                                value={organization.slug}
                                onChange={(e) =>
                                    setOrganization({ ...organization, slug: e.target.value })
                                }
                                disabled={!isEditing}
                            />
                        </div>
                        <p className="label">
                            Used for workspace URL and team invites
                        </p>
                    </fieldset>

                    <fieldset className="fieldset md:col-span-2">
                        <legend className="fieldset-legend">Website</legend>
                        <input
                            type="url"
                            className="input"
                            value={organization.website}
                            onChange={(e) =>
                                setOrganization({ ...organization, website: e.target.value })
                            }
                            disabled={!isEditing}
                            placeholder="https://example.com"
                        />
                    </fieldset>

                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend">Industry</legend>
                        <select
                            className="select select-bordered w-full"
                            value={organization.industry}
                            onChange={(e) =>
                                setOrganization({ ...organization, industry: e.target.value })
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
                            value={organization.size}
                            onChange={(e) =>
                                setOrganization({ ...organization, size: e.target.value })
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
                            value={organization.description}
                            onChange={(e) =>
                                setOrganization({ ...organization, description: e.target.value })
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
