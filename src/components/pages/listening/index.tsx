import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { BentoOverlay } from '../../templates';
import { Lately, ListenAlongButton, ListenCover, MiniPlayer, useNowListening } from '../../atoms';
import './index.scss';

/**
 * The board's In Jake's ears tile opened, at /listening: the song Jake has on now (or had on last),
 * big, beside everything Lately has, his recent plays and his top songs, albums and artists.
 */
export const Listening = () => {
    const navigate = useNavigate();
    const { listen, live, label, service } = useNowListening();

    return (
        <BentoOverlay label="In Jake's ears" onClose={() => navigate('/')} className='listening'>
            <header className='listening__head'>
                <div className='listening__intro'>
                    <h2>In Jake's ears</h2>
                    <p>What Jake's got on right now, and what he's had on lately.</p>
                </div>
                <MiniPlayer className='listening__player' />
            </header>

            <div className='listening__body'>
                {listen && (
                    <section className='listening__now' aria-labelledby='listening-title'>
                        <ListenCover title={listen.title} cover={listen.cover} spotifyUrl={listen.spotifyUrl} className='listening__cover' />
                        <span className='listening__label'>
                            {live && <span className='now-playing__dot' aria-hidden />}
                            {live && service ? `${label} on ${service}` : label}
                        </span>
                        <div>
                            <h3 id='listening-title' className='listening__title'>
                                {listen.title}
                            </h3>
                            <p className='listening__byline'>{[listen.artist, listen.album].filter(Boolean).join(' · ')}</p>
                        </div>
                        <div className='listening__actions'>
                            {listen.link && (
                                <a className='listening__open' href={listen.link} target='_blank' rel='noopener noreferrer'>
                                    Open in {service ?? 'a new tab'} <FiArrowUpRight aria-hidden />
                                </a>
                            )}
                            <ListenAlongButton />
                        </div>
                    </section>
                )}
                <Lately pageSize={10} />
            </div>
        </BentoOverlay>
    );
};
