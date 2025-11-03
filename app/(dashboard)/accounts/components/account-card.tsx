import type { SocialAccount } from '@/types';
import type { AccountMetrics } from '@/data/social-accounts';
import { formatDistanceToNow } from 'date-fns';
import { PLATFORM_CONFIG } from '@/lib/platform-config';

interface AccountCardProps {
    account: SocialAccount;
    metrics?: AccountMetrics;
    onDisconnect?: (accountId: string) => void;
    onReconnect?: (accountId: string) => void;
    isExpired?: boolean;
    isDisconnected?: boolean;
}

const platformConfig = PLATFORM_CONFIG;

export function AccountCard({
    account,
    metrics,
    onDisconnect,
    onReconnect,
    isExpired,
    isDisconnected
}: AccountCardProps) {
    const config = platformConfig[account.platform as keyof typeof platformConfig];

    // Determine status
    let statusBadge = null;
    if (isDisconnected) {
        statusBadge = <div className="badge badge-ghost">Disconnected</div>;
    } else if (isExpired) {
        statusBadge = <div className="badge badge-warning">Expired</div>;
    } else {
        statusBadge = <div className="badge badge-success">Connected</div>;
    }

    // Format last activity
    const lastActivity = metrics?.lastActivity
        ? formatDistanceToNow(metrics.lastActivity, { addSuffix: true })
        : 'Never';

    return (
        <div className={`card bg-base-100 shadow-lg ${isDisconnected ? 'opacity-60' : ''}`}>
            <div className="card-body">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                            <i className={`${config.icon} text-2xl ${config.color}`}></i>
                        </div>
                        <div>
                            <h3 className="font-semibold">{account.displayName}</h3>
                            <p className="text-sm text-base-content/70">{account.username}</p>
                        </div>
                    </div>
                    {statusBadge}
                </div>

                {/* Metrics */}
                {metrics && !isDisconnected && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <div className="text-2xl font-bold">{metrics.followers.toLocaleString()}</div>
                            <div className="text-sm text-base-content/70">Followers</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{metrics.posts.toLocaleString()}</div>
                            <div className="text-sm text-base-content/70">Posts</div>
                        </div>
                    </div>
                )}

                {/* Last Activity */}
                <div className="text-sm text-base-content/70 mb-4">
                    <i className="fa-solid fa-duotone fa-clock mr-2"></i>
                    Last activity: {lastActivity}
                </div>

                {/* Expiration Warning */}
                {isExpired && account.expiresAt && (
                    <div className="alert alert-warning mb-4">
                        <i className="fa-solid fa-duotone fa-triangle-exclamation"></i>
                        <span className="text-sm">
                            Token expired {formatDistanceToNow(account.expiresAt, { addSuffix: true })}
                        </span>
                    </div>
                )}

                {/* Actions */}
                <div className="card-actions justify-end">
                    {isExpired || isDisconnected ? (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => onReconnect?.(account.id)}
                        >
                            <i className="fa-solid fa-duotone fa-rotate"></i>
                            Reconnect
                        </button>
                    ) : (
                        <button
                            className="btn btn-ghost btn-sm text-error"
                            onClick={() => onDisconnect?.(account.id)}
                        >
                            <i className="fa-solid fa-duotone fa-link-slash"></i>
                            Disconnect
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
