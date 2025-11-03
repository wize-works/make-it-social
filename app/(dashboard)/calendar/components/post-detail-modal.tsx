import { Post } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PostDetailModalProps {
    post: Post | null;
    onClose: () => void;
    onReschedule?: (postId: string, newTime: Date) => void;
}

const STATUS_BADGES: Record<string, string> = {
    draft: 'badge-neutral',
    pending: 'badge-warning',
    approved: 'badge-warning',
    scheduled: 'badge-info',
    published: 'badge-success',
    failed: 'badge-error',
};

export function PostDetailModal({ post, onClose, onReschedule }: PostDetailModalProps) {
    const router = useRouter();
    const [isEditingTime, setIsEditingTime] = useState(false);
    const [editedTime, setEditedTime] = useState('');

    if (!post) return null;

    const handleEdit = () => {
        // TODO: Navigate to edit page with post data
        router.push(`/compose?edit=${post.id}`);
    };

    const handleDelete = () => {
        // TODO: Implement delete functionality
        console.log('Delete post:', post.id);
        onClose();
    };

    const handleEditTime = () => {
        // Convert current scheduledTime to datetime-local format
        if (post.scheduledTime) {
            const date = new Date(post.scheduledTime);
            // Format as YYYY-MM-DDTHH:mm for datetime-local input
            const formatted = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
            setEditedTime(formatted);
        } else {
            // Default to tomorrow at 9am
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(9, 0, 0, 0);
            const formatted = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
            setEditedTime(formatted);
        }
        setIsEditingTime(true);
    };

    const handleSaveTime = () => {
        if (editedTime && onReschedule) {
            const newDate = new Date(editedTime);
            onReschedule(post.id, newDate);
        }
        setIsEditingTime(false);
    };

    const handleCancelEditTime = () => {
        setIsEditingTime(false);
        setEditedTime('');
    };

    const formattedDate = post.scheduledTime
        ? new Date(post.scheduledTime).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : 'Not scheduled';

    const formattedTime = post.scheduledTime
        ? new Date(post.scheduledTime).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        })
        : '';

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-2xl mb-2">Post Details</h3>
                        <div className="flex items-center gap-2">
                            <span className={`badge ${STATUS_BADGES[post.status]}`}>
                                {post.status.toUpperCase()}
                            </span>
                            {post.targets.length > 0 && (
                                <span className="badge badge-outline">
                                    {post.targets.length}{' '}
                                    {post.targets.length === 1 ? 'platform' : 'platforms'}
                                </span>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
                        <i className="fa-solid fa-duotone fa-xmark text-xl"></i>
                    </button>
                </div>

                {/* Scheduled Time */}
                {post.scheduledTime && !isEditingTime && (
                    <div className="alert mb-4">
                        <i className="fa-solid fa-duotone fa-clock text-xl"></i>
                        <div className="flex-1">
                            <div className="font-bold">{formattedDate}</div>
                            <div className="text-sm opacity-70">at {formattedTime}</div>
                        </div>
                        {(post.status === 'draft' || post.status === 'scheduled') && onReschedule && (
                            <button
                                onClick={handleEditTime}
                                className="btn btn-sm btn-ghost"
                                title="Edit scheduled time"
                            >
                                <i className="fa-solid fa-duotone fa-pen-to-square"></i>
                            </button>
                        )}
                    </div>
                )}

                {/* Edit Scheduled Time */}
                {isEditingTime && (
                    <div className="alert alert-info mb-4">
                        <i className="fa-solid fa-duotone fa-clock text-xl"></i>
                        <div className="flex-1">
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text font-bold">Reschedule Post</span>
                                </div>
                                <input
                                    type="datetime-local"
                                    value={editedTime}
                                    onChange={(e) => setEditedTime(e.target.value)}
                                    className="input input-bordered w-full"
                                />
                            </label>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleSaveTime} className="btn btn-sm btn-success">
                                <i className="fa-solid fa-duotone fa-check mr-1"></i>
                                Save
                            </button>
                            <button onClick={handleCancelEditTime} className="btn btn-sm btn-ghost">
                                <i className="fa-solid fa-duotone fa-xmark"></i>
                            </button>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="mb-4">
                    <h4 className="font-bold mb-2">Content</h4>
                    <div className="bg-base-200 p-4 rounded-lg whitespace-pre-wrap">
                        {post.content}
                    </div>
                </div>

                {/* Media */}
                {post.mediaUrls.length > 0 && (
                    <div className="mb-4">
                        <h4 className="font-bold mb-2">Media ({post.mediaUrls.length})</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {post.mediaUrls.map((url, index) => (
                                <div
                                    key={index}
                                    className="aspect-square bg-base-200 rounded-lg flex items-center justify-center"
                                >
                                    <i className="fa-solid fa-duotone fa-image text-4xl opacity-30"></i>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Targets */}
                {post.targets.length > 0 && (
                    <div className="mb-4">
                        <h4 className="font-bold mb-2">Publishing To</h4>
                        <div className="space-y-2">
                            {post.targets.map(target => (
                                <div
                                    key={target.id}
                                    className="flex items-center justify-between p-2 bg-base-200 rounded"
                                >
                                    <div className="flex items-center gap-2">
                                        <i className="fa-solid fa-duotone fa-hashtag"></i>
                                        <span>Account {target.socialAccountId}</span>
                                    </div>
                                    <span
                                        className={`badge badge-sm ${target.status === 'published'
                                            ? 'badge-success'
                                            : target.status === 'failed'
                                                ? 'badge-error'
                                                : 'badge-info'
                                            }`}
                                    >
                                        {target.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="modal-action">
                    {post.status === 'draft' || post.status === 'scheduled' ? (
                        <>
                            <button onClick={handleEdit} className="btn btn-primary">
                                <i className="fa-solid fa-duotone fa-pen-to-square mr-2"></i>
                                Edit Post
                            </button>
                            <button onClick={handleDelete} className="btn btn-error btn-outline">
                                <i className="fa-solid fa-duotone fa-trash mr-2"></i>
                                Delete
                            </button>
                        </>
                    ) : (
                        <button onClick={onClose} className="btn btn-outline">
                            Close
                        </button>
                    )}
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
}
