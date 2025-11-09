import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes (accessible without authentication)
const isPublicRoute = createRouteMatcher([
    '/',
    '/login(.*)',
    '/signup(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
    // Protect all routes except public ones
    if (!isPublicRoute(request)) {
        await auth.protect();
    }

    // Note: Organization check removed from middleware due to edge runtime fetch limitations
    // Organization validation is handled client-side in OrganizationContext provider
    // New users without organizations should use the onboarding page
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
