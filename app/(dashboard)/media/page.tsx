'use client';

import { ProductMediaManager } from './components/product-media-manager';
import { useActiveContext } from '@/contexts/active-context-provider';

export default function MediaPage() {
    const { activeContext } = useActiveContext();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Media Library</h1>
                <p className="text-base-content/70">
                    Manage product media, brand assets, and content library
                </p>
            </div>

            {!activeContext?.productId ? (
                <div className="alert alert-info">
                    <i className="fa-solid fa-duotone fa-info-circle"></i>
                    <span>Select a product from the context switcher to view media</span>
                </div>
            ) : (
                <ProductMediaManager />
            )}
        </div>
    );
}
