import React from 'react';
import { MdPause, MdPlayArrow, MdSkipNext } from 'react-icons/md';
import { useAudioStore } from '../../../store/audio';
import { findTrack } from '../../../common/music';
import { CoverArt } from '../cover-art';
import { EqBars } from '../eq-bars';
import { VolumeControl } from '../volume-control';
import './index.scss';

/**
 * The playing track in a pill: cover, bars, title, play/pause, next and volume. It stands in for the
 * Now Playing tile wherever that tile is out of sight: in the overlays, and on phones once the
 * tile has scrolled away.
 */
// `volume` is which way its slider opens: up by default, down in an overlay's header where there's no room above.
// `collapsed` shows just the cover, as a circle, and slides the rest out on hover or focus (the project viewer).
export const MiniPlayer = ({ className = '', volume = 'up', collapsed = false }: { className?: string; volume?: 'up' | 'down'; collapsed?: boolean }) => {
    const audioUrl = useAudioStore((store) => store.audioUrl);
    const isPlaying = useAudioStore((store) => store.isPlaying);
    const togglePlayback = useAudioStore((store) => store.togglePlayback);
    const playNext = useAudioStore((store) => store.playNext);
    const track = findTrack(audioUrl);

    return (
        <div className={`mini-player${collapsed ? ' mini-player--collapsed' : ''} ${className}`}>
            <CoverArt track={track} className='mini-player__cover' />
            <EqBars className='mini-player__eq' />
            <span className='mini-player__title'>{track ? track.title : 'Press play for music'}</span>
            <button type='button' className='mini-player__play' aria-label={isPlaying ? 'Pause' : 'Play'} onClick={togglePlayback}>
                {isPlaying ? <MdPause /> : <MdPlayArrow />}
            </button>
            <button type='button' className='mini-player__next' aria-label='Next track' onClick={playNext}>
                <MdSkipNext />
            </button>
            <VolumeControl direction={volume} className='mini-player__volume' />
        </div>
    );
};
