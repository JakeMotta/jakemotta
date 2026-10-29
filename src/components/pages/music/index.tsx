import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BentoOverlay, OverlayHeader } from '../../templates';
import { CoverArt, Lately, ListenCover, MusicRow, NowPlaying, PlayerCard } from '../../atoms';
import { useAudioStore } from '../../../store/audio';
import { useListenAlongStore } from '../../../store/listen-along';
import { musicList, MusicItemProps, youtubeSongs } from '../../../common/constants';
import { findTrack, listenUrl, songUrl, streamedTrack, upNextTracks } from '../../../common/music';
import { useFavoriteArtists } from './favorites';
import './index.scss';

type Tab = 'mine' | 'favorites' | 'playlist' | 'recent';

const TABS: Tab[] = ['mine', 'favorites', 'playlist', 'recent'];

/** The music tile opened: the player and what plays next on the left, the whole library on the right */
export const MusicLibrary = () => {
    const navigate = useNavigate();
    // The tab lives in the URL (/library?tab=favorites), so the board's Favorite artists tile can open straight onto it
    const [params, setParams] = useSearchParams();
    const tab = TABS.find((key) => key === params.get('tab')) ?? 'mine';
    const setTab = (key: Tab) => setParams(key === 'mine' ? {} : { tab: key }, { replace: true });
    const audioUrl = useAudioStore((store) => store.audioUrl);
    const isPlaying = useAudioStore((store) => store.isPlaying);
    const track = findTrack(audioUrl);
    const { setAudioUrl, playTrack, togglePlayback } = useAudioStore.getState();
    const upNext = upNextTracks(useAudioStore((store) => store.shuffled));
    // The songs that play from YouTube: Jake's picks, then his Spotify playlist's once the Worker sends them
    const spotifyPlaylist = useAudioStore((store) => store.playlist);
    const playlist = [...youtubeSongs.map((song) => findTrack(song.url) ?? song), ...spotifyPlaylist];
    const favorites = useFavoriteArtists();
    // Whether the listening Worker is up, which a Spotify play needs to find its YouTube copy
    const worker = useListenAlongStore((store) => !!store.available);
    const probe = useListenAlongStore((store) => store.probe);

    useEffect(() => {
        probe();
    }, [probe]);

    // Each tab has its own subtitle under the heading. The tabs show no counts, as Jake asked on 2026-10-28.
    const tabs: { key: Tab; label: string; subtitle: string }[] = [
        { key: 'mine', label: 'My music', subtitle: "Songs I've made over the years." },
        { key: 'favorites', label: 'Favorite artists', subtitle: 'Artists I love. Press play to hear why.' },
        ...(playlist.length ? [{ key: 'playlist' as Tab, label: 'Playlist', subtitle: "What I've had on repeat." }] : []),
        // What Jake's been playing elsewhere (ListenBrainz): the song on now, then his recent plays and top lists
        { key: 'recent', label: 'Recent listens', subtitle: "What I've been digging." },
    ];

    // A song as a row: playing it plays it now, and the shuffle carries on after it
    const songRow = (item: MusicItemProps, i: number, meta: string | undefined) => {
        const current = item.url === audioUrl;
        return (
            <li key={item.url}>
                <MusicRow
                    rank={i + 1}
                    art={<CoverArt track={item} />}
                    title={item.title}
                    meta={meta}
                    description={item.description}
                    current={current}
                    playing={isPlaying}
                    onPlay={() => (current ? togglePlayback() : setAudioUrl(item.url))}
                />
            </li>
        );
    };

    // An artist as a row: it plays their most-played song, from YouTube, when that can play here
    const artistRows = favorites.artists.map(({ name, plays, image, song }, i) => {
        const url = song && (listenUrl(song, worker) ?? (worker ? songUrl(song.artist, song.title) : undefined));
        const current = !!url && url === audioUrl;
        return (
            <li key={name}>
                <MusicRow
                    rank={i + 1}
                    art={<ListenCover title={name} cover={image ?? song?.cover} spotifyUrl={song?.spotifyUrl} />}
                    title={name}
                    meta={[plays !== undefined && `${plays} ${plays === 1 ? 'play' : 'plays'}`, song?.title].filter(Boolean).join(' · ') || undefined}
                    current={current}
                    playing={isPlaying}
                    onPlay={url && song ? () => (current ? togglePlayback() : playTrack(streamedTrack(url, song.title, song.artist, song.cover))) : undefined}
                />
            </li>
        );
    });

    return (
        <BentoOverlay label='Music library' onClose={() => navigate('/')} className='library'>
            <div className='library__player'>
                <PlayerCard className='library__card' />
                {track?.description && <p className='library__note'>“{track.description}”</p>}

                <h3 className='library__next-title'>Up next</h3>
                <ol className='library__next'>
                    {upNext.map((next) => (
                        <li key={next.url}>
                            <button type='button' className='library__next-row' onClick={() => setAudioUrl(next.url)}>
                                <CoverArt track={next} className='library__next-cover' />
                                <span className='library__next-name'>{next.title}</span>
                                <span className='library__next-year'>{next.date}</span>
                            </button>
                        </li>
                    ))}
                </ol>
            </div>

            <div className='library__browse'>
                <OverlayHeader title='Music' subtitle={tabs.find(({ key }) => key === tab)?.subtitle}>
                    <div role='tablist' aria-label='Music lists' className='library__tabs'>
                        {tabs.map(({ key, label }) => (
                            <button
                                key={key}
                                type='button'
                                role='tab'
                                id={`library-tab-${key}`}
                                aria-selected={tab === key}
                                aria-controls='library-list'
                                className={`library__tab${tab === key ? ' library__tab--on' : ''}`}
                                onClick={() => setTab(key)}>
                                {label}
                            </button>
                        ))}
                    </div>
                </OverlayHeader>
                {tab === 'recent' ? (
                    <div id='library-list' role='tabpanel' aria-labelledby='library-tab-recent' className='library__lately'>
                        <NowPlaying className='library__now' />
                        <Lately pageSize={100} />
                    </div>
                ) : (
                    <ol id='library-list' role='tabpanel' aria-labelledby={`library-tab-${tab}`} className='library__rows'>
                        {tab === 'mine' ? (
                            musicList.map((item, i) => songRow(item, i, item.date))
                        ) : tab === 'playlist' ? (
                            playlist.map((item, i) => songRow(item, i, item.artist))
                        ) : favorites.ready ? (
                            artistRows.length ? (
                                artistRows
                            ) : (
                                <li className='library__empty'>Nothing here yet.</li>
                            )
                        ) : (
                            <li className='library__empty'>Tuning in…</li>
                        )}
                    </ol>
                )}
            </div>
        </BentoOverlay>
    );
};
