import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowUpRight } from 'react-icons/fi';
import { ColorShiftingBackground } from '../../templates';
import { homeProjectList } from '../../../common/constants';
import './index.scss';

/**
 * Frames a project's hosted copy (see `preview` in constants) inside the site, so the
 * background, the music and the visualizer keep going while a visitor clicks around it.
 * The framed sites are same-origin files under /projects/.
 */

// Paths the framed sites may navigate to inside the frame. Anything else (another site,
// or this app itself) opens in a new tab rather than replacing the project in the frame.
const FRAMEABLE = ['/projects/', '/vendor/'];

const isFrameable = (link: HTMLAnchorElement) => link.origin === window.location.origin && FRAMEABLE.some((path) => link.pathname.startsWith(path));

export const ProjectViewer = () => {
    const { id } = useParams();
    const project = homeProjectList.find((item) => item.id === id);
    const frameRef = useRef<HTMLIFrameElement>(null);
    const [loaded, setLoaded] = useState(false);

    const onFrameLoad = () => {
        setLoaded(true);
        const doc = frameRef.current?.contentDocument;
        if (!doc) return;
        // Decided per click rather than once on load, so links a page adds later are covered too.
        doc.addEventListener('click', (event) => {
            const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
            if (!link || link.getAttribute('href')?.startsWith('#') || isFrameable(link)) return;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        });
    };

    if (!project) {
        return (
            <ColorShiftingBackground>
                <div className='flex flex-col items-center justify-center gap-4 h-screen text-primary-dark'>
                    <h1 className='text-3xl font-bold'>That project doesn't exist</h1>
                    <Link to='/home' className='project-viewer__button project-viewer__button--solid'>
                        <FiArrowLeft /> Back to projects
                    </Link>
                </div>
            </ColorShiftingBackground>
        );
    }

    return (
        <ColorShiftingBackground>
            <div className='project-viewer'>
                <header className='project-viewer__bar'>
                    <Link to='/home' className='project-viewer__button'>
                        <FiArrowLeft /> Back
                    </Link>

                    <div className='project-viewer__heading'>
                        <h1 className='project-viewer__title'>{project.title}</h1>
                        <span className='project-viewer__year'>{project.date}</span>
                    </div>

                    {project.preview && (
                        <a className='project-viewer__button project-viewer__button--solid' href={project.preview} target='_blank' rel='noreferrer'>
                            <span className='project-viewer__label'>Open in new tab</span> <FiArrowUpRight />
                        </a>
                    )}
                </header>

                {project.preview ? (
                    <div className='project-viewer__stage'>
                        {!loaded && <div className='project-viewer__loading'>Loading {project.title}…</div>}
                        <iframe ref={frameRef} className='project-viewer__frame' src={project.preview} title={`${project.title} preview`} onLoad={onFrameLoad} />
                    </div>
                ) : (
                    <div className='project-viewer__stage project-viewer__stage--empty'>
                        {project.image && <img className='project-viewer__still' src={project.image} alt={`Screenshot of ${project.title}`} />}
                        <p className='project-viewer__note'>There's no live preview of {project.title} yet.</p>
                        {project.description && <p className='project-viewer__description'>{project.description}</p>}
                    </div>
                )}
            </div>
        </ColorShiftingBackground>
    );
};
