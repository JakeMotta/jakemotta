import React, { ReactNode } from 'react';
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
    // Beside the eyebrow, after the volume: the board tile's Library link
    action?: ReactNode;
    className?: string;
}

/**
 * The player: what's on (with the volume and any action beside it), its cover, title and byline, the
 * seek slider, and previous/play/next centred under it. The board's Now Playing tile and the library's
 * left column both show this one, so they always match. It sits on primary-dark surfaces.
 */
export const PlayerCard = ({ action, className = '' }: PlayerCardProps) => {
    const audioUrl = useAudioStore((store) => store.audioUrl);
    const isPlaying = useAudioStore((store) => store.isPlaying);
    const track = findTrack(audioUrl);

    return (
        <div className={`player-card ${className}`}>
            <div className='player-card__head'>
                <span className='player-card__eyebrow'>
                    <EqBars bars={4} /> {track ? (isPlaying ? 'Now playing' : 'Paused') : 'Nothing playing yet'}
                </span>
                <div className='player-card__actions'>
                    <VolumeControl direction='down' className='player-card__volume' />
                    {action}
                </div>
            </div>
            {/* A song from YouTube shows its video where the cover goes */}
            {isStreamed(audioUrl) ? <VideoSlot track={track} className='player-card__cover' /> : <CoverArt track={track} className='player-card__cover' />}
            <div>
                <h2 className='player-card__title'>{track ? track.title : 'Pick a song'}</h2>
                {track && <p className='player-card__byline'>{trackByline(track)}</p>}
            </div>
            <TrackProgress />
            <Transport className='player-card__transport' />
        </div>
    );
};
