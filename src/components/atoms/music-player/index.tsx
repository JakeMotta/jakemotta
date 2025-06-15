import React, { useRef, useEffect, useState } from 'react';
import { useAudioStore } from '../../../store/audio';
import { Button, Slider } from 'antd';
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa';

import './index.scss';

export const MusicPlayer = () => {
    const audioUrl = useAudioStore((store) => store.audioUrl);
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioContext = useRef<AudioContext | null>(null);
    const sourceNode = useRef<MediaElementAudioSourceNode | null>(null);
    const analyzerNode = useRef<AnalyserNode | null>(null);
    const animationFrame = useRef<number | null>(null);
    const [beatStrength, setBeatStrength] = useState(0);
    const dataArrayRef = useRef<Uint8Array>();
    const visualizerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isHovering, setIsHovering] = useState(false);

    // Clean up function
    const cleanup = () => {
        if (animationFrame.current) {
            cancelAnimationFrame(animationFrame.current);
            animationFrame.current = null;
        }
        if (sourceNode.current) {
            sourceNode.current.disconnect();
            sourceNode.current = null;
        }
        if (analyzerNode.current) {
            analyzerNode.current.disconnect();
            analyzerNode.current = null;
        }
        if (audioContext.current) {
            audioContext.current.close();
            audioContext.current = null;
        }
        setBeatStrength(0);
    };

    // Clean up on unmount
    useEffect(() => {
        return cleanup;
    }, []);

    // Effect to handle audio URL changes
    useEffect(() => {
        if (!audioRef.current || !audioUrl) return;

        // Clean up existing audio context and nodes
        cleanup();

        // Create new audio context
        audioContext.current = new AudioContext();

        // Create new audio graph
        sourceNode.current = audioContext.current.createMediaElementSource(audioRef.current);
        analyzerNode.current = audioContext.current.createAnalyser();
        analyzerNode.current.fftSize = 1024;

        // Connect nodes
        sourceNode.current.connect(analyzerNode.current);
        analyzerNode.current.connect(audioContext.current.destination);

        // Initialize data array
        if (analyzerNode.current) {
            dataArrayRef.current = new Uint8Array(analyzerNode.current.frequencyBinCount);
        }

        const analyze = () => {
            if (!analyzerNode.current || !dataArrayRef.current || !visualizerRef.current) return;

            analyzerNode.current.getByteFrequencyData(dataArrayRef.current);

            // Get bass frequencies (first 5 bins) for better beat detection
            const bass = dataArrayRef.current.slice(0, 5);
            const bassAverage = bass.reduce((sum: number, val: number) => sum + val, 0) / bass.length;
            const normalized = Math.min(bassAverage / 255, 1);

            // Update visualizer pulse
            const baseSize = 2;
            const maxSize = 15;
            const spreadSize = 5;
            const pulseSize = baseSize + (maxSize - baseSize) * normalized;

            visualizerRef.current.style.boxShadow = `
                0px 0px ${spreadSize}px ${pulseSize}px rgba(0, 0, 0, .5) inset
            `;

            animationFrame.current = requestAnimationFrame(analyze);

            // Update beat strength
            setBeatStrength(normalized);
        };

        // Start the visualization
        analyze();

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

        audioRef.current.addEventListener('canplay', handleCanPlay);

        return () => {
            cleanup();
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
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
                        icon={audioRef.current?.paused ? <FaPlayCircle /> : <FaPauseCircle />}
                        onClick={togglePlayback}
                        className="music-control text-2xl"
                    />}
                </div>
                <audio ref={audioRef} src={audioUrl} />
            </div>


            {/* For debugging beat detection */}
            {/* <div className="beat-tracker" style={{ backgroundColor: `rgb(${Math.round(beatStrength * 255)}, 0, 0)` }} /> */}
        </>
    );
}; 