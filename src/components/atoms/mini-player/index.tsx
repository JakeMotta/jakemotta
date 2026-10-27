import React, { useEffect, useRef } from 'react';
import { MdPause, MdPlayArrow, MdSkipNext } from 'react-icons/md';
import { useAudioStore } from '../../../store/audio';
import { findTrack } from '../../../common/music';
import { CoverArt } from '../cover-art';
import { EqBars } from '../eq-bars';
import { VolumeControl } from '../volume-control';
import './index.scss';

const RING_RADIUS = 25;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

// How far through the song it is, drawn round the cover. Like the visualizer, it's written straight
// onto the circle every frame through a ref, never through React state.
const ProgressRing = () => {
    const fillRef = useRef<SVGCircleElement>(null);

    useEffect(() => {
        let frame = 0;
        const tick = () => {
            const element = useAudioStore.getState().audioElement;
            const progress = element && element.duration ? element.currentTime / element.duration : 0;
            if (fillRef.current) fillRef.current.style.strokeDashoffset = String(RING_LENGTH * (1 - progress));
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <svg className='mini-player__ring' viewBox='0 0 54 54' aria-hidden>
            <circle className='mini-player__ring-track' cx='27' cy='27' r={RING_RADIUS} />
            <circle ref={fillRef} className='mini-player__ring-fill' cx='27' cy='27' r={RING_RADIUS} strokeDasharray={RING_LENGTH} strokeDashoffset={RING_LENGTH} />
        </svg>
    );
};

interface MiniPlayerProps {
    className?: string;
    // Which way the volume slider opens: up by default, down near the top of the screen
    volume?: 'up' | 'down';
    // Just the cover, as a circle with the song's progress round it; a click on it opens the rest
    collapsed?: boolean;
    open?: boolean;
    onToggle?: () => void;
}

/**
 * The playing track in a pill: cover, bars, title, play/pause, next and volume. Collapsed, it's the
 * floating player (atoms/floating-player): the cover alone until it's clicked open.
 */
export const MiniPlayer = ({ className = '', volume = 'up', collapsed = false, open = false, onToggle }: MiniPlayerProps) => {
    const audioUrl = useAudioStore((store) => store.audioUrl);
    const isPlaying = useAudioStore((store) => store.isPlaying);
    const togglePlayback = useAudioStore((store) => store.togglePlayback);
    const playNext = useAudioStore((store) => store.playNext);
    const track = findTrack(audioUrl);

    return (
        <div className={`mini-player${collapsed ? ' mini-player--collapsed' : ''}${collapsed && open ? ' mini-player--open' : ''} ${className}`}>
            {collapsed ? (
                <button type='button' className='mini-player__disc' aria-label={open ? 'Hide the music controls' : 'Show the music controls'} aria-expanded={open} onClick={onToggle}>
                    <CoverArt track={track} className='mini-player__cover' />
                    <ProgressRing />
                </button>
            ) : (
                <span className='mini-player__disc'>
                    <CoverArt track={track} className='mini-player__cover' />
                </span>
            )}
            <EqBars className='mini-player__eq' />
            <span className='mini-player__title'>{track ? track.title : 'Press play for music'}</span>
            <button type='button' className='mini-player__play' aria-label={isPlaying ? 'Pause' : 'Play'} onClick={togglePlayback}>
                {isPlaying ? <MdPause /> : <MdPlayArrow />}
            </button>
            <button type='button' className='mini-player__next' aria-label='Next track' onClick={playNext}>
                <MdSkipNext />
            </button>
            <VolumeControl direction={volume} className='mini-player__volume' />
        </div>
    );
};
