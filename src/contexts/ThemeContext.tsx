import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';

interface ThemeContextType {
    primaryColor: string;
    primaryDark: string;
    setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to parse HSL string
const parseHsl = (hsl: string): [number, number, number] => {
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return [0, 0, 0];
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
};

// Helper function to create darker version of a color
const createDarkerColor = (hsl: string): string => {
    const [h, s, l] = parseHsl(hsl);
    // Adjust lightness to ensure readability
    const newL = Math.max(20, l - 30); // Ensure minimum lightness of 20%
    return `hsl(${h}, ${s}%, ${newL}%)`;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [primaryColor, setPrimaryColor] = useState('#E6B3B3');

    // Calculate primaryDark whenever primaryColor changes
    const primaryDark = useMemo(() => {
        return createDarkerColor(primaryColor);
    }, [primaryColor]);

    // Update CSS variables when colors change, this is needed for tailwind to get the color changes
    useEffect(() => {
        document.documentElement.style.setProperty('--color-primary', primaryColor);
        document.documentElement.style.setProperty('--color-primary-dark', primaryDark);
    }, [primaryColor, primaryDark]);

    return (
        <ThemeContext.Provider value={{ primaryColor, primaryDark, setPrimaryColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 