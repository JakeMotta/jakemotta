import React from 'react';
import { MdPause, MdPlayArrow, MdPlaylistAdd } from 'react-icons/md';
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

/** A song in the library: cover with a play button and a queue toggle, then its title */
export const MusicTile = ({ item, title = item.title, meta = item.date }: MusicTileProps) => {
    const isCurrent = useAudioStore((store) => store.audioUrl === item.url);
    const isPlaying = useAudioStore((store) => store.isPlaying);
    const queuePosition = useAudioStore((store) => store.queue.indexOf(item.url)) + 1;
    const setAudioUrl = useAudioStore((store) => store.setAudioUrl);
    const togglePlayback = useAudioStore((store) => store.togglePlayback);
    const toggleQueued = useAudioStore((store) => store.toggleQueued);
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
                {/* Queue toggle: plays after the current track instead of interrupting it */}
                <button
                    type='button'
                    className={`music-tile__queue${queuePosition ? ' music-tile__queue--queued' : ''}`}
                    title={queuePosition ? `Queued #${queuePosition}. Click to remove` : 'Add to queue'}
                    aria-label={queuePosition ? `Queued #${queuePosition}. Remove ${title} from the queue` : `Add ${title} to the queue`}
                    onClick={() => toggleQueued(item.url)}>
                    {queuePosition ? queuePosition : <MdPlaylistAdd />}
                </button>
            </div>
            <span className='music-tile__title'>{title}</span>
            <span className='music-tile__meta'>{meta}</span>
        </div>
    );
};
