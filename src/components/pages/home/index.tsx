import React, { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ColorShiftingBackground } from '../../templates';
import { FloatingPlayer } from '../../atoms';
import { useAudioStore } from '../../../store/audio';
import { useCommonStore } from '../../../store/common';
import { usePageMeta } from '../../../common/seo';
import { EarsTile, FeaturedTile, HeroTile, ModpackTile, NowPlayingTile, ProjectsTile, SayHiTile, UpNextTile } from './tiles';
import './index.scss';

// The board on its own; any other path under it is an opened tile drawn over it
const BOARD_PATHS = ['/', '/home'];

/**
 * The whole site on one board. Tiles open as overlays (the routes rendered into the Outlet:
 * /library, /project, /project/:id, /minecraft), so the board stays mounted behind them.
 */
export const Home = () => {
    const { pathname } = useLocation();
    const overlayOpen = !BOARD_PATHS.includes(pathname.replace(/(.)\/+$/, '$1'));
    const waiting = useAudioStore((store) => store.entry === 'waiting');
    const boardRef = useRef<HTMLElement>(null);
    const nowRef = useRef<HTMLElement>(null);
    const [nowInView, setNowInView] = useState(true);
    usePageMeta();

    // Behind an overlay the whole board is inert; while the visitor hasn't chosen yet, everything but the Now Playing tile is.
    // A layout effect, so the board is live again before a closing overlay hands focus back to the tile that opened it.
    useLayoutEffect(() => {
        const board = boardRef.current;
        if (!board) return;
        board.toggleAttribute('inert', overlayOpen);
        board.querySelectorAll('.tile:not(.tile-now)').forEach((tile) => tile.toggleAttribute('inert', waiting));
    }, [overlayOpen, waiting]);

    // Tell the board's animations (the hue cycle in App, the particles) to rest while an overlay is up
    useEffect(() => {
        useCommonStore.setState({ overlayOpen });
    }, [overlayOpen]);

    // On phones the Now Playing tile scrolls away; the floating player takes over until it's back
    useEffect(() => {
        const tile = nowRef.current;
        if (!tile) return;
        const observer = new IntersectionObserver(([entry]) => setNowInView(entry.isIntersecting), { threshold: 0.2 });
        observer.observe(tile);
        return () => observer.disconnect();
    }, []);

    return (
        <ColorShiftingBackground>
            <main ref={boardRef} className={`bento${waiting ? ' bento--waiting' : ''}${overlayOpen ? ' bento--behind' : ''}`}>
                {waiting && (
                    <span className='bento__shh' aria-hidden>
                        psst… sound or silence
                    </span>
                )}
                <HeroTile />
                <NowPlayingTile ref={nowRef} />
                <FeaturedTile />
                <UpNextTile />
                <ProjectsTile />
                <ModpackTile />
                <EarsTile />
                <SayHiTile />
            </main>

            {/* The music, wherever the Now Playing tile is out of sight: behind an overlay, or scrolled away on a phone. It hides itself while nothing plays. */}
            {!waiting && (overlayOpen || !nowInView) && <FloatingPlayer />}

            {/* The overlays load in their own chunks (App.tsx); nothing shows until the one asked for arrives */}
            <Suspense fallback={null}>
                <Outlet />
            </Suspense>
        </ColorShiftingBackground>
    );
};
