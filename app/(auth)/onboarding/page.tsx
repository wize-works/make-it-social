'use client';

import { useAuth, useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function OnboardingPage() {
    const { getToken, isLoaded: authLoaded } = useAuth();
    const { user, isLoaded: userLoaded } = useUser();
    const { setActive } = useClerk();
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orgName, setOrgName] = useState('');

    // Auto-populate org name from user's first name
    useEffect(() => {
        if (user?.firstName) {
            setOrgName(`${user.firstName}'s Workspace`);
        }
    }, [user]);

    const createOrganization = async () => {
        if (!orgName.trim()) {
            setError('Please enter a workspace name');
            return;
        }

        try {
            setIsCreating(true);
            setError(null);

            // Generate slug from org name
            const slug = orgName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
                + `-${Date.now().toString().slice(-6)}`;

            // Get JWT token for auth-api
            const token = await getToken({ template: 'make-it-social-api' });

            if (!token) {
                throw new Error('Failed to get authentication token');
            }

            // Create organization via auth-api (handles both Clerk and database)
            const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3002'}/api/v1/organizations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: orgName,
                    slug: slug,
                    imageUrl: user?.imageUrl,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to create organization');
            }

            const { data: organization } = await response.json();
            const clerkOrgId = organization.clerkOrganizationId;

            console.log('Organization created:', organization.id, 'Clerk ID:', clerkOrgId);

            // Set the newly created organization as active using Clerk's setActive
            if (clerkOrgId) {
                await setActive({ organization: clerkOrgId });
                console.log('Set active organization:', clerkOrgId);
            }

            // Small delay to ensure Clerk state updates
            await new Promise(resolve => setTimeout(resolve, 500));

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (err) {
            console.error('Error creating organization:', err);
            setError(err instanceof Error ? err.message : 'Failed to create workspace');
        } finally {
            setIsCreating(false);
        }
    };

    // Show loading state while Clerk loads
    if (!authLoaded || !userLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-base-200">
            <div className="card bg-base-100 shadow-xl w-full max-w-md">
                <div className="card-body">
                    <div className="text-center mb-6">
                        <i className="fa-solid fa-duotone fa-rocket text-5xl text-primary mb-4"></i>
                        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.firstName}!</h1>
                        <p className="opacity-70">Let&apos;s create your workspace</p>
                    </div>

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold">Workspace Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="My Company"
                            className="input input-bordered w-full"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            disabled={isCreating}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    createOrganization();
                                }
                            }}
                        />
                        <label className="label">
                            <span className="label-text-alt opacity-70">
                                You can change this later in settings
                            </span>
                        </label>
                    </div>

                    {error && (
                        <div className="alert alert-error mb-4">
                            <i className="fa-solid fa-duotone fa-circle-exclamation"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        onClick={createOrganization}
                        disabled={isCreating || !orgName.trim()}
                        className="btn btn-primary w-full"
                    >
                        {isCreating ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Creating Workspace...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-duotone fa-check mr-2"></i>
                                Create Workspace
                            </>
                        )}
                    </button>

                    <div className="divider"></div>

                    <div className="text-center">
                        <p className="text-sm opacity-70">
                            Your workspace will be ready in seconds
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
