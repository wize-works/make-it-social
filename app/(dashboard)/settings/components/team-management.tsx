'use client';

import { useState } from 'react';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    avatar?: string;
    status: 'active' | 'pending';
    joinedAt: string;
}

export function TeamManagement() {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('editor');

    // Mock team data
    const [members] = useState<TeamMember[]>([
        {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'admin',
            status: 'active',
            joinedAt: '2025-01-15',
        },
        {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'editor',
            status: 'active',
            joinedAt: '2025-02-20',
        },
        {
            id: '3',
            name: 'Bob Johnson',
            email: 'bob@example.com',
            role: 'viewer',
            status: 'pending',
            joinedAt: '2025-10-28',
        },
    ]);

    const handleInvite = () => {
        // TODO: Send invitation
        console.log('Invite:', inviteEmail, inviteRole);
        setIsInviteModalOpen(false);
        setInviteEmail('');
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'badge-error';
            case 'editor':
                return 'badge-primary';
            case 'viewer':
                return 'badge-neutral';
            default:
                return '';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Team Management</h2>
                    <p className="text-base-content/60 mt-1">
                        Manage team members and their permissions
                    </p>
                </div>
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="btn btn-primary"
                >
                    <i className="fa-solid fa-duotone fa-user-plus"></i>
                    Invite Member
                </button>
            </div>

            <div className="divider"></div>

            {/* Role Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-base-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <i className="fa-solid fa-duotone fa-crown text-error"></i>
                        <h3 className="font-semibold">Admin</h3>
                    </div>
                    <p className="text-sm text-base-content/60">
                        Full access to all features including billing and organization settings
                    </p>
                </div>
                <div className="bg-base-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <i className="fa-solid fa-duotone fa-pen text-primary"></i>
                        <h3 className="font-semibold">Editor</h3>
                    </div>
                    <p className="text-sm text-base-content/60">
                        Create, edit, and schedule posts. View analytics and manage content
                    </p>
                </div>
                <div className="bg-base-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <i className="fa-solid fa-duotone fa-eye text-neutral"></i>
                        <h3 className="font-semibold">Viewer</h3>
                    </div>
                    <p className="text-sm text-base-content/60">
                        Read-only access to analytics and scheduled content
                    </p>
                </div>
            </div>

            <div className="divider"></div>

            {/* Team Members Table */}
            <div>
                <h3 className="font-semibold mb-4">Team Members ({members.length})</h3>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Member</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-primary-content font-bold">
                                                {member.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')}
                                            </div>
                                            <div>
                                                <div className="font-medium">{member.name}</div>
                                                <div className="text-sm text-base-content/60">
                                                    {member.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span
                                            className={`badge ${getRoleColor(member.role)} capitalize`}
                                        >
                                            {member.role}
                                        </span>
                                    </td>
                                    <td>
                                        {member.status === 'active' ? (
                                            <span className="badge badge-success">Active</span>
                                        ) : (
                                            <span className="badge badge-warning">Pending</span>
                                        )}
                                    </td>
                                    <td className="text-sm">{member.joinedAt}</td>
                                    <td>
                                        <div className="dropdown dropdown-end">
                                            <button className="btn btn-ghost btn-sm">
                                                <i className="fa-solid fa-duotone fa-ellipsis-vertical"></i>
                                            </button>
                                            <ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-lg border border-base-300">
                                                <li>
                                                    <a>
                                                        <i className="fa-solid fa-duotone fa-pen"></i>
                                                        Change Role
                                                    </a>
                                                </li>
                                                <li>
                                                    <a>
                                                        <i className="fa-solid fa-duotone fa-envelope"></i>
                                                        Resend Invite
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="text-error">
                                                        <i className="fa-solid fa-duotone fa-user-xmark"></i>
                                                        Remove Member
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal */}
            {isInviteModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Invite Team Member</h3>

                        <div className="space-y-4">
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">Email Address</legend>
                                <input
                                    type="email"
                                    className="input"
                                    placeholder="email@example.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                />
                            </fieldset>

                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">Role</legend>
                                <select
                                    className="select select-bordered w-full"
                                    value={inviteRole}
                                    onChange={(e) =>
                                        setInviteRole(e.target.value as 'admin' | 'editor' | 'viewer')
                                    }
                                >
                                    <option value="viewer">Viewer - Read-only access</option>
                                    <option value="editor">Editor - Create and edit content</option>
                                    <option value="admin">Admin - Full access</option>
                                </select>
                            </fieldset>
                        </div>

                        <div className="modal-action">
                            <button
                                onClick={() => setIsInviteModalOpen(false)}
                                className="btn btn-ghost"
                            >
                                Cancel
                            </button>
                            <button onClick={handleInvite} className="btn btn-primary">
                                <i className="fa-solid fa-duotone fa-paper-plane"></i>
                                Send Invitation
                            </button>
                        </div>
                    </div>
                    <div
                        className="modal-backdrop"
                        onClick={() => setIsInviteModalOpen(false)}
                    ></div>
                </div>
            )}
        </div>
    );
}
