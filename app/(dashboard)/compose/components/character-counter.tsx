'use client';

interface CharacterCounterProps {
    content: string;
    selectedPlatforms: string[];
}

const platformLimits: Record<string, number> = {
    twitter: 280,
    instagram: 2200,
    facebook: 63206,
    linkedin: 3000,
    tiktok: 2200,
    youtube: 5000,
    pinterest: 500,
};

export function CharacterCounter({ content, selectedPlatforms }: CharacterCounterProps) {
    const characterCount = content.length;

    // Get the most restrictive limit from selected platforms
    const relevantLimits = selectedPlatforms
        .filter(platform => platformLimits[platform])
        .map(platform => ({
            platform,
            limit: platformLimits[platform],
            percentage: (characterCount / platformLimits[platform]) * 100,
        }))
        .sort((a, b) => a.limit - b.limit);

    const mostRestrictive = relevantLimits[0];

    if (!mostRestrictive) {
        return (
            <div className="flex items-center justify-between text-sm text-base-content/60">
                <span>
                    <i className="fa-solid fa-duotone fa-align-left mr-1"></i>
                    {characterCount} characters
                </span>
                <span className="text-xs">Select a platform to see limits</span>
            </div>
        );
    }

    const isNearLimit = mostRestrictive.percentage >= 80;
    const isOverLimit = mostRestrictive.percentage >= 100;

    return (
        <div className="space-y-2">
            {/* Character count */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-base-content/70">
                    <i className="fa-solid fa-duotone fa-align-left mr-1"></i>
                    {characterCount} / {mostRestrictive.limit} characters
                </span>
                <span
                    className={`font-medium ${isOverLimit
                        ? 'text-error'
                        : isNearLimit
                            ? 'text-warning'
                            : 'text-success'
                        }`}
                >
                    {mostRestrictive.platform.charAt(0).toUpperCase() + mostRestrictive.platform.slice(1)} limit
                </span>
            </div>

            {/* Progress bar */}
            <div className="relative w-full h-2 bg-base-300 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${isOverLimit
                        ? 'bg-error'
                        : isNearLimit
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                    style={{ width: `${Math.min(mostRestrictive.percentage, 100)}%` }}
                />
            </div>

            {/* Warning messages */}
            {isOverLimit && (
                <div className="alert alert-error">
                    <i className="fa-solid fa-duotone fa-triangle-exclamation"></i>
                    <span className="text-xs">
                        Content exceeds {mostRestrictive.platform} character limit by {characterCount - mostRestrictive.limit} characters
                    </span>
                </div>
            )}

            {/* Show other platform limits */}
            {relevantLimits.length > 1 && !isOverLimit && (
                <details className="text-xs">
                    <summary className="cursor-pointer text-base-content/60 hover:text-base-content">
                        Other platform limits
                    </summary>
                    <div className="mt-2 space-y-1 pl-4">
                        {relevantLimits.slice(1).map(({ platform, limit, percentage }) => (
                            <div key={platform} className="flex justify-between">
                                <span className="capitalize">{platform}:</span>
                                <span className={percentage >= 100 ? 'text-error' : 'text-base-content/60'}>
                                    {characterCount} / {limit}
                                </span>
                            </div>
                        ))}
                    </div>
                </details>
            )}
        </div>
    );
}
