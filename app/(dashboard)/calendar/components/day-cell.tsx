import { Post } from '@/types';
import { PostCardMini } from './post-card-mini';
import { useState } from 'react';

interface DayCellProps {
    date: Date;
    posts: Post[];
    isCurrentMonth: boolean;
    isToday: boolean;
    onPostClick: (post: Post) => void;
    onDropPost?: (postId: string, preserveTime?: boolean) => void;
}

export function DayCell({ date, posts, isCurrentMonth, isToday, onPostClick, onDropPost }: DayCellProps) {
    const dayNumber = date.getDate();
    const [isDragOver, setIsDragOver] = useState(false);

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);

                try {
                    const payload = e.dataTransfer.getData('application/json');
                    if (!payload) return;
                    const parsed = JSON.parse(payload) as { id: string; time?: string | null };
                    const preserveTime = !!parsed.time;
                    // Notify parent with postId and whether to preserve time
                    onDropPost?.(parsed.id, preserveTime);
                } catch {
                    // ignore parse errors
                }
            }}
            className={`min-h-[120px] border border-base-300 p-2 ${isCurrentMonth ? 'bg-base-100' : 'bg-base-200/50 opacity-50'
                } ${isToday ? 'ring-2 ring-primary' : ''} ${isDragOver ? 'bg-primary/5 ring-1 ring-primary/40' : ''}`}
        >
            {/* Day Number */}
            <div className="flex items-center justify-between mb-2">
                <span
                    className={`text-sm font-bold ${isToday
                        ? 'bg-primary text-primary-content rounded-full w-6 h-6 flex items-center justify-center'
                        : ''
                        }`}
                >
                    {dayNumber}
                </span>
                {posts.length > 0 && (
                    <span className="badge badge-xs badge-primary">{posts.length}</span>
                )}
            </div>

            {/* Posts */}
            <div className="space-y-1">
                {posts.slice(0, 3).map(post => (
                    <PostCardMini key={post.id} post={post} onClick={onPostClick} />
                ))}
                {posts.length > 3 && (
                    <div className="text-xs text-center opacity-60 py-1">
                        +{posts.length - 3} more
                    </div>
                )}
            </div>
        </div>
    );
}
