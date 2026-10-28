import React from 'react';
import { HomeProject } from '../../../common/constants';
import './index.scss';

/** A project's screenshot, or a monogram tile in the hue when it has none. Never an empty image. */
export const ProjectImage = ({ project, className = '' }: { project: HomeProject; className?: string }) =>
    project.image ? (
        <img className={`project-image ${className}`} src={project.image} alt='' loading='lazy' decoding='async' />
    ) : (
        <span className={`project-image project-image--monogram ${className}`} aria-hidden>
            <span>{project.title.replace(/[^A-Za-z0-9]/g, '').slice(0, 5)}</span>
        </span>
    );
