import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { MdPause, MdPlayArrow } from 'react-icons/md';
import { ListenSource } from '../../../api/listenbrainz';
import { ListenCover, SourceIcon, sourceName } from '../listen-cover';
import './index.scss';

interface ListenRowProps {
    title: string;
    subtitle?: string;
    // Right-aligned: when it was played, or how many times
    meta?: string;
    cover?: string;
    spotifyUrl?: string;
    source?: ListenSource;
    href?: string;
    rank?: number;
    // Plays the song here, from YouTube; absent when it can't be
    onPlay?: () => void;
    // It's the song on now, and whether it's playing
    current?: boolean;
    playing?: boolean;
}

/**
 * One line of the Lately panel: a play, or a top song, album or artist. It links out when there's
 * somewhere to go. A song that can play here, from YouTube, has a play button beside the link.
 */
export const ListenRow = ({ title, subtitle, meta, cover, spotifyUrl, source, href, rank, onPlay, current, playing }: ListenRowProps) => {
    const body = (
        <>
            {rank !== undefined && <span className='listen-row__rank'>{rank}</span>}
            <ListenCover title={title} cover={cover} spotifyUrl={spotifyUrl} className='listen-row__cover' />
            <span className='listen-row__text'>
                <span className='listen-row__title'>{title}</span>
                {subtitle && <span className='listen-row__subtitle'>{subtitle}</span>}
            </span>
            {meta && <span className='listen-row__meta'>{meta}</span>}
            {source && <SourceIcon source={source} className='listen-row__source' />}
            {href && <FiArrowUpRight className='listen-row__go' aria-hidden />}
        </>
    );

    const service = source && sourceName[source];
    const row = href ? (
        <a className='listen-row listen-row--link' href={href} target='_blank' rel='noopener noreferrer' title={service ? `Open on ${service}` : undefined}>
            {body}
        </a>
    ) : (
        <div className='listen-row'>{body}</div>
    );
    if (!onPlay) return row;

    const pausable = current && playing;
    return (
        <div className={`listen-row-playable${current ? ' listen-row-playable--current' : ''}`}>
            <button type='button' className='listen-row__play' aria-label={pausable ? `Pause ${title}` : `Play ${title}`} onClick={onPlay}>
                {pausable ? <MdPause aria-hidden /> : <MdPlayArrow aria-hidden />}
            </button>
            {row}
        </div>
    );
};
