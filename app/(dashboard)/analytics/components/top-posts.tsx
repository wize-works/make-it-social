import type { Post } from '@/types';

interface TopPostsProps {
    posts: Post[];
}

export function TopPosts({ posts }: TopPostsProps) {
    const formatDate = (date: Date | undefined): string => {
        if (!date) return 'Not published';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Mock engagement data for display (deterministic based on post id)
    const getEngagement = (post: Post): number => {
        // In real app, this would come from analytics data
        // Use hash of post id for consistent values
        const hash = post.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return (hash % 900) + 100;
    };

    if (posts.length === 0) {
        return (
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body text-center py-12">
                    <i className="fa-solid fa-duotone fa-chart-line text-6xl opacity-20 mb-4"></i>
                    <h3 className="font-bold text-xl mb-2">No Published Posts Yet</h3>
                    <p className="opacity-70">
                        Publish some posts to see performance analytics here
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Content</th>
                                <th>Published</th>
                                <th>Platforms</th>
                                <th>Engagement</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post, index) => {
                                const engagement = getEngagement(post);
                                return (
                                    <tr key={post.id} className="hover">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="badge badge-neutral badge-sm">
                                                    #{index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium line-clamp-1">
                                                        {post.content.substring(0, 60)}
                                                        {post.content.length > 60 && '...'}
                                                    </div>
                                                    {post.mediaUrls.length > 0 && (
                                                        <div className="text-xs opacity-70 mt-1">
                                                            <i className="fa-solid fa-duotone fa-image mr-1"></i>
                                                            {post.mediaUrls.length} media
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-sm">
                                                {formatDate(post.scheduledTime)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1">
                                                {post.targets.slice(0, 3).map(target => (
                                                    <div
                                                        key={target.id}
                                                        className="badge badge-sm badge-outline"
                                                    >
                                                        <i className="fa-solid fa-duotone fa-hashtag text-xs"></i>
                                                    </div>
                                                ))}
                                                {post.targets.length > 3 && (
                                                    <span className="text-xs opacity-70">
                                                        +{post.targets.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="radial-progress text-primary" style={{ '--value': Math.min((engagement / 1000) * 100, 100), '--size': '2.5rem' } as React.CSSProperties} role="progressbar">
                                                    <span className="text-xs font-bold">{engagement}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <button className="btn btn-ghost btn-sm">
                                                <i className="fa-solid fa-duotone fa-chart-simple"></i>
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
