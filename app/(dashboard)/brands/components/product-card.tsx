import type { Product } from '@/types';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="card bg-base-100">
            <div className="card-body">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        {product.logo ? (
                            <img
                                src={product.logo}
                                alt={product.name}
                                className="w-8 h-8 rounded"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                                <i className="fa-solid fa-duotone fa-box text-primary text-sm"></i>
                            </div>
                        )}
                        <h3 className="font-semibold">{product.name}</h3>
                    </div>
                    <button className="btn btn-ghost btn-sm btn-square">
                        <i className="fa-solid fa-duotone fa-ellipsis-vertical"></i>
                    </button>
                </div>

                {product.description && (
                    <p className="text-sm text-base-content/70 mb-3">{product.description}</p>
                )}

                <div className="space-y-2">
                    {product.brandVoice && (
                        <div>
                            <p className="text-xs font-semibold text-base-content/60 mb-1">
                                <i className="fa-solid fa-duotone fa-microphone mr-1"></i>
                                Brand Voice
                            </p>
                            <p className="text-xs text-base-content/80 line-clamp-2">
                                {product.brandVoice}
                            </p>
                        </div>
                    )}

                    {product.targetAudience && (
                        <div>
                            <p className="text-xs font-semibold text-base-content/60 mb-1">
                                <i className="fa-solid fa-duotone fa-users mr-1"></i>
                                Target Audience
                            </p>
                            <p className="text-xs text-base-content/80 line-clamp-2">
                                {product.targetAudience}
                            </p>
                        </div>
                    )}

                    {product.preferredHashtags && product.preferredHashtags.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-base-content/60 mb-1">
                                <i className="fa-solid fa-duotone fa-hashtag mr-1"></i>
                                Hashtags
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {product.preferredHashtags.slice(0, 3).map(tag => (
                                    <span key={tag} className="badge badge-sm">{tag}</span>
                                ))}
                                {product.preferredHashtags.length > 3 && (
                                    <span className="badge badge-sm">
                                        +{product.preferredHashtags.length - 3}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="card-actions justify-end mt-4">
                    <button className="btn btn-sm btn-ghost">
                        <i className="fa-solid fa-duotone fa-pen-to-square mr-1"></i>
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}
