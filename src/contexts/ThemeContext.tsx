import React, { createContext, useContext, ReactNode, useLayoutEffect } from 'react';

interface ThemeContextType {
    randomStartHue: number;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Export the random hue generation so it can be used in App.tsx
export const generateRandomHue = () => Math.floor(Math.random() * 360);

/**
 * Paints the whole site in one hue by writing its colors to their CSS variables, which Tailwind's
 * primary colors and the SCSS read. It writes the DOM directly and never goes through React state: the
 * hue moves about twelve times a second, and re-rendering the app that often made everything lag.
 */
export const applyHue = (hue: number) => {
    const style = document.documentElement.style;
    style.setProperty('--color-primary', `hsl(${hue}, 40%, 60%)`);
    // The darker version, kept readable: never under 20% lightness
    style.setProperty('--color-primary-dark', `hsl(${hue}, 40%, 30%)`);
    // A pale tint, readable as text on the darker version
    style.setProperty('--color-primary-light', `hsl(${hue}, 45%, 94%)`);
    // A near-black of the hue, readable as small text straight on the page ground
    style.setProperty('--color-primary-ink', `hsl(${hue}, 45%, 15%)`);
    // The hue a third and two thirds of the way round, for charts with more series than one hue's shades can tell apart
    style.setProperty('--color-accent-1', `hsl(${(hue + 120) % 360}, 40%, 60%)`);
    style.setProperty('--color-accent-2', `hsl(${(hue + 240) % 360}, 40%, 60%)`);
};

export const ThemeProvider: React.FC<{ children: ReactNode; initialHue: number }> = ({ children, initialHue }) => {
    // Before the first paint, so nothing shows up uncolored
    useLayoutEffect(() => applyHue(initialHue), [initialHue]);

    return <ThemeContext.Provider value={{ randomStartHue: initialHue }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
