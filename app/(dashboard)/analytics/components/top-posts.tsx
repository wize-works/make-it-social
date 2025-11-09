import type { TopPostResponse } from '@/types';

interface TopPostsProps {
    posts: TopPostResponse[];
}

export function TopPosts({ posts }: TopPostsProps) {
    const formatDate = (dateString: string): string => {
        if (!dateString) return 'Not published';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
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
                                <th>Reach</th>
                                <th>Engagement</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post, index) => (
                                <tr key={post.postId} className="hover">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="badge badge-neutral badge-sm">
                                                #{index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium line-clamp-2">
                                                    {post.content || 'No content available'}
                                                </div>
                                                <div className="text-xs opacity-70 mt-1">
                                                    <i className={`fa-brands fa-${post.platform} mr-1`}></i>
                                                    {post.platform}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-sm">
                                            {formatDate(post.publishedAt)}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium">
                                                {formatNumber(post.reach)} reach
                                            </div>
                                            <div className="text-xs opacity-70">
                                                {formatNumber(post.impressions)} impressions
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="space-y-1">
                                            <div className="text-sm font-bold text-primary">
                                                {formatNumber(post.engagement)}
                                            </div>
                                            <div className="text-xs opacity-70">
                                                {post.engagementRate.toFixed(2)}% rate
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
