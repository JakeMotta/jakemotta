import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BentoOverlay, OverlayHeader } from '../../templates';
import { CoverArt, Lately, MusicTile, NowPlaying, PlayerCard } from '../../atoms';
import { useAudioStore } from '../../../store/audio';
import { favoriteArtists, musicList } from '../../../common/constants';
import { findTrack } from '../../../common/music';
import './index.scss';

type Tab = 'mine' | 'favorites' | 'recent';

const TABS: Tab[] = ['mine', 'favorites', 'recent'];

/** The music tile opened: the player and what plays next on the left, the whole library on the right */
export const MusicLibrary = () => {
    const navigate = useNavigate();
    // The tab lives in the URL (/library?tab=favorites), so the board's Favorite artists tile can open straight onto it
    const [params, setParams] = useSearchParams();
    const tab = TABS.find((key) => key === params.get('tab')) ?? 'mine';
    const setTab = (key: Tab) => setParams(key === 'mine' ? {} : { tab: key }, { replace: true });
    const audioUrl = useAudioStore((store) => store.audioUrl);
    const track = findTrack(audioUrl);
    const setAudioUrl = useAudioStore((store) => store.setAudioUrl);
    const upNext = useAudioStore((store) => store.shuffled);

    // Each tab has its own subtitle under the heading
    const tabs: { key: Tab; label: string; count?: number; subtitle: string }[] = [
        { key: 'mine', label: 'My music', count: musicList.length, subtitle: "Songs I've made over the years." },
        { key: 'favorites', label: 'Favorite artists', count: favoriteArtists.length, subtitle: 'Artists I love. Press play to hear why.' },
        // What Jake's been playing elsewhere (ListenBrainz): the song on now, then his recent plays and top lists
        { key: 'recent', label: 'Recent listens', subtitle: "What I've been digging." },
    ];

    return (
        <BentoOverlay label='Music library' onClose={() => navigate('/')} className='library'>
            <div className='library__player'>
                <PlayerCard className='library__card' />
                {track?.description && <p className='library__note'>“{track.description}”</p>}

                <h3 className='library__next-title'>Up next</h3>
                <ol className='library__next'>
                    {upNext.map((url) => {
                        const next = findTrack(url);
                        if (!next) return null;
                        return (
                            <li key={url}>
                                <button type='button' className='library__next-row' onClick={() => setAudioUrl(url)}>
                                    <CoverArt track={next} className='library__next-cover' />
                                    <span className='library__next-name'>{next.title}</span>
                                    <span className='library__next-year'>{next.date}</span>
                                </button>
                            </li>
                        );
                    })}
                </ol>
            </div>

            <div className='library__browse'>
                <OverlayHeader title='Music' subtitle={tabs.find(({ key }) => key === tab)?.subtitle}>
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
                                {label} {count !== undefined && <span>{count}</span>}
                            </button>
                        ))}
                    </div>
                </OverlayHeader>
                {tab === 'recent' ? (
                    <div id='library-grid' role='tabpanel' aria-labelledby='library-tab-recent' className='library__lately'>
                        <NowPlaying className='library__now' />
                        <Lately pageSize={100} />
                    </div>
                ) : (
                    <div id='library-grid' role='tabpanel' aria-labelledby={`library-tab-${tab}`} className='library__grid'>
                        {tab === 'mine'
                            ? musicList.map((item) => <MusicTile key={item.url} item={item} />)
                            : favoriteArtists.map((artist) => <MusicTile key={artist.url} item={findTrack(artist.url) ?? artist} title={artist.title} meta={findTrack(artist.url)?.title} />)}
                    </div>
                )}
            </div>
        </BentoOverlay>
    );
};
