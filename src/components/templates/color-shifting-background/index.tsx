
import React from 'react';
import './index.scss';

export const ColorShiftingBackground = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            className="flex flex-col h-screen w-full overflow-auto"
            data-scroll-root
        >
            {/* Color shifting background: the hue's CSS variable, so it changes without a re-render. No transition, which would repaint it every frame */}
            <div className='flex h-screen w-full absolute top-0 left-0 -z-2' style={{ backgroundColor: 'var(--color-primary)' }}></div>
            <div className='z-10'>
                {children}
            </div>
        </div>
    );
}