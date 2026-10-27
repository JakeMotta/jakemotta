import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiDownload } from 'react-icons/fi';
import { MdPlayArrow } from 'react-icons/md';
import { useAudioStore } from '../../../store/audio';
import { useListeningStore } from '../../../store/listening';
import { favoriteArtists, homeProjectList, welcomeTrack } from '../../../common/constants';
import { listenedAgo } from '../../../common/listening';
import { findTrack, trackByline } from '../../../common/music';
import { useReleases } from '../../../common/modpack';
import { CoverArt, EqBars, NowPlaying, PixelCube, ProjectImage, sourceName, TrackProgress, Transport, useNowListening } from '../../atoms';

/** A tile's way to open itself up: the link in its header to the overlay with the rest of it */
const ExpandLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link className='tile-expand' to={to}>
        {children} <FiArrowUpRight />
    </Link>
);

export const HeroTile = () => {
    const isPlaying = useAudioStore((store) => store.isPlaying);

    return (
        <section className='tile tile-hero tile--outline' aria-labelledby='hero-name'>
            <div className='tile-hero__top'>
                <span>jakemotta.com</span>
                <span className='tile-hero__sound'>
                    <EqBars /> {isPlaying ? 'sound on' : 'sound off'}
                </span>
            </div>
            <div>
                <h1 id='hero-name' className='tile-hero__name'>
                    Jake Motta
                </h1>
                <p className='tile-hero__tagline'>A slice of work throughout the years</p>
            </div>
            <nav className='tile-hero__chips' aria-label='Sections'>
                <Link className='chip' to='/library'>
                    Music
                </Link>
                <Link className='chip' to='/project'>
                    Projects
                </Link>
                <Link className='chip' to='/minecraft'>
                    Minecraft
                </Link>
            </nav>
        </section>
    );
};

/**
 * The player, and before the visitor has chosen, the way in: browsers only allow sound after a
 * click, so this tile asks for one while the rest of the board waits.
 */
export const NowPlayingTile = forwardRef<HTMLElement>((_, ref) => {
    const entry = useAudioStore((store) => store.entry);
    const audioUrl = useAudioStore((store) => store.audioUrl);
    const isPlaying = useAudioStore((store) => store.isPlaying);
    const setAudioUrl = useAudioStore((store) => store.setAudioUrl);
    const enterSilently = useAudioStore((store) => store.enterSilently);
    const togglePlayback = useAudioStore((store) => store.togglePlayback);
    const track = findTrack(audioUrl);

    const libraryLink = <ExpandLink to='/library'>Library</ExpandLink>;

    return (
        <section ref={ref} className='tile tile-now tile--dark' aria-label='Now playing'>
            {entry === 'waiting' ? (
                <>
                    <span className='eyebrow'>Welcome in</span>
                    <h2 className='tile-now__ask'>Press play to come in</h2>
                    <p className='tile-now__why'>The music follows you around the whole site. Your browser just wants a click first.</p>
                    <div className='tile-now__stage'>
                        <span className='disc disc--spin' aria-hidden>
                            <span className='disc__label'>{welcomeTrack.title}</span>
                        </span>
                    </div>
                    <p className='tile-now__first'>First up: {welcomeTrack.title}, the welcome track</p>
                    <button type='button' className='tile-now__go' onClick={() => setAudioUrl(welcomeTrack.url)}>
                        <MdPlayArrow /> Play with sound
                    </button>
                    <button type='button' className='tile-now__lame' onClick={enterSilently}>
                        <span className='tile-now__lame-rest'>Browse in silence</span>
                        <span className='tile-now__lame-hover'>Click here if you're lame</span>
                    </button>
                </>
            ) : track ? (
                <>
                    <div className='tile-now__head'>
                        <span className='eyebrow'>
                            <EqBars bars={4} /> {isPlaying ? 'Now playing' : 'Paused'}
                        </span>
                        {libraryLink}
                    </div>
                    <CoverArt track={track} className='tile-now__cover' />
                    <div>
                        <h2 className='tile-now__title'>{track.title}</h2>
                        <p className='tile-now__byline'>{trackByline(track)}</p>
                    </div>
                    <TrackProgress />
                    <Transport />
                </>
            ) : (
                <>
                    <div className='tile-now__head'>
                        <span className='eyebrow'>Silence, as requested</span>
                        {libraryLink}
                    </div>
                    <div className='tile-now__stage'>
                        <span className='disc' aria-hidden>
                            <span className='disc__label'>shh</span>
                        </span>
                    </div>
                    <p className='tile-now__why'>Change your mind any time. It starts with {welcomeTrack.title}.</p>
                    <button type='button' className='tile-now__go' onClick={togglePlayback}>
                        <MdPlayArrow /> Play some music
                    </button>
                </>
            )}
        </section>
    );
});

/** The newest project, big */
export const FeaturedTile = () => {
    const project = homeProjectList[0];

    return (
        <Link className='tile tile-feat' to={`/project/${project.id}`}>
            <ProjectImage project={project} className='tile-feat__image' />
            <span className='tile-feat__badge'>Newest</span>
            <span className='tile-feat__arrow' aria-hidden>
                <FiArrowUpRight />
            </span>
            <span className='tile-feat__panel'>
                <strong className='tile-feat__title'>
                    {project.title} <span>· {project.date}</span>
                </strong>
                {project.description && <span className='tile-feat__description'>{project.description}</span>}
            </span>
        </Link>
    );
};

/** What plays next: the queue first, numbered, then the shuffle */
export const UpNextTile = () => {
    const queue = useAudioStore((store) => store.queue);
    const shuffled = useAudioStore((store) => store.shuffled);
    const setAudioUrl = useAudioStore((store) => store.setAudioUrl);
    const rows = [...queue.map((url, i) => ({ url, position: i + 1 })), ...shuffled.filter((url) => !queue.includes(url)).map((url) => ({ url, position: 0 }))].slice(0, 4);

    return (
        <section className='tile tile-next tile--dark' aria-labelledby='up-next-title'>
            <div className='tile-next__head'>
                <div>
                    <h2 id='up-next-title'>Up next</h2>
                    <span>{queue.length ? `${queue.length} queued, then shuffle` : 'shuffled'}</span>
                </div>
                <ExpandLink to='/library'>Queue</ExpandLink>
            </div>
            <ol className='tile-next__list'>
                {rows.map(({ url, position }) => {
                    const track = findTrack(url);
                    if (!track) return null;
                    return (
                        <li key={url}>
                            <button type='button' className='tile-next__row' onClick={() => setAudioUrl(url)}>
                                <CoverArt track={track} className='tile-next__cover' />
                                <span className='tile-next__name'>{track.title}</span>
                                {position ? (
                                    <span className='tile-next__position' title={`Queued #${position}`}>
                                        {position}
                                    </span>
                                ) : (
                                    <span className='tile-next__year'>{track.date}</span>
                                )}
                            </button>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
};

/** Every project but the featured one, as small screenshots that scroll inside the tile */
export const ProjectsTile = () => (
    <section id='projects' className='tile tile-proj tile--shade' aria-labelledby='projects-title'>
        <div className='tile-proj__head'>
            <h2 id='projects-title'>Projects</h2>
            <ExpandLink to='/project'>All {homeProjectList.length}</ExpandLink>
        </div>
        <ul className='tile-proj__grid'>
            {homeProjectList.slice(1).map((project) => (
                <li key={project.id}>
                    <Link className='project-thumb' to={`/project/${project.id}`}>
                        <ProjectImage project={project} className='project-thumb__image' />
                        <span className='project-thumb__label'>
                            <span className='project-thumb__name'>{project.title}</span>
                            <span>{project.date}</span>
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    </section>
);

export const ModpackTile = () => {
    const { releases } = useReleases();
    const latest = releases?.[0];

    return (
        <Link className='tile tile-mc tile--light' to='/minecraft'>
            <PixelCube className='tile-mc__cube' />
            <span className='eyebrow'>Modpack</span>
            <span>
                <strong className='tile-mc__title'>Progression Survival</strong>
                <span className='tile-mc__version'>{latest ? `${latest.version} · Minecraft ${latest.minecraft}` : 'Our modded Minecraft server'}</span>
            </span>
            <span className='tile-mc__cta'>
                <FiDownload /> Download &amp; install
            </span>
        </Link>
    );
};

export const ArtistsTile = () => {
    const setAudioUrl = useAudioStore((store) => store.setAudioUrl);

    return (
        <section className='tile tile-art tile--dark' aria-labelledby='artists-title'>
            <div className='tile-art__head'>
                <h2 id='artists-title' className='eyebrow'>
                    Favorite artists
                </h2>
                <ExpandLink to='/library?tab=favorites'>Library</ExpandLink>
            </div>
            <div className='tile-art__names'>
                {favoriteArtists.map((artist) => (
                    <button key={artist.title} type='button' className='tile-art__name' onClick={() => setAudioUrl(artist.url)}>
                        {artist.title}
                    </button>
                ))}
            </div>
            <p className='tile-art__hint'>Tap a name to hear why.</p>
        </section>
    );
};

/**
 * What Jake has on, from ListenBrainz (docs/listening.md): the song playing now, or else the last
 * one, then the few before it. Lately opens the rest.
 */
export const EarsTile = () => {
    const { listen } = useNowListening();
    const playingNow = useListeningStore((store) => !!store.nowPlaying);
    const recent = useListeningStore((store) => store.recent);
    const loaded = useListeningStore((store) => store.loaded);
    // The card shows the last play when nothing's playing, so the list starts after it
    const from = playingNow ? 0 : 1;
    const before = recent.slice(from, from + 3);

    return (
        <section className='tile tile-ears tile--light' aria-labelledby='ears-title'>
            <div className='tile-ears__head'>
                <h2 id='ears-title' className='eyebrow'>
                    In Jake's ears
                </h2>
                <ExpandLink to='/listening'>Lately</ExpandLink>
            </div>
            {listen ? (
                <>
                    <NowPlaying compact className='tile-ears__card' />
                    <ol className='tile-ears__before' aria-label='Before that'>
                        {before.map((play, i) => {
                            const ago = play.listenedAt ? listenedAgo(play.listenedAt).replace(/ ago$/, '') : '';
                            const row = (
                                <>
                                    <span className='tile-ears__name'>
                                        <strong>{play.title}</strong> · {play.artist}
                                    </span>
                                    <span className='tile-ears__ago'>{ago}</span>
                                </>
                            );
                            const service = sourceName[play.source];
                            return (
                                <li key={`${play.listenedAt}-${i}`}>
                                    {play.link ? (
                                        <a href={play.link} target='_blank' rel='noopener noreferrer' aria-label={`${play.title} by ${play.artist}, ${ago}${service ? `. Opens ${service} in a new tab` : ''}`}>
                                            {row}
                                        </a>
                                    ) : (
                                        <span>{row}</span>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </>
            ) : (
                <p className='tile-ears__empty'>{loaded ? 'Quiet in here for now.' : 'Tuning in…'}</p>
            )}
        </section>
    );
};

export const SayHiTile = () => (
    <section className='tile tile-hi tile--shade' aria-labelledby='say-hi-title'>
        <h2 id='say-hi-title' className='tile-hi__title'>
            Say hi
        </h2>
        <a className='tile-hi__link' href='https://github.com/JakeMotta' target='_blank' rel='noreferrer'>
            GitHub <FiArrowUpRight />
        </a>
    </section>
);
