import Image from 'next/image';
import { useState } from 'react';

export default function CommentAvatar({ authorAvatar, authorDisplayName }: { authorAvatar: string, authorDisplayName: string }) {
    const [imageError, setImageError] = useState(false);

    if (!authorAvatar || imageError) {
        return (
            <div className="avatar-fallback">
                {authorDisplayName?.[0] || '?'}
            </div>
        );
    }

    return (
        <Image
            src={authorAvatar}
            alt={authorDisplayName}
            width={40}
            height={40}
            className="rounded-full w-10 h-10 object-cover"
            onError={() => setImageError(true)}
        />
    );
}
