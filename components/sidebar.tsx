'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
    label: string;
    href: string;
    icon: string;
    badge?: number;
}

interface NavSection {
    title?: string;
    items: NavItem[];
}

const navigationSections: NavSection[] = [
    {
        items: [
            { label: 'Dashboard', href: '/dashboard', icon: 'fa-grid-2' },
            { label: 'Inbox', href: '/inbox', icon: 'fa-inbox', badge: 3 },
            { label: 'Calendar', href: '/calendar', icon: 'fa-calendar-days' },
            { label: 'Workflow', href: '/workflow', icon: 'fa-list-check', badge: 3 },
        ],
    },
    {
        title: 'Insights',
        items: [
            { label: 'Analytics', href: '/analytics', icon: 'fa-chart-line' },
        ],
    },
    {
        title: 'Settings',
        items: [
            { label: 'Accounts', href: '/accounts', icon: 'fa-link' },
            { label: 'Brands', href: '/brands', icon: 'fa-building' },
            { label: 'Settings', href: '/settings', icon: 'fa-gear' },
        ],
    },
];

export function Sidebar() {
    const pathname = usePathname();
    // Load initial state from localStorage
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedState = localStorage.getItem('sidebar-collapsed');
            return savedState ? JSON.parse(savedState) : false;
        }
        return false;
    });

    // Save collapsed state to localStorage
    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex flex-col fixed h-[calc(100vh-64px)] bg-base-100 shadow-lg z-100 border-r border-base-300 transition-all duration-300 ${isCollapsed ? 'w-18' : 'w-64'
                    }`}
            >
                {/* Create Post Button */}
                <div className="p-4">
                    <Link
                        href="/compose"
                        className={`btn btn-primary tooltip tooltip-right ${isCollapsed ? 'btn-square' : 'btn-block'
                            }`}
                        title="Create Post"
                    >
                        <i className="fa-solid fa-duotone fa-pen-to-square"></i>
                        {!isCollapsed && <span className="ml-2">Create Post</span>}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    {navigationSections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="mb-4">
                            {section.title && !isCollapsed && (
                                <div className="px-4 py-2 text-xs font-semibold opacity-60 uppercase">
                                    {section.title}
                                </div>
                            )}
                            {section.title && isCollapsed && (
                                <div className="divider my-2"></div>
                            )}
                            <ul className="space-y-4">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className={`btn tooltip tooltip-right ${isActive ? 'active' : ''
                                                    } ${isCollapsed ? ' btn-square' : ' btn-block justify-between'}`}
                                                data-tip={isCollapsed ? item.label : undefined}
                                            >
                                                <span className='space-x-2'>
                                                    <i className={`fa-solid fa-duotone ${item.icon}`}></i>
                                                    {!isCollapsed && <span>{item.label}</span>}
                                                </span>
                                                {!isCollapsed && item.badge && (
                                                    <span className="badge badge-sm badge-primary">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Collapse Toggle */}
                <div className="p-4 border-t border-base-300">
                    <button
                        onClick={toggleCollapse}
                        className="btn btn-block btn-ghost justify-start"
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <i
                            className={`fa-solid fa-duotone ${isCollapsed ? 'fa-angles-right' : 'fa-angles-left'
                                }`}
                        ></i>
                        {!isCollapsed && <span className="ml-2">Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Drawer */}
            <div className="lg:hidden">
                <input type="checkbox" id="sidebar-drawer" className="drawer-toggle" />
                <div className="drawer-side z-50">
                    <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
                    <aside className="w-64 bg-base-200 min-h-full flex flex-col">
                        {/* Logo */}
                        <div className="p-4 border-b border-base-300">
                            <div className="flex items-center gap-3">
                                <i className="fa-solid fa-duotone fa-rocket text-2xl text-primary"></i>
                                <h2 className="text-xl font-bold">Make It Social</h2>
                            </div>
                        </div>

                        {/* Create Post Button */}
                        <div className="p-4">
                            <Link href="/compose" className="btn btn-primary w-full">
                                <i className="fa-solid fa-duotone fa-pen-to-square"></i>
                                <span className="ml-2">Create Post</span>
                            </Link>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto px-2">
                            {navigationSections.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="mb-4">
                                    {section.title && (
                                        <div className="px-4 py-2 text-xs font-semibold opacity-60 uppercase">
                                            {section.title}
                                        </div>
                                    )}
                                    <ul className="menu menu-sm">
                                        {section.items.map((item) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <li key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        className={isActive ? 'active' : ''}
                                                    >
                                                        <i className={`fa-solid fa-duotone ${item.icon}`}></i>
                                                        <span>{item.label}</span>
                                                        {item.badge && (
                                                            <span className="badge badge-sm badge-primary">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </aside>
                </div>
            </div>
        </>
    );
}
