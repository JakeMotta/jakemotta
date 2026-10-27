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
    const panelRef = useRef<HTMLElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;
    // Whatever had focus when this opened (usually the tile), read once so a re-run effect can't mistake the close button for it
    const [opener] = useState(() => document.activeElement as HTMLElement | null);

    useEffect(() => {
        const panel = panelRef.current;
        closeRef.current?.focus();
        // Leave Escape alone when something on the page already used it, like a framed site closing its own lightbox,
        // or when a framed page has a <dialog> open: the browser closes that on Escape without marking the key used
        const onKeyDown = (event: KeyboardEvent) => {
            const dialogOpen = (event.currentTarget as Document).querySelector('dialog[open]');
            if (event.key === 'Escape' && !event.defaultPrevented && !dialogOpen) onCloseRef.current();
        };
        // Keys pressed inside a framed page (a project preview) go to that page's document, not this one, so
        // listen there too, each time the frame loads a page. A cross-origin frame (a live site) can't be reached.
        const listenInFrame = (event: Event) => {
            if (event.target instanceof HTMLIFrameElement) event.target.contentDocument?.addEventListener('keydown', onKeyDown);
        };
        document.addEventListener('keydown', onKeyDown);
        // load doesn't bubble, so catch the frames' load events on the way down
        panel?.addEventListener('load', listenInFrame, true);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            panel?.removeEventListener('load', listenInFrame, true);
            opener?.focus?.();
        };
    }, [opener]);

    return createPortal(
        <div className='bento-overlay'>
            <div className='bento-overlay__scrim' onClick={onClose} aria-hidden />
            <section ref={panelRef} className={`bento-overlay__panel ${className}`} role='dialog' aria-modal='true' aria-label={label}>
                <button ref={closeRef} type='button' className='bento-overlay__close' aria-label={`Close ${label.toLowerCase()}`} onClick={onClose}>
                    <FiX />
                </button>
                {children}
            </section>
        </div>,
        document.body,
    );
};
