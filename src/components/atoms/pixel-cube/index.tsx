import React from 'react';
import './index.scss';

// A grass block, four by four, in the hue: g for the grass top, d for dirt, s for shade
const PIXELS = 'gdgg' + 'dgdg' + 'sdsd' + 'dsds';

/** The modpack's mark */
export const PixelCube = ({ className = '' }: { className?: string }) => (
    <span className={`pixel-cube ${className}`} aria-hidden>
        {PIXELS.split('').map((pixel, i) => (
            <span key={i} className={`pixel-cube__${pixel}`} />
        ))}
    </span>
);
