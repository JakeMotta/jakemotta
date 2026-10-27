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
 * A speaker button whose volume card, an upright slider with the level under it, shows on hover or
 * focus, or on a tap, since touch screens can't hover. The icon follows the volume.
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
                <div className='volume-control__card'>
                    <VolumeSlider className='volume-control__slider' />
                    <span className='volume-control__level' aria-hidden>
                        {Math.round(volume * 100)}
                    </span>
                </div>
            </div>
        </div>
    );
};
