'use client';

import { useState } from 'react';

interface MediaUploaderProps {
    mediaUrls: string[];
    onMediaChange: (urls: string[]) => void;
    maxFiles?: number;
}

export function MediaUploader({
    mediaUrls,
    onMediaChange,
    maxFiles = 10
}: MediaUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        }
    };

    const handleFiles = (files: File[]) => {
        // TODO: In production, upload to storage and get URLs
        // For now, create mock URLs
        const newUrls = files.map((file, index) =>
            `/mock-images/upload-${Date.now()}-${index}.jpg`
        );

        const updatedUrls = [...mediaUrls, ...newUrls].slice(0, maxFiles);
        onMediaChange(updatedUrls);
    };

    const removeMedia = (index: number) => {
        const updatedUrls = mediaUrls.filter((_, i) => i !== index);
        onMediaChange(updatedUrls);
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                    ? 'border-primary bg-primary/10'
                    : 'border-base-300 hover:border-primary/50'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="space-y-3">
                    <i className="fa-solid fa-duotone fa-cloud-arrow-up text-4xl text-base-content/40"></i>
                    <div>
                        <p className="font-medium">
                            Drag and drop media here
                        </p>
                        <p className="text-sm text-base-content/60 mt-1">
                            or click to browse files
                        </p>
                    </div>

                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileInput}
                        className="hidden"
                        id="media-upload"
                    />
                    <label htmlFor="media-upload" className="btn btn-sm btn-primary">
                        <i className="fa-solid fa-duotone fa-plus"></i>
                        Choose Files
                    </label>

                    <p className="text-xs text-base-content/50 mt-2">
                        Max {maxFiles} files • Images & Videos • Up to 100MB each
                    </p>
                </div>
            </div>

            {/* Media Preview Grid */}
            {mediaUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {mediaUrls.map((url, index) => (
                        <div
                            key={index}
                            className="relative group aspect-square rounded-lg overflow-hidden bg-base-300"
                        >
                            {/* Mock image preview */}
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                <i className="fa-solid fa-duotone fa-image text-3xl text-base-content/30"></i>
                            </div>

                            {/* Remove button */}
                            <button
                                onClick={() => removeMedia(index)}
                                className="absolute top-2 right-2 btn btn-xs btn-circle btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <i className="fa-solid fa-duotone fa-xmark"></i>
                            </button>

                            {/* File info overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="truncate">Media {index + 1}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Media Count */}
            {mediaUrls.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                    <span className="text-base-content/60">
                        {mediaUrls.length} of {maxFiles} files
                    </span>
                    {mediaUrls.length > 0 && (
                        <button
                            onClick={() => onMediaChange([])}
                            className="link link-error text-xs"
                        >
                            <i className="fa-solid fa-duotone fa-trash-can mr-1"></i>
                            Remove All
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
