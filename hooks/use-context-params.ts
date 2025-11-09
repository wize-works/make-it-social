/**
 * useContextParams Hook
 * 
 * Returns the current context parameters (companyId, productId) 
 * to be included in API calls for context-aware filtering.
 */

import { useActiveContext } from '@/contexts/active-context-provider';

export interface ContextParams {
    companyId?: string;
    productId?: string;
}

/**
 * Get current context parameters for API calls
 * @returns Object with companyId and productId (if set)
 */
export function useContextParams(): ContextParams {
    const { activeContext } = useActiveContext();

    return {
        companyId: activeContext?.companyId,
        productId: activeContext?.productId,
    };
}

/**
 * Build URL search params with context
 * @param baseParams - Base query parameters
 * @returns URLSearchParams with context added
 */
export function useContextSearchParams(baseParams?: Record<string, string | number | boolean | undefined>): URLSearchParams {
    const contextParams = useContextParams();
    const params = new URLSearchParams();

    // Add base params
    if (baseParams) {
        Object.entries(baseParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, String(value));
            }
        });
    }

    // Add context params
    if (contextParams.companyId) {
        params.append('companyId', contextParams.companyId);
    }
    if (contextParams.productId) {
        params.append('productId', contextParams.productId);
    }

    return params;
}

/**
 * Build query string with context
 * @param baseParams - Base query parameters
 * @returns Query string (without leading ?)
 */
export function useContextQueryString(baseParams?: Record<string, string | number | boolean | undefined>): string {
    const params = useContextSearchParams(baseParams);
    const queryString = params.toString();
    return queryString ? queryString : '';
}
