'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { ThemeToggle } from './theme-toggle';
import { OrganizationSwitcher } from './organization-switcher';
import { ContextSwitcher } from './context-switcher';

export function SiteHeader() {
    const { isSignedIn, user } = useUser();
    const { signOut } = useClerk();
    const pathname = usePathname();

    // Check if we're in the dashboard section
    const isDashboard = pathname?.startsWith('/dashboard') ||
        pathname?.startsWith('/calendar') ||
        pathname?.startsWith('/analytics') ||
        pathname?.startsWith('/workflow') ||
        pathname?.startsWith('/inbox') ||
        pathname?.startsWith('/compose');

    const handleSignOut = () => {
        signOut({ redirectUrl: '/' });
    };
    return (
        <div className="navbar shadow-lg sticky top-0 z-50">
            <div className="navbar-start">
                {/* Mobile Dropdown */}
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <i className="fa-solid fa-duotone fa-bars text-xl"></i>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                    >
                        <li>
                            <Link href="#features">
                                <i className="fa-solid fa-duotone fa-sparkles"></i>
                                Features
                            </Link>
                        </li>
                        <li>
                            <Link href="#pricing">
                                <i className="fa-solid fa-duotone fa-tag"></i>
                                Pricing
                            </Link>
                        </li>
                        <li>
                            <Link href="#about">
                                <i className="fa-solid fa-duotone fa-info-circle"></i>
                                About
                            </Link>
                        </li>
                        <li>
                            <Link href="#contact">
                                <i className="fa-solid fa-duotone fa-envelope"></i>
                                Contact
                            </Link>
                        </li>
                        <div className="divider"></div>
                        <li>
                            <Link href="/login">
                                <i className="fa-solid fa-duotone fa-arrow-right-to-bracket"></i>
                                Sign In
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Logo */}
                <Link href="/" className="btn btn-ghost text-xl">
                    <i className="fa-solid fa-duotone fa-rocket"></i>
                    <span className="hidden sm:inline">Make It Social</span>
                </Link>
            </div>

            {/* Desktop Navigation / Context Switcher */}
            <div className="navbar-center hidden lg:flex">
                {(isDashboard && isSignedIn) ?? (
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <Link href="#features">
                                <i className="fa-solid fa-duotone fa-sparkles"></i>
                                Features
                            </Link>
                        </li>
                        <li>
                            <Link href="#pricing">
                                <i className="fa-solid fa-duotone fa-tag"></i>
                                Pricing
                            </Link>
                        </li>
                        <li>
                            <Link href="#about">
                                <i className="fa-solid fa-duotone fa-info-circle"></i>
                                About
                            </Link>
                        </li>
                        <li>
                            <Link href="#contact">
                                <i className="fa-solid fa-duotone fa-envelope"></i>
                                Contact
                            </Link>
                        </li>
                    </ul>
                )}
            </div>

            {/* Right Side Actions */}
            <div className="navbar-end gap-2">
                <ContextSwitcher />

                <ThemeToggle />

                {!isSignedIn ? (
                    <>
                        {/* Not logged in */}
                        <Link href="/login" className="btn btn-ghost btn-sm hidden sm:flex">
                            <i className="fa-solid fa-duotone fa-arrow-right-to-bracket"></i>
                            Sign In
                        </Link>

                        <Link href="/signup" className="btn btn-primary btn-sm">
                            <i className="fa-solid fa-duotone fa-rocket"></i>
                            <span className="hidden sm:inline">Get Started</span>
                        </Link>
                    </>
                ) : (
                    <>
                        {/* Logged in - User Dropdown */}
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost gap-2 normal-case hover:bg-base-200 transition-all"
                            >
                                <div className="avatar">
                                    <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        {user?.imageUrl ? (
                                            <Image
                                                src={user.imageUrl}
                                                alt={user.fullName || 'User'}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                                                <span className="text-sm font-bold text-primary-content">
                                                    {user?.firstName?.charAt(0) || user?.emailAddresses[0].emailAddress.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="hidden md:flex flex-col items-start">
                                    <span className="text-sm font-semibold leading-tight">
                                        {user?.firstName || 'User'}
                                    </span>
                                    <span className="text-xs opacity-60 leading-tight">
                                        {user?.primaryEmailAddress?.emailAddress}
                                    </span>
                                </div>
                                <i className="fa-solid fa-duotone fa-chevron-down text-xs opacity-60"></i>
                            </div>
                            <div
                                tabIndex={0}
                                className="dropdown-content z-50 mt-4 w-72 rounded-box bg-base-100 shadow-2xl border border-base-300 overflow-hidden"
                            >

                                {/* Menu Items */}
                                <ul className="menu p-2 w-full">
                                    <li>
                                        <Link href="/dashboard" className="gap-3 py-3 w-full">
                                            <i className="fa-solid fa-duotone fa-gauge text-lg"></i>
                                            <div className="flex flex-col items-start">
                                                <span className="font-medium">Dashboard</span>
                                                <span className="text-xs opacity-60">View your overview</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/calendar" className="gap-3 py-3">
                                            <i className="fa-solid fa-duotone fa-calendar text-lg"></i>
                                            <div className="flex flex-col items-start">
                                                <span className="font-medium">Calendar</span>
                                                <span className="text-xs opacity-60">Manage posts</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/accounts" className="gap-3 py-3">
                                            <i className="fa-solid fa-duotone fa-share-nodes text-lg"></i>
                                            <div className="flex flex-col items-start">
                                                <span className="font-medium">Social Accounts</span>
                                                <span className="text-xs opacity-60">Connect platforms</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <div className="divider my-1"></div>

                                    <li>
                                        <Link href="/settings" className="gap-3 py-3">
                                            <i className="fa-solid fa-duotone fa-gear text-lg"></i>
                                            <span className="font-medium">Settings</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/settings/billing" className="gap-3 py-3">
                                            <i className="fa-solid fa-duotone fa-credit-card text-lg"></i>
                                            <div className="flex-1 flex justify-between items-center">
                                                <span className="font-medium">Billing</span>
                                                <span className="badge badge-primary badge-sm">Pro</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <div className="divider my-1"></div>

                                    <li>
                                        <button
                                            onClick={handleSignOut}
                                            className="gap-3 py-3 text-error hover:bg-error hover:text-error-content"
                                        >
                                            <i className="fa-solid fa-duotone fa-arrow-right-from-bracket text-lg"></i>
                                            <span className="font-medium">Sign Out</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
