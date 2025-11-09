'use client';

import { useState } from 'react';
import { useActiveContext } from '@/contexts/active-context-provider';
import { apiClient } from '@/lib/api-client';

interface AddCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddCompanyModal({ isOpen, onClose }: AddCompanyModalProps) {
    const { activeContext } = useActiveContext();
    const organizationId = activeContext?.organizationId;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        website: '',
        description: '',
        primaryColor: '#FF4F64',
        secondaryColor: '#6366F1',
        accentColor: '#FBBF24',
        brandVoice: '',
        targetAudience: '',
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!organizationId) {
            setError('No organization selected');
            return;
        }

        if (!formData.name.trim()) {
            setError('Company name is required');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await apiClient.companies.create({
                organizationId,
                name: formData.name,
                slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                industry: formData.industry || undefined,
                website: formData.website || undefined,
                description: formData.description || undefined,
                // logoUrl: null, // TODO: Handle file upload
                brandVoice: formData.brandVoice || undefined,
                targetAudience: formData.targetAudience || undefined,
                visualIdentity: {
                    primary_colors: [formData.primaryColor],
                    secondary_colors: [formData.secondaryColor, formData.accentColor],
                },
            });

            // Reset form and close
            setFormData({
                name: '',
                industry: '',
                website: '',
                description: '',
                primaryColor: '#FF4F64',
                secondaryColor: '#6366F1',
                accentColor: '#FBBF24',
                brandVoice: '',
                targetAudience: '',
            });
            onClose();
        } catch (err) {
            console.error('Failed to create company:', err);
            setError(err instanceof Error ? err.message : 'Failed to create company');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setError(null);
            onClose();
        }
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-lg mb-4">Add New Company</h3>

                {error && (
                    <div className="alert alert-error mb-4">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Company Name *</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Acme Digital Marketing"
                                className="input input-bordered"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Industry</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Marketing & Advertising"
                                className="input input-bordered"
                                value={formData.industry}
                                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Website</span>
                            </label>
                            <input
                                type="url"
                                placeholder="https://example.com"
                                className="input input-bordered"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>
                            <textarea
                                placeholder="Brief description of the company..."
                                className="textarea textarea-bordered h-20"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="divider">Branding</div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Company Logo</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="file-input file-input-bordered w-full"
                                disabled={isSubmitting}
                            />
                            <label className="label">
                                <span className="label-text-alt">Recommended: Square image, at least 512x512px (Coming soon)</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Primary Color</span>
                                </label>
                                <input
                                    type="color"
                                    className="input input-bordered h-12 w-full cursor-pointer"
                                    value={formData.primaryColor}
                                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Secondary Color</span>
                                </label>
                                <input
                                    type="color"
                                    className="input input-bordered h-12 w-full cursor-pointer"
                                    value={formData.secondaryColor}
                                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Accent Color</span>
                                </label>
                                <input
                                    type="color"
                                    className="input input-bordered h-12 w-full cursor-pointer"
                                    value={formData.accentColor}
                                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="divider">Brand Profile (Optional)</div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Brand Voice</span>
                            </label>
                            <textarea
                                placeholder="Describe the tone and style of communication..."
                                className="textarea textarea-bordered h-24"
                                value={formData.brandVoice}
                                onChange={(e) => setFormData({ ...formData, brandVoice: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Target Audience</span>
                            </label>
                            <textarea
                                placeholder="Who are you trying to reach?"
                                className="textarea textarea-bordered h-20"
                                value={formData.targetAudience}
                                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-duotone fa-plus mr-2"></i>
                                    Add Company
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={handleClose}></div>
        </div>
    );
}
