'use client';

import { useState, useRef } from 'react';

interface ComposerToolbarProps {
    onInsertEmoji: (emoji: string) => void;
    onInsertHashtag: (hashtag: string) => void;
    onInsertMention: (mention: string) => void;
}

// Popular emoji categories with frequently used emojis for social media
const EMOJI_CATEGORIES = {
    'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😗', '😙', '😚', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '🥱', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵'],
    'Gestures': ['👍', '👎', '👏', '🙌', '👐', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸'],
    'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
    'Celebrations': ['🎉', '🎊', '🎈', '🎁', '🎀', '🎂', '🍰', '🧁', '🥳', '🎆', '🎇', '✨', '🎃', '🎄', '🎋', '🎍', '🎑', '🎗️', '🎟️', '🎫'],
    'Objects': ['💼', '📱', '💻', '⌚', '📷', '📸', '🎥', '📹', '🎬', '📺', '📻', '🎙️', '🎚️', '🎛️', '🎧', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛒', '💰', '💳', '💎', '⚖️'],
    'Nature': ['🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🏵️', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🪴'],
    'Food': ['🍕', '🍔', '🍟', '🌭', '🍿', '🧈', '🧂', '🥓', '🥚', '🍳', '🥞', '🧇', '🥐', '🍞', '🥖', '🥨', '🧀', '🥗', '🥙', '🌮', '🌯', '🥪', '🥩', '🍖', '🍗', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🥘', '🍝', '🥫', '🫕', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫'],
    'Activities': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🏹', '🎣', '🥊', '🥋', '⛷️', '🏂', '🏋️'],
};

// Common hashtags for quick insert
const COMMON_HASHTAGS = [
    '#SocialMedia',
    '#Marketing',
    '#Business',
    '#Entrepreneur',
    '#SmallBusiness',
    '#DigitalMarketing',
    '#ContentMarketing',
    '#SocialMediaMarketing',
    '#Branding',
    '#Success',
    '#Motivation',
    '#Inspiration',
    '#Growth',
    '#Innovation',
    '#Leadership',
    '#Technology',
    '#Startup',
    '#WorkFromHome',
    '#RemoteWork',
    '#Productivity',
];

export function ComposerToolbar({ onInsertEmoji, onInsertHashtag, onInsertMention }: ComposerToolbarProps) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showHashtagPicker, setShowHashtagPicker] = useState(false);
    const [emojiCategory, setEmojiCategory] = useState<keyof typeof EMOJI_CATEGORIES>('Smileys');
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const hashtagPickerRef = useRef<HTMLDivElement>(null);

    const handleEmojiClick = (emoji: string) => {
        onInsertEmoji(emoji);
        setShowEmojiPicker(false);
    };

    const handleHashtagClick = (hashtag: string) => {
        onInsertHashtag(hashtag);
        setShowHashtagPicker(false);
    };

    return (
        <div className="flex items-center gap-2 py-2 border-t border-base-300">
            {/* Emoji Picker */}
            <div className="relative">
                <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    title="Insert emoji"
                >
                    <i className="fa-solid fa-duotone fa-face-smile text-lg"></i>
                </button>

                {showEmojiPicker && (
                    <div
                        ref={emojiPickerRef}
                        className="absolute bottom-full left-0 mb-2 w-80 bg-base-100 border border-base-300 rounded-lg shadow-xl z-50"
                    >
                        <div className="p-3">
                            {/* Category Tabs */}
                            <div className="flex gap-1 mb-3 overflow-x-auto pb-2">
                                {Object.keys(EMOJI_CATEGORIES).map((category) => (
                                    <button
                                        key={category}
                                        type="button"
                                        className={`btn btn-xs ${emojiCategory === category ? 'btn-primary' : 'btn-ghost'}`}
                                        onClick={() => setEmojiCategory(category as keyof typeof EMOJI_CATEGORIES)}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            {/* Emoji Grid */}
                            <div className="grid grid-cols-8 gap-1 max-h-64 overflow-y-auto">
                                {EMOJI_CATEGORIES[emojiCategory].map((emoji, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="btn btn-ghost btn-sm text-2xl p-1 h-auto hover:bg-base-200"
                                        onClick={() => handleEmojiClick(emoji)}
                                        title={emoji}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Hashtag Helper */}
            <div className="relative">
                <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowHashtagPicker(!showHashtagPicker)}
                    title="Insert hashtag"
                >
                    <i className="fa-solid fa-duotone fa-hashtag text-lg"></i>
                </button>

                {showHashtagPicker && (
                    <div
                        ref={hashtagPickerRef}
                        className="absolute bottom-full left-0 mb-2 w-72 bg-base-100 border border-base-300 rounded-lg shadow-xl z-50"
                    >
                        <div className="p-3">
                            <h4 className="font-bold text-sm mb-2">Popular Hashtags</h4>
                            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                                {COMMON_HASHTAGS.map((hashtag) => (
                                    <button
                                        key={hashtag}
                                        type="button"
                                        className="badge badge-primary badge-lg cursor-pointer hover:badge-accent"
                                        onClick={() => handleHashtagClick(hashtag)}
                                    >
                                        {hashtag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mention Helper */}
            <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onInsertMention('@')}
                title="Insert mention"
            >
                <i className="fa-solid fa-duotone fa-at text-lg"></i>
            </button>

            {/* Divider */}
            <div className="divider divider-horizontal mx-0"></div>

            {/* Quick Emoji Insert */}
            <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onInsertEmoji('💡')}
                title="Insert idea emoji"
            >
                <i className="fa-solid fa-duotone fa-lightbulb text-lg"></i>
            </button>

            <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onInsertEmoji('🚀')}
                title="Insert rocket emoji"
            >
                <i className="fa-solid fa-duotone fa-rocket text-lg"></i>
            </button>

            <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onInsertEmoji('🎉')}
                title="Insert celebration emoji"
            >
                <i className="fa-solid fa-duotone fa-party-horn text-lg"></i>
            </button>

            {/* Close on outside click */}
            {(showEmojiPicker || showHashtagPicker) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setShowEmojiPicker(false);
                        setShowHashtagPicker(false);
                    }}
                />
            )}
        </div>
    );
}
