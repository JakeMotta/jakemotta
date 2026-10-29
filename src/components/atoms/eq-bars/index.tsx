import React, { useEffect, useRef } from 'react';
import { audioLevels } from '../music-player/levels';
import { useAudioStore } from '../../../store/audio';
import { isStreamed } from '../../../common/music';
import './index.scss';

interface EqBarsProps {
    bars?: number;
    className?: string;
}

/**
 * A few bars that bounce with the track that's actually playing: the first follows the lows, the
 * last the highs, and the ones between blend the two. Like the vignette, they're drawn in an
 * animation loop straight onto the DOM, never through React state, and only when a bar has moved:
 * each write restyles the page, which a slow device feels.
 *
 * A song from YouTube never reaches the analyser (its sound stays in YouTube's frame), so while one
 * plays the bars dance to a made-up beat instead: a few sine waves per bar, out of step with each
 * other (Jake, 2026-10-29).
 */
// A bar's level, 0 to 1, for a song whose sound can't be measured: a slow swell, a quicker bounce and
// a flicker, each bar at its own speeds, so they never move together
const pretendLevel = (t: number, bar: number) => {
    const level = 0.5 + 0.25 * Math.sin(t * (2.1 + bar * 0.7) + bar * 1.9) + 0.2 * Math.sin(t * (7.3 + bar * 1.3) + bar) + 0.1 * Math.sin(t * (13.7 - bar * 2.1));
    return Math.min(1, Math.max(0, level));
};

export const EqBars = ({ bars = 3, className = '' }: EqBarsProps) => {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        let frame = 0;
        const shown: string[] = [];
        const draw = () => {
            frame = requestAnimationFrame(draw);
            const element = ref.current;
            // Behind an overlay the board is inert, and its bars can't be seen
            if (!element || element.closest('[inert]')) return;
            const children = element.children;
            const { audioUrl, isPlaying } = useAudioStore.getState();
            const pretend = isPlaying && isStreamed(audioUrl);
            const t = performance.now() / 1000;
            for (let i = 0; i < children.length; i++) {
                const mix = children.length > 1 ? i / (children.length - 1) : 0;
                const level = pretend ? pretendLevel(t, i) : audioLevels.lows * (1 - mix) + audioLevels.highs * mix;
                const transform = `scaleY(${(0.2 + 0.8 * level).toFixed(2)})`;
                if (transform === shown[i]) continue;
                shown[i] = transform;
                (children[i] as HTMLElement).style.transform = transform;
            }
        };
        frame = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <span ref={ref} className={`eq-bars ${className}`} aria-hidden>
            {Array.from({ length: bars }, (_, i) => (
                <span key={i} />
            ))}
        </span>
    );
};
