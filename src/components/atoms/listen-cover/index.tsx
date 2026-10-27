import React, { useEffect, useState } from 'react';
import { SiSpotify, SiYoutubemusic } from 'react-icons/si';
import { getSpotifyCover, ListenSource } from '../../../api/listenbrainz';
import './index.scss';

interface ListenCoverProps {
    title: string;
    cover?: string;
    // Asked about when there's no cover yet, which is usual for the track playing now
    spotifyUrl?: string;
    className?: string;
}

const initials = (title: string) =>
    title
        .split(/\s+/)
        .map((word) => word.replace(/[^\p{L}\p{N}]/gu, '').charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase();

/** A listen's cover, or a monogram tile in the hue when there isn't one (or it fails to load) */
export const ListenCover = ({ title, cover, spotifyUrl, className = '' }: ListenCoverProps) => {
    const [src, setSrc] = useState(cover);

    useEffect(() => {
        setSrc(cover);
        if (cover || !spotifyUrl) return;
        let current = true;
        getSpotifyCover(spotifyUrl).then((found) => current && setSrc(found));
        return () => {
            current = false;
        };
    }, [cover, spotifyUrl]);

    return src ? (
        <img
            className={`listen-cover ${className}`}
            src={src}
            alt=''
            loading='lazy'
            onError={() => setSrc(undefined)}
            // YouTube answers a video it doesn't know with a small grey placeholder rather than an error
            onLoad={(event) => event.currentTarget.naturalWidth < 200 && setSrc(undefined)}
        />
    ) : (
        <span className={`listen-cover listen-cover--monogram ${className}`} aria-hidden>
            <span>{initials(title)}</span>
        </span>
    );
};

export const sourceName: Record<ListenSource, string | undefined> = {
    spotify: 'Spotify',
    'youtube-music': 'YouTube Music',
    other: undefined,
};

/** The service a listen came from, as its logo in the pale tint */
export const SourceIcon = ({ source, className = '' }: { source: ListenSource; className?: string }) => {
    const Icon = source === 'spotify' ? SiSpotify : source === 'youtube-music' ? SiYoutubemusic : undefined;
    return Icon ? <Icon className={`listen-source ${className}`} title={sourceName[source]} aria-hidden /> : null;
};
