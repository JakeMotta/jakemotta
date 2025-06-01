import React, { useRef, useEffect } from 'react';
import { useAudioStore } from '../../../store/audio';
import { Button } from 'antd';
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa';

import './index.scss';

export const MusicPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioUrl = useAudioStore((store) => store.audioUrl);

    // Effect to handle audio URL changes
    useEffect(() => {
        if (!audioRef.current || !audioUrl) return;

        // Load the new audio
        audioRef.current.load();

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
        };
    }, [audioUrl]);

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
        <div className="music-player">
            <audio
                ref={audioRef}
                src={audioUrl}
                className="hidden"
            />
            <Button
                type="text"
                icon={audioRef.current?.paused ? <FaPlayCircle /> : <FaPauseCircle />}
                onClick={togglePlayback}
                className="music-control text-2xl"
            />
        </div>
    );
}; 