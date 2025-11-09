'use client';

import { AIUsageDashboard } from './components/ai-usage-dashboard';

export default function AIUsagePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">AI Usage Dashboard</h1>
                <p className="text-base-content/70">
                    Track AI generation usage, costs, and quality metrics
                </p>
            </div>

            <AIUsageDashboard />
        </div>
    );
}
