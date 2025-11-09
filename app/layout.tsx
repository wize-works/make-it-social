import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { ClerkProvider } from '@clerk/nextjs';
import { ToastProvider } from "@/contexts/toast-context";
import { ToastContainer } from "@/components/toast";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthProvider } from "@/components/auth-provider";
import { OrganizationProvider } from "@/contexts/organization-context";
import { ActiveContextWrapper } from "@/components/active-context-wrapper";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Make It Social",
    description: "AI-powered social media management platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
            afterSignUpUrl="/onboarding"
            afterSignInUrl="/dashboard"
        >
            <html lang="en" suppressHydrationWarning>
                <head>
                    <Script src="https://kit.fontawesome.com/703619c987.js" crossOrigin="anonymous"></Script>
                    {/* Prevent flash of unstyled content - set theme before page renders */}
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                            (function() {
                                const theme = localStorage.getItem('theme') || 
                                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                                document.documentElement.setAttribute('data-theme', theme);
                            })();
                        `,
                        }}
                    />
                </head>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <AuthProvider>
                        <OrganizationProvider>
                            <ActiveContextWrapper>
                                <SiteHeader />
                                <ToastProvider>
                                    {children}
                                    <ToastContainer />
                                </ToastProvider>
                                <SiteFooter />
                            </ActiveContextWrapper>
                        </OrganizationProvider>
                    </AuthProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
