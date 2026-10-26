import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';

interface ThemeContextType {
    randomStartHue: number;
    primaryColor: string;
    primaryDark: string;
    setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Export the random hue generation so it can be used in App.tsx
export const generateRandomHue = () => Math.floor(Math.random() * 360);

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

// Helper function to create a pale tint of a color, readable as text on the darker version
const createLighterColor = (hsl: string): string => {
    const [h] = parseHsl(hsl);
    return `hsl(${h}, 45%, 94%)`;
};

// Helper function to create a near-black of the hue, readable as small text straight on the page ground
const createInkColor = (hsl: string): string => {
    const [h] = parseHsl(hsl);
    return `hsl(${h}, 45%, 15%)`;
};

export const ThemeProvider: React.FC<{ children: ReactNode; initialHue: number }> = ({ children, initialHue }) => {
    const [primaryColor, setPrimaryColor] = useState(`hsl(${initialHue}, 40%, 60%)`);

    // Calculate primaryDark whenever primaryColor changes
    const primaryDark = useMemo(() => {
        return createDarkerColor(primaryColor);
    }, [primaryColor]);

    const primaryLight = useMemo(() => {
        return createLighterColor(primaryColor);
    }, [primaryColor]);

    const primaryInk = useMemo(() => {
        return createInkColor(primaryColor);
    }, [primaryColor]);

    // Update CSS variables when colors change, this is needed for tailwind to get the color changes
    useEffect(() => {
        document.documentElement.style.setProperty('--color-primary', primaryColor);
        document.documentElement.style.setProperty('--color-primary-dark', primaryDark);
        document.documentElement.style.setProperty('--color-primary-light', primaryLight);
        document.documentElement.style.setProperty('--color-primary-ink', primaryInk);
    }, [primaryColor, primaryDark, primaryLight, primaryInk]);

    return (
        <ThemeContext.Provider value={{ randomStartHue: initialHue, primaryColor, primaryDark, setPrimaryColor }}>
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