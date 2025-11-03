'use client';

/**
 * Auth Provider
 * Sets the authentication token for API client automatically
 */

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { apiClient } from '@/lib/api-client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { getToken } = useAuth();

    useEffect(() => {
        // Function to update API client token
        const updateToken = async () => {
            try {
                const token = await getToken();
                apiClient.setAuthToken(token);
            } catch (error) {
                console.error('Failed to set auth token:', error);
                apiClient.setAuthToken(null);
            }
        };

        // Update token initially
        updateToken();

        // Set up interval to refresh token periodically (every 30 seconds)
        const interval = setInterval(updateToken, 30000);

        return () => clearInterval(interval);
    }, [getToken]);

    return <>{children}</>;
}
