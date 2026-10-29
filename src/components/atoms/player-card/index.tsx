import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAudioStore } from '../../../store/audio';
import { findTrack, isStreamed, trackByline } from '../../../common/music';
import { CoverArt } from '../cover-art';
import { EqBars } from '../eq-bars';
import { TrackProgress } from '../track-progress';
import { Transport } from '../transport';
import { VolumeControl } from '../volume-control';
import { VideoSlot } from '../youtube-player';
import './index.scss';

interface PlayerCardProps {
    // Beside the eyebrow: the board tile's Library link
    action?: ReactNode;
    // Where the header row opens, when it's a tile on the board (tile-head in pages/home)
    titleTo?: string;
    className?: string;
}

/**
 * The player: what's on (with any action beside it), its cover, title and byline, the seek slider,
 * and previous/play/next centred under it with the volume at the bottom right. The board's Now
 * Playing tile and the library's left column both show this one, so they always match. It sits on
 * primary-dark surfaces.
 */
export const PlayerCard = ({ action, titleTo, className = '' }: PlayerCardProps) => {
    const audioUrl = useAudioStore((store) => store.audioUrl);
    const isPlaying = useAudioStore((store) => store.isPlaying);
    const track = findTrack(audioUrl);
    const status = track ? (isPlaying ? 'Now playing' : 'Paused') : 'Nothing playing yet';

    return (
        <div className={`player-card ${className}`}>
            <div className={`player-card__head${titleTo ? ' tile-head' : ''}`}>
                <span className='player-card__eyebrow'>
                    <EqBars bars={4} />{' '}
                    {titleTo ? (
                        <Link className='tile-head__link' to={titleTo}>
                            {status}
                        </Link>
                    ) : (
                        status
                    )}
                </span>
                {action}
            </div>
            {/* A song from YouTube shows its video where the cover goes */}
            {isStreamed(audioUrl) ? <VideoSlot track={track} className='player-card__cover' /> : <CoverArt track={track} className='player-card__cover' />}
            <div className='player-card__about'>
                <h2 className='player-card__title'>{track ? track.title : 'Pick a song'}</h2>
                {track && <p className='player-card__byline'>{trackByline(track)}</p>}
            </div>
            <TrackProgress />
            <div className='player-card__controls'>
                <Transport className='player-card__transport' />
                <VolumeControl className='player-card__volume' />
            </div>
        </div>
    );
};
