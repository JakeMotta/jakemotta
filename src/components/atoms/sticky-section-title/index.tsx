import React, { useEffect, useRef, useState } from 'react';

const SCROLL_ROOT_ATTR = 'data-scroll-root';

interface StickySectionTitleProps {
    children: React.ReactNode;
}

/**
 * Sentinel + IntersectionObserver so `.section-title--stuck` applies only while
 * the sticky header is pinned (content scrolls behind it).
 */
export const StickySectionTitle = ({ children }: StickySectionTitleProps) => {
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [isStuck, setIsStuck] = useState(false);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const root = sentinel.closest(`[${SCROLL_ROOT_ATTR}]`) as HTMLElement | null;
        if (!root) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const rootRect = root.getBoundingClientRect();
                const stuck =
                    !entry.isIntersecting && entry.boundingClientRect.top < rootRect.top;
                setIsStuck(stuck);
            },
            { root, threshold: [0] }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div
                ref={sentinelRef}
                className="pointer-events-none h-px w-full shrink-0"
                aria-hidden
            />
            <div
                className={`section-title${isStuck ? ' section-title--stuck' : ''}`}
            >
                {children}
            </div>
        </>
    );
};
