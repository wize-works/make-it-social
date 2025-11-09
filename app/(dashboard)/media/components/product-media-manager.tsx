'use client';

import { useState, useEffect, useCallback } from 'react';
import { useContextParams } from '@/hooks/use-context-params';
import Image from 'next/image';

interface ProductMedia {
    id: string;
    product_id: string;
    media_url: string;
    media_type: 'image' | 'video' | 'document';
    file_name: string;
    file_size: number;
    mime_type: string;
    alt_text?: string;
    tags?: string[];
    is_brand_asset: boolean;
    created_at: string;
    updated_at: string;
}

interface ProductMediaManagerProps {
    className?: string;
}

export function ProductMediaManager({ className = '' }: ProductMediaManagerProps) {
    const { productId } = useContextParams();
    const [media, setMedia] = useState<ProductMedia[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<ProductMedia | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch media
    const fetchMedia = useCallback(async () => {
        if (!productId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:3004/api/v1/product-media?productId=${productId}`);
            if (!response.ok) throw new Error('Failed to load media');
            const data = await response.json();
            setMedia(data.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load media');
        } finally {
            setIsLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    // Handle file upload
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0 || !productId) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('product_id', productId);
                formData.append('file_name', file.name);
                formData.append('media_type', file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document');
                formData.append('mime_type', file.type);
                formData.append('file_size', file.size.toString());

                const response = await fetch('http://localhost:3004/api/v1/product-media', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                setUploadProgress((prev) => prev + (100 / files.length));
            }

            await fetchMedia();
            event.target.value = ''; // Reset input
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // Handle delete
    const handleDelete = async (mediaId: string) => {
        if (!confirm('Are you sure you want to delete this media?')) return;

        try {
            const response = await fetch(`http://localhost:3004/api/v1/product-media/${mediaId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Delete failed');

            setMedia(media.filter((m) => m.id !== mediaId));
            setSelectedMedia(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Delete failed');
        }
    };

    // Handle toggle brand asset
    const handleToggleBrandAsset = async (mediaItem: ProductMedia) => {
        try {
            const response = await fetch(`http://localhost:3004/api/v1/product-media/${mediaItem.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    is_brand_asset: !mediaItem.is_brand_asset,
                }),
            });

            if (!response.ok) throw new Error('Update failed');

            setMedia(media.map((m) => (m.id === mediaItem.id ? { ...m, is_brand_asset: !m.is_brand_asset } : m)));
            if (selectedMedia?.id === mediaItem.id) {
                setSelectedMedia({ ...mediaItem, is_brand_asset: !mediaItem.is_brand_asset });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Update failed');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <i className="fa-solid fa-duotone fa-exclamation-triangle"></i>
                <span>{error}</span>
                <button className="btn btn-sm" onClick={fetchMedia}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
            {/* Media Grid */}
            <div className="lg:col-span-2">
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="card-title">
                                <i className="fa-solid fa-duotone fa-images"></i>
                                Media Gallery
                            </h2>
                            <label className="btn btn-primary btn-sm">
                                <i className="fa-solid fa-duotone fa-upload"></i>
                                Upload
                                <input type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
                            </label>
                        </div>

                        {isUploading && (
                            <div className="mb-4">
                                <progress className="progress progress-primary w-full" value={uploadProgress} max="100"></progress>
                                <p className="text-sm text-center mt-2">Uploading... {Math.round(uploadProgress)}%</p>
                            </div>
                        )}

                        {media.length === 0 ? (
                            <div className="text-center py-12">
                                <i className="fa-solid fa-duotone fa-image text-6xl text-base-content/30 mb-4"></i>
                                <p className="text-base-content/70">No media yet. Upload your first file!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {media.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`card bg-base-100 shadow cursor-pointer hover:shadow-xl transition-shadow ${selectedMedia?.id === item.id ? 'ring-2 ring-primary' : ''
                                            }`}
                                        onClick={() => setSelectedMedia(item)}
                                    >
                                        <figure className="relative aspect-square">
                                            {item.media_type === 'image' ? (
                                                <Image src={item.media_url} alt={item.alt_text || item.file_name} fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" />
                                            ) : item.media_type === 'video' ? (
                                                <div className="w-full h-full flex items-center justify-center bg-base-300">
                                                    <i className="fa-solid fa-duotone fa-video text-4xl text-base-content/50"></i>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-base-300">
                                                    <i className="fa-solid fa-duotone fa-file text-4xl text-base-content/50"></i>
                                                </div>
                                            )}
                                            {item.is_brand_asset && (
                                                <div className="badge badge-primary badge-sm absolute top-2 right-2">
                                                    <i className="fa-solid fa-duotone fa-star"></i>
                                                </div>
                                            )}
                                        </figure>
                                        <div className="card-body p-2">
                                            <p className="text-xs truncate">{item.file_name}</p>
                                            <p className="text-xs text-base-content/50">{(item.file_size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Details Panel */}
            <div className="lg:col-span-1">
                {selectedMedia ? (
                    <div className="card bg-base-200 shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title">
                                <i className="fa-solid fa-duotone fa-info-circle"></i>
                                Media Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">File Name</span>
                                    </label>
                                    <p className="text-sm break-all">{selectedMedia.file_name}</p>
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">Type</span>
                                    </label>
                                    <div className="badge badge-outline">{selectedMedia.media_type}</div>
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">Size</span>
                                    </label>
                                    <p className="text-sm">{(selectedMedia.file_size / 1024).toFixed(2)} KB</p>
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">MIME Type</span>
                                    </label>
                                    <p className="text-sm">{selectedMedia.mime_type}</p>
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">Alt Text</span>
                                    </label>
                                    <p className="text-sm">{selectedMedia.alt_text || 'Not set'}</p>
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">Brand Asset</span>
                                    </label>
                                    <div className="form-control">
                                        <label className="label cursor-pointer">
                                            <span className="label-text">Mark as brand asset</span>
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={selectedMedia.is_brand_asset}
                                                onChange={() => handleToggleBrandAsset(selectedMedia)}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">URL</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input type="text" value={selectedMedia.media_url} readOnly className="input input-sm input-bordered flex-1 text-xs" />
                                        <button
                                            className="btn btn-sm btn-square"
                                            onClick={() => navigator.clipboard.writeText(selectedMedia.media_url)}
                                            title="Copy URL"
                                        >
                                            <i className="fa-solid fa-duotone fa-copy"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="divider"></div>

                                <div className="flex gap-2">
                                    <button className="btn btn-error btn-sm flex-1" onClick={() => handleDelete(selectedMedia.id)}>
                                        <i className="fa-solid fa-duotone fa-trash"></i>
                                        Delete
                                    </button>
                                    <a href={selectedMedia.media_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm flex-1">
                                        <i className="fa-solid fa-duotone fa-external-link"></i>
                                        Open
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card bg-base-200 shadow-lg">
                        <div className="card-body">
                            <div className="text-center py-8">
                                <i className="fa-solid fa-duotone fa-hand-pointer text-4xl text-base-content/30 mb-4"></i>
                                <p className="text-base-content/70">Select a media item to view details</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
