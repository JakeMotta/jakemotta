import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FiArrowUpRight, FiChevronLeft, FiChevronRight, FiInfo, FiLock } from 'react-icons/fi';
import { BentoOverlay } from '../../templates';
import { MiniPlayer, ProjectImage } from '../../atoms';
import { homeProjectList } from '../../../common/constants';
import './index.scss';

/**
 * A project tile opened: the project's hosted copy (see `preview` in constants) framed over the
 * board, so the background, the music and the visualizer keep going while a visitor clicks around it.
 * Most framed sites are same-origin files under /projects/. A project live on its own domain
 * (TapSlayDie) is framed at that address instead; its document is cross-origin, so the link
 * handling below can't reach it and its links behave as that site wrote them.
 */

const FRAMEABLE = ['/projects/', '/vendor/'];

const isFrameable = (link: HTMLAnchorElement) => link.origin === window.location.origin && FRAMEABLE.some((path) => link.pathname.startsWith(path));

const navigates = (link: HTMLAnchorElement) => !/^javascript:$/i.test(link.protocol);

const isLive = (preview: string) => /^https?:\/\//i.test(preview);

// What the address bar shows: the host and folder, without the page file
const address = (preview: string) => {
    const url = new URL(preview, window.location.origin);
    const host = isLive(preview) ? url.host : 'jakemotta.com';
    return `${host}${url.pathname.replace(/index\.html$/, '')}`.replace(/\/$/, '');
};

export const ProjectViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const frameRef = useRef<HTMLIFrameElement>(null);
    const stripRef = useRef<HTMLUListElement>(null);
    const stripPlaced = useRef(false);
    const [loadedId, setLoadedId] = useState<string>();
    const index = homeProjectList.findIndex((item) => item.id === id);
    const project = homeProjectList[index];
    // Opened from the all-projects overlay, closing goes back there; opened from the board, back to the board
    const fromGallery = (location.state as { from?: string } | null)?.from === 'gallery';
    const close = () => navigate(fromGallery ? '/project' : '/');

    // The strip holds more projects than fit, so it centres the open one: at once on opening, then gliding as the visitor steps
    useEffect(() => {
        const strip = stripRef.current;
        const current = strip?.querySelector<HTMLElement>('[aria-current]');
        if (!strip || !current) return;
        const left = strip.scrollLeft + current.getBoundingClientRect().left - strip.getBoundingClientRect().left - (strip.clientWidth - current.offsetWidth) / 2;
        const glide = stripPlaced.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        strip.scrollTo({ left, behavior: glide ? 'smooth' : 'auto' });
        stripPlaced.current = true;
    }, [id]);

    if (!project) {
        return (
            <BentoOverlay label='Project not found' onClose={close} className='viewer viewer--missing'>
                <h2 className='viewer__missing-title'>That project doesn't exist</h2>
                <Link to='/' className='viewer__button viewer__button--solid'>
                    Back to the board
                </Link>
            </BentoOverlay>
        );
    }

    const count = homeProjectList.length;
    const previous = homeProjectList[(index - 1 + count) % count];
    const next = homeProjectList[(index + 1) % count];
    // Stepping between projects replaces the entry, so Back closes the viewer instead of retracing every project
    const show = (projectId: string) => navigate(`/project/${projectId}`, { replace: true, state: location.state });

    const onFrameLoad = () => {
        setLoadedId(project.id);
        const doc = frameRef.current?.contentDocument;
        if (!doc) return;
        doc.addEventListener('click', (event) => {
            const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
            if (!link || link.getAttribute('href')?.startsWith('#') || !navigates(link) || isFrameable(link)) return;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        });
    };

    return (
        <BentoOverlay label={`${project.title} preview`} onClose={close} className='viewer'>
            <div className='viewer__stage'>
                <div className='viewer__bar'>
                    <button type='button' className='viewer__icon' aria-label={`Previous project: ${previous.title}`} onClick={() => show(previous.id)}>
                        <FiChevronLeft />
                    </button>
                    <button type='button' className='viewer__icon' aria-label={`Next project: ${next.title}`} onClick={() => show(next.id)}>
                        <FiChevronRight />
                    </button>
                    <span className='viewer__address'>
                        <FiLock aria-hidden />
                        <span>{project.preview ? address(project.preview) : project.title}</span>
                    </span>
                    {project.preview && (
                        <a className='viewer__button viewer__button--solid' href={project.preview} target='_blank' rel='noreferrer'>
                            <span className='viewer__label'>Open in new tab</span> <FiArrowUpRight />
                        </a>
                    )}
                </div>

                <div className='viewer__frame'>
                    {project.preview ? (
                        <>
                            {loadedId !== project.id && <div className='viewer__loading'>Loading {project.title}…</div>}
                            <iframe key={project.id} ref={frameRef} src={project.preview} title={`${project.title} preview`} onLoad={onFrameLoad} />
                        </>
                    ) : (
                        <div className='viewer__empty'>
                            {project.image && <img className='viewer__still' src={project.image} alt={`Screenshot of ${project.title}`} />}
                            <p>There's no live preview of {project.title} yet.</p>
                        </div>
                    )}
                </div>

                <ul ref={stripRef} className='viewer__strip' aria-label='All projects'>
                    {homeProjectList.map((item) => (
                        <li key={item.id}>
                            <button
                                type='button'
                                className={`viewer__thumb${item.id === project.id ? ' viewer__thumb--on' : ''}`}
                                aria-current={item.id === project.id ? 'true' : undefined}
                                onClick={() => show(item.id)}>
                                <ProjectImage project={item} className='viewer__thumb-image' />
                                <span>{item.title}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <aside className='viewer__side'>
                <span className='viewer__eyebrow'>
                    Project {index + 1} of {count}
                </span>
                <div>
                    <h2 className='viewer__title'>{project.title}</h2>
                    <span className='viewer__year'>{project.date}</span>
                </div>
                {project.description && <p className='viewer__description'>{project.description}</p>}
                {project.preview && (
                    <p className='viewer__how'>
                        <FiInfo aria-hidden />
                        {isLive(project.preview)
                            ? `The live site at ${new URL(project.preview).host}. Its links work the way that site wrote them.`
                            : 'An archived copy, running as plain files in your browser. Links that leave it open in a new tab.'}
                    </p>
                )}
                <div className='viewer__steps'>
                    <button type='button' className='viewer__step' onClick={() => show(previous.id)}>
                        <span>← {previous.title}</span>
                        <span>Previous</span>
                    </button>
                    <button type='button' className='viewer__step' onClick={() => show(next.id)}>
                        <span>Next</span>
                        <span>{next.title} →</span>
                    </button>
                    <Link className='viewer__step' to='/project'>
                        <span>All projects</span>
                        <span>{count}</span>
                    </Link>
                </div>
                <MiniPlayer className='viewer__player' />
            </aside>
        </BentoOverlay>
    );
};
