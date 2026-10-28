import React, { useEffect, useRef } from 'react';
import { useAudioStore } from '../../../store/audio';
import './index.scss';

const SCALE = 1000;

const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

/**
 * How far into the track we are, as a slider you can drag or arrow through to seek. Its position
 * is written in an animation loop straight onto the input, like the visualizer, not through state,
 * and only when it has moved.
 */
export const TrackProgress = ({ className = '' }: { className?: string }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let frame = 0;
        let lastText = '';
        let lastFill = '';
        const draw = () => {
            frame = requestAnimationFrame(draw);
            const input = inputRef.current;
            const media = useAudioStore.getState().media();
            if (!input || !media || input.closest('[inert]')) return;
            const { currentTime, duration } = media;
            const progress = duration > 0 && Number.isFinite(duration) ? currentTime / duration : 0;
            const value = String(Math.round(progress * SCALE));
            // Leave the value alone while the visitor is dragging it
            if (document.activeElement !== input && input.value !== value) input.value = value;
            const fill = `${(progress * 100).toFixed(1)}%`;
            if (fill !== lastFill) {
                input.style.setProperty('--fill', fill);
                lastFill = fill;
            }
            const text = duration > 0 && Number.isFinite(duration) ? `${formatTime(currentTime)} of ${formatTime(duration)}` : 'Not started';
            if (text !== lastText) {
                input.setAttribute('aria-valuetext', text);
                lastText = text;
            }
        };
        frame = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frame);
    }, []);

    const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
        const media = useAudioStore.getState().media();
        if (!media || !Number.isFinite(media.duration)) return;
        media.currentTime = (Number(event.target.value) / SCALE) * media.duration;
    };

    return <input ref={inputRef} className={`range-slider ${className}`} type='range' min={0} max={SCALE} defaultValue={0} aria-label='Seek' onChange={seek} />;
};

/** The player's volume, 0 to 100 */
export const VolumeSlider = ({ id, className = '' }: { id?: string; className?: string }) => {
    const volume = useAudioStore((store) => store.volume);
    const setVolume = useAudioStore((store) => store.setVolume);
    const percent = Math.round(volume * 100);

    return (
        <input
            id={id}
            className={`range-slider ${className}`}
            type='range'
            min={0}
            max={100}
            value={percent}
            aria-label={id ? undefined : 'Volume'}
            style={{ '--fill': `${percent}%` } as React.CSSProperties}
            onChange={(event) => setVolume(Number(event.target.value) / 100)}
        />
    );
};
