'use client';

import { CampaignTimeline } from './components/campaign-timeline';

export default function CampaignsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Campaign Timeline</h1>
                <p className="text-base-content/70">
                    View and organize your posts by campaign
                </p>
            </div>

            <CampaignTimeline />
        </div>
    );
}
