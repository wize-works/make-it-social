'use client';

import { useState } from 'react';

interface NotificationSettings {
    email: {
        postPublished: boolean;
        approvalRequests: boolean;
        mentions: boolean;
        weeklyReport: boolean;
    };
    inApp: {
        postPublished: boolean;
        approvalRequests: boolean;
        mentions: boolean;
        comments: boolean;
    };
}

export function PreferencesSettings() {
    const [timezone, setTimezone] = useState('America/Los_Angeles');
    const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
    const [timeFormat, setTimeFormat] = useState('12h');
    const [language, setLanguage] = useState('en');
    const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');

    const [notifications, setNotifications] = useState<NotificationSettings>({
        email: {
            postPublished: true,
            approvalRequests: true,
            mentions: true,
            weeklyReport: false,
        },
        inApp: {
            postPublished: true,
            approvalRequests: true,
            mentions: true,
            comments: true,
        },
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">Preferences</h2>
                <p className="text-base-content/60 mt-1">
                    Customize your experience and notification settings
                </p>
            </div>

            <div className="divider"></div>

            {/* Regional Settings */}
            <div>
                <h3 className="font-semibold mb-4">Regional Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend">Timezone</legend>
                        <select
                            className="select select-bordered w-full"
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                        >
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="Europe/London">London (GMT)</option>
                            <option value="Europe/Paris">Paris (CET)</option>
                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                        </select>
                        <p className="label">
                            Current time: {new Date().toLocaleTimeString()}
                        </p>
                    </fieldset>

                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend">Language</legend>
                        <select
                            className="select select-bordered w-full"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="ja">日本語</option>
                        </select>
                    </fieldset>

                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend">Date Format</legend>
                        <select
                            className="select select-bordered w-full"
                            value={dateFormat}
                            onChange={(e) => setDateFormat(e.target.value)}
                        >
                            <option value="MM/DD/YYYY">MM/DD/YYYY (10/30/2025)</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY (30/10/2025)</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD (2025-10-30)</option>
                        </select>
                    </fieldset>

                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend">Time Format</legend>
                        <select
                            className="select select-bordered w-full"
                            value={timeFormat}
                            onChange={(e) => setTimeFormat(e.target.value)}
                        >
                            <option value="12h">12-hour (2:30 PM)</option>
                            <option value="24h">24-hour (14:30)</option>
                        </select>
                    </fieldset>
                </div>
            </div>

            <div className="divider"></div>

            {/* Theme Settings */}
            <div>
                <h3 className="font-semibold mb-4">Appearance</h3>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Theme</legend>
                    <div className="grid grid-cols-3 gap-4 max-w-2xl">
                        <button
                            className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setTheme('light')}
                        >
                            <i className="fa-solid fa-duotone fa-sun"></i>
                            Light
                        </button>
                        <button
                            className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setTheme('dark')}
                        >
                            <i className="fa-solid fa-duotone fa-moon"></i>
                            Dark
                        </button>
                        <button
                            className={`btn ${theme === 'auto' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setTheme('auto')}
                        >
                            <i className="fa-solid fa-duotone fa-circle-half-stroke"></i>
                            Auto
                        </button>
                    </div>
                </fieldset>
            </div>

            <div className="divider"></div>

            {/* Email Notifications */}
            <div>
                <h3 className="font-semibold mb-4">Email Notifications</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <div>
                            <div className="font-medium">Post Published</div>
                            <div className="text-sm text-base-content/60">
                                When your scheduled posts are published
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={notifications.email.postPublished}
                            onChange={(e) =>
                                setNotifications({
                                    ...notifications,
                                    email: { ...notifications.email, postPublished: e.target.checked },
                                })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <div>
                            <div className="font-medium">Approval Requests</div>
                            <div className="text-sm text-base-content/60">
                                When a post needs your approval
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={notifications.email.approvalRequests}
                            onChange={(e) =>
                                setNotifications({
                                    ...notifications,
                                    email: { ...notifications.email, approvalRequests: e.target.checked },
                                })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <div>
                            <div className="font-medium">Mentions</div>
                            <div className="text-sm text-base-content/60">
                                When someone mentions you in a comment
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={notifications.email.mentions}
                            onChange={(e) =>
                                setNotifications({
                                    ...notifications,
                                    email: { ...notifications.email, mentions: e.target.checked },
                                })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <div>
                            <div className="font-medium">Weekly Report</div>
                            <div className="text-sm text-base-content/60">
                                Performance summary every Monday
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={notifications.email.weeklyReport}
                            onChange={(e) =>
                                setNotifications({
                                    ...notifications,
                                    email: { ...notifications.email, weeklyReport: e.target.checked },
                                })
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="divider"></div>

            {/* In-App Notifications */}
            <div>
                <h3 className="font-semibold mb-4">In-App Notifications</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <div>
                            <div className="font-medium">Post Published</div>
                            <div className="text-sm text-base-content/60">
                                Show notification when posts are published
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={notifications.inApp.postPublished}
                            onChange={(e) =>
                                setNotifications({
                                    ...notifications,
                                    inApp: { ...notifications.inApp, postPublished: e.target.checked },
                                })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <div>
                            <div className="font-medium">Approval Requests</div>
                            <div className="text-sm text-base-content/60">
                                Alert when approval is needed
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={notifications.inApp.approvalRequests}
                            onChange={(e) =>
                                setNotifications({
                                    ...notifications,
                                    inApp: { ...notifications.inApp, approvalRequests: e.target.checked },
                                })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <div>
                            <div className="font-medium">Mentions</div>
                            <div className="text-sm text-base-content/60">
                                When you&apos;re mentioned in comments
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={notifications.inApp.mentions}
                            onChange={(e) =>
                                setNotifications({
                                    ...notifications,
                                    inApp: { ...notifications.inApp, mentions: e.target.checked },
                                })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <div>
                            <div className="font-medium">Comments</div>
                            <div className="text-sm text-base-content/60">
                                New comments on your posts
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={notifications.inApp.comments}
                            onChange={(e) =>
                                setNotifications({
                                    ...notifications,
                                    inApp: { ...notifications.inApp, comments: e.target.checked },
                                })
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="divider"></div>

            {/* Default Post Settings */}
            <div>
                <h3 className="font-semibold mb-4">Default Post Settings</h3>
                <div className="space-y-3 max-w-2xl">
                    <div className="form-control">
                        <label className="cursor-pointer flex items-center justify-between p-3 bg-base-200 rounded-lg">
                            <div>
                                <div className="font-medium">Auto-add Hashtags</div>
                                <div className="text-sm text-base-content/60">
                                    Automatically suggest hashtags for new posts
                                </div>
                            </div>
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="cursor-pointer flex items-center justify-between p-3 bg-base-200 rounded-lg">
                            <div>
                                <div className="font-medium">Auto-optimize Images</div>
                                <div className="text-sm text-base-content/60">
                                    Compress and resize images for optimal quality
                                </div>
                            </div>
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="cursor-pointer flex items-center justify-between p-3 bg-base-200 rounded-lg">
                            <div>
                                <div className="font-medium">AI Enhancements</div>
                                <div className="text-sm text-base-content/60">
                                    Enable AI-powered caption and hashtag suggestions
                                </div>
                            </div>
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                        </label>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
                <button className="btn btn-primary">
                    <i className="fa-solid fa-duotone fa-floppy-disk"></i>
                    Save Preferences
                </button>
            </div>
        </div>
    );
}
