import React, { useRef, useEffect, useState } from 'react';
import { useAudioStore } from '../../../store/audio';
import { Button } from 'antd';
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa';
import { createRealTimeBpmProcessor, getBiquadFilter } from 'realtime-bpm-analyzer';
import { AudioVisualizer } from '../audio-visualizer';

import './index.scss';

export const MusicPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioContext = useRef<AudioContext | null>(null);
    const sourceNode = useRef<MediaElementAudioSourceNode | null>(null);
    const analyzerNode = useRef<AnalyserNode | null>(null);
    const [bpm, setBpm] = useState<number | null>(null);
    const audioUrl = useAudioStore((store) => store.audioUrl);

    // Initialize audio context
    useEffect(() => {
        if (!audioContext.current) {
            audioContext.current = new AudioContext();
        }

        return () => {
            if (sourceNode.current) {
                sourceNode.current.disconnect();
            }
            if (audioContext.current) {
                audioContext.current.close();
                audioContext.current = null;
            }
        };
    }, []);

    // Effect to handle audio URL changes
    useEffect(() => {
        if (!audioRef.current || !audioUrl || !audioContext.current) return;

        // Load the new audio
        audioRef.current.load();

        analyzeBPM();

        // Wait for the audio to be loaded before playing
        const handleCanPlay = () => {
            if (audioUrl) {
                audioRef.current?.play().catch(error => {
                    console.error('Error playing audio:', error);
                });
            }
        };

        audioRef.current.addEventListener('canplay', handleCanPlay);

        return () => {
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            if (sourceNode.current) {
                sourceNode.current.disconnect();
                sourceNode.current = null;
            }
            if (analyzerNode.current) {
                analyzerNode.current.disconnect();
                analyzerNode.current = null;
            }
            setBpm(null);
        };
    }, [audioUrl]);

    const analyzeBPM = async () => {
        if (!audioContext.current) return;

        const realtimeAnalyzerNode = await createRealTimeBpmProcessor(audioContext.current);

        // Set the source with the HTML Audio Node
        const myAudioElement = document.getElementById('audio-element');
        if (!myAudioElement) return;

        // Clean up previous source node if it exists
        if (sourceNode.current) {
            sourceNode.current.disconnect();
            sourceNode.current = null;
        }

        // Create analyzer node for visualization
        analyzerNode.current = audioContext.current.createAnalyser();
        analyzerNode.current.fftSize = 256;
        analyzerNode.current.smoothingTimeConstant = 0.8;

        sourceNode.current = audioContext.current.createMediaElementSource(myAudioElement as HTMLMediaElement);
        const lowpass = getBiquadFilter(audioContext.current);

        // Connect nodes together
        sourceNode.current.connect(lowpass).connect(realtimeAnalyzerNode);
        sourceNode.current.connect(analyzerNode.current); // Connect to analyzer for visualization
        sourceNode.current.connect(audioContext.current.destination);

        realtimeAnalyzerNode.port.onmessage = (event) => {
            if (event.data.message === 'BPM') {
                console.log('BPM', event.data.data.bpm);
                setBpm(event.data.data.bpm);
            }
            // if (event.data.message === 'BPM_STABLE') {
            //     console.log('BPM_STABLE', event.data.data.bpm);
            //     setBpm(event.data.data.bpm);
            // }
        };
    }

    // Effect to handle audio playback
    const togglePlayback = () => {
        if (audioRef.current && audioUrl) {
            if (audioRef.current.paused) {
                console.log('hit play');
                audioRef.current.play().catch(error => {
                    console.error('Error playing audio:', error);
                });
            } else {
                console.log('hit pause');
                audioRef.current.pause();
            }
        }
    };

    return (
        <>
            {/* Music visualizer */}
            <AudioVisualizer
                audioRef={audioRef}
                audioContext={audioContext.current}
                analyzerNode={analyzerNode.current}
                bpm={bpm}
            />

            <div className="music-player">
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    id="audio-element"
                    className="hidden"
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