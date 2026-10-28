import React, { useEffect, useRef } from 'react';
import { audioLevels } from '../music-player/levels';
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
 */
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
            for (let i = 0; i < children.length; i++) {
                const mix = children.length > 1 ? i / (children.length - 1) : 0;
                const level = audioLevels.lows * (1 - mix) + audioLevels.highs * mix;
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
