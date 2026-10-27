import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { BentoOverlay, OverlayHeader } from '../../templates';
import { ProjectImage } from '../../atoms';
import { homeProjectList } from '../../../common/constants';
import { projectSections } from '../../../common/projects';
import './index.scss';

/**
 * The Projects tile opened: every project, sorted into websites, apps, games, art and animation,
 * each section newest first, and each project opening in the viewer. It lives at
 * /project (singular), since /projects/ is the folder of standalone sites that the server never
 * hands to this app.
 */
export const ProjectGallery = () => {
    const navigate = useNavigate();

    return (
        <BentoOverlay label='All projects' onClose={() => navigate('/')} className='gallery'>
            <OverlayHeader title='Projects' subtitle="Everything I've built, drawn and animated over the years." />

            <div className='gallery__body'>
                {projectSections.map((section) => (
                    <section key={section.id} className='gallery__section' aria-labelledby={`gallery-${section.id}`}>
                        <h3 id={`gallery-${section.id}`} className='gallery__heading'>
                            {section.label} <span>{section.projects.length}</span>
                        </h3>
                        <ul className='gallery__grid'>
                            {section.projects.map((project) => (
                                <li key={project.id}>
                                    {/* The viewer goes back here, not to the board, when it was opened from here */}
                                    <Link className='gallery__card' to={`/project/${project.id}`} state={{ from: 'gallery' }}>
                                        <span className='gallery__frame'>
                                            <ProjectImage project={project} className='gallery__image' />
                                            {project === homeProjectList[0] && <span className='gallery__badge'>Newest</span>}
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
                    </section>
                ))}
            </div>
        </BentoOverlay>
    );
};
