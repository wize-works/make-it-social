'use client';

import { useState } from 'react';

interface ReplyBoxProps {
    onSend: (content: string) => Promise<void>;
    onCancel?: () => void;
    platform?: string;
    maxLength?: number;
}

const PLATFORM_LIMITS: Record<string, number> = {
    instagram: 2200,
    facebook: 8000,
    twitter: 280,
    linkedin: 1250,
    pinterest: 500,
    tiktok: 150,
    youtube: 10000,
};

export function ReplyBox({ onSend, onCancel, platform, maxLength }: ReplyBoxProps) {
    const [content, setContent] = useState('');
    const [isSending, setIsSending] = useState(false);

    const limit = maxLength || (platform ? PLATFORM_LIMITS[platform] : 2000);
    const remaining = limit - content.length;
    const isOverLimit = remaining < 0;

    const handleSend = async () => {
        if (!content.trim() || isOverLimit || isSending) return;

        setIsSending(true);
        try {
            await onSend(content);
            setContent(''); // Clear on success
        } catch (error) {
            console.error('Failed to send reply:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSend();
        }
    };

    return (
        <div className="bg-base-200 rounded-box p-4 space-y-3">
            <div>
                <textarea
                    className="textarea textarea-bordered w-full min-h-[100px]"
                    placeholder="Type your reply..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isSending}
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Character counter */}
                    <span className={`text-sm ${isOverLimit ? 'text-error' : 'text-base-content/60'}`}>
                        {remaining} characters remaining
                    </span>

                    {/* Emoji picker placeholder */}
                    <button className="btn btn-sm btn-ghost" title="Add emoji">
                        <i className="fa-solid fa-face-smile"></i>
                    </button>

                    {/* Media attachment placeholder */}
                    <button className="btn btn-sm btn-ghost" title="Attach media">
                        <i className="fa-solid fa-paperclip"></i>
                    </button>
                </div>

                <div className="flex gap-2">
                    {onCancel && (
                        <button
                            className="btn btn-sm btn-ghost"
                            onClick={onCancel}
                            disabled={isSending}
                        >
                            Cancel
                        </button>
                    )}

                    <button
                        className="btn btn-sm btn-primary"
                        onClick={handleSend}
                        disabled={!content.trim() || isOverLimit || isSending}
                    >
                        {isSending ? (
                            <>
                                <span className="loading loading-spinner loading-xs"></span>
                                Sending...
                            </>
                        ) : (
                            'Send Reply'
                        )}
                    </button>
                </div>
            </div>

            <div className="text-xs text-base-content/50">
                <kbd className="kbd kbd-xs">Ctrl</kbd> + <kbd className="kbd kbd-xs">Enter</kbd> to send
            </div>
        </div>
    );
}
