import React, { useRef, useEffect, useState } from 'react';
import { useAudioStore } from '../../../store/audio';
import { Button, Slider } from 'antd';
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa';

import './index.scss';

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

export const MusicPlayer = () => {
    const audioUrl = useAudioStore((store) => store.audioUrl);
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioContext = useRef<AudioContext | null>(null);
    const analyzerNode = useRef<AnalyserNode | null>(null);
    const animationFrame = useRef<number | null>(null);
    const bands = useRef(createBands());
    const visualizerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isHovering, setIsHovering] = useState(false);

    // Tear the audio graph down on unmount
    useEffect(() => {
        return () => {
            if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
            audioContext.current?.close();
            audioContext.current = null;
            analyzerNode.current = null;
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
                if (audioContext.current?.state === "suspended") {
                    await audioContext.current.resume();
                }
                await audioRef.current?.play();
            } catch (error) {
                console.error('Error playing audio:', error);
            }
        };

        const audio = audioRef.current;
        audio.addEventListener('canplay', handleCanPlay);

        return () => {
            audio.removeEventListener('canplay', handleCanPlay);
        };
    }, [audioUrl]);

    const togglePlayback = async () => {
        if (!audioRef.current || !audioUrl) return;

        try {
            if (audioRef.current.paused) {
                if (audioContext.current?.state === "suspended") {
                    await audioContext.current.resume();
                }
                await audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        } catch (error) {
            console.error("Error toggling playback:", error);
        }
    };

    const handleVolumeChange = (value: number) => {
        if (audioRef.current) {
            audioRef.current.volume = value;
            setVolume(value);
        }
    };

    return (
        <>
            {/* Visualizer */}
            <div ref={visualizerRef} className="audio-visualizer" />

            {/* Player */}
            {/* <div className="music-player">
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    id="audio-element"
                    className="hidden"
                    key={audioUrl}
                />

                {audioUrl && <Button
                    type="text"
                    icon={audioRef.current?.paused ? <FaPlayCircle /> : <FaPauseCircle />}
                    onClick={togglePlayback}
                    className="music-control text-2xl"
                />}
            </div> */}

            <div className="fixed bottom-4 right-6 z-50">
                <div
                    className="relative"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {isHovering && (
                        <div className="absolute bottom-full -right-2 p-2 rounded-lg">
                            <Slider
                                vertical
                                min={0}
                                max={1}
                                step={0.01}
                                value={volume}
                                onChange={handleVolumeChange}
                                tooltip={{ open: false }}
                                className="h-24"
                            />
                        </div>
                    )}
                    {audioUrl && <Button
                        type="text"
                        icon={isPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
                        onClick={togglePlayback}
                        className="music-control text-2xl"
                    />}
                </div>
                <audio ref={audioRef} src={audioUrl} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
            </div>
        </>
    );
};
