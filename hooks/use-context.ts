/**
 * Context-Aware API Hooks
 * 
 * Custom hooks that automatically include context parameters in API calls
 */

import { useActiveContext } from '@/contexts/active-context-provider';

/**
 * Generic context-aware fetch function
 * Use this for custom API calls that need context params
 */
export function useContextAwareFetch() {
    const { activeContext } = useActiveContext();

    const addContextParams = (params: Record<string, string | number | boolean> = {}): Record<string, string | number | boolean> => {
        const contextParams = { ...params };

        if (activeContext?.companyId) {
            contextParams.companyId = activeContext.companyId;
        }
        if (activeContext?.productId) {
            contextParams.productId = activeContext.productId;
        }

        return contextParams;
    };

    /**
     * Build URL with context params
     */
    const buildUrlWithContext = (baseUrl: string, params?: Record<string, string | number | boolean>): string => {
        const contextParams = addContextParams(params);
        const searchParams = new URLSearchParams();

        Object.entries(contextParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });

        const queryString = searchParams.toString();
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    };

    return {
        addContextParams,
        buildUrlWithContext,
        activeContext,
        companyId: activeContext?.companyId,
        productId: activeContext?.productId,
    };
}
