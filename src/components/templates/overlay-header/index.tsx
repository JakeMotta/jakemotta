import React, { ReactNode } from 'react';
import './index.scss';

interface OverlayHeaderProps {
    title: string;
    titleId?: string;
    subtitle?: string;
    // Before the title: the modpack's pixel cube
    lead?: ReactNode;
    // After the title, on its line: the library's tabs
    children?: ReactNode;
}

/**
 * Every overlay's header: the title on one line with the overlay's close button, anything that belongs
 * beside it, and the subtitle under that line. The music is the floating player (atoms/floating-player).
 */
export const OverlayHeader = ({ title, titleId, subtitle, lead, children }: OverlayHeaderProps) => (
    <header className='overlay-header'>
        <div className='overlay-header__row'>
            {lead}
            <h2 id={titleId} className='overlay-header__title'>
                {title}
            </h2>
            {children}
        </div>
        {subtitle && <p className='overlay-header__subtitle'>{subtitle}</p>}
    </header>
);
