/**
 * AI Caption Generator Modal
 * Allows users to generate AI-powered caption variations
 */

'use client';

import { useState, useEffect } from 'react';
import { aiApiClient, type CaptionVariation } from '@/lib/ai-api-client';
import { useBrandProfile } from '@/hooks/use-brand-profile';
import { useOrganization } from '@/contexts/organization-context';
import type { Company, Product } from '@/types';

interface AICaptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectCaption: (caption: string, hashtags?: string[]) => void;
    initialContent?: string;
    selectedPlatforms?: string[];
    initialCompanyId?: string;
}

export function AICaptionModal({
    isOpen,
    onClose,
    onSelectCaption,
    initialContent,
    selectedPlatforms = [],
    initialCompanyId,
}: AICaptionModalProps) {
    // Get organization context and brand data
    const { organizationId } = useOrganization();
    const { companies, products } = useBrandProfile(organizationId || undefined);

    // State
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>(initialCompanyId || '');
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [content, setContent] = useState(initialContent || '');
    const [tone, setTone] = useState<'professional' | 'casual' | 'friendly' | 'formal' | 'humorous'>('friendly');
    const [includeHashtags, setIncludeHashtags] = useState(true);
    const [includeEmojis, setIncludeEmojis] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [variations, setVariations] = useState<CaptionVariation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedVariation, setSelectedVariation] = useState<number | null>(null);

    // Get selected company and product
    const selectedCompany = companies.find((c: Company) => c.id === selectedCompanyId);
    const availableProducts = selectedCompanyId ? products.filter((p: Product) => p.companyId === selectedCompanyId) : [];
    const selectedProduct = availableProducts.find((p: Product) => p.id === selectedProductId);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setContent(initialContent || '');
            // Only set company ID if not already set or if initialCompanyId changed
            if (!selectedCompanyId || initialCompanyId) {
                setSelectedCompanyId(initialCompanyId || (companies[0]?.id || ''));
            }
            setSelectedProductId('');
            setVariations([]);
            setError(null);
            setSelectedVariation(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, initialContent, initialCompanyId]);

    // Reset product when company changes
    useEffect(() => {
        setSelectedProductId('');
    }, [selectedCompanyId]);

    const handleGenerate = async () => {
        if (!content.trim()) {
            setError('Please provide some content or context for the AI to work with');
            return;
        }

        setIsGenerating(true);
        setError(null);
        setVariations([]);
        setSelectedVariation(null);

        try {
            // Build brand profile from selected company and product
            const brandProfile = selectedCompany ? {
                companyName: selectedCompany.name,
                brandVoice: selectedProduct?.brandVoice || selectedCompany.brandVoice,
                targetAudience: selectedProduct?.targetAudience || selectedCompany.targetAudience,
                industry: selectedCompany.industry,
                restrictedTopics: selectedCompany.restrictedTopics,
                productName: selectedProduct?.name,
                productDescription: selectedProduct?.description,
            } : undefined;

            const response = await aiApiClient.generateCaption({
                content: content.trim(),
                platform: selectedPlatforms,
                tone,
                includeHashtags,
                includeEmojis,
                brandProfile,
            });

            setVariations(response.data.variations);

            if (response.data.variations.length === 0) {
                setError('No captions were generated. Please try again.');
            }
        } catch (err) {
            console.error('Error generating caption:', err);
            setError(err instanceof Error ? err.message : 'Failed to generate caption. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSelectAndInsert = () => {
        if (selectedVariation !== null && variations[selectedVariation]) {
            const variation = variations[selectedVariation];
            onSelectCaption(variation.text, variation.hashtags);
            onClose();
        }
    };

    const handleRegenerate = () => {
        handleGenerate();
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-4xl max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-lg">
                        <i className="fa-solid fa-duotone fa-sparkles text-primary mr-2"></i>
                        AI Caption Generator
                    </h3>
                    <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
                        <i className="fa-solid fa-duotone fa-xmark text-xl"></i>
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Brand Context Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                <i className="fa-solid fa-duotone fa-building mr-2"></i>
                                Company
                            </legend>
                            <select
                                className="select select-bordered w-full"
                                value={selectedCompanyId}
                                onChange={(e) => setSelectedCompanyId(e.target.value)}
                                disabled={isGenerating}
                            >
                                <option value="">Select a company...</option>
                                {companies.map(company => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                        {company.isPersonal ? ' (Personal)' : ''}
                                    </option>
                                ))}
                            </select>
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                <i className="fa-solid fa-duotone fa-box mr-2"></i>
                                Product/Service
                            </legend>
                            <select
                                className="select select-bordered w-full"
                                value={selectedProductId}
                                onChange={(e) => setSelectedProductId(e.target.value)}
                                disabled={isGenerating || !selectedCompanyId || availableProducts.length === 0}
                            >
                                <option value="">General post</option>
                                {availableProducts.map((product: Product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                            <p className="label text-xs">
                                {selectedCompanyId && availableProducts.length === 0
                                    ? 'No products for this company'
                                    : 'Optional - uses company branding if not selected'}
                            </p>
                        </fieldset>
                    </div>

                    {/* Content Input */}
                    <fieldset className="fieldset mb-4">
                        <legend className="fieldset-legend">What&apos;s your post about?</legend>
                        <textarea
                            className="textarea textarea-bordered h-24 w-full"
                            placeholder="E.g., Launching our new product feature that helps teams collaborate better..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isGenerating}
                        />
                        <p className="label text-xs">Provide context or a brief description for the AI</p>
                    </fieldset>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Tone</legend>
                            <select
                                className="select select-bordered w-full"
                                value={tone}
                                onChange={(e) => setTone(e.target.value as 'professional' | 'casual' | 'friendly' | 'formal' | 'humorous')}
                                disabled={isGenerating}
                            >
                                <option value="professional">Professional</option>
                                <option value="casual">Casual</option>
                                <option value="friendly">Friendly</option>
                                <option value="formal">Formal</option>
                                <option value="humorous">Humorous</option>
                            </select>
                        </fieldset>

                        <div className="form-control pt-8">
                            <label className="label cursor-pointer justify-start gap-3">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary"
                                    checked={includeHashtags}
                                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                                    disabled={isGenerating}
                                />
                                <span className="label-text">Include Hashtags</span>
                            </label>
                        </div>

                        <div className="form-control pt-8">
                            <label className="label cursor-pointer justify-start gap-3">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary"
                                    checked={includeEmojis}
                                    onChange={(e) => setIncludeEmojis(e.target.checked)}
                                    disabled={isGenerating}
                                />
                                <span className="label-text">Include Emojis</span>
                            </label>
                        </div>
                    </div>

                    {/* Brand Context Info */}
                    {selectedCompany && (
                        <div className="alert alert-info mb-4">
                            <i className="fa-solid fa-duotone fa-lightbulb"></i>
                            <div className="flex-1">
                                <p className="font-bold">
                                    Using: {selectedCompany.name}
                                    {selectedProduct && ` - ${selectedProduct.name}`}
                                </p>
                                <div className="text-sm mt-1">
                                    {selectedProduct ? (
                                        <>
                                            <p>Voice: {selectedProduct.brandVoice || selectedCompany.brandVoice}</p>
                                            <p>Audience: {selectedProduct.targetAudience || selectedCompany.targetAudience}</p>
                                        </>
                                    ) : (
                                        <>
                                            {selectedCompany.brandVoice && <p>Voice: {selectedCompany.brandVoice}</p>}
                                            {selectedCompany.targetAudience && <p>Audience: {selectedCompany.targetAudience}</p>}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="alert alert-error mb-4">
                            <i className="fa-solid fa-duotone fa-circle-exclamation"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Generated Variations */}
                    {variations.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold">Generated Captions</h4>
                                <span className="text-xs opacity-70">Select one to insert</span>
                            </div>

                            <div className="space-y-3">
                                {variations.map((variation, index) => (
                                    <div
                                        key={index}
                                        className={`card bg-base-200 cursor-pointer transition-all ${selectedVariation === index
                                            ? 'ring-2 ring-primary'
                                            : 'hover:bg-base-300'
                                            }`}
                                        onClick={() => setSelectedVariation(index)}
                                    >
                                        <div className="card-body p-4">
                                            <p className="whitespace-pre-wrap text-sm">{variation.text}</p>

                                            {variation.hashtags && variation.hashtags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {variation.hashtags.map((hashtag, i) => (
                                                        <span key={i} className="badge badge-primary badge-sm">
                                                            {hashtag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-base-300">
                                                <span className="text-xs opacity-70">
                                                    {variation.characterCount} characters
                                                </span>
                                                {selectedVariation === index && (
                                                    <span className="badge badge-primary badge-sm">
                                                        <i className="fa-solid fa-duotone fa-check mr-1"></i>
                                                        Selected
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-action">
                    {variations.length === 0 ? (
                        <>
                            <button type="button" onClick={onClose} className="btn btn-ghost">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={isGenerating || !content.trim() || !selectedCompanyId}
                                className="btn btn-primary"
                            >
                                {isGenerating ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-duotone fa-wand-magic-sparkles mr-2"></i>
                                        Generate Captions
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            <button type="button" onClick={handleRegenerate} disabled={isGenerating} className="btn btn-outline">
                                <i className="fa-solid fa-duotone fa-rotate-right mr-2"></i>
                                Regenerate
                            </button>
                            <button
                                type="button"
                                onClick={handleSelectAndInsert}
                                disabled={selectedVariation === null}
                                className="btn btn-primary"
                            >
                                <i className="fa-solid fa-duotone fa-check mr-2"></i>
                                Insert Caption
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
}
