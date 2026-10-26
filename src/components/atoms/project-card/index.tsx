import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import './index.scss';

interface ProjectCardProps {
    image: string;
    title: string;
    date: string;
    description: string;
    /** Full page load: the projects are standalone sites, not routes in this app */
    href?: string;
}

/**
 * Screenshot-first card. On devices that can hover, only a name pill shows until hover or
 * keyboard focus slides the details panel up. On touch screens the panel is always visible
 * as a compact bar, since there is no hover to reveal it.
 */
export const ProjectCard = ({ image, title, date, description, href }: ProjectCardProps) => {
    const monogram = title.replace(/[^A-Za-z0-9]/g, '').slice(0, 5);

    return (
        <a className="project-card" href={href}>
            {image ? (
                <img className="project-card__image" src={image} alt="" />
            ) : (
                <div className="project-card__monogram" aria-hidden>
                    {monogram}
                </div>
            )}

            <span className="project-card__label" aria-hidden>
                {title} <span className="project-card__year">{date}</span>
            </span>

            <div className="project-card__panel">
                <div className="project-card__text">
                    <div className="project-card__head">
                        <h3 className="project-card__title">{title}</h3>
                        <span className="project-card__year">{date}</span>
                    </div>
                    {description && <p className="project-card__description">{description}</p>}
                </div>

                <span className="project-card__cta">
                    Visit site <FiArrowUpRight />
                </span>
                <span className="project-card__arrow" aria-hidden>
                    <FiArrowUpRight />
                </span>
            </div>
        </a>
    );
};
