interface AddCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddCompanyModal({ isOpen, onClose }: AddCompanyModalProps) {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement company creation
        onClose();
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-lg mb-4">Add New Company</h3>

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
                                required
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
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>
                            <textarea
                                placeholder="Brief description of the company..."
                                className="textarea textarea-bordered h-20"
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
                            />
                            <label className="label">
                                <span className="label-text-alt">Recommended: Square image, at least 512x512px</span>
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
                                    defaultValue="#FF4F64"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Secondary Color</span>
                                </label>
                                <input
                                    type="color"
                                    className="input input-bordered h-12 w-full cursor-pointer"
                                    defaultValue="#6366F1"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Accent Color</span>
                                </label>
                                <input
                                    type="color"
                                    className="input input-bordered h-12 w-full cursor-pointer"
                                    defaultValue="#FBBF24"
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
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Target Audience</span>
                            </label>
                            <textarea
                                placeholder="Who are you trying to reach?"
                                className="textarea textarea-bordered h-20"
                            />
                        </div>
                    </div>

                    <div className="modal-action">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <i className="fa-solid fa-duotone fa-plus mr-2"></i>
                            Add Company
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
}
