'use client';

import { useState, useEffect, useCallback } from 'react';
import { useContextParams } from '@/hooks/use-context-params';

interface AIGeneration {
    id: string;
    organization_id: string;
    user_id: string;
    product_id?: string;
    feature_type: 'caption' | 'hashtag' | 'content_idea' | 'copy_improvement' | 'other';
    input_data?: Record<string, unknown>;
    generated_content: string;
    model_used: string;
    tokens_used: number;
    estimated_cost: number;
    generation_time_ms: number;
    quality_rating?: number;
    was_used: boolean;
    used_in_post_id?: string;
    created_at: string;
}

interface UsageSummary {
    total_generations: number;
    total_cost: number;
    total_tokens: number;
    avg_quality: number;
    usage_rate: number;
    by_feature: Record<string, { count: number; cost: number }>;
}

interface AIUsageDashboardProps {
    className?: string;
}

export function AIUsageDashboard({ className = '' }: AIUsageDashboardProps) {
    const { productId } = useContextParams();
    const [summary, setSummary] = useState<UsageSummary | null>(null);
    const [generations, setGenerations] = useState<AIGeneration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const perPage = 20;

    // Fetch data
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Fetch summary
            const summaryParams = new URLSearchParams();
            if (productId) summaryParams.append('product_id', productId);

            const summaryResponse = await fetch(`http://localhost:3008/api/v1/ai/usage/summary?${summaryParams}`);
            if (summaryResponse.ok) {
                const summaryData = await summaryResponse.json();
                setSummary(summaryData.data);
            }

            // Fetch generations
            const generationsParams = new URLSearchParams();
            if (productId) generationsParams.append('product_id', productId);
            if (selectedFeature) generationsParams.append('feature_type', selectedFeature);
            generationsParams.append('page', page.toString());
            generationsParams.append('perPage', perPage.toString());

            const generationsResponse = await fetch(`http://localhost:3008/api/v1/ai/usage/details?${generationsParams}`);
            if (!generationsResponse.ok) throw new Error('Failed to load AI generations');

            const generationsData = await generationsResponse.json();
            setGenerations(generationsData.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load data');
        } finally {
            setIsLoading(false);
        }
    }, [productId, selectedFeature, page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Get feature icon
    const getFeatureIcon = (type: AIGeneration['feature_type']) => {
        switch (type) {
            case 'caption':
                return 'fa-comment-dots';
            case 'hashtag':
                return 'fa-hashtag';
            case 'content_idea':
                return 'fa-lightbulb';
            case 'copy_improvement':
                return 'fa-wand-magic-sparkles';
            default:
                return 'fa-robot';
        }
    };

    if (isLoading && !summary) {
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
                <button className="btn btn-sm" onClick={fetchData}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="card bg-gradient-primary text-primary-content shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-primary-content/70 text-sm">Total Generations</p>
                                    <p className="text-3xl font-bold">{summary.total_generations}</p>
                                </div>
                                <i className="fa-solid fa-duotone fa-robot text-4xl opacity-50"></i>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-success to-success/70 text-success-content shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-success-content/70 text-sm">Total Cost</p>
                                    <p className="text-3xl font-bold">${summary.total_cost.toFixed(2)}</p>
                                </div>
                                <i className="fa-solid fa-duotone fa-dollar-sign text-4xl opacity-50"></i>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-warning to-warning/70 text-warning-content shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-warning-content/70 text-sm">Usage Rate</p>
                                    <p className="text-3xl font-bold">{(summary.usage_rate * 100).toFixed(0)}%</p>
                                </div>
                                <i className="fa-solid fa-duotone fa-chart-line text-4xl opacity-50"></i>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-info to-info/70 text-info-content shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-info-content/70 text-sm">Avg Quality</p>
                                    <p className="text-3xl font-bold">{summary.avg_quality.toFixed(1)}/5</p>
                                </div>
                                <i className="fa-solid fa-duotone fa-star text-4xl opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Feature Breakdown */}
            {summary && summary.by_feature && (
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title">
                            <i className="fa-solid fa-duotone fa-chart-pie"></i>
                            Usage by Feature
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            {Object.entries(summary.by_feature).map(([feature, data]) => (
                                <div
                                    key={feature}
                                    className={`card bg-base-100 shadow cursor-pointer hover:shadow-xl transition-shadow ${selectedFeature === feature ? 'ring-2 ring-primary' : ''
                                        }`}
                                    onClick={() => setSelectedFeature(selectedFeature === feature ? null : feature)}
                                >
                                    <div className="card-body">
                                        <div className="flex items-center gap-3 mb-2">
                                            <i className={`fa-solid fa-duotone ${getFeatureIcon(feature as AIGeneration['feature_type'])} text-2xl text-primary`}></i>
                                            <h3 className="font-semibold capitalize">{feature.replace('_', ' ')}</h3>
                                        </div>
                                        <div className="text-sm text-base-content/70">
                                            <p>
                                                <i className="fa-solid fa-duotone fa-hashtag"></i> {data.count} generations
                                            </p>
                                            <p>
                                                <i className="fa-solid fa-duotone fa-dollar-sign"></i> ${data.cost.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Generation History */}
            <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="card-title">
                            <i className="fa-solid fa-duotone fa-history"></i>
                            Generation History
                            {selectedFeature && (
                                <span className="badge badge-primary capitalize">{selectedFeature.replace('_', ' ')}</span>
                            )}
                        </h2>
                        {selectedFeature && (
                            <button className="btn btn-sm btn-ghost" onClick={() => setSelectedFeature(null)}>
                                <i className="fa-solid fa-duotone fa-times"></i>
                                Clear Filter
                            </button>
                        )}
                    </div>

                    {generations.length === 0 ? (
                        <div className="text-center py-12">
                            <i className="fa-solid fa-duotone fa-robot text-6xl text-base-content/30 mb-4"></i>
                            <p className="text-base-content/70">No AI generations yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {generations.map((gen) => (
                                <div key={gen.id} className="flex items-start gap-4 p-4 bg-base-100 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <i className={`fa-solid fa-duotone ${getFeatureIcon(gen.feature_type)} text-2xl text-primary`}></i>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="badge badge-sm capitalize">{gen.feature_type.replace('_', ' ')}</span>
                                            {gen.was_used && (
                                                <span className="badge badge-sm badge-success">
                                                    <i className="fa-solid fa-duotone fa-check"></i> Used
                                                </span>
                                            )}
                                            {gen.quality_rating && (
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i
                                                            key={i}
                                                            className={`fa-solid fa-duotone fa-star text-xs ${i < gen.quality_rating! ? 'text-warning' : 'text-base-content/20'
                                                                }`}
                                                        ></i>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-sm line-clamp-2 mb-2">{gen.generated_content}</p>

                                        <div className="flex flex-wrap gap-4 text-xs text-base-content/60">
                                            <span>
                                                <i className="fa-solid fa-duotone fa-microchip"></i> {gen.model_used}
                                            </span>
                                            <span>
                                                <i className="fa-solid fa-duotone fa-gauge"></i> {gen.tokens_used} tokens
                                            </span>
                                            <span>
                                                <i className="fa-solid fa-duotone fa-dollar-sign"></i> ${gen.estimated_cost.toFixed(4)}
                                            </span>
                                            <span>
                                                <i className="fa-solid fa-duotone fa-clock"></i> {gen.generation_time_ms}ms
                                            </span>
                                            <span>
                                                <i className="fa-solid fa-duotone fa-calendar"></i> {new Date(gen.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {generations.length > 0 && (
                        <div className="flex justify-center gap-2 mt-6">
                            <button
                                className="btn btn-sm"
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                            >
                                <i className="fa-solid fa-duotone fa-chevron-left"></i>
                                Previous
                            </button>
                            <span className="flex items-center px-4">Page {page}</span>
                            <button
                                className="btn btn-sm"
                                onClick={() => setPage(page + 1)}
                                disabled={generations.length < perPage}
                            >
                                Next
                                <i className="fa-solid fa-duotone fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
