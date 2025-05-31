import React, { useEffect, useRef, useState } from 'react';
import { useCommonStore } from '../../../store/common';
import { useAudioStore } from '../../../store/audio';
import './index.scss';

export const AudioVisualizer = () => {
    const isMusicPlaying = useCommonStore((store) => store.isMusicPlaying);
    const { audioContext, analyser } = useAudioStore();
    const dataArrayRef = useRef<Uint8Array>();
    const animationRef = useRef<number>();
    const visualizerRef = useRef<HTMLDivElement>(null);
    const lastPulseTime = useRef<number>(0);
    const lastIntensity = useRef<number>(0);

    useEffect(() => {
        if (!analyser || !visualizerRef.current) return;

        // Initialize data array if not already done
        if (!dataArrayRef.current) {
            dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
        }

        // Animation function
        const animate = () => {
            if (!analyser || !dataArrayRef.current || !visualizerRef.current) return;

            animationRef.current = requestAnimationFrame(animate);
            analyser.getByteFrequencyData(dataArrayRef.current);

            // Get bass frequencies (first 5 bins) for better beat detection
            const bass = dataArrayRef.current.slice(0, 5);
            const bassAverage = bass.reduce((a, b) => a + b, 0) / bass.length;

            // Calculate current time for beat detection
            const now = Date.now();
            const timeSinceLastPulse = now - lastPulseTime.current;

            // Calculate pulse intensity with threshold for beat detection
            const intensity = bassAverage / 255;
            const threshold = 0.3; // Adjust this value to change sensitivity
            const isBeat = intensity > threshold && timeSinceLastPulse > 100; // Minimum 100ms between beats

            if (isBeat) {
                lastPulseTime.current = now;
                lastIntensity.current = intensity;
            }

            // Smooth the intensity transition
            const smoothedIntensity = lastIntensity.current * 0.8 + intensity * 0.2;
            lastIntensity.current = smoothedIntensity;

            // Update the visualizer's box-shadow with more dramatic effect
            const baseSize = 10; // Base size when no beat
            const maxSize = window.innerWidth < 768 ? 20 : 20; // Smaller max size on mobile
            const pulseSize = isBeat ? maxSize : baseSize + (maxSize - baseSize) * smoothedIntensity;

            // Add a second, outer shadow for more dramatic effect
            const outerSize = pulseSize * 1.5;
            visualizerRef.current.style.boxShadow = `
                0px 0px ${pulseSize}px ${pulseSize / 2}px rgba(0,0,0,0.5) inset,
                0px 0px ${outerSize}px ${outerSize / 2}px rgba(0,0,0,0.3) inset
            `;
        };

        if (isMusicPlaying) {
            animate();
        } else {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (visualizerRef.current) {
                visualizerRef.current.style.boxShadow = '0px 0px 10px 5px rgba(0,0,0,0.5) inset';
            }
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isMusicPlaying, audioContext, analyser]);

    return (
        <div ref={visualizerRef} className="audio-visualizer" />
    );
}; 