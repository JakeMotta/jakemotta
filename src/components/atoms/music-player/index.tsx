import React, { useRef, useEffect } from 'react';
import { useCommonStore } from '../../../store/common';
import { useAudioStore } from '../../../store/audio';
import { Button } from 'antd';
import { SoundOutlined, PauseOutlined } from '@ant-design/icons';
import './index.scss';

export const MusicPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const isMusicPlaying = useCommonStore((store) => store.isMusicPlaying);
    const setIsMusicPlaying = useCommonStore((store) => store.setIsMusicPlaying);
    const { audioContext, setAudioContext, analyser, setAnalyser, source, setSource } = useAudioStore();

    useEffect(() => {
        if (!audioRef.current) return;

        // Initialize audio context if not already done
        if (!audioContext) {
            const context = new AudioContext();
            setAudioContext(context);
        }

        // Set up analyzer if not already done
        if (audioContext && !analyser) {
            const analyzer = audioContext.createAnalyser();
            analyzer.fftSize = 512;
            analyzer.smoothingTimeConstant = 0.8;
            setAnalyser(analyzer);
        }

        // Connect audio to analyzer if not already done
        if (audioContext && analyser && !source) {
            const audioSource = audioContext.createMediaElementSource(audioRef.current);
            audioSource.connect(analyser);
            analyser.connect(audioContext.destination);
            setSource(audioSource);
        }

        return () => {
            // Cleanup will be handled by the AudioVisualizer
        };
    }, [audioContext, analyser, source, setAudioContext, setAnalyser, setSource]);

    useEffect(() => {
        if (audioRef.current) {
            if (isMusicPlaying) {
                audioRef.current.play().catch(error => {
                    console.error('Error playing audio:', error);
                    setIsMusicPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isMusicPlaying, setIsMusicPlaying]);

    const togglePlayback = () => {
        setIsMusicPlaying(!isMusicPlaying);
    };

    return (
        <div className="music-player">
            <audio
                ref={audioRef}
                src="/dancin.mp3"
                loop
                className="hidden"
            />
            <Button
                type="text"
                icon={isMusicPlaying ? <PauseOutlined /> : <SoundOutlined />}
                onClick={togglePlayback}
                className="music-control"
            />
        </div>
    );
}; 