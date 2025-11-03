'use client';

import { useState } from 'react';

interface ConnectedApp {
    id: string;
    name: string;
    icon: string;
    permissions: string[];
    connectedAt: string;
}

const mockConnectedApps: ConnectedApp[] = [
    {
        id: '1',
        name: 'Canva',
        icon: 'fa-palette',
        permissions: ['Read posts', 'Upload media'],
        connectedAt: 'Oct 15, 2025',
    },
    {
        id: '2',
        name: 'Google Analytics',
        icon: 'fa-chart-line',
        permissions: ['Read analytics'],
        connectedAt: 'Sep 22, 2025',
    },
];

export function DataPrivacySettings() {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">Data & Privacy</h2>
                <p className="text-base-content/60 mt-1">
                    Manage your data, privacy settings, and GDPR compliance
                </p>
            </div>

            <div className="divider"></div>

            {/* Data Export */}
            <div>
                <h3 className="font-semibold mb-4">Export Your Data</h3>
                <div className="bg-base-200 rounded-lg p-6">
                    <p className="text-sm text-base-content/60 mb-4">
                        Download a copy of all your data including posts, analytics, and account information.
                        You&apos;ll receive an email with a download link when your export is ready (typically within 24 hours).
                    </p>
                    <div className="flex gap-2">
                        <button className="btn btn-primary">
                            <i className="fa-solid fa-duotone fa-download"></i>
                            Request Data Export
                        </button>
                        <button className="btn btn-outline">
                            <i className="fa-solid fa-duotone fa-file-export"></i>
                            Export Format: JSON
                        </button>
                    </div>
                </div>
            </div>

            <div className="divider"></div>

            {/* Privacy Policy */}
            <div>
                <h3 className="font-semibold mb-4">Privacy & Terms</h3>
                <div className="space-y-3">
                    <div className="bg-base-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <div className="font-medium">Privacy Policy</div>
                            <div className="text-sm text-base-content/60">
                                Last accepted on October 1, 2025
                            </div>
                        </div>
                        <a href="/privacy" className="btn btn-sm btn-outline">
                            View
                        </a>
                    </div>

                    <div className="bg-base-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <div className="font-medium">Terms of Service</div>
                            <div className="text-sm text-base-content/60">
                                Last accepted on October 1, 2025
                            </div>
                        </div>
                        <a href="/terms" className="btn btn-sm btn-outline">
                            View
                        </a>
                    </div>
                </div>
            </div>

            <div className="divider"></div>

            {/* Cookie Preferences */}
            <div>
                <h3 className="font-semibold mb-4">Cookie Preferences</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <div>
                            <div className="font-medium">Essential Cookies</div>
                            <div className="text-sm text-base-content/60">
                                Required for the platform to function properly
                            </div>
                        </div>
                        <input type="checkbox" className="toggle" checked disabled />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <div>
                            <div className="font-medium">Analytics Cookies</div>
                            <div className="text-sm text-base-content/60">
                                Help us understand how you use the platform
                            </div>
                        </div>
                        <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <div>
                            <div className="font-medium">Marketing Cookies</div>
                            <div className="text-sm text-base-content/60">
                                Used to show you relevant advertisements
                            </div>
                        </div>
                        <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                </div>
            </div>

            <div className="divider"></div>

            {/* Connected Apps */}
            <div>
                <h3 className="font-semibold mb-4">Connected Apps & Permissions</h3>
                <div className="space-y-3">
                    {mockConnectedApps.map((app) => (
                        <div key={app.id} className="bg-base-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                        <i className={`fa-solid fa-duotone ${app.icon} text-primary`}></i>
                                    </div>
                                    <div>
                                        <div className="font-medium">{app.name}</div>
                                        <div className="text-sm text-base-content/60">
                                            Connected on {app.connectedAt}
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-sm btn-error btn-outline">
                                    Revoke
                                </button>
                            </div>
                            <div className="text-sm text-base-content/60 ml-13">
                                <div className="font-medium mb-1">Permissions:</div>
                                <ul className="list-disc list-inside">
                                    {app.permissions.map((permission, index) => (
                                        <li key={index}>{permission}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="divider"></div>

            {/* Data Retention */}
            <div>
                <h3 className="font-semibold mb-4">Data Retention</h3>
                <div className="bg-base-200 rounded-lg p-6">
                    <p className="text-sm text-base-content/60 mb-4">
                        We automatically delete draft posts after 90 days of inactivity and analytics data
                        after 2 years. Published posts are retained indefinitely unless you delete them manually.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">90 days</div>
                            <div className="text-sm text-base-content/60">Draft posts</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">2 years</div>
                            <div className="text-sm text-base-content/60">Analytics data</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">Indefinite</div>
                            <div className="text-sm text-base-content/60">Published posts</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="divider"></div>

            {/* Audit Log */}
            <div>
                <h3 className="font-semibold mb-4">Audit Log</h3>
                <p className="text-sm text-base-content/60 mb-4">
                    View recent actions taken on your account
                </p>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Action</th>
                                <th>Details</th>
                                <th>IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Oct 30, 2025 2:45 PM</td>
                                <td>
                                    <span className="badge badge-neutral">Login</span>
                                </td>
                                <td>Successful login from Chrome</td>
                                <td>192.168.1.1</td>
                            </tr>
                            <tr>
                                <td>Oct 30, 2025 10:22 AM</td>
                                <td>
                                    <span className="badge badge-primary">Post Created</span>
                                </td>
                                <td>Created post &quot;New Product Launch&quot;</td>
                                <td>192.168.1.1</td>
                            </tr>
                            <tr>
                                <td>Oct 29, 2025 4:15 PM</td>
                                <td>
                                    <span className="badge badge-warning">Settings Changed</span>
                                </td>
                                <td>Updated notification preferences</td>
                                <td>192.168.1.1</td>
                            </tr>
                            <tr>
                                <td>Oct 29, 2025 11:30 AM</td>
                                <td>
                                    <span className="badge badge-success">Account Connected</span>
                                </td>
                                <td>Connected Instagram account</td>
                                <td>192.168.1.1</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4">
                    <button className="btn btn-outline">
                        Load More
                    </button>
                </div>
            </div>

            <div className="divider"></div>

            {/* Delete Account */}
            <div className="bg-error/10 rounded-lg p-6 border border-error/20">
                <h3 className="font-semibold text-error mb-2">Delete Account</h3>
                <p className="text-sm text-base-content/60 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                    All your posts, analytics, and settings will be permanently removed.
                </p>
                <button
                    className="btn btn-error btn-outline"
                    onClick={() => setShowDeleteConfirm(true)}
                >
                    <i className="fa-solid fa-duotone fa-trash"></i>
                    Delete Account
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-error mb-4">
                            <i className="fa-solid fa-duotone fa-triangle-exclamation mr-2"></i>
                            Confirm Account Deletion
                        </h3>
                        <p className="mb-4">
                            Are you absolutely sure you want to delete your account? This will:
                        </p>
                        <ul className="list-disc list-inside space-y-1 mb-4 text-sm">
                            <li>Permanently delete all your posts and drafts</li>
                            <li>Remove all analytics and performance data</li>
                            <li>Disconnect all social media accounts</li>
                            <li>Cancel your subscription immediately</li>
                            <li>Remove you from all team workspaces</li>
                        </ul>
                        <fieldset className="fieldset mb-4">
                            <legend className="fieldset-legend">Type &quot;DELETE&quot; to confirm:</legend>
                            <input
                                type="text"
                                className="input"
                                placeholder="DELETE"
                            />
                        </fieldset>
                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button className="btn btn-error">
                                Delete My Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
