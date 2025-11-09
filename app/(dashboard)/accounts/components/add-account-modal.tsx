'use client';

import { useState } from 'react';
import { useToast } from '@/contexts/toast-context';
import { ALL_PLATFORMS } from '@/lib/platform-config';
import { useAuth, useOrganization as useClerkOrganization } from '@clerk/nextjs';

interface AddAccountModalProps {
    onClose: () => void;
}

const platforms = ALL_PLATFORMS.map(platform => ({
    id: platform.id,
    name: platform.name,
    icon: platform.icon,
    color: platform.color,
    bgColor: platform.bgColor,
    description: `Connect your ${platform.name} account`
}));

export function AddAccountModal({ onClose }: AddAccountModalProps) {
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const { showToast } = useToast();
    const { getToken } = useAuth();
    const { organization } = useClerkOrganization();

    const handleConnect = async () => {
        if (!selectedPlatform) return;

        if (!organization) {
            showToast('Please select an organization first', 'error');
            return;
        }

        setIsConnecting(true);

        try {
            // Get the current page URL to return to after OAuth
            const returnUrl = `${window.location.origin}/accounts`;

            // Get token with organization context
            const token = await getToken();

            if (!token) {
                throw new Error('Not authenticated');
            }

            // Call the backend API to initiate OAuth flow
            const response = await fetch(
                `http://localhost:3003/api/v1/social-accounts/${selectedPlatform}/connect`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ returnUrl }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to initiate OAuth flow');
            }

            const data = await response.json();

            // Redirect to the platform's authorization URL
            window.location.href = data.data.authorizationUrl;
        } catch (error) {
            console.error('Failed to connect account:', error);
            showToast(
                error instanceof Error ? error.message : 'Failed to connect account',
                'error'
            );
            setIsConnecting(false);
        }
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-2xl mb-2">Connect Social Account</h3>
                <p className="text-base-content/70 mb-6">
                    Choose a platform to connect your account
                </p>

                {/* Platform Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {platforms.map(platform => (
                        <button
                            key={platform.id}
                            className={`card bg-base-200 shadow-sm hover:shadow-lg transition-all cursor-pointer ${selectedPlatform === platform.id ? 'ring-2 ring-primary' : ''
                                }`}
                            onClick={() => setSelectedPlatform(platform.id)}
                        >
                            <div className="card-body p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-lg ${platform.bgColor} flex items-center justify-center shrink-0`}>
                                        <i className={`${platform.icon} text-2xl ${platform.color}`}></i>
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-semibold">{platform.name}</h4>
                                        <p className="text-xs text-base-content/70">
                                            {platform.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Info Alert */}
                <div className="alert alert-info mb-6">
                    <i className="fa-solid fa-duotone fa-circle-info"></i>
                    <div>
                        <p className="font-semibold">OAuth Authentication</p>
                        <p className="text-sm">
                            You&apos;ll be redirected to {selectedPlatform ? platforms.find(p => p.id === selectedPlatform)?.name : 'the platform'} to authorize Make It Social.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="modal-action">
                    <button
                        className="btn btn-ghost"
                        onClick={onClose}
                        disabled={isConnecting}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleConnect}
                        disabled={!selectedPlatform || isConnecting}
                    >
                        {isConnecting ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Connecting...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-duotone fa-link"></i>
                                Connect Account
                            </>
                        )}
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
}
