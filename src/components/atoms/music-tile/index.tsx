import React from 'react';
import { MdPause, MdPlayArrow } from 'react-icons/md';
import { useAudioStore } from '../../../store/audio';
import { MusicItemProps } from '../../../common/constants';
import { CoverArt } from '../cover-art';
import { EqBars } from '../eq-bars';
import './index.scss';

export interface MusicTileProps {
    item: MusicItemProps;
    // What to call it, when that isn't the track's own title (the artists in Favorite artists)
    title?: string;
    meta?: string;
}

/** A song in the library: cover with a play button, then its title. Playing one plays it now; the shuffle carries on after it. */
export const MusicTile = ({ item, title = item.title, meta = item.date }: MusicTileProps) => {
    const isCurrent = useAudioStore((store) => store.audioUrl === item.url);
    const isPlaying = useAudioStore((store) => store.isPlaying);
    const setAudioUrl = useAudioStore((store) => store.setAudioUrl);
    const togglePlayback = useAudioStore((store) => store.togglePlayback);
    const pausable = isCurrent && isPlaying;

    return (
        <div className={`music-tile${isCurrent ? ' music-tile--current' : ''}`}>
            <div className='music-tile__art'>
                <CoverArt track={item} className='music-tile__cover' />
                {isCurrent && <EqBars bars={4} className='music-tile__eq' />}
                <button
                    type='button'
                    className='music-tile__play'
                    aria-label={pausable ? `Pause ${title}` : `Play ${title}`}
                    onClick={() => (isCurrent ? togglePlayback() : setAudioUrl(item.url))}>
                    {pausable ? <MdPause /> : <MdPlayArrow />}
                </button>
            </div>
            <span className='music-tile__title'>{title}</span>
            <span className='music-tile__meta'>{meta}</span>
        </div>
    );
};
