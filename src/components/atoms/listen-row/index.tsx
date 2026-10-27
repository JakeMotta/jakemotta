import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
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
}

/**
 * One line of the Lately panel: a play, or a top song, album or artist. It links out when there's
 * somewhere to go, and has no play button, so it can't be mistaken for a song that plays here.
 */
export const ListenRow = ({ title, subtitle, meta, cover, spotifyUrl, source, href, rank }: ListenRowProps) => {
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
    return href ? (
        <a className='listen-row listen-row--link' href={href} target='_blank' rel='noopener noreferrer' title={service ? `Open on ${service}` : undefined}>
            {body}
        </a>
    ) : (
        <div className='listen-row'>{body}</div>
    );
};
