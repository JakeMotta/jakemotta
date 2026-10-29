import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiDownload } from 'react-icons/fi';
import { MdPlayArrow } from 'react-icons/md';
import { useAudioStore } from '../../../store/audio';
import { useListeningStore } from '../../../store/listening';
import { playFirstSong } from '../../../store/first-song';
import { homeProjectList, socialLinks } from '../../../common/constants';
import { listenedAgo } from '../../../common/listening';
import { findTrack, upNextTracks } from '../../../common/music';
import { useReleases } from '../../../common/modpack';
import { CoverArt, NowPlaying, PixelCube, PlayerCard, ProjectImage, sourceName, useNowListening } from '../../atoms';

/** A tile's way to open itself up: the link in its header to the overlay with the rest of it */
const ExpandLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link className='tile-expand' to={to}>
        {children} <FiArrowUpRight />
    </Link>
);

/**
 * A tile's title that opens the same overlay as its expand link. It stretches over the whole header
 * row, so the row is the click target; the row's own buttons and links sit above it.
 */
const TitleLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link className='tile-head__link' to={to}>
        {children}
    </Link>
);

/** A "HELLO my name is" sticker, tilted, whose corner peels up on hover */
export const HeroTile = () => {
    return (
        <section className='tile tile-hero' aria-labelledby='hero-name'>
            <div className='tile-hero__band'>
                <span className='tile-hero__hello'>HELLO</span>
                <span className='tile-hero__my-name'>my name is</span>
            </div>
            <div className='tile-hero__body'>
                <div className='tile-hero__who'>
                    <h1 id='hero-name' className='tile-hero__name'>
                        Jake Motta
                    </h1>
                    <p className='tile-hero__tagline'>Some of my work throughout the years</p>
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
                    <Link className='chip' to='/devlog'>
                        Dev log
                    </Link>
                </nav>
            </div>
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
    const enterSilently = useAudioStore((store) => store.enterSilently);
    const track = findTrack(audioUrl);

    const libraryLink = <ExpandLink to='/library'>Library</ExpandLink>;

    return (
        <section ref={ref} className='tile tile-now tile--dark' aria-label='Now playing'>
            {entry === 'waiting' ? (
                <>
                    <span className='eyebrow'>Welcome in</span>
                    <h2 className='tile-now__ask'>Let's kick it</h2>
                    <div className='tile-now__stage'>
                        <span className='disc disc--spin' aria-hidden>
                            <span className='disc__label'>surprise</span>
                        </span>
                    </div>
                    <button type='button' className='tile-now__go' onClick={playFirstSong}>
                        <MdPlayArrow /> Play with sound
                    </button>
                    <button type='button' className='tile-now__lame' onClick={enterSilently}>
                        <span className='tile-now__lame-rest'>Browse in silence</span>
                        <span className='tile-now__lame-hover'>Click here if you're lame</span>
                    </button>
                </>
            ) : track ? (
                <PlayerCard action={libraryLink} titleTo='/library' />
            ) : (
                <>
                    <div className='tile-now__head tile-head'>
                        <span className='eyebrow'>
                            <TitleLink to='/library'>Silence, as requested</TitleLink>
                        </span>
                        {libraryLink}
                    </div>
                    <div className='tile-now__stage'>
                        <span className='disc' aria-hidden>
                            <span className='disc__label'>shh</span>
                        </span>
                    </div>
                    <p className='tile-now__why'>Change your mind any time. I'll pick the first song.</p>
                    <button type='button' className='tile-now__go' onClick={playFirstSong}>
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

/** What plays next: the next ten songs in the shuffle, scrolling inside the tile */
export const UpNextTile = () => {
    const upNext = upNextTracks(useAudioStore((store) => store.shuffled));
    const setAudioUrl = useAudioStore((store) => store.setAudioUrl);

    return (
        <section className='tile tile-next tile--dark' aria-labelledby='up-next-title'>
            <div className='tile-next__head tile-head'>
                <h2 id='up-next-title'>
                    <TitleLink to='/library'>Up next</TitleLink>
                </h2>
                <ExpandLink to='/library'>All songs</ExpandLink>
            </div>
            <ol className='tile-next__list'>
                {upNext.map((track) => (
                    <li key={track.url}>
                        <button type='button' className='tile-next__row' onClick={() => setAudioUrl(track.url)}>
                            <CoverArt track={track} className='tile-next__cover' />
                            <span className='tile-next__name'>{track.title}</span>
                            <span className='tile-next__year'>{track.date}</span>
                        </button>
                    </li>
                ))}
            </ol>
        </section>
    );
};

/** Every project but the featured one, as small screenshots that scroll inside the tile */
export const ProjectsTile = () => (
    <section id='projects' className='tile tile-proj tile--shade' aria-labelledby='projects-title'>
        <div className='tile-proj__head tile-head'>
            <h2 id='projects-title'>
                <TitleLink to='/project'>Projects</TitleLink>
            </h2>
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
            <span className='eyebrow'>Minecraft Modpack</span>
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

/**
 * What Jake has on, from ListenBrainz (docs/listening.md): the song playing now, or else the last
 * one, then the plays before it (the last 100), scrolling inside the tile. Lately opens the top lists.
 * On a desktop it takes two cells, the one that held Favorite artists until 2026-10-27 included
 * (those live on in the library's tab).
 */
export const EarsTile = () => {
    const { listen } = useNowListening();
    const playingNow = useListeningStore((store) => !!store.nowPlaying);
    const recent = useListeningStore((store) => store.recent);
    const loaded = useListeningStore((store) => store.loaded);
    // The card shows the last play when nothing's playing, so the list starts after it
    const from = playingNow ? 0 : 1;
    // Every play the store has, which is the last 100 (getRecentListens)
    const before = recent.slice(from);

    return (
        <section className='tile tile-ears tile--light' aria-labelledby='ears-title'>
            <div className='tile-ears__head tile-head'>
                <h2 id='ears-title' className='eyebrow'>
                    <TitleLink to='/library?tab=recent'>Recent listens</TitleLink>
                </h2>
                <ExpandLink to='/library?tab=recent'>Lately</ExpandLink>
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
        <ul className='tile-hi__links'>
            {socialLinks.map(({ label, url }) => (
                <li key={label}>
                    <a className='tile-hi__link' href={url} target='_blank' rel='noreferrer'>
                        {label} <FiArrowUpRight />
                    </a>
                </li>
            ))}
        </ul>
    </section>
);
