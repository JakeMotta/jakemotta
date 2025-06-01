import React, { useRef, useEffect, useState } from 'react';
import { useAudioStore } from '../../../store/audio';
import { Button } from 'antd';
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

        // Start visualization
        const bufferLength = analyzerNode.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const analyze = () => {
            if (!analyzerNode.current) return;

            analyzerNode.current.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            const normalized = Math.min(avg / 128, 1);
            setBeatStrength(normalized);

            animationFrame.current = requestAnimationFrame(analyze);
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

    const beatColor = `rgb(${Math.round(beatStrength * 255)}, 0, 0)`;

    return (
        <>
            <div className="music-player">
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    id="audio-element"
                    className="hidden"
                    key={audioUrl}
                />
                <div
                    className="beat-tracker"
                    style={{ backgroundColor: beatColor }}
                />
                {audioUrl && <Button
                    type="text"
                    icon={audioRef.current?.paused ? <FaPlayCircle /> : <FaPauseCircle />}
                    onClick={togglePlayback}
                    className="music-control text-2xl"
                />}
            </div>
        </>
    );
}; 