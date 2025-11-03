'use client';

import { useState, useRef, useEffect } from 'react';
import { PlatformSelector } from './platform-selector';
import { MediaUploader } from './media-uploader';
import { CharacterCounter } from './character-counter';
import { PostPreview } from './post-preview';
import { SchedulePicker } from './schedule-picker';
import { ComposerToolbar } from './composer-toolbar';
import { EditCompanyModal } from '../../brands/components/edit-company-modal';
import { EditProductModal } from '../../brands/components/edit-product-modal';
import { useSocialAccounts } from '@/hooks/use-social-accounts';
import { useBrandProfile } from '@/hooks/use-brand-profile';
import { aiApiClient } from '@/lib/ai-api-client';
import { useToast } from '@/contexts/ToastContext';
import { getPlatformConfig, getPlatformName } from '@/lib/platform-config';
import type { CaptionVariation } from '@/lib/ai-api-client';
import type { SocialPlatform, Product, Company } from '@/types';

interface PostData {
    content: string;
    platformSpecificContent?: Record<string, string>; // platform -> content mapping
    mediaUrls: string[];
    selectedAccounts: string[];
    scheduledTime?: Date;
    isDraft: boolean;
}

// Enhanced variation structure with platform-specific content
interface EnhancedVariation {
    variationIndex: number;
    platformVersions: {
        [platform: string]: CaptionVariation;
    };
}

interface PostComposerProps {
    onSave: (data: PostData) => void;
    onCancel: () => void;
    isSaving?: boolean;
}

export function PostComposer({ onSave, onCancel, isSaving = false }: PostComposerProps) {
    const [content, setContent] = useState('');
    const [platformSpecificContent, setPlatformSpecificContent] = useState<Record<string, string>>({});
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
    const [scheduledTime, setScheduledTime] = useState<Date | undefined>();
    const [showPreview, setShowPreview] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { showToast } = useToast();

    // Brand context state
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [selectedTone, setSelectedTone] = useState<'professional' | 'casual' | 'friendly' | 'formal' | 'humorous'>('professional');
    const [includeHashtags, setIncludeHashtags] = useState(true);
    const [includeEmojis, setIncludeEmojis] = useState(true);

    // AI variations state
    const [aiVariations, setAiVariations] = useState<EnhancedVariation[]>([]);
    const [selectedVariation, setSelectedVariation] = useState<number>(0);
    const [selectedPlatformTab, setSelectedPlatformTab] = useState<string>('');
    const [showVariations, setShowVariations] = useState(false);

    // Edit modals state
    const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
    const [showEditProductModal, setShowEditProductModal] = useState(false);

    // Load social accounts and brand data from API
    const { accounts: availableAccounts, isLoading: accountsLoading } = useSocialAccounts();
    const { companies, products, isLoading: brandLoading } = useBrandProfile();

    // Get filtered products based on selected company
    const availableProducts = selectedCompanyId
        ? products.filter((p: Product) => p.companyId === selectedCompanyId)
        : [];

    const handleSaveDraft = () => {
        onSave({
            content,
            platformSpecificContent: Object.keys(platformSpecificContent).length > 0 ? platformSpecificContent : undefined,
            mediaUrls,
            selectedAccounts,
            scheduledTime,
            isDraft: true,
        });
    };

    const handleSchedule = () => {
        if (!scheduledTime) {
            alert('Please select a date and time to schedule');
            return;
        }
        onSave({
            content,
            platformSpecificContent: Object.keys(platformSpecificContent).length > 0 ? platformSpecificContent : undefined,
            mediaUrls,
            selectedAccounts,
            scheduledTime,
            isDraft: false,
        });
    };

    const handlePublishNow = () => {
        onSave({
            content,
            platformSpecificContent: Object.keys(platformSpecificContent).length > 0 ? platformSpecificContent : undefined,
            mediaUrls,
            selectedAccounts,
            scheduledTime: new Date(),
            isDraft: false,
        });
    };

    // Reset product selection when company changes
    useEffect(() => {
        if (selectedCompanyId) {
            setSelectedProductId('');
        }
    }, [selectedCompanyId]);

    // Initialize selectedPlatformTab when accounts are selected
    useEffect(() => {
        if (selectedAccounts.length > 0 && !selectedPlatformTab) {
            const firstAccount = availableAccounts.find(a => a.id === selectedAccounts[0]);
            if (firstAccount) {
                setSelectedPlatformTab(firstAccount.platform);
            }
        }
    }, [selectedAccounts, selectedPlatformTab, availableAccounts]);

    // Insert text at cursor position
    const insertAtCursor = (textToInsert: string) => {
        const textarea = textareaRef.current;
        if (!textarea) {
            // Fallback: append to end
            setContent(prev => prev + textToInsert);
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const textBefore = content.substring(0, start);
        const textAfter = content.substring(end);

        const newContent = textBefore + textToInsert + textAfter;
        setContent(newContent);

        // Set cursor position after inserted text
        setTimeout(() => {
            const newCursorPos = start + textToInsert.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
            textarea.focus();
        }, 0);
    };

    const handleInsertEmoji = (emoji: string) => {
        insertAtCursor(emoji);
    };

    const handleInsertHashtag = (hashtag: string) => {
        // Add space before if needed
        const textarea = textareaRef.current;
        const start = textarea?.selectionStart || content.length;
        const textBefore = content.substring(0, start);
        const needsSpace = textBefore.length > 0 && !textBefore.endsWith(' ') && !textBefore.endsWith('\n');

        insertAtCursor((needsSpace ? ' ' : '') + hashtag + ' ');
    };

    const handleInsertMention = (mention: string) => {
        insertAtCursor(mention);
    };

    const handleAIAssist = async () => {
        // Validate company selection
        if (!selectedCompanyId) {
            showToast('Please select a company first', 'warning');
            return;
        }

        setIsEnhancing(true);
        setShowVariations(false);

        try {
            const hasContent = content.trim().length > 0;

            if (hasContent) {
                // Enhance existing content
                const company = companies.find((c: Company) => c.id === selectedCompanyId);
                const product = selectedProductId ? products.find((p: Product) => p.id === selectedProductId) : undefined;

                const response = await aiApiClient.enhanceContent({
                    content,
                    platform: selectedPlatforms,
                    tone: selectedTone,
                    brandVoice: product?.brandVoice || company?.brandVoice,
                    targetAudience: product?.targetAudience || company?.targetAudience,
                    goals: [
                        'improve_grammar',
                        'increase_engagement',
                        ...(includeEmojis ? ['add_emojis'] : []),
                        'improve_clarity'
                    ],
                });

                setContent(response.data.enhancedContent);
                showToast('Content enhanced successfully! ✨', 'success');
            } else {
                // Generate new content - platform-specific if multiple platforms selected
                const company = companies.find((c: Company) => c.id === selectedCompanyId);
                const product = selectedProductId ? products.find((p: Product) => p.id === selectedProductId) : undefined;

                if (selectedPlatforms.length === 0) {
                    showToast('Please select at least one platform', 'warning');
                    return;
                }

                // If multiple platforms with different content styles, generate separate content for each
                const platformsByStyle = selectedPlatforms.reduce((acc, platform) => {
                    const config = getPlatformConfig(platform as SocialPlatform);
                    if (!acc[config.contentStyle]) {
                        acc[config.contentStyle] = [];
                    }
                    acc[config.contentStyle].push(platform);
                    return acc;
                }, {} as Record<string, string[]>);

                const uniqueStyles = Object.keys(platformsByStyle);

                if (uniqueStyles.length > 1) {
                    // Multiple content styles needed - generate platform-specific variations
                    const enhancedVariations: EnhancedVariation[] = [];

                    // First, get 3 base variations for each platform style
                    const variationsByStyle: Record<string, CaptionVariation[]> = {};

                    for (const style of uniqueStyles) {
                        const platforms = platformsByStyle[style];
                        const maxLength = Math.min(...platforms.map(p => getPlatformConfig(p as SocialPlatform).characterLimit));

                        // Build context for AI
                        let context = `Create an engaging social media post for ${company?.name || 'the company'}`;
                        if (product) {
                            context += ` about ${product.name}`;
                        }
                        context += `. Optimize for ${platforms.map(p => getPlatformName(p as SocialPlatform)).join(', ')}.`;

                        const response = await aiApiClient.generateCaption({
                            context,
                            platform: platforms,
                            tone: selectedTone,
                            includeHashtags,
                            includeEmojis,
                            maxLength,
                            brandProfile: {
                                companyName: company?.name || '',
                                brandVoice: product?.brandVoice || company?.brandVoice,
                                targetAudience: product?.targetAudience || company?.targetAudience,
                                industry: company?.industry,
                                restrictedTopics: company?.restrictedTopics,
                            },
                        });

                        variationsByStyle[style] = response.data.variations;
                    }

                    // Now structure into 3 variations, each with platform versions
                    for (let i = 0; i < 3; i++) {
                        const platformVersions: Record<string, CaptionVariation> = {};

                        for (const style of uniqueStyles) {
                            const platforms = platformsByStyle[style];
                            const platformGroup = platforms.map(p => getPlatformName(p as SocialPlatform)).join('/');
                            platformVersions[platformGroup] = variationsByStyle[style][i];
                        }

                        enhancedVariations.push({
                            variationIndex: i,
                            platformVersions,
                        });
                    }

                    setAiVariations(enhancedVariations);
                    setSelectedVariation(0);
                    setSelectedPlatformTab(Object.keys(enhancedVariations[0].platformVersions)[0]);
                    setShowVariations(true);
                    showToast(`Generated 3 variations with platform-specific content!`, 'success');
                } else {
                    // Single content style - generate 3 variations
                    const maxLength = Math.min(...selectedPlatforms.map(p => getPlatformConfig(p as SocialPlatform).characterLimit));

                    let context = `Create an engaging social media post for ${company?.name || 'the company'}`;
                    if (product) {
                        context += ` about ${product.name}`;
                    }
                    context += '.';

                    const response = await aiApiClient.generateCaption({
                        context,
                        platform: selectedPlatforms,
                        tone: selectedTone,
                        includeHashtags,
                        includeEmojis,
                        maxLength,
                        brandProfile: {
                            companyName: company?.name || '',
                            brandVoice: product?.brandVoice || company?.brandVoice,
                            targetAudience: product?.targetAudience || company?.targetAudience,
                            industry: company?.industry,
                            restrictedTopics: company?.restrictedTopics,
                        },
                    });

                    // Convert to EnhancedVariation format (single platform group)
                    const platformGroup = 'All Platforms';
                    const enhancedVariations: EnhancedVariation[] = response.data.variations.map((variation, index) => ({
                        variationIndex: index,
                        platformVersions: {
                            [platformGroup]: variation,
                        },
                    }));

                    setAiVariations(enhancedVariations);
                    setSelectedVariation(0);
                    setSelectedPlatformTab(platformGroup);
                    setShowVariations(true);
                    showToast('Generated 3 caption variations! Choose one below.', 'success');
                }
            }
        } catch (error) {
            console.error('AI assist error:', error);
            showToast('Failed to process request. Please try again.', 'error');
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleUseVariation = () => {
        if (aiVariations[selectedVariation]) {
            const variation = aiVariations[selectedVariation];
            const platformVersions = variation.platformVersions;

            // Build platform-specific content map
            const platformContentMap: Record<string, string> = {};

            Object.entries(platformVersions).forEach(([platformGroup, captionVariation]) => {
                let content = captionVariation.text;

                // Add hashtags if they exist and includeHashtags is true
                if (includeHashtags && captionVariation.hashtags && captionVariation.hashtags.length > 0) {
                    const hashtagsText = captionVariation.hashtags.join(' ');
                    if (!content.includes(hashtagsText)) {
                        content = `${content}\n\n${hashtagsText}`;
                    }
                }

                // Store content for each platform in the group
                // Parse platform group (e.g., "Twitter/Pinterest" or "All Platforms")
                if (platformGroup === 'All Platforms') {
                    // Single content for all platforms - map to each selected platform
                    selectedAccounts.forEach(accountId => {
                        const account = availableAccounts.find(a => a.id === accountId);
                        if (account) {
                            platformContentMap[account.platform] = content;
                        }
                    });
                } else {
                    // Platform-specific content - parse the platform group names
                    const platforms = platformGroup.split('/');
                    platforms.forEach(platformName => {
                        // Find the platform key that matches this name
                        const matchingAccount = availableAccounts.find(acc =>
                            getPlatformName(acc.platform as SocialPlatform) === platformName.trim()
                        );
                        if (matchingAccount) {
                            platformContentMap[matchingAccount.platform] = content;
                        }
                    });
                }
            });

            // Set the first platform's content as the main content (for display)
            const firstPlatform = selectedAccounts[0] ?
                availableAccounts.find(a => a.id === selectedAccounts[0])?.platform : null;
            const mainContent = firstPlatform && platformContentMap[firstPlatform]
                ? platformContentMap[firstPlatform]
                : Object.values(platformContentMap)[0] || '';

            setContent(mainContent);
            setPlatformSpecificContent(platformContentMap);
            setShowVariations(false);
            setAiVariations([]);
            showToast('Platform-specific content applied! 🎉', 'success');
        }
    };

    const canSave = content.trim().length > 0 && selectedAccounts.length > 0;

    // Get selected platforms for AI context
    const selectedPlatforms = selectedAccounts
        .map(id => availableAccounts.find((acc) => acc.id === id)?.platform)
        .filter(Boolean) as string[];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Composer - Left Side */}
            <div className="lg:col-span-2 space-y-6">
                {/* Content Editor */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title text-lg mb-4">
                            <i className="fa-solid fa-duotone fa-pen-to-square text-primary"></i>
                            Compose Your Post
                        </h2>

                        {/* Brand Context Section */}
                        <div className="bg-base-100 rounded-lg mb-4 space-y-3 border border-base-300 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <i className="fa-solid fa-duotone fa-building text-primary"></i>
                                <span className="font-semibold text-sm">Brand Context (for AI)</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Company Selector */}
                                <fieldset className="fieldset w-full">
                                    <legend className="fieldset-legend">Company*</legend>
                                    <div className="flex gap-2">
                                        <select
                                            className="select select-bordered w-full"
                                            value={selectedCompanyId}
                                            onChange={(e) => setSelectedCompanyId(e.target.value)}
                                        >
                                            <option value="">Select company...</option>
                                            {companies.map((company: Company) => (
                                                <option key={company.id} value={company.id}>
                                                    {company.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-square"
                                            onClick={() => setShowEditCompanyModal(true)}
                                            disabled={!selectedCompanyId}
                                            title="Edit company"
                                        >
                                            <i className="fa-solid fa-duotone fa-pen-to-square"></i>
                                        </button>
                                    </div>
                                </fieldset>

                                {/* Product Selector */}
                                <fieldset className="fieldset w-full">
                                    <legend className="fieldset-legend">Product (Optional)</legend>
                                    <div className="flex gap-2">
                                        <select
                                            className="select select-bordered w-full"
                                            value={selectedProductId}
                                            onChange={(e) => setSelectedProductId(e.target.value)}
                                            disabled={!selectedCompanyId || availableProducts.length === 0}
                                        >
                                            <option value="">None (use company voice)</option>
                                            {availableProducts.map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-square"
                                            onClick={() => setShowEditProductModal(true)}
                                            disabled={!selectedProductId}
                                            title="Edit product"
                                        >
                                            <i className="fa-solid fa-duotone fa-pen-to-square"></i>
                                        </button>
                                    </div>
                                </fieldset>
                            </div>

                            {/* AI Options Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {/* Tone Selector */}
                                <fieldset className="fieldset w-full">
                                    <legend className="fieldset-legend">Tone</legend>
                                    <select
                                        className="select select-bordered w-full"
                                        value={selectedTone}
                                        onChange={(e) => setSelectedTone(e.target.value as 'professional' | 'casual' | 'friendly' | 'formal' | 'humorous')}
                                    >
                                        <option value="professional">Professional</option>
                                        <option value="casual">Casual</option>
                                        <option value="friendly">Friendly</option>
                                        <option value="formal">Formal</option>
                                        <option value="humorous">Humorous</option>
                                    </select>
                                </fieldset>

                                {/* Hashtags Toggle */}
                                <fieldset className="fieldset w-full">
                                    <legend className="fieldset-legend">Options</legend>
                                    <label className="label cursor-pointer justify-start gap-2 py-1">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm checkbox-primary"
                                            checked={includeHashtags}
                                            onChange={(e) => setIncludeHashtags(e.target.checked)}
                                        />
                                        <span className="label-text">Hashtags</span>
                                    </label>
                                </fieldset>

                                {/* Emojis Toggle */}
                                <fieldset className="fieldset w-full">
                                    <legend className="fieldset-legend">&nbsp;</legend>
                                    <label className="label cursor-pointer justify-start gap-2 py-1">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm checkbox-primary"
                                            checked={includeEmojis}
                                            onChange={(e) => setIncludeEmojis(e.target.checked)}
                                        />
                                        <span className="label-text">Emojis</span>
                                    </label>
                                </fieldset>
                            </div>
                        </div>

                        {/* Platform-Specific Content Tabs (if multiple platforms selected) */}
                        {(() => {
                            // Get unique platforms from selected accounts
                            const platforms = selectedAccounts
                                .map(accountId => availableAccounts.find(a => a.id === accountId)?.platform)
                                .filter(Boolean) as string[];
                            const uniquePlatforms = Array.from(new Set(platforms));
                            const hasMultiplePlatforms = uniquePlatforms.length > 1;
                            const hasPlatformContent = Object.keys(platformSpecificContent).length > 0;

                            return hasMultiplePlatforms && hasPlatformContent ? (
                                <div className="space-y-2">
                                    {/* Platform Tabs */}
                                    <div className="tabs tabs-boxed">
                                        {(() => {

                                            return uniquePlatforms.map(platform => {
                                                const config = getPlatformConfig(platform as SocialPlatform);
                                                return (
                                                    <button
                                                        key={platform}
                                                        type="button"
                                                        className={`tab gap-2 ${selectedPlatformTab === platform ? 'tab-active' : ''}`}
                                                        onClick={() => setSelectedPlatformTab(platform)}
                                                    >
                                                        <i className={config.icon}></i>
                                                        {config.name}
                                                    </button>
                                                );
                                            });
                                        })()}
                                    </div>

                                    {/* Platform-Specific Textarea */}
                                    {(() => {
                                        // Get unique platforms from selected accounts
                                        const platforms = selectedAccounts
                                            .map(accountId => availableAccounts.find(a => a.id === accountId)?.platform)
                                            .filter(Boolean) as string[];
                                        const uniquePlatforms = Array.from(new Set(platforms));

                                        return uniquePlatforms.map(platform => {
                                            if (selectedPlatformTab !== platform) return null;

                                            const config = getPlatformConfig(platform as SocialPlatform);
                                            const platformContent = platformSpecificContent[platform] || '';

                                            return (
                                                <div key={platform} className="space-y-2">
                                                    <textarea
                                                        ref={selectedPlatformTab === platform ? textareaRef : null}
                                                        className="textarea textarea-bordered w-full min-h-[200px] text-base"
                                                        placeholder={`Content optimized for ${config.name} (max ${config.characterLimit} characters)...`}
                                                        value={platformContent}
                                                        onChange={(e) => {
                                                            const newContent = e.target.value;
                                                            setPlatformSpecificContent(prev => ({
                                                                ...prev,
                                                                [platform]: newContent
                                                            }));
                                                            // Update main content to the first platform's content
                                                            const firstPlatform = uniquePlatforms[0];
                                                            if (platform === firstPlatform) {
                                                                setContent(newContent);
                                                            }
                                                        }}
                                                    />
                                                    <div className="flex items-center justify-between text-xs text-base-content/60">
                                                        <span>
                                                            <i className="fa-solid fa-duotone fa-sparkles mr-1"></i>
                                                            Platform-optimized content
                                                        </span>
                                                        <span>
                                                            {platformContent.length} / {config.characterLimit} characters
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}

                                    {/* Clear Platform-Specific Content Button */}
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-xs"
                                        onClick={() => {
                                            setPlatformSpecificContent({});
                                            setContent('');
                                        }}
                                    >
                                        <i className="fa-solid fa-duotone fa-xmark mr-1"></i>
                                        Clear platform-specific content
                                    </button>
                                </div>
                            ) : (
                                /* Single Text Area (default or single platform) */
                                <textarea
                                    ref={textareaRef}
                                    className="textarea textarea-bordered w-full min-h-[200px] text-base"
                                    placeholder="Start typing or use AI Assist to generate content..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            );
                        })()}

                        {/* Composer Toolbar with AI Assist */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <ComposerToolbar
                                onInsertEmoji={handleInsertEmoji}
                                onInsertHashtag={handleInsertHashtag}
                                onInsertMention={handleInsertMention}
                            />

                            {/* AI Assist Button */}
                            <button
                                type="button"
                                className={`btn btn-sm gap-2 ${content.trim() ? 'btn-accent' : 'btn-primary'}`}
                                onClick={handleAIAssist}
                                disabled={!selectedCompanyId || isEnhancing}
                                title={
                                    !selectedCompanyId
                                        ? 'Select a company first'
                                        : content.trim()
                                            ? 'Enhance content with AI'
                                            : 'Generate content with AI'
                                }
                            >
                                {isEnhancing ? (
                                    <>
                                        <span className="loading loading-spinner loading-xs"></span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-duotone fa-wand-magic-sparkles"></i>
                                        <span className="hidden sm:inline">
                                            {content.trim() ? 'AI Enhance' : 'AI Generate'}
                                        </span>
                                        <span className="sm:hidden">AI</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* AI Variations Section */}
                        {showVariations && aiVariations.length > 0 && (
                            <div className="bg-base-100 rounded-lg p-4 mt-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <i className="fa-solid fa-duotone fa-sparkles text-primary"></i>
                                        <span className="font-semibold text-sm">AI Generated Variations</span>
                                    </div>
                                    <button
                                        className="btn btn-ghost btn-xs"
                                        onClick={() => setShowVariations(false)}
                                    >
                                        <i className="fa-solid fa-duotone fa-xmark"></i>
                                    </button>
                                </div>

                                {/* Outer Tabs: Variations (creative direction) */}
                                <div className="tabs tabs-boxed">
                                    {aiVariations.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`tab ${selectedVariation === index ? 'tab-active' : ''}`}
                                            onClick={() => setSelectedVariation(index)}
                                        >
                                            <i className="fa-solid fa-duotone fa-palette mr-1.5"></i>
                                            Variation {index + 1}
                                        </button>
                                    ))}
                                </div>

                                {/* Inner Tabs: Platform-specific content (if multi-platform) */}
                                {aiVariations[selectedVariation] && Object.keys(aiVariations[selectedVariation].platformVersions).length > 1 && (
                                    <div className="tabs tabs-bordered">
                                        {Object.keys(aiVariations[selectedVariation].platformVersions).map((platformKey) => (
                                            <button
                                                key={platformKey}
                                                className={`tab ${selectedPlatformTab === platformKey ? 'tab-active' : ''}`}
                                                onClick={() => setSelectedPlatformTab(platformKey)}
                                            >
                                                {platformKey}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Selected Variation Content */}
                                {aiVariations[selectedVariation] && (() => {
                                    const platformKeys = Object.keys(aiVariations[selectedVariation].platformVersions);
                                    const platformKey = selectedPlatformTab || platformKeys[0];
                                    const captionVariation = aiVariations[selectedVariation].platformVersions[platformKey];

                                    return (
                                        <div className="bg-base-200 rounded-lg p-4 text-sm">
                                            <p className="whitespace-pre-wrap">{captionVariation.text}</p>
                                            {captionVariation.hashtags && captionVariation.hashtags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-base-300">
                                                    {captionVariation.hashtags.map((tag, idx) => (
                                                        <span key={idx} className="badge badge-primary badge-sm">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="text-xs text-base-content/60 mt-3">
                                                {captionVariation.characterCount} characters
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Use Variation Button */}
                                <button
                                    className="btn btn-primary btn-sm w-full"
                                    onClick={handleUseVariation}
                                >
                                    <i className="fa-solid fa-duotone fa-check"></i>
                                    Use This Variation
                                </button>
                            </div>
                        )}

                        <CharacterCounter
                            content={content}
                            selectedPlatforms={selectedAccounts.map(id =>
                                availableAccounts.find((acc) => acc.id === id)?.platform || ''
                            )}
                        />
                    </div>
                </div>

                {/* Media Upload */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title text-lg mb-4">
                            <i className="fa-solid fa-duotone fa-image text-secondary"></i>
                            Media
                        </h2>

                        <MediaUploader
                            mediaUrls={mediaUrls}
                            onMediaChange={setMediaUrls}
                        />
                    </div>
                </div>

                {/* Preview Toggle */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <h2 className="card-title text-lg">
                                <i className="fa-solid fa-duotone fa-eye text-accent"></i>
                                Preview
                            </h2>
                            <button
                                className="btn btn-sm btn-outline"
                                onClick={() => setShowPreview(!showPreview)}
                            >
                                {showPreview ? 'Hide' : 'Show'} Preview
                            </button>
                        </div>

                        {showPreview && (
                            <div className="mt-4">
                                <PostPreview
                                    content={content}
                                    platformSpecificContent={platformSpecificContent}
                                    mediaUrls={mediaUrls}
                                    selectedAccounts={selectedAccounts.map(id =>
                                        availableAccounts.find((acc) => acc.id === id)!
                                    ).filter(Boolean)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
                {/* Platform Selection */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title text-lg mb-4">
                            <i className="fa-solid fa-duotone fa-share-nodes text-primary"></i>
                            Platforms
                        </h2>

                        <PlatformSelector
                            accounts={availableAccounts}
                            selectedAccounts={selectedAccounts}
                            onSelectionChange={setSelectedAccounts}
                        />
                    </div>
                </div>

                {/* Schedule */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title text-lg mb-4">
                            <i className="fa-solid fa-duotone fa-clock text-secondary"></i>
                            Schedule
                        </h2>

                        <SchedulePicker
                            scheduledTime={scheduledTime}
                            onTimeChange={setScheduledTime}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <div className="space-y-3">
                            <button
                                className="btn btn-primary btn-block"
                                onClick={handlePublishNow}
                                disabled={!canSave || isSaving}
                            >
                                <i className="fa-solid fa-duotone fa-paper-plane"></i>
                                Publish Now
                            </button>

                            <button
                                className="btn btn-secondary btn-block"
                                onClick={handleSchedule}
                                disabled={!canSave || !scheduledTime || isSaving}
                            >
                                <i className="fa-solid fa-duotone fa-calendar-plus"></i>
                                Schedule Post
                            </button>

                            <button
                                className="btn btn-outline btn-block"
                                onClick={handleSaveDraft}
                                disabled={!canSave || isSaving}
                            >
                                <i className="fa-solid fa-duotone fa-floppy-disk"></i>
                                Save as Draft
                            </button>

                            <button
                                className="btn btn-ghost btn-block"
                                onClick={onCancel}
                                disabled={isSaving}
                            >
                                <i className="fa-solid fa-duotone fa-xmark"></i>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Company Modal */}
            {selectedCompanyId && (
                <EditCompanyModal
                    isOpen={showEditCompanyModal}
                    onClose={() => setShowEditCompanyModal(false)}
                    company={companies.find((c: Company) => c.id === selectedCompanyId)!}
                    onSave={() => {
                        // In real app, this would update the company in the backend
                        showToast('Company updated successfully!', 'success');
                        setShowEditCompanyModal(false);
                    }}
                />
            )}

            {/* Edit Product Modal */}
            {selectedProductId && (
                <EditProductModal
                    isOpen={showEditProductModal}
                    onClose={() => setShowEditProductModal(false)}
                    product={products.find((p: Product) => p.id === selectedProductId)!}
                    onSave={() => {
                        // In real app, this would update the product in the backend
                        showToast('Product updated successfully!', 'success');
                        setShowEditProductModal(false);
                    }}
                />
            )}
        </div>
    );
}
