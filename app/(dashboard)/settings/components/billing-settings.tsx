'use client';

import { useState } from 'react';

interface Plan {
    id: string;
    name: string;
    price: number;
    interval: 'month' | 'year';
    features: string[];
    limits: {
        accounts: number | 'unlimited';
        teamMembers: number;
        postsPerMonth: number | 'unlimited';
    };
}

const plans: Plan[] = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        interval: 'month',
        features: [
            'Basic scheduling',
            'Limited analytics',
            'Email support',
        ],
        limits: {
            accounts: 3,
            teamMembers: 1,
            postsPerMonth: 30,
        },
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 29,
        interval: 'month',
        features: [
            'AI features',
            'Advanced analytics',
            'Priority support',
            'Content calendar',
        ],
        limits: {
            accounts: 10,
            teamMembers: 3,
            postsPerMonth: 300,
        },
    },
    {
        id: 'team',
        name: 'Team',
        price: 79,
        interval: 'month',
        features: [
            'Approval workflow',
            'White-label reports',
            'Dedicated support',
            'Advanced permissions',
        ],
        limits: {
            accounts: 25,
            teamMembers: 10,
            postsPerMonth: 1000,
        },
    },
    {
        id: 'agency',
        name: 'Agency',
        price: 199,
        interval: 'month',
        features: [
            'Multi-client management',
            'Custom branding',
            'API access',
            'Premium support',
        ],
        limits: {
            accounts: 'unlimited',
            teamMembers: 25,
            postsPerMonth: 'unlimited',
        },
    },
];

export function BillingSettings() {
    const [currentPlan] = useState('pro'); // Current plan (mock)
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">Billing & Subscription</h2>
                <p className="text-base-content/60 mt-1">
                    Manage your subscription plan and billing information
                </p>
            </div>

            <div className="divider"></div>

            {/* Current Plan */}
            <div className="bg-linear-to-br from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold mb-1">Current Plan: Pro</h3>
                        <p className="text-base-content/60">
                            $29/month • Renews on November 30, 2025
                        </p>
                    </div>
                    <span className="badge badge-primary badge-lg">Active</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div>
                        <div className="text-2xl font-bold">7 / 10</div>
                        <div className="text-sm text-base-content/60">Social accounts</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">2 / 3</div>
                        <div className="text-sm text-base-content/60">Team members</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">142 / 300</div>
                        <div className="text-sm text-base-content/60">Posts this month</div>
                    </div>
                </div>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-center gap-4">
                <span className={billingCycle === 'monthly' ? 'font-semibold' : 'text-base-content/60'}>
                    Monthly
                </span>
                <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={billingCycle === 'annual'}
                    onChange={(e) => setBillingCycle(e.target.checked ? 'annual' : 'monthly')}
                />
                <span className={billingCycle === 'annual' ? 'font-semibold' : 'text-base-content/60'}>
                    Annual
                    <span className="badge badge-success badge-sm ml-2">Save 20%</span>
                </span>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => {
                    const price = billingCycle === 'annual' ? Math.round(plan.price * 0.8 * 12) : plan.price;
                    const isCurrent = plan.id === currentPlan;

                    return (
                        <div
                            key={plan.id}
                            className={`card bg-base-200 border-2 ${isCurrent ? 'border-primary' : 'border-base-300'
                                }`}
                        >
                            <div className="card-body">
                                <h3 className="card-title">{plan.name}</h3>
                                <div className="my-4">
                                    <div className="text-4xl font-bold">
                                        ${price}
                                        <span className="text-base font-normal text-base-content/60">
                                            /{billingCycle === 'annual' ? 'yr' : 'mo'}
                                        </span>
                                    </div>
                                </div>
                                <ul className="space-y-2 mb-4">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm">
                                            <i className="fa-solid fa-duotone fa-check text-success mt-0.5"></i>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="card-actions">
                                    {isCurrent ? (
                                        <button className="btn btn-outline btn-block" disabled>
                                            Current Plan
                                        </button>
                                    ) : (
                                        <button className="btn btn-primary btn-block">
                                            {plan.price > plans.find(p => p.id === currentPlan)!.price
                                                ? 'Upgrade'
                                                : 'Downgrade'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="divider"></div>

            {/* Payment Method */}
            <div>
                <h3 className="font-semibold mb-4">Payment Method</h3>
                <div className="bg-base-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <i className="fa-brands fa-cc-visa text-4xl"></i>
                        <div>
                            <div className="font-medium">Visa ending in 4242</div>
                            <div className="text-sm text-base-content/60">Expires 12/2026</div>
                        </div>
                    </div>
                    <button className="btn btn-sm btn-outline">
                        <i className="fa-solid fa-duotone fa-pen"></i>
                        Update
                    </button>
                </div>
            </div>

            {/* Billing History */}
            <div>
                <h3 className="font-semibold mb-4">Billing History</h3>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Invoice</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Oct 1, 2025</td>
                                <td>Pro Plan - Monthly</td>
                                <td>$29.00</td>
                                <td>
                                    <span className="badge badge-success">Paid</span>
                                </td>
                                <td>
                                    <button className="btn btn-ghost btn-sm">
                                        <i className="fa-solid fa-duotone fa-download"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>Sep 1, 2025</td>
                                <td>Pro Plan - Monthly</td>
                                <td>$29.00</td>
                                <td>
                                    <span className="badge badge-success">Paid</span>
                                </td>
                                <td>
                                    <button className="btn btn-ghost btn-sm">
                                        <i className="fa-solid fa-duotone fa-download"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="divider"></div>

            {/* Cancel Subscription */}
            <div className="bg-error/10 rounded-lg p-6 border border-error/20">
                <h3 className="font-semibold text-error mb-2">Cancel Subscription</h3>
                <p className="text-sm text-base-content/60 mb-4">
                    Your subscription will remain active until the end of the current billing period.
                </p>
                <button className="btn btn-error btn-outline">
                    Cancel Subscription
                </button>
            </div>
        </div>
    );
}
