'use client';

import { useState } from 'react';
import { ProfileSettings } from './components/profile-settings';
import { OrganizationSettings } from './components/organization-settings';
import { TeamManagement } from './components/team-management';
import { BillingSettings } from './components/billing-settings';
import { SecuritySettings } from './components/security-settings';
import { PreferencesSettings } from './components/preferences-settings';
import { DataPrivacySettings } from './components/data-privacy-settings';

type SettingsTab =
    | 'profile'
    | 'organization'
    | 'team'
    | 'billing'
    | 'security'
    | 'preferences'
    | 'privacy';

interface Tab {
    id: SettingsTab;
    label: string;
    icon: string;
    description: string;
}

const tabs: Tab[] = [
    {
        id: 'profile',
        label: 'Profile',
        icon: 'fa-user',
        description: 'Manage your personal information',
    },
    {
        id: 'organization',
        label: 'Organization',
        icon: 'fa-building',
        description: 'Workspace and organization settings',
    },
    {
        id: 'team',
        label: 'Team',
        icon: 'fa-users',
        description: 'Manage team members and permissions',
    },
    {
        id: 'billing',
        label: 'Billing',
        icon: 'fa-credit-card',
        description: 'Subscription and payment management',
    },
    {
        id: 'security',
        label: 'Security',
        icon: 'fa-shield-halved',
        description: 'Password and two-factor authentication',
    },
    {
        id: 'preferences',
        label: 'Preferences',
        icon: 'fa-sliders',
        description: 'Timezone, notifications, and display options',
    },
    {
        id: 'privacy',
        label: 'Data & Privacy',
        icon: 'fa-user-shield',
        description: 'GDPR compliance and data management',
    },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header */}
            <div className="bg-base-100 border-b border-base-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-3">
                        <i className="fa-solid fa-duotone fa-gear text-3xl text-primary"></i>
                        <div>
                            <h1 className="text-3xl font-bold">Settings</h1>
                            <p className="text-base-content/60 mt-1">
                                Manage your account, team, and preferences
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Navigation */}
                    <aside className="lg:w-64 shrink-0">
                        <div className="bg-base-100 rounded-lg border border-base-300 p-2">
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activeTab === tab.id
                                            ? 'bg-primary text-primary-content'
                                            : 'hover:bg-base-200'
                                            }`}
                                    >
                                        <i className={`fa-solid fa-duotone ${tab.icon} text-lg`}></i>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium">{tab.label}</div>
                                            <div
                                                className={`text-xs mt-0.5 ${activeTab === tab.id
                                                    ? 'text-primary-content/80'
                                                    : 'text-base-content/60'
                                                    }`}
                                            >
                                                {tab.description}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 bg-base-100 rounded-lg border border-base-300 p-4">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <i className="fa-solid fa-duotone fa-bolt"></i>
                                Quick Actions
                            </h3>
                            <div className="space-y-2">
                                <button className="btn btn-sm btn-block btn-outline justify-start">
                                    <i className="fa-solid fa-duotone fa-download"></i>
                                    Export Data
                                </button>
                                <button className="btn btn-sm btn-block btn-outline justify-start">
                                    <i className="fa-solid fa-duotone fa-life-ring"></i>
                                    Get Help
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-base-100 rounded-lg border border-base-300 p-6">
                            {activeTab === 'profile' && <ProfileSettings />}
                            {activeTab === 'organization' && <OrganizationSettings />}
                            {activeTab === 'team' && <TeamManagement />}
                            {activeTab === 'billing' && <BillingSettings />}
                            {activeTab === 'security' && <SecuritySettings />}
                            {activeTab === 'preferences' && <PreferencesSettings />}
                            {activeTab === 'privacy' && <DataPrivacySettings />}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
