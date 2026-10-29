import React, { ReactNode } from 'react';
import { MdPause, MdPlayArrow } from 'react-icons/md';
import { EqBars } from '../eq-bars';
import './index.scss';

export interface MusicRowProps {
    rank: number;
    // The cover: CoverArt for a song, ListenCover for an artist
    art: ReactNode;
    title: string;
    meta?: string;
    // What Jake says about the song, under the rest
    description?: string;
    // It's the song on now, and whether it's playing
    current?: boolean;
    playing?: boolean;
    // Absent when it can't play here; the row still shows
    onPlay?: () => void;
}

/**
 * A line of the library: its number (bouncing bars while it plays), cover, title and what's under
 * it. The whole row is the play button; a play button shows on the cover and at the row's end on
 * hover, and stays at the end while it's the song on.
 */
export const MusicRow = ({ rank, art, title, meta, description, current, playing, onPlay }: MusicRowProps) => {
    const pausable = current && playing;
    const body = (
        <>
            <span className='music-row__rank'>{current ? <EqBars bars={3} className='music-row__eq' /> : String(rank).padStart(2, '0')}</span>
            <span className='music-row__art'>
                {art}
                {onPlay && (
                    <span className='music-row__hover' aria-hidden>
                        <MdPlayArrow />
                    </span>
                )}
            </span>
            <span className='music-row__text'>
                <span className='music-row__title'>{title}</span>
                {meta && <span className='music-row__meta'>{meta}</span>}
                {description && <span className='music-row__description'>{description}</span>}
            </span>
            {onPlay && (
                <span className='music-row__go' aria-hidden>
                    {pausable ? <MdPause /> : <MdPlayArrow />}
                </span>
            )}
        </>
    );

    const className = `music-row${current ? ' music-row--current' : ''}`;
    return onPlay ? (
        <button type='button' className={className} aria-label={pausable ? `Pause ${title}` : `Play ${title}`} onClick={onPlay}>
            {body}
        </button>
    ) : (
        <div className={className}>{body}</div>
    );
};
