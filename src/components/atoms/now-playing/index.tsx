import React, { useEffect } from 'react';
import { FiArrowUpRight, FiHeadphones } from 'react-icons/fi';
import { MdPause, MdPlayArrow } from 'react-icons/md';
import { LISTENBRAINZ_USER, listenedAgo } from '../../../common/listening';
import { useListenAlongStore } from '../../../store/listen-along';
import { useListeningStore, useLiveListening } from '../../../store/listening';
import { ListenCover, SourceIcon, sourceName } from '../listen-cover';
import { usePlayListens } from '../listen-row';
import './index.scss';

/**
 * What to show as Jake's current listen: what's playing now, or else the last thing he played,
 * with its label, and whether a visitor can listen along. The card below and the opened
 * library's Recent listens tab both read it.
 */
export const useNowListening = () => {
    useLiveListening();
    const nowPlaying = useListeningStore((store) => store.nowPlaying);
    const last = useListeningStore((store) => store.recent[0]);
    const listenAlongReady = useListenAlongStore((store) => store.available);
    const listeningAlong = useListenAlongStore((store) => store.active);
    const { probe, start, stop } = useListenAlongStore.getState();
    const listen = LISTENBRAINZ_USER ? (nowPlaying ?? last) : undefined;
    const onSpotify = nowPlaying?.source === 'spotify';

    // Only ask whether the Worker is there once there's something to listen along with
    useEffect(() => {
        if (onSpotify) probe();
    }, [onSpotify, probe]);

    const live = !!nowPlaying;
    const ago = listen?.listenedAt ? listenedAgo(listen.listenedAt) : 'a while ago';
    const label = live ? 'Playing now' : `Last played · ${ago}`;

    return {
        listen,
        live,
        label,
        // For the board's narrow tile, where the long label would wrap
        shortLabel: live ? label : `Played ${ago}`,
        service: listen ? sourceName[listen.source] : undefined,
        canListenAlong: onSpotify && !!listenAlongReady,
        listeningAlong,
        toggleListenAlong: () => (listeningAlong ? stop() : start()),
    };
};

/** The listen-along button: the YouTube copy of what Jake has on Spotify, in sync (atoms/listen-along) */
export const ListenAlongButton = ({ className = '' }: { className?: string }) => {
    const { canListenAlong, listeningAlong, toggleListenAlong } = useNowListening();
    if (!canListenAlong) return null;

    return (
        <button type='button' className={`now-playing__along ${className}`} aria-pressed={listeningAlong} onClick={toggleListenAlong}>
            <FiHeadphones aria-hidden /> {listeningAlong ? 'Listening' : 'Listen along'}
        </button>
    );
};

/**
 * What Jake is listening to right now on Spotify or YouTube Music, or else the last thing he played.
 * Clicking the card plays the song here, from YouTube, when it can (atoms/listen-row's usePlayListens),
 * and the service's logo is the way out to it there; otherwise the card links out to the track. While
 * he's on Spotify, and the listening Worker is up, it also offers to listen along. `compact` drops the
 * arrow and the listen-along button, for the board's narrow tile; the library's Recent listens tab has both.
 */
export const NowPlaying = ({ compact = false, className = '' }: { compact?: boolean; className?: string }) => {
    const now = useNowListening();
    const { playListen } = usePlayListens();
    const { listen, live, service } = now;
    const label = compact ? now.shortLabel : now.label;

    if (!listen) return null;

    const { onPlay, current, playing } = playListen(listen);
    const pausable = current && playing;
    const opensAs = `${listen.title} by ${listen.artist}${service ? `. Opens ${service} in a new tab` : ''}`;
    const out = onPlay && listen.link && (
        <a className={compact ? 'now-playing__out now-playing__source' : 'now-playing__go now-playing__out'} href={listen.link} target='_blank' rel='noopener noreferrer' aria-label={opensAs} title={service ? `Open on ${service}` : undefined}>
            {compact ? <SourceIcon source={listen.source} /> : <FiArrowUpRight aria-hidden />}
        </a>
    );

    return (
        <div className={`now-playing${onPlay || listen.link ? ' now-playing--link' : ''}${compact ? ' now-playing--compact' : ''}${current ? ' now-playing--current' : ''} ${className}`}>
            <span className='now-playing__art'>
                <ListenCover title={listen.title} cover={listen.cover} spotifyUrl={listen.spotifyUrl} className='now-playing__cover' />
                {onPlay && <span className='now-playing__play'>{pausable ? <MdPause aria-hidden /> : <MdPlayArrow aria-hidden />}</span>}
            </span>
            <span className='now-playing__text'>
                <span className='now-playing__label'>
                    {live && <span className='now-playing__dot' aria-hidden />}
                    {label}
                </span>
                {/* The title is the button or link, stretched over the whole card, so the controls beside it stay their own */}
                {onPlay ? (
                    <button type='button' className='now-playing__title now-playing__stretch' aria-label={`${label}: ${pausable ? 'pause' : 'play'} ${listen.title} by ${listen.artist}`} onClick={onPlay}>
                        {listen.title}
                    </button>
                ) : listen.link ? (
                    <a className='now-playing__title now-playing__stretch' href={listen.link} target='_blank' rel='noopener noreferrer' aria-label={`${label}: ${opensAs}`}>
                        {listen.title}
                    </a>
                ) : (
                    <span className='now-playing__title'>{listen.title}</span>
                )}
                <span className='now-playing__artist'>{listen.artist}</span>
            </span>
            {compact && out ? out : <SourceIcon source={listen.source} className='now-playing__source' />}
            {!compact && <ListenAlongButton />}
            {!compact &&
                (out ||
                    (listen.link && (
                        <span className='now-playing__go' aria-hidden>
                            <FiArrowUpRight />
                        </span>
                    )))}
        </div>
    );
};
