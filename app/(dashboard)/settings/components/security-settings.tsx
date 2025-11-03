'use client';

import { useState } from 'react';

interface Session {
    id: string;
    device: string;
    location: string;
    ip: string;
    lastActive: string;
    current: boolean;
}

const mockSessions: Session[] = [
    {
        id: '1',
        device: 'Chrome on Windows',
        location: 'Los Angeles, CA',
        ip: '192.168.1.1',
        lastActive: '2 minutes ago',
        current: true,
    },
    {
        id: '2',
        device: 'Safari on iPhone',
        location: 'Los Angeles, CA',
        ip: '192.168.1.2',
        lastActive: '3 hours ago',
        current: false,
    },
];

export function SecuritySettings() {
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [show2FASetup, setShow2FASetup] = useState(false);
    const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

    const recoveryCodes = [
        'AB12-CD34-EF56',
        'GH78-IJ90-KL12',
        'MN34-OP56-QR78',
        'ST90-UV12-WX34',
        'YZ56-AB78-CD90',
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">Security Settings</h2>
                <p className="text-base-content/60 mt-1">
                    Manage your account security and authentication methods
                </p>
            </div>

            <div className="divider"></div>

            {/* Change Password */}
            <div>
                <h3 className="font-semibold mb-4">Change Password</h3>
                <div className="space-y-4 max-w-md">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Current Password</legend>
                        <input
                            type="password"
                            className="input"
                            placeholder="Enter current password"
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">New Password</legend>
                        <input
                            type="password"
                            className="input"
                            placeholder="Enter new password"
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Confirm New Password</legend>
                        <input
                            type="password"
                            className="input"
                            placeholder="Confirm new password"
                        />
                    </fieldset>
                    <button className="btn btn-primary">
                        Update Password
                    </button>
                </div>
            </div>

            <div className="divider"></div>

            {/* Two-Factor Authentication */}
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-semibold">Two-Factor Authentication</h3>
                        <p className="text-sm text-base-content/60 mt-1">
                            Add an extra layer of security to your account
                        </p>
                    </div>
                    <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={is2FAEnabled}
                        onChange={(e) => {
                            setIs2FAEnabled(e.target.checked);
                            if (e.target.checked) {
                                setShow2FASetup(true);
                            }
                        }}
                    />
                </div>

                {/* 2FA Setup Modal */}
                {show2FASetup && (
                    <div className="bg-base-200 rounded-lg p-6 space-y-4">
                        <div className="text-center">
                            <h4 className="font-semibold mb-2">Set Up Two-Factor Authentication</h4>
                            <p className="text-sm text-base-content/60 mb-4">
                                Scan this QR code with your authenticator app
                            </p>
                            <div className="bg-white p-4 rounded-lg inline-block mb-4">
                                {/* Placeholder QR code */}
                                <div className="w-48 h-48 bg-base-300 flex items-center justify-center">
                                    <i className="fa-solid fa-duotone fa-qrcode text-6xl"></i>
                                </div>
                            </div>
                            <p className="text-xs text-base-content/60">
                                Manual entry: JBSWY3DPEHPK3PXP
                            </p>
                        </div>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Enter verification code</legend>
                            <input
                                type="text"
                                className="input text-center text-2xl tracking-widest"
                                placeholder="000000"
                                maxLength={6}
                            />
                        </fieldset>
                        <div className="flex gap-2">
                            <button
                                className="btn btn-outline flex-1"
                                onClick={() => setShow2FASetup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary flex-1"
                                onClick={() => {
                                    setShow2FASetup(false);
                                    setShowRecoveryCodes(true);
                                }}
                            >
                                Verify & Enable
                            </button>
                        </div>
                    </div>
                )}

                {/* Recovery Codes */}
                {is2FAEnabled && !show2FASetup && (
                    <div className="bg-base-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h4 className="font-semibold">Recovery Codes</h4>
                                <p className="text-sm text-base-content/60 mt-1">
                                    Save these codes in a safe place
                                </p>
                            </div>
                            <button
                                className="btn btn-sm btn-outline"
                                onClick={() => setShowRecoveryCodes(!showRecoveryCodes)}
                            >
                                {showRecoveryCodes ? 'Hide' : 'Show'} Codes
                            </button>
                        </div>
                        {showRecoveryCodes && (
                            <div className="space-y-2">
                                <div className="bg-base-300 rounded-lg p-4 font-mono text-sm">
                                    {recoveryCodes.map((code, index) => (
                                        <div key={index}>{code}</div>
                                    ))}
                                </div>
                                <button className="btn btn-sm btn-outline w-full">
                                    <i className="fa-solid fa-duotone fa-download"></i>
                                    Download Codes
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="divider"></div>

            {/* Active Sessions */}
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-semibold">Active Sessions</h3>
                        <p className="text-sm text-base-content/60 mt-1">
                            Manage devices where you&apos;re currently signed in
                        </p>
                    </div>
                    <button className="btn btn-sm btn-error btn-outline">
                        Sign Out All Devices
                    </button>
                </div>

                <div className="space-y-3">
                    {mockSessions.map((session) => (
                        <div
                            key={session.id}
                            className="bg-base-200 rounded-lg p-4 flex items-start justify-between"
                        >
                            <div className="flex gap-4">
                                <div className="text-3xl">
                                    <i className={`fa-solid fa-duotone fa-${session.device.includes('iPhone') ? 'mobile' : 'desktop'
                                        }`}></i>
                                </div>
                                <div>
                                    <div className="font-medium flex items-center gap-2">
                                        {session.device}
                                        {session.current && (
                                            <span className="badge badge-primary badge-sm">Current</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-base-content/60">
                                        {session.location} • {session.ip}
                                    </div>
                                    <div className="text-sm text-base-content/60">
                                        Last active: {session.lastActive}
                                    </div>
                                </div>
                            </div>
                            {!session.current && (
                                <button className="btn btn-ghost btn-sm text-error">
                                    Sign Out
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="divider"></div>

            {/* Login Activity */}
            <div>
                <h3 className="font-semibold mb-4">Recent Login Activity</h3>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Device</th>
                                <th>Location</th>
                                <th>IP Address</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Oct 30, 2025 2:45 PM</td>
                                <td>Chrome on Windows</td>
                                <td>Los Angeles, CA</td>
                                <td>192.168.1.1</td>
                                <td>
                                    <span className="badge badge-success">Success</span>
                                </td>
                            </tr>
                            <tr>
                                <td>Oct 30, 2025 9:22 AM</td>
                                <td>Safari on iPhone</td>
                                <td>Los Angeles, CA</td>
                                <td>192.168.1.2</td>
                                <td>
                                    <span className="badge badge-success">Success</span>
                                </td>
                            </tr>
                            <tr>
                                <td>Oct 29, 2025 6:15 PM</td>
                                <td>Firefox on Mac</td>
                                <td>San Francisco, CA</td>
                                <td>10.0.0.1</td>
                                <td>
                                    <span className="badge badge-error">Failed</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
