'use client';

import { useState } from 'react';

export function ProfileSettings() {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Mock user data - will be replaced with real data from Clerk/Supabase
    const [profile, setProfile] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        avatar: '',
        jobTitle: 'Marketing Manager',
        company: 'Acme Corp',
        phone: '+1 (555) 123-4567',
        bio: 'Passionate about social media marketing and community building.',
    });

    const handleSave = async () => {
        setIsSaving(true);
        // TODO: Save to Clerk/Supabase
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
        setIsSaving(false);
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Profile Settings</h2>
                    <p className="text-base-content/60 mt-1">
                        Manage your personal information and public profile
                    </p>
                </div>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                        <i className="fa-solid fa-duotone fa-pen"></i>
                        Edit Profile
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

            {/* Profile Picture */}
            <div className="flex items-start gap-6">
                <div className="shrink-0">
                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-primary-content text-3xl font-bold">
                        {profile.firstName.charAt(0)}
                        {profile.lastName.charAt(0)}
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold mb-2">Profile Picture</h3>
                    <p className="text-sm text-base-content/60 mb-4">
                        Upload a profile picture to personalize your account
                    </p>
                    <div className="flex gap-2">
                        <button className="btn btn-sm btn-outline" disabled={!isEditing}>
                            <i className="fa-solid fa-duotone fa-upload"></i>
                            Upload Photo
                        </button>
                        {profile.avatar && (
                            <button className="btn btn-sm btn-ghost btn-error" disabled={!isEditing}>
                                <i className="fa-solid fa-duotone fa-trash"></i>
                                Remove
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="divider"></div>

            {/* Personal Information */}
            <div>
                <h3 className="font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend">First Name</legend>
                        <input
                            type="text"
                            className="input"
                            value={profile.firstName}
                            onChange={(e) =>
                                setProfile({ ...profile, firstName: e.target.value })
                            }
                            disabled={!isEditing}
                        />
                    </fieldset>

                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend">Last Name</legend>
                        <input
                            type="text"
                            className="input"
                            value={profile.lastName}
                            onChange={(e) =>
                                setProfile({ ...profile, lastName: e.target.value })
                            }
                            disabled={!isEditing}
                        />
                    </fieldset>

                    <fieldset className="fieldset md:col-span-2">
                        <legend className="fieldset-legend">Email Address</legend>
                        <input
                            type="email"
                            className="input"
                            value={profile.email}
                            disabled
                        />
                        <p className="label">
                            Email cannot be changed. Contact support if needed.
                        </p>
                    </fieldset>

                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend">Job Title</legend>
                        <input
                            type="text"
                            className="input"
                            value={profile.jobTitle}
                            onChange={(e) =>
                                setProfile({ ...profile, jobTitle: e.target.value })
                            }
                            disabled={!isEditing}
                        />
                    </fieldset>

                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend">Company</legend>
                        <input
                            type="text"
                            className="input"
                            value={profile.company}
                            onChange={(e) =>
                                setProfile({ ...profile, company: e.target.value })
                            }
                            disabled={!isEditing}
                        />
                    </fieldset>

                    <fieldset className="fieldset md:col-span-2">
                        <legend className="fieldset-legend">Phone Number</legend>
                        <input
                            type="tel"
                            className="input"
                            value={profile.phone}
                            onChange={(e) =>
                                setProfile({ ...profile, phone: e.target.value })
                            }
                            disabled={!isEditing}
                        />
                    </fieldset>

                    <fieldset className="fieldset md:col-span-2">
                        <legend className="fieldset-legend">Bio</legend>
                        <textarea
                            className="textarea textarea-bordered h-24 w-full"
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            disabled={!isEditing}
                        />
                        <p className="label">
                            Brief description for your profile
                        </p>
                    </fieldset>
                </div>
            </div>
        </div>
    );
}
