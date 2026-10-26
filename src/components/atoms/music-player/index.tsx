import React, { useRef, useEffect } from 'react';
import { useAudioStore } from '../../../store/audio';
import { audioLevels } from './levels';

import './index.scss';

export { audioLevels } from './levels';

// A frequency band whose level is normalized against the range the current track actually uses,
// so quiet and loud masters both swing the visualizer from rest to full.
interface Band {
    fromHz: number;
    toHz: number;
    // Seconds for the level to rise / fall, and the smallest range we'll stretch to full scale
    attack: number;
    release: number;
    minRange: number;
    floor: number;
    ceiling: number;
    level: number;
}

const createBands = () => ({
    // Kick and bass: the punch of the vignette
    lows: { fromHz: 30, toHz: 150, attack: 0.02, release: 0.22, minRange: 0.12, floor: 0, ceiling: 0, level: 0 } as Band,
    // Hats, cymbals, vocal air: the shimmer on the rim
    highs: { fromHz: 4000, toHz: 12000, attack: 0.015, release: 0.12, minRange: 0.08, floor: 0, ceiling: 0, level: 0 } as Band,
});

// How fast the adaptive range forgets: the floor creeps up toward the signal, the ceiling sinks toward it
const FLOOR_RISE_SECONDS = 2.5;
const CEILING_FALL_SECONDS = 4;

const ease = (dt: number, seconds: number) => 1 - Math.exp(-dt / seconds);

const updateBand = (band: Band, data: Uint8Array, hzPerBin: number, dt: number) => {
    const from = Math.max(1, Math.floor(band.fromHz / hzPerBin));
    const to = Math.min(data.length - 1, Math.ceil(band.toHz / hzPerBin));
    let sum = 0;
    for (let i = from; i <= to; i++) sum += data[i];
    const raw = sum / (to - from + 1) / 255;

    // Track the quietest and loudest the band has been lately: snap outward, drift back in slowly
    band.floor = raw < band.floor ? raw : band.floor + (raw - band.floor) * ease(dt, FLOOR_RISE_SECONDS);
    band.ceiling = raw > band.ceiling ? raw : band.ceiling + (raw - band.ceiling) * ease(dt, CEILING_FALL_SECONDS);

    const range = Math.max(band.ceiling - band.floor, band.minRange);
    const normalized = Math.min(Math.max((raw - band.floor) / range, 0), 1);
    // Squaring keeps the troughs calm so the peaks stand out
    const target = normalized * normalized;

    band.level += (target - band.level) * ease(dt, target > band.level ? band.attack : band.release);
    return band.level;
};

/**
 * Owns the site's one <audio> element and the vignette visualizer. It has no buttons of its own:
 * every control (the board's Now Playing tile, the library, the mini players) drives the element
 * through the audio store, where this registers it.
 */
export const MusicPlayer = () => {
    const audioUrl = useAudioStore((store) => store.audioUrl);
    const playNext = useAudioStore((store) => store.playNext);
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioContext = useRef<AudioContext | null>(null);
    const analyzerNode = useRef<AnalyserNode | null>(null);
    const animationFrame = useRef<number | null>(null);
    const bands = useRef(createBands());
    const visualizerRef = useRef<HTMLDivElement>(null);

    // Hand the element to the store, and tear the audio graph down on unmount
    useEffect(() => {
        const element = audioRef.current;
        if (element) element.volume = useAudioStore.getState().volume;
        useAudioStore.setState({ audioElement: element });
        return () => {
            if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
            audioContext.current?.close();
            audioContext.current = null;
            analyzerNode.current = null;
            useAudioStore.setState({ audioElement: null, audioContext: null });
        };
    }, []);

    // The <audio> element can only ever feed one MediaElementAudioSourceNode, so the graph is
    // built once on the first track and reused for every track after it.
    const ensureAudioGraph = () => {
        if (audioContext.current || !audioRef.current) return;

        const context = new AudioContext();
        const analyzer = context.createAnalyser();
        // 2048 gives ~23Hz bins, enough to keep the kick separate from the bass line
        analyzer.fftSize = 2048;
        // Light smoothing so transients survive; the bands do their own attack/release
        analyzer.smoothingTimeConstant = 0.5;
        analyzer.minDecibels = -90;
        analyzer.maxDecibels = -10;

        context.createMediaElementSource(audioRef.current).connect(analyzer);
        analyzer.connect(context.destination);

        audioContext.current = context;
        analyzerNode.current = analyzer;
        useAudioStore.setState({ audioContext: context });

        const data = new Uint8Array(analyzer.frequencyBinCount);
        const hzPerBin = context.sampleRate / analyzer.fftSize;
        let lastTime = performance.now();

        const analyze = (now: number) => {
            animationFrame.current = requestAnimationFrame(analyze);
            if (!analyzerNode.current || !visualizerRef.current) return;

            // Clamp so a backgrounded tab doesn't jump the envelopes when it comes back
            const dt = Math.min((now - lastTime) / 1000, 0.1);
            lastTime = now;

            analyzerNode.current.getByteFrequencyData(data);
            const lows = updateBand(bands.current.lows, data, hzPerBin, dt);
            const highs = updateBand(bands.current.highs, data, hzPerBin, dt);
            audioLevels.lows = lows;
            audioLevels.highs = highs;

            // Lows push the dark vignette in; highs flicker a tighter dark rim on top of it
            const rim = `inset 0 0 ${4 + 10 * highs}px ${1 + 4 * highs}px rgba(0, 0, 0, ${(highs * 0.45).toFixed(3)})`;
            const vignette = `inset 0 0 ${8 + 28 * lows}px ${2 + 16 * lows}px rgba(0, 0, 0, ${(0.4 + 0.25 * lows).toFixed(3)})`;
            visualizerRef.current.style.boxShadow = `${rim}, ${vignette}`;
        };

        animationFrame.current = requestAnimationFrame(analyze);
    };

    // Effect to handle audio URL changes
    useEffect(() => {
        if (!audioRef.current || !audioUrl) return;

        ensureAudioGraph();
        // Each track learns its own range from scratch
        bands.current = createBands();

        // Load and play the new audio
        audioRef.current.load();

        const handleCanPlay = async () => {
            try {
                if (audioContext.current?.state === 'suspended') {
                    await audioContext.current.resume();
                }
                await audioRef.current?.play();
            } catch (error) {
                console.error('Error playing audio:', error);
            }
        };

        const audio = audioRef.current;
        audio.addEventListener('canplay', handleCanPlay, { once: true });

        return () => {
            audio.removeEventListener('canplay', handleCanPlay);
        };
    }, [audioUrl]);

    return (
        <>
            {/* Visualizer */}
            <div ref={visualizerRef} className="audio-visualizer" />

            <audio
                ref={audioRef}
                src={audioUrl}
                onPlay={() => useAudioStore.setState({ isPlaying: true })}
                onPause={() => useAudioStore.setState({ isPlaying: false })}
                onEnded={playNext}
            />
        </>
    );
};
