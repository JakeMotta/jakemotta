import React, { useEffect } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { MdPause, MdPlayArrow } from 'react-icons/md';
import { Listen, ListenSource } from '../../../api/listenbrainz';
import { listenUrl, streamedTrack } from '../../../common/music';
import { useAudioStore } from '../../../store/audio';
import { useListenAlongStore } from '../../../store/listen-along';
import { ListenCover, SourceIcon, sourceName } from '../listen-cover';
import './index.scss';

export type PlayProps = { current?: boolean; playing?: boolean; onPlay?: () => void };

/**
 * How a listen plays here, through the site's player (docs/listening.md): `play` gives the props that
 * make a row play its song, and nothing for one that can't. A Spotify play needs the listening Worker
 * to find its YouTube copy, so `worker` says whether it's there.
 */
export const usePlayListens = () => {
    const worker = useListenAlongStore((store) => !!store.available);
    const probe = useListenAlongStore((store) => store.probe);
    const audioUrl = useAudioStore((store) => store.audioUrl);
    const isPlaying = useAudioStore((store) => store.isPlaying);

    useEffect(() => {
        probe();
    }, [probe]);

    const play = (url: string | undefined, title: string, artist: string | undefined, cover: string | undefined): PlayProps => {
        if (!url) return {};
        const current = url === audioUrl;
        const { playTrack, togglePlayback } = useAudioStore.getState();
        return { current, playing: isPlaying, onPlay: () => (current ? togglePlayback() : playTrack(streamedTrack(url, title, artist, cover))) };
    };

    return { worker, play, playListen: (listen: Listen) => play(listenUrl(listen, worker), listen.title, listen.artist, listen.cover) };
};

interface ListenRowProps extends PlayProps {
    title: string;
    subtitle?: string;
    // Right-aligned: when it was played, or how many times
    meta?: string;
    cover?: string;
    spotifyUrl?: string;
    source?: ListenSource;
    href?: string;
    rank?: number;
}

/**
 * One line of the Lately panel: a play, or a top song, album or artist. A song that can play here, from
 * YouTube, plays when the row is clicked, and its service's logo beside it is the way out to the song
 * there. Any other row links out when there's somewhere to go.
 */
export const ListenRow = ({ title, subtitle, meta, cover, spotifyUrl, source, href, rank, onPlay, current, playing }: ListenRowProps) => {
    const pausable = current && playing;
    const service = source && sourceName[source];

    const body = (
        <>
            {rank !== undefined && <span className='listen-row__rank'>{rank}</span>}
            <span className='listen-row__art'>
                <ListenCover title={title} cover={cover} spotifyUrl={spotifyUrl} className='listen-row__cover' />
                {onPlay && <span className='listen-row__play'>{pausable ? <MdPause aria-hidden /> : <MdPlayArrow aria-hidden />}</span>}
            </span>
            <span className='listen-row__text'>
                <span className='listen-row__title'>{title}</span>
                {subtitle && <span className='listen-row__subtitle'>{subtitle}</span>}
            </span>
            {meta && <span className='listen-row__meta'>{meta}</span>}
            {!onPlay && source && <SourceIcon source={source} className='listen-row__source' />}
            {!onPlay && href && <FiArrowUpRight className='listen-row__go' aria-hidden />}
        </>
    );

    if (onPlay) {
        const name = subtitle ? `${title} by ${subtitle}` : title;
        return (
            <div className={`listen-row-playable${current ? ' listen-row-playable--current' : ''}`}>
                <button type='button' className='listen-row listen-row--link' aria-label={pausable ? `Pause ${name}` : `Play ${name}`} onClick={onPlay}>
                    {body}
                </button>
                {href && (
                    <a className='listen-row__out' href={href} target='_blank' rel='noopener noreferrer' aria-label={`${name}${service ? ` on ${service}` : ''}, in a new tab`} title={service ? `Open on ${service}` : undefined}>
                        {source && source !== 'other' ? <SourceIcon source={source} /> : <FiArrowUpRight aria-hidden />}
                    </a>
                )}
            </div>
        );
    }

    return href ? (
        <a className='listen-row listen-row--link' href={href} target='_blank' rel='noopener noreferrer' title={service ? `Open on ${service}` : undefined}>
            {body}
        </a>
    ) : (
        <div className='listen-row'>{body}</div>
    );
};
