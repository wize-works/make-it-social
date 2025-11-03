import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes (accessible without authentication)
const isPublicRoute = createRouteMatcher([
    '/',
    '/login(.*)',
    '/signup(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)',
]);

// Routes that don't require org check
const isAuthRoute = createRouteMatcher([
    '/login(.*)',
    '/signup(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/onboarding(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
    const authData = await auth();
    const { userId } = authData;

    // Protect all routes except public ones
    if (!isPublicRoute(request)) {
        await auth.protect();
    }

    // For authenticated users not on auth/onboarding routes, check if they have an organization
    if (userId && !isAuthRoute(request) && !isPublicRoute(request)) {
        try {
            // Get user's token to call our API
            const token = await authData.getToken();

            if (token) {
                // Check if user has any organizations
                const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/v1/organizations`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    // If user has no organizations, redirect to onboarding
                    if (!data.data || data.data.length === 0) {
                        const onboardingUrl = new URL('/onboarding', request.url);
                        return NextResponse.redirect(onboardingUrl);
                    }
                }
            }
        } catch (error) {
            console.error('Error checking user organizations:', error);
            // Don't block user on error - let them proceed
        }
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
