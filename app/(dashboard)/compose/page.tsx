'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostComposer } from './components/post-composer';

interface PostData {
    content: string;
    mediaUrls: string[];
    selectedAccounts: string[];
    scheduledTime?: Date;
    isDraft: boolean;
}

export default function ComposePage() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (postData: PostData) => {
        setIsSaving(true);
        // TODO: Replace with actual API call
        console.log('Saving post:', postData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
    };

    const handleCancel = () => {
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Create Post</h1>
                    <p className="text-base-content/70">
                        Compose and schedule your social media content
                    </p>
                </div>

                {/* Composer */}
                <PostComposer
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaving={isSaving}
                />
            </main>
        </div>
    );
}
