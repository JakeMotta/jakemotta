import React, { useEffect, useRef } from 'react';
import { useAudioStore } from '../../../store/audio';
import './index.scss';

const SCALE = 1000;

const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

/**
 * How far into the track we are, as a slider you can drag or arrow through to seek. Its position
 * is written in an animation loop straight onto the input, like the visualizer, not through state.
 */
export const TrackProgress = ({ className = '' }: { className?: string }) => {
    const audioElement = useAudioStore((store) => store.audioElement);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let frame = 0;
        let lastText = '';
        const draw = () => {
            frame = requestAnimationFrame(draw);
            const input = inputRef.current;
            if (!input || !audioElement) return;
            const { currentTime, duration } = audioElement;
            const progress = duration > 0 && Number.isFinite(duration) ? currentTime / duration : 0;
            // Leave the value alone while the visitor is dragging it
            if (document.activeElement !== input) input.value = String(Math.round(progress * SCALE));
            input.style.setProperty('--fill', `${(progress * 100).toFixed(2)}%`);
            const text = duration > 0 && Number.isFinite(duration) ? `${formatTime(currentTime)} of ${formatTime(duration)}` : 'Not started';
            if (text !== lastText) {
                input.setAttribute('aria-valuetext', text);
                lastText = text;
            }
        };
        frame = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frame);
    }, [audioElement]);

    const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!audioElement || !Number.isFinite(audioElement.duration)) return;
        audioElement.currentTime = (Number(event.target.value) / SCALE) * audioElement.duration;
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
