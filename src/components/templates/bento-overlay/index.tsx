import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import './index.scss';

interface BentoOverlayProps {
    // The dialog's accessible name
    label: string;
    onClose: () => void;
    className?: string;
    children: ReactNode;
}

/**
 * An opened tile: a panel over the board, which stays mounted and dimmed behind it, so the music,
 * the background and the visualizer carry on. Escape, the close button and a click on the dimmed
 * board all close it. The board makes itself inert while one is open.
 */
export const BentoOverlay = ({ label, onClose, className = '', children }: BentoOverlayProps) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;
    // Whatever had focus when this opened (usually the tile), read once so a re-run effect can't mistake the close button for it
    const [opener] = useState(() => document.activeElement as HTMLElement | null);

    useEffect(() => {
        closeRef.current?.focus();
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onCloseRef.current();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            opener?.focus?.();
        };
    }, [opener]);

    return createPortal(
        <div className='bento-overlay'>
            <div className='bento-overlay__scrim' onClick={onClose} aria-hidden />
            <section className={`bento-overlay__panel ${className}`} role='dialog' aria-modal='true' aria-label={label}>
                <button ref={closeRef} type='button' className='bento-overlay__close' aria-label={`Close ${label.toLowerCase()}`} onClick={onClose}>
                    <FiX />
                </button>
                {children}
            </section>
        </div>,
        document.body,
    );
};
