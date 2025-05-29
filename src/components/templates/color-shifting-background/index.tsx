
import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import './index.scss';

export const ColorShiftingBackground = ({ children }: { children: React.ReactNode }) => {
    const { primaryColor } = useTheme();

    return (
        <div className="h-screen flex items-center justify-center">
            {/* {musicEnabled && <div className={`overlay-music-player-pulse ${isMusicPlaying ? 'opacity-100' : 'opacity-0'}`} />} */}
            {/* Color shifting background */}
            <div className='flex h-screen w-full absolute top-0 left-0 z-[-1] transition-all duration-100' style={{ backgroundColor: primaryColor }}></div>
            {children}
        </div>
    );
}