
import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

export const ColorShiftingBackground = ({ children }: { children: React.ReactNode }) => {
    const { primaryColor } = useTheme();

    return (
        <div className="h-screen flex items-center justify-center">
            {/* Color shifting background */}
            <div className='flex h-screen w-full absolute top-0 left-0 z-[-1] transition-all duration-100' style={{ backgroundColor: primaryColor }}></div>
            {children}
        </div>
    );
}