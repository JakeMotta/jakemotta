import React, { useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiDownload } from 'react-icons/fi';
import { BentoOverlay } from '../../templates';
import { homeProjectList, movedProjects } from '../../../common/constants';
import { orderedProjects } from '../../../common/projects';
import './index.scss';

/**
 * A project tile opened: the project's hosted copy (see `preview` in constants) framed over the
 * board, so the background, the music and the visualizer keep going while a visitor clicks around it.
 * Most framed sites are same-origin files under /projects/. A project live on its own domain
 * (TapSlayDie) is framed at that address instead; its document is cross-origin, so the link
 * handling below can't reach it and its links behave as that site wrote them.
 *
 * A hub's pages (`pages` in constants, like Ambii Business's apps) open at /project/:id/:page, one
 * step in: closing one, with Escape or the close button, returns to the hub.
 */

const FRAMEABLE = ['/projects/', '/vendor/'];

const isFrameable = (link: HTMLAnchorElement) => link.origin === window.location.origin && FRAMEABLE.some((path) => link.pathname.startsWith(path));

const navigates = (link: HTMLAnchorElement) => !/^javascript:$/i.test(link.protocol);

const pathOf = (url: string) => decodeURIComponent(new URL(url, window.location.origin).pathname);

interface ViewerState {
    // 'gallery' when opened from the all-projects overlay
    from?: string;
    // The exact address a hub's link to one of its pages pointed at, query and hash included
    src?: string;
}

export const ProjectViewer = () => {
    const { id, page: slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const frameRef = useRef<HTMLIFrameElement>(null);
    const [loadedId, setLoadedId] = useState<string>();
    const project = homeProjectList.find((item) => item.id === id);
    const page = slug ? project?.pages?.find((item) => item.slug === slug) : undefined;
    const state = location.state as ViewerState | null;
    // A page closes back to its hub. A project opened from the all-projects overlay closes back there; from the board, to the board
    const fromGallery = state?.from === 'gallery';
    const close = () => (page && project ? navigate(`/project/${project.id}`, { state: { from: state?.from } }) : navigate(fromGallery ? '/project' : '/'));

    if (!project) {
        const moved = id && movedProjects[id];
        if (moved) return <Navigate to={`/project/${moved}${slug ? `/${slug}` : ''}`} replace state={location.state} />;
        return (
            <BentoOverlay label='Project not found' onClose={close} className='viewer viewer--missing'>
                <h2 className='viewer__missing-title'>That project doesn't exist</h2>
                <Link to='/' className='viewer__button viewer__button--solid'>
                    Back to the board
                </Link>
            </BentoOverlay>
        );
    }

    if (slug && !page) return <Navigate to={`/project/${project.id}`} replace state={{ from: state?.from }} />;

    const src = page ? state?.src || page.preview : project.preview;
    const frameKey = page ? `${project.id}/${page.slug}` : project.id;
    const title = page ? page.title : project.title;

    // Back and Forward step through the projects in the all-projects overlay's order
    const count = orderedProjects.length;
    const position = orderedProjects.indexOf(project);
    const previous = orderedProjects[(position - 1 + count) % count];
    const next = orderedProjects[(position + 1) % count];
    // Stepping between projects replaces the entry, so Back in the browser closes the viewer instead of retracing every project
    const show = (projectId: string) => navigate(`/project/${projectId}`, { replace: true, state: { from: state?.from } });

    // A link to one of the hub's pages opens that page's address, a step in, rather than inside the frame
    const pageAt = (url: { origin: string; href: string }) => {
        if (url.origin !== window.location.origin) return undefined;
        const path = pathOf(url.href);
        return project.pages?.find((item) => item !== page && pathOf(item.preview) === path);
    };

    const onFrameLoad = () => {
        setLoadedId(frameKey);
        const doc = frameRef.current?.contentDocument;
        if (!doc) return;
        // The frame reached one of the pages some other way, like a click before the hub had loaded: move to its
        // address, in place of the entry that navigation made, so Escape and Back return to the hub
        const reached = doc.location && pageAt(doc.location);
        if (reached) {
            navigate(`/project/${project.id}/${reached.slug}`, { replace: true, state: { from: state?.from, src: doc.location.pathname + doc.location.search + doc.location.hash } });
            return;
        }
        doc.addEventListener('click', (event) => {
            const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
            if (!link || link.getAttribute('href')?.startsWith('#') || !navigates(link)) return;
            const target = pageAt(link);
            if (target && !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                event.preventDefault();
                navigate(`/project/${project.id}/${target.slug}`, { state: { from: state?.from, src: link.pathname + link.search + link.hash } });
                return;
            }
            if (isFrameable(link)) return;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        });
    };

    return (
        <BentoOverlay label={`${title} preview`} onClose={close} className='viewer'>
            <div className='viewer__stage'>
                <div className='viewer__frame'>
                    {src ? (
                        <>
                            {loadedId !== frameKey && <div className='viewer__loading'>Loading {title}…</div>}
                            <iframe key={frameKey} ref={frameRef} src={src} title={`${title} preview`} onLoad={onFrameLoad} />
                            <a className='viewer__button viewer__button--solid viewer__open' href={src} target='_blank' rel='noreferrer'>
                                Open in a new tab <FiArrowUpRight aria-hidden />
                            </a>
                        </>
                    ) : (
                        <div className='viewer__empty'>
                            {project.image && <img className='viewer__still' src={project.image} alt={`Screenshot of ${project.title}`} />}
                            <p>There's no live preview of {project.title} yet.</p>
                        </div>
                    )}
                </div>
            </div>

            <aside className='viewer__side'>
                <div className='viewer__head'>
                    {page && (
                        <button type='button' className='viewer__crumb' onClick={close}>
                            <FiArrowLeft aria-hidden /> {project.title}
                        </button>
                    )}
                    <h2 className='viewer__title'>{title}</h2>
                    <ul className='viewer__tags' aria-label='About this project'>
                        <li>{project.date}</li>
                        {project.tags?.map((tag) => (
                            <li key={tag}>{tag}</li>
                        ))}
                    </ul>
                </div>
                {project.description && <p className='viewer__description'>{project.description}</p>}
                {project.download && (
                    <div className='viewer__download'>
                        <a className='viewer__button viewer__button--solid' href={project.download.url} download>
                            <FiDownload aria-hidden /> {project.download.label}
                        </a>
                        {project.download.note && <p>{project.download.note}</p>}
                    </div>
                )}
                <div className='viewer__steps'>
                    <button type='button' className='viewer__step' aria-label={`Back: ${previous.title}`} onClick={() => show(previous.id)}>
                        <FiArrowLeft aria-hidden /> Back
                    </button>
                    <button type='button' className='viewer__step' aria-label={`Forward: ${next.title}`} onClick={() => show(next.id)}>
                        Forward <FiArrowRight aria-hidden />
                    </button>
                </div>
            </aside>
        </BentoOverlay>
    );
};
