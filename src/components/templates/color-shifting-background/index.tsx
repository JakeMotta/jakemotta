
import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import './index.scss';

export const ColorShiftingBackground = ({ children }: { children: React.ReactNode }) => {
    const { primaryColor } = useTheme();

    return (
        <div
            className="flex flex-col h-screen w-full overflow-auto"
            data-scroll-root
        >
            {/* Color shifting background */}
            <div className='flex h-screen w-full absolute top-0 left-0 -z-2 transition-all duration-100' style={{ backgroundColor: primaryColor }}></div>
            <div className='z-10'>
                {children}
            </div>
        </div>
    );
}