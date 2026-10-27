import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { BentoOverlay, OverlayHeader } from '../../templates';
import { ProjectImage } from '../../atoms';
import { homeProjectList } from '../../../common/constants';
import './index.scss';

/**
 * The Projects tile opened: every project, newest first, each opening in the viewer. It lives at
 * /project (singular), since /projects/ is the folder of standalone sites that the server never
 * hands to this app.
 */
export const ProjectGallery = () => {
    const navigate = useNavigate();

    return (
        <BentoOverlay label='All projects' onClose={() => navigate('/')} className='gallery'>
            <OverlayHeader title='Projects' subtitle="Everything I've built, drawn and animated over the years, newest first." />

            <ul className='gallery__grid'>
                {homeProjectList.map((project, i) => (
                    <li key={project.id}>
                        {/* The viewer goes back here, not to the board, when it was opened from here */}
                        <Link className='gallery__card' to={`/project/${project.id}`} state={{ from: 'gallery' }}>
                            <span className='gallery__frame'>
                                <ProjectImage project={project} className='gallery__image' />
                                {i === 0 && <span className='gallery__badge'>Newest</span>}
                                <span className='gallery__arrow' aria-hidden>
                                    <FiArrowUpRight />
                                </span>
                            </span>
                            <span className='gallery__title'>
                                <strong>{project.title}</strong>
                                <span>{project.date}</span>
                            </span>
                            {project.description && <span className='gallery__description'>{project.description}</span>}
                        </Link>
                    </li>
                ))}
            </ul>
        </BentoOverlay>
    );
};
