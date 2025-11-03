/**
 * Authentication utilities for API requests
 * Provides JWT token from Clerk for authenticated API calls
 */

import { auth } from '@clerk/nextjs/server';
import { useAuth } from '@clerk/nextjs';

/**
 * Get authentication token for server-side API requests
 * Use this in Server Components and Route Handlers
 */
export async function getAuthToken(): Promise<string | null> {
    const { getToken } = await auth();
    return await getToken();
}

/**
 * Get authentication headers for API requests
 * Returns headers object with Authorization bearer token
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
    const token = await getAuthToken();

    if (!token) {
        return {};
    }

    return {
        'Authorization': `Bearer ${token}`,
    };
}

/**
 * Hook to get authentication token for client-side API requests
 * Use this in Client Components and custom hooks
 */
export function useAuthToken() {
    const { getToken } = useAuth();

    return {
        getToken: async () => {
            try {
                return await getToken();
            } catch (error) {
                console.error('Failed to get auth token:', error);
                return null;
            }
        }
    };
}
