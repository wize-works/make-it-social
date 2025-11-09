'use client';

/**
 * Active Context Wrapper
 * Wraps children with ActiveContextProvider and provides userId from Clerk
 */

import { useUser } from '@clerk/nextjs';
import { ActiveContextProvider } from '@/contexts/active-context-provider';

export function ActiveContextWrapper({ children }: { children: React.ReactNode }) {
    const { user } = useUser();

    // Always provide the context, but pass undefined userId if not loaded
    // This prevents "useActiveContext must be used within ActiveContextProvider" errors
    return (
        <ActiveContextProvider userId={user?.id}>
            {children}
        </ActiveContextProvider>
    );
}
