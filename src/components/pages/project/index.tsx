import React, { useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiInfo } from 'react-icons/fi';
import { BentoOverlay } from '../../templates';
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

export const ProjectViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const frameRef = useRef<HTMLIFrameElement>(null);
    const [loadedId, setLoadedId] = useState<string>();
    const index = homeProjectList.findIndex((item) => item.id === id);
    const project = homeProjectList[index];
    // Opened from the all-projects overlay, closing goes back there; opened from the board, back to the board
    const fromGallery = (location.state as { from?: string } | null)?.from === 'gallery';
    const close = () => navigate(fromGallery ? '/project' : '/');

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
    // Stepping between projects replaces the entry, so Back in the browser closes the viewer instead of retracing every project
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
                <div className='viewer__frame'>
                    {project.preview ? (
                        <>
                            {loadedId !== project.id && <div className='viewer__loading'>Loading {project.title}…</div>}
                            <iframe key={project.id} ref={frameRef} src={project.preview} title={`${project.title} preview`} onLoad={onFrameLoad} />
                            <a className='viewer__button viewer__button--solid viewer__open' href={project.preview} target='_blank' rel='noreferrer'>
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
                    <h2 className='viewer__title'>{project.title}</h2>
                    <ul className='viewer__tags' aria-label='About this project'>
                        <li>{project.date}</li>
                        {project.tags?.map((tag) => (
                            <li key={tag}>{tag}</li>
                        ))}
                    </ul>
                </div>
                {project.description && <p className='viewer__description'>{project.description}</p>}
                {project.preview && (
                    <p className='viewer__how'>
                        <FiInfo aria-hidden />
                        {isLive(project.preview) ? `This is the real thing, live at ${new URL(project.preview).host}.` : 'This is the original, saved just the way it was. Click around!'}
                    </p>
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
