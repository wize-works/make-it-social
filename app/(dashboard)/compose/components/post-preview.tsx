'use client';

import type { SocialAccount } from '@/types';

interface PostPreviewProps {
    content: string;
    platformSpecificContent?: Record<string, string>; // platform -> content mapping
    mediaUrls: string[];
    selectedAccounts: SocialAccount[];
}

// Platform-specific preview renderers
const renderTwitterPreview = (account: SocialAccount, content: string, mediaUrls: string[]) => (
    <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden max-w-xl">
        {/* Twitter Header */}
        <div className="p-4">
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold">
                    {account.displayName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-base">{account.displayName}</span>
                        <i className="fa-solid fa-duotone fa-badge-check text-sky-500 text-sm"></i>
                        <span className="text-sm text-base-content/60">@{account.username}</span>
                        <span className="text-sm text-base-content/60">· 1m</span>
                    </div>
                    <div className="mt-2 text-[15px] whitespace-pre-wrap wrap-break-word">{content}</div>

                    {/* Media */}
                    {mediaUrls.length > 0 && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-base-300">
                            <div className="aspect-video bg-linear-to-br from-sky-100 to-blue-100 dark:from-sky-900 dark:to-blue-900 flex items-center justify-center">
                                <i className="fa-solid fa-duotone fa-duotone fa-image text-4xl text-base-content/30"></i>
                            </div>
                        </div>
                    )}

                    {/* Twitter Actions */}
                    <div className="flex items-center justify-between mt-3 text-base-content/50 text-sm max-w-md">
                        <button className="flex items-center gap-2 hover:text-sky-500 transition-colors">
                            <i className="fa-solid fa-duotone fa-comment"></i>
                            <span>42</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                            <i className="fa-solid fa-duotone fa-retweet"></i>
                            <span>128</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-pink-500 transition-colors">
                            <i className="fa-solid fa-duotone fa-heart"></i>
                            <span>1.2K</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-sky-500 transition-colors">
                            <i className="fa-solid fa-duotone fa-chart-simple"></i>
                            <span>45.2K</span>
                        </button>
                        <button className="hover:text-sky-500 transition-colors">
                            <i className="fa-solid fa-duotone fa-arrow-up-from-bracket"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const renderInstagramPreview = (account: SocialAccount, content: string, mediaUrls: string[]) => (
    <div className="bg-base-100 rounded-lg border border-base-300 overflow-hidden max-w-md">
        {/* Instagram Header */}
        <div className="flex items-center justify-between p-3 border-b border-base-300">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-purple-500 via-pink-500 to-orange-400 p-0.5">
                    <div className="w-full h-full rounded-full bg-base-100 flex items-center justify-center">
                        <span className="text-xs font-bold">{account.displayName.charAt(0)}</span>
                    </div>
                </div>
                <span className="font-semibold text-sm">{account.username}</span>
            </div>
            <button><i className="fa-solid fa-duotone fa-ellipsis"></i></button>
        </div>

        {/* Instagram Media */}
        {mediaUrls.length > 0 && (
            <div className="aspect-square bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center">
                <i className="fa-solid fa-duotone fa-duotone fa-image text-5xl text-base-content/30"></i>
            </div>
        )}

        {/* Instagram Actions */}
        <div className="p-3 space-y-2">
            <div className="flex items-center justify-between text-2xl">
                <div className="flex items-center gap-4">
                    <button className="hover:text-base-content/60 transition-colors">
                        <i className="fa-solid fa-duotone fa-heart"></i>
                    </button>
                    <button className="hover:text-base-content/60 transition-colors">
                        <i className="fa-solid fa-duotone fa-comment"></i>
                    </button>
                    <button className="hover:text-base-content/60 transition-colors">
                        <i className="fa-solid fa-duotone fa-paper-plane"></i>
                    </button>
                </div>
                <button className="hover:text-base-content/60 transition-colors">
                    <i className="fa-solid fa-duotone fa-bookmark"></i>
                </button>
            </div>

            <div className="text-sm">
                <p className="font-semibold mb-1">3,492 likes</p>
                <p>
                    <span className="font-semibold mr-2">{account.username}</span>
                    <span className="whitespace-pre-wrap wrap-break-word">{content}</span>
                </p>
                <p className="text-base-content/50 text-xs mt-2">2 HOURS AGO</p>
            </div>
        </div>
    </div>
);

const renderLinkedInPreview = (account: SocialAccount, content: string, mediaUrls: string[]) => (
    <div className="bg-base-100 rounded-lg border border-base-300 overflow-hidden max-w-xl">
        {/* LinkedIn Header */}
        <div className="p-4">
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold">
                    {account.displayName.charAt(0)}
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-sm">{account.displayName}</p>
                    <p className="text-xs text-base-content/60">Professional Title | Company</p>
                    <p className="text-xs text-base-content/50 flex items-center gap-1 mt-1">
                        <span>1h</span>
                        <span>·</span>
                        <i className="fa-solid fa-duotone fa-earth-americas text-[10px]"></i>
                    </p>
                </div>
                <button className="text-base-content/60">
                    <i className="fa-solid fa-duotone fa-ellipsis"></i>
                </button>
            </div>

            {/* LinkedIn Content */}
            <div className="mt-3 text-sm whitespace-pre-wrap wrap-break-word">{content}</div>

            {/* LinkedIn Media */}
            {mediaUrls.length > 0 && (
                <div className="mt-3 rounded-lg overflow-hidden border border-base-300">
                    <div className="aspect-video bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 flex items-center justify-center">
                        <i className="fa-solid fa-duotone fa-duotone fa-image text-4xl text-base-content/30"></i>
                    </div>
                </div>
            )}
        </div>

        {/* LinkedIn Engagement */}
        <div className="px-4 py-2 border-y border-base-300 flex items-center justify-between text-xs text-base-content/60">
            <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                    <div className="w-4 h-4 rounded-full bg-blue-500 border border-base-100 flex items-center justify-center">
                        <i className="fa-solid fa-duotone fa-thumbs-up text-[8px] text-white"></i>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-red-500 border border-base-100 flex items-center justify-center">
                        <i className="fa-solid fa-duotone fa-heart text-[8px] text-white"></i>
                    </div>
                </div>
                <span>487</span>
            </div>
            <div className="flex items-center gap-3">
                <span>23 comments</span>
                <span>12 reposts</span>
            </div>
        </div>

        {/* LinkedIn Actions */}
        <div className="px-4 py-3 flex items-center justify-around text-sm text-base-content/70">
            <button className="flex items-center gap-2 hover:bg-base-200 px-4 py-2 rounded transition-colors">
                <i className="fa-solid fa-duotone fa-thumbs-up"></i>
                <span>Like</span>
            </button>
            <button className="flex items-center gap-2 hover:bg-base-200 px-4 py-2 rounded transition-colors">
                <i className="fa-solid fa-duotone fa-comment"></i>
                <span>Comment</span>
            </button>
            <button className="flex items-center gap-2 hover:bg-base-200 px-4 py-2 rounded transition-colors">
                <i className="fa-solid fa-duotone fa-retweet"></i>
                <span>Repost</span>
            </button>
            <button className="flex items-center gap-2 hover:bg-base-200 px-4 py-2 rounded transition-colors">
                <i className="fa-solid fa-duotone fa-paper-plane"></i>
                <span>Send</span>
            </button>
        </div>
    </div>
);

const renderFacebookPreview = (account: SocialAccount, content: string, mediaUrls: string[]) => (
    <div className="bg-base-100 rounded-lg border border-base-300 overflow-hidden max-w-xl">
        {/* Facebook Header */}
        <div className="p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold">
                        {account.displayName.charAt(0)}
                    </div>
                    <div>
                        <p className="font-semibold text-sm">{account.displayName}</p>
                        <p className="text-xs text-base-content/60 flex items-center gap-1">
                            <span>1h</span>
                            <span>·</span>
                            <i className="fa-solid fa-duotone fa-earth-americas text-[10px]"></i>
                        </p>
                    </div>
                </div>
                <button className="text-base-content/60">
                    <i className="fa-solid fa-duotone fa-ellipsis"></i>
                </button>
            </div>

            {/* Facebook Content */}
            <div className="text-[15px] whitespace-pre-wrap wrap-break-word">{content}</div>
        </div>

        {/* Facebook Media */}
        {mediaUrls.length > 0 && (
            <div className="aspect-video bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 flex items-center justify-center border-y border-base-300">
                <i className="fa-solid fa-duotone fa-duotone fa-image text-5xl text-base-content/30"></i>
            </div>
        )}

        {/* Facebook Engagement */}
        <div className="px-4 py-2 border-b border-base-300 flex items-center justify-between text-xs text-base-content/60">
            <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                    <div className="w-4 h-4 rounded-full bg-blue-500 border border-base-100 flex items-center justify-center">
                        <i className="fa-solid fa-duotone fa-thumbs-up text-[8px] text-white"></i>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-red-500 border border-base-100 flex items-center justify-center">
                        <i className="fa-solid fa-duotone fa-heart text-[8px] text-white"></i>
                    </div>
                </div>
                <span>You and 234 others</span>
            </div>
            <div className="flex items-center gap-3">
                <span>18 comments</span>
                <span>5 shares</span>
            </div>
        </div>

        {/* Facebook Actions */}
        <div className="px-4 py-2 flex items-center justify-around text-sm text-base-content/70">
            <button className="flex items-center gap-2 hover:bg-base-200 flex-1 justify-center py-2 rounded transition-colors">
                <i className="fa-solid fa-duotone fa-thumbs-up"></i>
                <span>Like</span>
            </button>
            <button className="flex items-center gap-2 hover:bg-base-200 flex-1 justify-center py-2 rounded transition-colors">
                <i className="fa-solid fa-duotone fa-comment"></i>
                <span>Comment</span>
            </button>
            <button className="flex items-center gap-2 hover:bg-base-200 flex-1 justify-center py-2 rounded transition-colors">
                <i className="fa-solid fa-duotone fa-share"></i>
                <span>Share</span>
            </button>
        </div>
    </div>
);

const renderTikTokPreview = (account: SocialAccount, content: string, mediaUrls: string[]) => (
    <div className="bg-black text-white rounded-lg overflow-hidden max-w-md">
        {/* TikTok Video Area */}
        <div className="relative aspect-9/16 bg-linear-to-br from-gray-900 to-black flex items-center justify-center">
            {mediaUrls.length > 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fa-solid fa-duotone fa-duotone fa-video text-6xl text-white/30"></i>
                </div>
            ) : (
                <i className="fa-solid fa-duotone fa-duotone fa-video text-6xl text-white/30"></i>
            )}

            {/* TikTok Caption Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-500 to-purple-600 flex items-center justify-center font-bold text-sm">
                        {account.displayName.charAt(0)}
                    </div>
                    <span className="font-semibold">@{account.username}</span>
                </div>
                <p className="text-sm mb-3 line-clamp-3">{content}</p>
            </div>

            {/* TikTok Side Actions */}
            <div className="absolute right-2 bottom-20 flex flex-col gap-4 items-center">
                <button className="flex flex-col items-center gap-1">
                    <i className="fa-solid fa-duotone fa-heart text-3xl"></i>
                    <span className="text-xs">128K</span>
                </button>
                <button className="flex flex-col items-center gap-1">
                    <i className="fa-solid fa-duotone fa-comment text-3xl"></i>
                    <span className="text-xs">2.3K</span>
                </button>
                <button className="flex flex-col items-center gap-1">
                    <i className="fa-solid fa-duotone fa-share text-3xl"></i>
                    <span className="text-xs">892</span>
                </button>
            </div>
        </div>
    </div>
);

const renderPinterestPreview = (account: SocialAccount, content: string, mediaUrls: string[]) => (
    <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden max-w-sm hover:shadow-lg transition-shadow">
        {/* Pinterest Image */}
        {mediaUrls.length > 0 && (
            <div className="aspect-2/3 bg-linear-to-br from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 flex items-center justify-center">
                <i className="fa-solid fa-duotone fa-duotone fa-image text-5xl text-base-content/30"></i>
            </div>
        )}

        {/* Pinterest Content */}
        <div className="p-4">
            <h3 className="font-bold text-base mb-2 line-clamp-2">{content.split('\n')[0] || 'Pin Title'}</h3>
            <p className="text-sm text-base-content/70 line-clamp-3">{content}</p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-base-300">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-red-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                        {account.displayName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{account.displayName}</span>
                </div>
                <button className="btn btn-sm btn-error rounded-full">
                    <i className="fa-solid fa-duotone fa-thumbtack"></i>
                    Save
                </button>
            </div>
        </div>
    </div>
);

const renderYouTubePreview = (account: SocialAccount, content: string, mediaUrls: string[]) => (
    <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden max-w-2xl">
        {/* YouTube Video Thumbnail */}
        <div className="aspect-video bg-black flex items-center justify-center relative">
            {mediaUrls.length > 0 ? (
                <div className="absolute inset-0 bg-linear-to-br from-red-900/50 to-black flex items-center justify-center">
                    <i className="fa-solid fa-duotone fa-duotone fa-play text-6xl text-white/80"></i>
                </div>
            ) : (
                <i className="fa-solid fa-duotone fa-duotone fa-play text-6xl text-white/50"></i>
            )}
            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-xs text-white rounded">
                10:24
            </div>
        </div>

        {/* YouTube Info */}
        <div className="p-4">
            <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold shrink-0">
                    {account.displayName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">{content.substring(0, 100) || 'Video Title'}</h3>
                    <p className="text-xs text-base-content/60">{account.displayName}</p>
                    <p className="text-xs text-base-content/50">1.2M views · 2 hours ago</p>
                </div>
            </div>

            {/* YouTube Actions */}
            <div className="flex items-center gap-4 mt-4 text-sm">
                <button className="flex items-center gap-2">
                    <i className="fa-solid fa-duotone fa-thumbs-up"></i>
                    <span>24K</span>
                </button>
                <button className="flex items-center gap-2">
                    <i className="fa-solid fa-duotone fa-thumbs-down"></i>
                </button>
                <button className="flex items-center gap-2">
                    <i className="fa-solid fa-duotone fa-share"></i>
                    <span>Share</span>
                </button>
                <button className="flex items-center gap-2 ml-auto">
                    <i className="fa-solid fa-duotone fa-ellipsis"></i>
                </button>
            </div>
        </div>
    </div>
);

const renderGenericPreview = (account: SocialAccount, content: string, mediaUrls: string[]) => (
    <div className="bg-base-200 rounded-lg border border-base-300 p-4">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-base-100 flex items-center justify-center">
                <i className={`fa-brands fa-${account.platform} text-lg`}></i>
            </div>
            <div>
                <p className="font-medium text-sm">{account.displayName}</p>
                <p className="text-xs opacity-60 capitalize">{account.platform}</p>
            </div>
        </div>
        <div className="text-sm whitespace-pre-wrap wrap-break-word">{content}</div>
        {mediaUrls.length > 0 && (
            <div className="mt-3 aspect-video bg-base-100 rounded flex items-center justify-center">
                <i className="fa-solid fa-duotone fa-duotone fa-image text-3xl text-base-content/30"></i>
            </div>
        )}
    </div>
);

export function PostPreview({ content, platformSpecificContent, mediaUrls, selectedAccounts }: PostPreviewProps) {
    if (selectedAccounts.length === 0) {
        return (
            <div className="text-center py-8 text-base-content/60">
                <i className="fa-solid fa-duotone fa-duotone fa-eye-slash text-3xl mb-2"></i>
                <p className="text-sm">Select a platform to preview your post</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {selectedAccounts.map(account => {
                // Get platform-specific content or fallback to main content
                const displayContent = platformSpecificContent?.[account.platform] || content;

                return (
                    <div key={account.id} className="space-y-2">
                        {/* Platform Label */}
                        <div className="flex items-center gap-2 text-sm text-base-content/60">
                            <i className={`fa-brands fa-${account.platform === 'twitter' ? 'x-twitter' : account.platform}`}></i>
                            <span className="capitalize font-medium">{account.platform}</span>
                            <span>•</span>
                            <span>{account.displayName}</span>
                        </div>

                        {/* Platform-specific Preview */}
                        {account.platform === 'twitter' && renderTwitterPreview(account, displayContent, mediaUrls)}
                        {account.platform === 'instagram' && renderInstagramPreview(account, displayContent, mediaUrls)}
                        {account.platform === 'linkedin' && renderLinkedInPreview(account, displayContent, mediaUrls)}
                        {account.platform === 'facebook' && renderFacebookPreview(account, displayContent, mediaUrls)}
                        {account.platform === 'tiktok' && renderTikTokPreview(account, displayContent, mediaUrls)}
                        {account.platform === 'pinterest' && renderPinterestPreview(account, displayContent, mediaUrls)}
                        {account.platform === 'youtube' && renderYouTubePreview(account, displayContent, mediaUrls)}
                        {!['twitter', 'instagram', 'linkedin', 'facebook', 'tiktok', 'pinterest', 'youtube'].includes(account.platform) &&
                            renderGenericPreview(account, displayContent, mediaUrls)}
                    </div>
                );
            })}
        </div>
    );
}
