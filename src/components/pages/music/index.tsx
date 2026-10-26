import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShuffle, FiVolume2, FiX } from 'react-icons/fi';
import { BentoOverlay } from '../../templates';
import { CoverArt, EqBars, MusicTile, TrackProgress, Transport, VolumeSlider } from '../../atoms';
import { useAudioStore } from '../../../store/audio';
import { favoriteArtists, musicList } from '../../../common/constants';
import { findTrack, trackByline } from '../../../common/music';
import './index.scss';

type Tab = 'mine' | 'favorites';

/** The music tile opened: the player and its queue on the left, the whole library on the right */
export const MusicLibrary = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>('mine');
    const audioUrl = useAudioStore((store) => store.audioUrl);
    const isPlaying = useAudioStore((store) => store.isPlaying);
    const queue = useAudioStore((store) => store.queue);
    const toggleQueued = useAudioStore((store) => store.toggleQueued);
    const clearQueue = useAudioStore((store) => store.clearQueue);
    const track = findTrack(audioUrl);

    const tabs: { key: Tab; label: string; count: number }[] = [
        { key: 'mine', label: 'My music', count: musicList.length },
        { key: 'favorites', label: 'Favorite artists', count: favoriteArtists.length },
    ];

    return (
        <BentoOverlay label='Music library' onClose={() => navigate('/')} className='library'>
            <div className='library__player'>
                <span className='library__eyebrow'>
                    <EqBars bars={4} /> {track ? (isPlaying ? 'Now playing' : 'Paused') : 'Nothing playing yet'}
                </span>
                <CoverArt track={track} className='library__cover' />
                <div>
                    <h2 className='library__title'>{track ? track.title : 'Pick a song'}</h2>
                    {track && <p className='library__byline'>{trackByline(track)}</p>}
                </div>
                {track?.description && <p className='library__note'>“{track.description}”</p>}
                <TrackProgress />
                <Transport size='lg' />
                <div className='library__volume'>
                    <FiVolume2 aria-hidden />
                    <label htmlFor='library-volume'>Volume</label>
                    <VolumeSlider id='library-volume' />
                </div>

                <div className='library__queue-head'>
                    <h3>
                        Queued <span>· {queue.length}</span>
                    </h3>
                    {queue.length > 0 && (
                        <button type='button' className='library__clear' onClick={clearQueue}>
                            Clear
                        </button>
                    )}
                </div>
                <ol className='library__queue'>
                    {queue.map((url, i) => {
                        const queued = findTrack(url);
                        if (!queued) return null;
                        return (
                            <li key={url} className='library__queued'>
                                <span className='library__position'>{i + 1}</span>
                                <CoverArt track={queued} className='library__queued-cover' />
                                <span className='library__queued-title'>{queued.title}</span>
                                <button type='button' className='library__remove' aria-label={`Remove ${queued.title} from the queue`} onClick={() => toggleQueued(url)}>
                                    <FiX />
                                </button>
                            </li>
                        );
                    })}
                </ol>
                {queue.length === 0 && <p className='library__empty'>Nothing queued. Use the + on any song.</p>}
                <p className='library__then'>
                    <FiShuffle aria-hidden /> Then: shuffle the rest, never the same song twice in a row
                </p>
            </div>

            <div className='library__browse'>
                <div className='library__browse-head'>
                    <h2>Music</h2>
                    <div role='tablist' aria-label='Music lists' className='library__tabs'>
                        {tabs.map(({ key, label, count }) => (
                            <button
                                key={key}
                                type='button'
                                role='tab'
                                id={`library-tab-${key}`}
                                aria-selected={tab === key}
                                aria-controls='library-grid'
                                className={`library__tab${tab === key ? ' library__tab--on' : ''}`}
                                onClick={() => setTab(key)}>
                                {label} <span>{count}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div id='library-grid' role='tabpanel' aria-labelledby={`library-tab-${tab}`} className='library__grid'>
                    {tab === 'mine'
                        ? musicList.map((item) => <MusicTile key={item.url} item={item} />)
                        : favoriteArtists.map((artist) => <MusicTile key={artist.url} item={findTrack(artist.url) ?? artist} title={artist.title} meta={findTrack(artist.url)?.title} />)}
                </div>
            </div>
        </BentoOverlay>
    );
};
