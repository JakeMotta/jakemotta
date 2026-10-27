import React, { useState } from 'react';
import { FiVolume1, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useAudioStore } from '../../../store/audio';
import { VolumeSlider } from '../track-progress';
import './index.scss';

interface VolumeControlProps {
    // Which way the slider stands from the button: up by default, down where there's no room above (a header)
    direction?: 'up' | 'down';
    className?: string;
}

/**
 * A speaker button whose vertical volume slider shows on hover or focus, or on a tap, since touch
 * screens can't hover. The icon follows the volume.
 */
export const VolumeControl = ({ direction = 'up', className = '' }: VolumeControlProps) => {
    const volume = useAudioStore((store) => store.volume);
    const [open, setOpen] = useState(false);
    const Icon = volume === 0 ? FiVolumeX : volume < 0.5 ? FiVolume1 : FiVolume2;

    return (
        <div className={`volume-control volume-control--${direction}${open ? ' volume-control--open' : ''} ${className}`} onMouseLeave={() => setOpen(false)}>
            <button type='button' className='volume-control__button' aria-label='Volume' aria-expanded={open} onClick={() => setOpen(!open)}>
                <Icon aria-hidden />
            </button>
            <div className='volume-control__pop'>
                <VolumeSlider />
            </div>
        </div>
    );
};
