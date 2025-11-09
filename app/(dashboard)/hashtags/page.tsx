'use client';

import { HashtagLibrary } from './components/hashtag-library';

export default function HashtagsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Hashtag Library</h1>
                <p className="text-base-content/70">
                    Manage your brand hashtags and organize them by collection
                </p>
            </div>

            <HashtagLibrary />
        </div>
    );
}
