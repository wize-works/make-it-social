import { useState, useRef } from 'react';
import Image from 'next/image';
import type { Product, BrandColor } from '@/types';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    companyId: string;
    companyName: string;
    onAdd: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function AddProductModal({ isOpen, onClose, companyId, companyName, onAdd }: AddProductModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo: undefined as string | undefined,
        icon: undefined as string | undefined,
        brandVoice: '',
        targetAudience: '',
        keywords: '',
        restrictedTopics: '',
        preferredHashtags: '',
    });
    const [brandColors, setBrandColors] = useState<BrandColor[]>([]);
    const [activeTab, setActiveTab] = useState<'details' | 'branding' | 'profile'>('details');

    const logoInputRef = useRef<HTMLInputElement>(null);
    const iconInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
            companyId,
            name: formData.name,
            description: formData.description || undefined,
            logo: formData.logo,
            icon: formData.icon,
            brandColors: brandColors.length > 0 ? brandColors : undefined,
            brandVoice: formData.brandVoice || undefined,
            targetAudience: formData.targetAudience || undefined,
            keywords: formData.keywords
                ? formData.keywords.split(',').map(k => k.trim()).filter(Boolean)
                : undefined,
            restrictedTopics: formData.restrictedTopics
                ? formData.restrictedTopics.split(',').map(t => t.trim()).filter(Boolean)
                : undefined,
            preferredHashtags: formData.preferredHashtags
                ? formData.preferredHashtags.split(',').map(t => t.trim()).filter(Boolean)
                : undefined,
        };

        onAdd(newProduct);

        // Reset form
        setFormData({
            name: '',
            description: '',
            logo: undefined,
            icon: undefined,
            brandVoice: '',
            targetAudience: '',
            keywords: '',
            restrictedTopics: '',
            preferredHashtags: '',
        });
        setBrandColors([]);
        setActiveTab('details');

        onClose();
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLogoClick = () => {
        logoInputRef.current?.click();
    };

    const handleIconClick = () => {
        iconInputRef.current?.click();
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // TODO: Upload file and get URL
            const url = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, logo: url }));
        }
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // TODO: Upload file and get URL
            const url = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, icon: url }));
        }
    };

    const handleDeleteColor = (colorId: string) => {
        setBrandColors(brandColors.filter(c => c.id !== colorId));
    };

    const handleUpdateColor = (colorId: string, value: string) => {
        setBrandColors(brandColors.map(c =>
            c.id === colorId ? { ...c, value } : c
        ));
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-2xl max-h-[90vh]">
                <h3 className="font-bold text-lg mb-2">Add New Product</h3>
                <p className="text-sm text-base-content/70 mb-4">
                    For company: <span className="font-semibold">{companyName}</span>
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Tabs */}
                    <div className="tabs tabs-boxed mb-6 bg-base-200">
                        <button
                            type="button"
                            className={`tab ${activeTab === 'details' ? 'tab-active' : ''}`}
                            onClick={() => setActiveTab('details')}
                        >
                            <i className="fa-solid fa-duotone fa-box mr-2"></i>
                            Details
                        </button>
                        <button
                            type="button"
                            className={`tab ${activeTab === 'branding' ? 'tab-active' : ''}`}
                            onClick={() => setActiveTab('branding')}
                        >
                            <i className="fa-solid fa-duotone fa-palette mr-2"></i>
                            Branding
                        </button>
                        <button
                            type="button"
                            className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <i className="fa-solid fa-duotone fa-bullseye mr-2"></i>
                            Profile
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="overflow-y-auto max-h-[calc(90vh-280px)]">
                        {/* Details Tab */}
                        {activeTab === 'details' && (
                            <div className="space-y-4">
                                <fieldset className="fieldset w-full">
                                    <legend className="fieldset-legend">
                                        Product Name
                                    </legend>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder="e.g., Social Media Management"
                                        className="input"
                                        required
                                    />
                                </fieldset>

                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">
                                        Description
                                    </legend>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        placeholder="Brief description of the product..."
                                        className="textarea textarea-bordered h-20 w-full"
                                    />
                                    <p className='label'>Optional</p>
                                </fieldset>
                            </div>
                        )}

                        {/* Branding Tab */}
                        {activeTab === 'branding' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Logo Upload */}
                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend">Logo</legend>
                                        <input
                                            ref={logoInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleLogoChange}
                                        />
                                        <div
                                            onClick={handleLogoClick}
                                            className="border-2 border-dashed border-base-300 rounded-xl p-6 hover:border-primary hover:bg-base-200/50 cursor-pointer transition-all flex items-center justify-center h-36 group"
                                        >
                                            {formData.logo ? (
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    <Image
                                                        src={formData.logo}
                                                        alt="Product logo"
                                                        fill
                                                        className="object-contain"
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg z-10">
                                                        <span className="text-white text-sm font-medium">
                                                            <i className="fa-solid fa-duotone fa-upload mr-2"></i>
                                                            Change Logo
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center text-base-content/50 group-hover:text-primary transition-colors">
                                                    <i className="fa-solid fa-duotone fa-image text-4xl mb-2 block"></i>
                                                    <p className="text-sm font-medium">Click to upload logo</p>
                                                    <p className="text-xs mt-1 opacity-60">Recommended: 512x512px</p>
                                                </div>
                                            )}
                                        </div>
                                        <span className="label">Click to upload</span>
                                    </fieldset>

                                    {/* Icon Upload */}
                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend">Icon</legend>
                                        <input
                                            ref={iconInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleIconChange}
                                        />
                                        <div
                                            onClick={handleIconClick}
                                            className="border-2 border-dashed border-base-300 rounded-xl p-6 hover:border-primary hover:bg-base-200/50 cursor-pointer transition-all flex items-center justify-center h-36 group"
                                        >
                                            {formData.icon ? (
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    <Image
                                                        src={formData.icon}
                                                        alt="Product icon"
                                                        fill
                                                        className="object-contain"
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg z-10">
                                                        <span className="text-white text-sm font-medium">
                                                            <i className="fa-solid fa-duotone fa-upload mr-2"></i>
                                                            Change Icon
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center text-base-content/50 group-hover:text-primary transition-colors">
                                                    <i className="fa-solid fa-duotone fa-icons text-4xl mb-2 block"></i>
                                                    <p className="text-sm font-medium">Click to upload icon</p>
                                                    <p className="text-xs mt-1 opacity-60">Square, 256x256px or larger</p>
                                                </div>
                                            )}
                                        </div>
                                        <span className="label">Product Icon</span>
                                    </fieldset>
                                </div>

                                {/* Brand Colors */}
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Brand Colors</legend>

                                    {/* Color Swatches Grid */}
                                    <div className="flex flex-wrap gap-3">
                                        {/* Existing Colors */}
                                        {brandColors.map((color) => (
                                            <div key={color.id} className="relative group">
                                                <div
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() => document.getElementById(`color-input-${color.id}`)?.click()}
                                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.getElementById(`color-input-${color.id}`)?.click(); } }}
                                                    className="w-16 h-16 rounded-lg border-2 border-base-300 shadow-sm cursor-pointer hover:border-primary transition-all"
                                                    style={{ backgroundColor: color.value }}
                                                    title={color.value}
                                                    aria-label={`Pick color ${color.value}`}
                                                />
                                                {/* positioned color input - triggered by swatch */}
                                                <input
                                                    id={`color-input-${color.id}`}
                                                    type="color"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    value={color.value}
                                                    onChange={(e) => handleUpdateColor(color.id, e.target.value)}
                                                    title={`Pick color ${color.value}`}
                                                />
                                                {/* Delete button - shows on hover */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteColor(color.id);
                                                    }}
                                                    className="absolute -top-2 -right-2 btn btn-xs btn-circle btn-error opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                    title="Delete color"
                                                    aria-label="Delete color"
                                                >
                                                    <i className="fa-solid fa-duotone fa-trash text-xs"></i>
                                                </button>
                                            </div>
                                        ))}

                                        {/* Add New Color Button */}
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => {
                                                const newColor: BrandColor = {
                                                    id: `color-${Date.now()}`,
                                                    value: '#FF4F64',
                                                };
                                                setBrandColors([...brandColors, newColor]);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    const newColor: BrandColor = {
                                                        id: `color-${Date.now()}`,
                                                        value: '#FF4F64',
                                                    };
                                                    setBrandColors([...brandColors, newColor]);
                                                }
                                            }}
                                            className="w-16 h-16 rounded-lg border-2 border-dashed border-base-300 cursor-pointer hover:border-primary hover:bg-base-200 transition-all flex items-center justify-center"
                                            title="Add new color"
                                            aria-label="Add new color"
                                        >
                                            <i className="fa-solid fa-duotone fa-plus text-2xl text-base-content/50"></i>
                                        </div>
                                    </div>

                                    {brandColors.length === 0 && (
                                        <p className="text-sm text-base-content/50 mt-2">Click the + button to add your first brand color</p>
                                    )}
                                    <span className="label">Click any swatch to change its color</span>
                                </fieldset>
                            </div>
                        )}

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-4">
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Brand Voice</legend>
                                    <textarea
                                        value={formData.brandVoice}
                                        onChange={(e) => handleChange('brandVoice', e.target.value)}
                                        placeholder="Describe the tone and style for this product..."
                                        className="textarea textarea-bordered h-24 w-full"
                                    />
                                    <p className='label'>Optional - overrides company brand voice</p>
                                </fieldset>

                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">
                                        Target Audience
                                    </legend>
                                    <textarea
                                        value={formData.targetAudience}
                                        onChange={(e) => handleChange('targetAudience', e.target.value)}
                                        placeholder="Who is this product for?"
                                        className="textarea textarea-bordered h-20 w-full"
                                    />
                                    <p className='label'>Optional</p>
                                </fieldset>

                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">
                                        Keywords (comma-separated)
                                    </legend>
                                    <input
                                        type="text"
                                        value={formData.keywords}
                                        onChange={(e) => handleChange('keywords', e.target.value)}
                                        placeholder="consulting, strategy, marketing"
                                        className="input w-full"
                                    />
                                    <p className='label'>Optional - helps AI understand product context</p>
                                </fieldset>

                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">
                                        Restricted Topics (comma-separated)
                                    </legend>
                                    <input
                                        type="text"
                                        value={formData.restrictedTopics}
                                        onChange={(e) => handleChange('restrictedTopics', e.target.value)}
                                        placeholder="Politics, Religion, Controversial topics"
                                        className="input w-full"
                                    />
                                    <p className='label'>Optional</p>
                                </fieldset>

                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">
                                        Preferred Hashtags (comma-separated)
                                    </legend>
                                    <input
                                        type="text"
                                        value={formData.preferredHashtags}
                                        onChange={(e) => handleChange('preferredHashtags', e.target.value)}
                                        placeholder="#Marketing, #Business, #Growth"
                                        className="input w-full"
                                    />
                                </fieldset>
                            </div>
                        )}
                    </div>

                    <div className="modal-action">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-accent">
                            <i className="fa-solid fa-duotone fa-plus mr-2"></i>
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
}
