'use client';

import Link from 'next/link';

interface DashboardHeaderProps {
    userName?: string;
    userEmail?: string;
}

export function DashboardHeader({ userName = 'User', userEmail }: DashboardHeaderProps) {
    return (
        <header className="bg-base-200 shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <i className="fa-solid fa-duotone fa-rocket text-2xl text-primary"></i>
                            <h1 className="text-2xl font-bold">Make It Social</h1>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex gap-2">
                            <Link href="/dashboard" className="btn btn-ghost btn-sm">
                                <i className="fa-solid fa-duotone fa-grid-2 mr-2"></i>
                                Dashboard
                            </Link>
                            <Link href="/inbox" className="btn btn-ghost btn-sm relative">
                                <i className="fa-solid fa-duotone fa-inbox mr-2"></i>
                                Inbox
                                {/* Unread badge - can be made dynamic later */}
                                <span className="absolute -top-1 -right-1 badge badge-xs badge-primary">3</span>
                            </Link>
                            <Link href="/calendar" className="btn btn-ghost btn-sm">
                                <i className="fa-solid fa-duotone fa-calendar-days mr-2"></i>
                                Calendar
                            </Link>
                            <Link href="/workflow" className="btn btn-ghost btn-sm relative">
                                <i className="fa-solid fa-duotone fa-list-check mr-2"></i>
                                Workflow
                                {/* Pending approvals badge */}
                                <span className="absolute -top-1 -right-1 badge badge-xs badge-warning">3</span>
                            </Link>
                            <Link href="/analytics" className="btn btn-ghost btn-sm">
                                <i className="fa-solid fa-duotone fa-chart-line mr-2"></i>
                                Analytics
                            </Link>
                            <Link href="/accounts" className="btn btn-ghost btn-sm">
                                <i className="fa-solid fa-duotone fa-link mr-2"></i>
                                Accounts
                            </Link>
                            <Link href="/compose" className="btn btn-primary btn-sm">
                                <i className="fa-solid fa-duotone fa-pen-to-square mr-2"></i>
                                Create Post
                            </Link>
                        </div>
                    </div>

                    {/* Right Side: Notifications and User Menu */}
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button
                            className="btn btn-sm btn-ghost relative"
                            aria-label="Notifications"
                        >
                            <i className="fa-solid fa-duotone fa-bell text-lg"></i>
                            {/* Notification badge */}
                            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                        </button>

                        {/* User Menu Dropdown */}
                        <div className="dropdown dropdown-end">
                            <label
                                tabIndex={0}
                                className="btn btn-ghost btn-circle avatar"
                                aria-label="User menu"
                            >
                                <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                                    <i className="fa-solid fa-duotone fa-user"></i>
                                </div>
                            </label>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu p-2 shadow-lg bg-base-200 rounded-box w-52 mt-3"
                            >
                                <li className="menu-title px-4 py-2">
                                    <span className="font-semibold">{userName}</span>
                                    {userEmail && <span className="text-xs opacity-70">{userEmail}</span>}
                                </li>
                                <li>
                                    <a href="/settings/profile">
                                        <i className="fa-solid fa-duotone fa-user mr-2"></i>
                                        Profile
                                    </a>
                                </li>
                                <li>
                                    <a href="/settings">
                                        <i className="fa-solid fa-duotone fa-gear mr-2"></i>
                                        Settings
                                    </a>
                                </li>
                                <li>
                                    <a href="/settings/organization">
                                        <i className="fa-solid fa-duotone fa-building mr-2"></i>
                                        Organization
                                    </a>
                                </li>
                                <div className="divider my-1"></div>
                                <li>
                                    <a href="/auth/logout">
                                        <i className="fa-solid fa-duotone fa-arrow-right-from-bracket mr-2"></i>
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
