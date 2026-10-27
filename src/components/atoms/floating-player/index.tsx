import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { isStreamed } from '../../../common/music';
import { useAudioStore } from '../../../store/audio';
import { MiniPlayer } from '../mini-player';
import { useVideoStore, VideoSlot } from '../youtube-player';
import './index.scss';

// Where the button can sit: the corners and the middles of the edges (never the middle of the page)
const DOCKS = ['top-left', 'top', 'top-right', 'left', 'right', 'bottom-left', 'bottom', 'bottom-right'] as const;
type Dock = (typeof DOCKS)[number];

const STORAGE_KEY = 'jakemotta:player-dock';
// Past this many pixels a press is a drag, not a click on the controls
const DRAG_THRESHOLD = 6;

const savedDock = (): Dock => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return DOCKS.find((dock) => dock === saved) ?? 'bottom-right';
    } catch {
        return 'bottom-right';
    }
};

// The page in thirds: which third the pointer let go in picks the dock. Let go in the middle third,
// and it goes to the nearer edge.
const dockAt = (x: number, y: number): Dock => {
    const column = Math.min(2, Math.floor((x / window.innerWidth) * 3));
    const row = Math.min(2, Math.floor((y / window.innerHeight) * 3));
    if (column === 1 && row === 1) {
        const dx = Math.abs(x - window.innerWidth / 2) / window.innerWidth;
        const dy = Math.abs(y - window.innerHeight / 2) / window.innerHeight;
        if (dx > dy) return x < window.innerWidth / 2 ? 'left' : 'right';
        return y < window.innerHeight / 2 ? 'top' : 'bottom';
    }
    const vertical = ['top', '', 'bottom'][row];
    const horizontal = ['left', '', 'right'][column];
    return ([vertical, horizontal].filter(Boolean).join('-') || 'bottom') as Dock;
};

/**
 * The music, wherever the Now Playing tile is out of sight: a circle of the cover, ringed with the
 * song's progress, that a click opens into the full controls and a click anywhere else closes. Drag it
 * by the cover to any corner or edge middle; it snaps there and stays there on later visits.
 */
export const FloatingPlayer = () => {
    const [dock, setDock] = useState<Dock>(savedDock);
    const [offset, setOffset] = useState<{ x: number; y: number } | null>(null);
    const [open, setOpen] = useState(false);
    const press = useRef<{ x: number; y: number; dragging: boolean } | null>(null);
    // A drag ends in a click on the cover; this lets that click through without toggling
    const justDragged = useRef(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const streamed = useAudioStore((store) => isStreamed(store.audioUrl));
    // A song from YouTube shows its video here when no player card is in sight
    const inFloating = useVideoStore((store) => store.inFloating);

    // Open, a click anywhere else closes it
    useEffect(() => {
        if (!open) return;
        const onPointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [open]);

    const toggle = () => {
        if (justDragged.current) {
            justDragged.current = false;
            return;
        }
        setOpen(!open);
    };

    const place = (next: Dock) => {
        setDock(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // Storage blocked: it just won't be remembered
        }
    };

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        // The controls keep their own clicks; the cover and anywhere else on the pill pick the player up
        if ((event.target as Element).closest('.mini-player__play, .mini-player__next, .volume-control')) return;
        // No text selection or native image drag, either of which would cancel the pointer mid-drag
        event.preventDefault();
        press.current = { x: event.clientX, y: event.clientY, dragging: false };
    };

    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const start = press.current;
        if (!start) return;
        const x = event.clientX - start.x;
        const y = event.clientY - start.y;
        if (!start.dragging && Math.hypot(x, y) < DRAG_THRESHOLD) return;
        if (!start.dragging) {
            start.dragging = true;
            // Captured only once it's a drag, so a plain click still lands on the cover button. On the pill,
            // since the wrapper itself lets the pointer through.
            (event.currentTarget.firstElementChild as HTMLElement | null)?.setPointerCapture(event.pointerId);
        }
        setOffset({ x, y });
    };

    const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        const start = press.current;
        press.current = null;
        if (start?.dragging) {
            // The click that may follow lands on the pill or the cover; either way it's gone by the next task
            justDragged.current = true;
            setTimeout(() => (justDragged.current = false));
            place(dockAt(event.clientX, event.clientY));
        }
        setOffset(null);
    };

    // A cancelled drag goes back where it was
    const onPointerCancel = () => {
        press.current = null;
        setOffset(null);
    };

    const upward = !dock.startsWith('top');

    return createPortal(
        <div
            ref={rootRef}
            className={`floating-player floating-player--${dock}${offset ? ' floating-player--dragging' : ''}`}
            style={offset ? ({ '--drag-x': `${offset.x}px`, '--drag-y': `${offset.y}px` } as React.CSSProperties) : undefined}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}>
            {streamed && <VideoSlot kind='floating' className={`floating-player__video${inFloating ? '' : ' floating-player__video--away'}`} />}
            <MiniPlayer collapsed open={open} onToggle={toggle} volume={upward ? 'up' : 'down'} className='floating-player__player' />
        </div>,
        document.body,
    );
};
