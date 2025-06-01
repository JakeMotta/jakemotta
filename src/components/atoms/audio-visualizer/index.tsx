import React, { useEffect, useRef, useState } from 'react';
import './index.scss';

interface AudioVisualizerProps {
    audioRef: React.RefObject<HTMLAudioElement>;
    audioContext: AudioContext | null;
    analyzerNode: AnalyserNode | null;
    bpm: number | null;
}

export const AudioVisualizer = ({ audioRef, audioContext, analyzerNode, bpm }: AudioVisualizerProps) => {
    const dataArrayRef = useRef<Uint8Array>();
    const animationRef = useRef<number>();
    const visualizerRef = useRef<HTMLDivElement>(null);
    const lastPulseTime = useRef<number>(0);
    const lastIntensity = useRef<number>(0);
    const [isRed, setIsRed] = useState(false);

    useEffect(() => {
        if (!analyzerNode || !visualizerRef.current) return;

        // Initialize data array if not already done
        if (!dataArrayRef.current) {
            dataArrayRef.current = new Uint8Array(analyzerNode.frequencyBinCount);
        }

        // Animation function
        const animate = () => {
            if (!analyzerNode || !dataArrayRef.current || !visualizerRef.current) return;

            const frameId = requestAnimationFrame(animate);
            if (frameId) {
                animationRef.current = frameId;
            }

            analyzerNode.getByteFrequencyData(dataArrayRef.current);

            // Get bass frequencies (first 5 bins) for better beat detection
            const bass = dataArrayRef.current.slice(0, 5);
            const bassAverage = bass.reduce((a, b) => a + b, 0) / bass.length;

            // Calculate current time for beat detection
            const now = Date.now();
            const timeSinceLastPulse = now - lastPulseTime.current;

            // Calculate pulse intensity with threshold for beat detection
            const intensity = bassAverage / 255;

            // Use BPM to determine beat timing if available
            let isBeat = false;
            if (bpm) {
                const beatInterval = (60 / bpm) * 1000; // Convert BPM to milliseconds
                isBeat = timeSinceLastPulse >= beatInterval;
            }

            if (isBeat) {
                lastPulseTime.current = now;
                lastIntensity.current = intensity;
                setIsRed(prev => !prev); // Toggle color on beat
            }

            // Smooth the intensity transition
            const smoothedIntensity = lastIntensity.current * 0.8 + intensity * 0.1;
            lastIntensity.current = smoothedIntensity;

            // Update the visualizer's box-shadow with more dramatic effect
            const baseSize = 5; // Base size when no beat
            const maxSize = 30; // Smaller max size on mobile
            const pulseSize = isBeat ? maxSize : baseSize + (maxSize - baseSize) * smoothedIntensity;

            // Add a second, outer shadow for more dramatic effect
            const outerSize = pulseSize * 1.5;
            const visualizer = visualizerRef.current;
            if (visualizer) {
                visualizer.style.boxShadow = `
                    0px 0px ${pulseSize}px ${pulseSize / 2}px rgba(0,0,0,0.5) inset,
                    0px 0px ${outerSize}px ${outerSize / 2}px rgba(0,0,0,0.3) inset
                `;
            }
        };

        if (audioRef.current && !audioRef.current?.paused) {
            animate();
        } else {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            const visualizer = visualizerRef.current;
            if (visualizer) {
                visualizer.style.boxShadow = '0px 0px 10px 5px rgba(0,0,0,0.5) inset';
            }
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [analyzerNode, bpm]);

    return (
        <div className="flex flex-col gap-4">
            <div ref={visualizerRef} className="audio-visualizer" />
            <div
                className="tempo-indicator"
                style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: isRed ? 'red' : 'black',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1000,
                }}
            />
        </div>
    );
}; 