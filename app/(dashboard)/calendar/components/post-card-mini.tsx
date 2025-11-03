import { Post } from '@/types';
import type { DragEvent } from 'react';

interface PostCardMiniProps {
    post: Post;
    onClick: (post: Post) => void;
}

const STATUS_STYLES: Record<string, string> = {
    draft: 'border-l-neutral',
    pending: 'border-l-warning',
    approved: 'border-l-warning',
    scheduled: 'border-l-info',
    published: 'border-l-success',
    failed: 'border-l-error',
};

export function PostCardMini({ post, onClick }: PostCardMiniProps) {
    const time = post.scheduledTime
        ? new Date(post.scheduledTime).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        })
        : '';

    // Truncate content for preview
    const truncatedContent =
        post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content;

    const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
        const payload = JSON.stringify({ id: post.id, time: post.scheduledTime ? new Date(post.scheduledTime).toISOString() : null });
        e.dataTransfer.setData('application/json', payload);
        e.dataTransfer.effectAllowed = 'move';
    };

    return (
        <button
            draggable
            onDragStart={handleDragStart}
            onClick={() => onClick(post)}
            className={`w-full text-left p-2 rounded bg-base-200 hover:bg-base-300 transition-colors border-l-4 ${STATUS_STYLES[post.status]
                } group mb-1`}
        >
            <div className="flex items-start gap-2">
                {/* Media Indicator */}
                {post.mediaUrls.length > 0 && (
                    <div className="text-primary shrink-0 mt-0.5">
                        <i className="fa-solid fa-duotone fa-image text-xs"></i>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {time && <div className="text-xs opacity-60 mb-1">{time}</div>}
                    <div className="text-sm line-clamp-2">{truncatedContent}</div>
                    <div className="flex items-center gap-1 mt-1">
                        {post.targets.slice(0, 3).map(target => (
                            <div
                                key={target.id}
                                className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center"
                            >
                                <i className="fa-solid fa-duotone fa-hashtag text-[8px]"></i>
                            </div>
                        ))}
                        {post.targets.length > 3 && (
                            <span className="text-xs opacity-60">+{post.targets.length - 3}</span>
                        )}
                    </div>
                </div>
            </div>
        </button>
    );
}
