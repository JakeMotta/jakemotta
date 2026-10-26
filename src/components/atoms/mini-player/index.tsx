import React from 'react';
import { MdPause, MdPlayArrow, MdSkipNext } from 'react-icons/md';
import { useAudioStore } from '../../../store/audio';
import { findTrack } from '../../../common/music';
import { CoverArt } from '../cover-art';
import { EqBars } from '../eq-bars';
import './index.scss';

/**
 * The playing track in a pill: cover, bars, title, play/pause and next. It stands in for the
 * Now Playing tile wherever that tile is out of sight: in the overlays, and on phones once the
 * tile has scrolled away.
 */
export const MiniPlayer = ({ className = '' }: { className?: string }) => {
    const audioUrl = useAudioStore((store) => store.audioUrl);
    const isPlaying = useAudioStore((store) => store.isPlaying);
    const togglePlayback = useAudioStore((store) => store.togglePlayback);
    const playNext = useAudioStore((store) => store.playNext);
    const track = findTrack(audioUrl);

    return (
        <div className={`mini-player ${className}`}>
            <CoverArt track={track} className='mini-player__cover' />
            <EqBars className='mini-player__eq' />
            <span className='mini-player__title'>{track ? track.title : 'Press play for music'}</span>
            <button type='button' className='mini-player__play' aria-label={isPlaying ? 'Pause' : 'Play'} onClick={togglePlayback}>
                {isPlaying ? <MdPause /> : <MdPlayArrow />}
            </button>
            <button type='button' className='mini-player__next' aria-label='Next track' onClick={playNext}>
                <MdSkipNext />
            </button>
        </div>
    );
};
