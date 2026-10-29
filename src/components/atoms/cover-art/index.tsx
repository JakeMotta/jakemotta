import React from 'react';
import { MusicItemProps } from '../../../common/constants';
import './index.scss';

interface CoverArtProps {
    track?: MusicItemProps;
    className?: string;
}

// A short title fits whole; a long one shrinks to its initials
const monogram = (title: string) =>
    title.length <= 8
        ? title
        : title
              .split(/\s+/)
              .map((word) => word.replace(/[^A-Za-z0-9]/g, '').charAt(0))
              .join('')
              .slice(0, 3);

/** A track's cover, or a monogram tile in the hue when it has none (Dandy) */
export const CoverArt = ({ track, className = '' }: CoverArtProps) =>
    track?.image ? (
        <img className={`cover-art ${className}`} src={track.image} alt="" decoding="async" />
    ) : (
        <span className={`cover-art cover-art--monogram ${className}`} aria-hidden>
            <span>{track ? monogram(track.title) : ''}</span>
        </span>
    );
