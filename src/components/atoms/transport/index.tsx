import React from 'react';
import { MdPause, MdPlayArrow, MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { useAudioStore } from '../../../store/audio';
import './index.scss';

interface TransportProps {
    size?: 'md' | 'lg';
    className?: string;
}

/** Previous, play/pause and next, for any surface that shows the playing track */
export const Transport = ({ size = 'md', className = '' }: TransportProps) => {
    const isPlaying = useAudioStore((store) => store.isPlaying);
    const togglePlayback = useAudioStore((store) => store.togglePlayback);
    const playNext = useAudioStore((store) => store.playNext);
    const playPrevious = useAudioStore((store) => store.playPrevious);

    return (
        <div className={`transport transport--${size} ${className}`}>
            <button type='button' className='transport__skip' aria-label='Previous track' onClick={playPrevious}>
                <MdSkipPrevious />
            </button>
            <button type='button' className='transport__play' aria-label={isPlaying ? 'Pause' : 'Play'} onClick={togglePlayback}>
                {isPlaying ? <MdPause /> : <MdPlayArrow />}
            </button>
            <button type='button' className='transport__skip' aria-label='Next track' onClick={playNext}>
                <MdSkipNext />
            </button>
        </div>
    );
};
