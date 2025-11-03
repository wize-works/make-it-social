'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
    // Initialize theme from localStorage or system preference
    const [theme, setTheme] = useState<'light-fish' | 'dark'>(() => {
        if (typeof window === 'undefined') return 'light-fish';

        const savedTheme = localStorage.getItem('theme') as 'light-fish' | 'dark' | null;
        if (savedTheme) return savedTheme;

        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light-fish';
    });

    // Apply theme and save to localStorage
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light-fish' ? 'dark' : 'light-fish');
    };

    return (
        <label className="swap swap-rotate">
            {/* Hidden checkbox controls the state */}
            <input
                type="checkbox"
                className="theme-controller"
                value="dark"
                checked={theme === 'dark'}
                onChange={toggleTheme}
                aria-label="Toggle theme"
            />

            {/* Sun icon (shows when light-fish theme is active) */}
            <i className='fa-solid fa-duotone fa-sun fa-xl swap-on' />

            {/* Moon icon (shows when dark theme is active) */}
            <i className='fa-solid fa-duotone fa-moon fa-xl swap-off' />
        </label>
    );
}
