import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { ColorShiftingBackground } from '../../templates';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import './index.scss';
import { ProjectCard } from '../../atoms';

/**
 * Build a backend. Hookup spotify API, and listen for my play events. Whatever i'm listening to, play that 
 * on the site. May need to use Youtube. Maybe show cover art. Maybe match bpm via server song analysis. If it's from 
 * spotify, that may have the details. Also musicbrainz. 
 */

const SECTIONS = {
    stats: 'Stats',
    projects: 'Projects',
    music: 'Music',
    work: 'Work',
    contact: 'Contact'
} as const;

const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
};

export const Home = () => {
    let navigate = useNavigate();
    const { primaryColor, primaryDark } = useTheme();

    return (
        <ColorShiftingBackground>
            <div className='flex flex-col items-center gap-4 py-8 px-16 h-screen'>
                <div className='flex flex-row w-full gap-4 overflow-y-hidden overflow-x-auto mb-4'>
                    {Object.entries(SECTIONS).map(([id, label]) => (
                        <div
                            key={id}
                            className='nav-item cursor-pointer'
                            onClick={() => scrollToSection(id)}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                <div className='flex flex-col gap-4 overflow-y-auto overflow-x-hidden h-full w-full'>
                    {Object.entries(SECTIONS).map(([id, label]) => (
                        <div className='section-wrapper'>
                            <div key={id} id={id} className='flex text-primary-dark text-2xl font-bold mb-4'>
                                {label}
                            </div>

                            <div className='item-wrapper pr-4'>
                                <div className='flex flex-row flex-wrap justify-between gap-8'>
                                    <ProjectCard image="" title="Project 1" date='2025' description="This is a project with a long description that wraps around to the next line This is a project with a long description that wraps around to the next line" />
                                    <ProjectCard image="" title="Project 2" date='2025' description="" />
                                    <ProjectCard image="" title="Project 3" date='2025' description="This is a project with a long description that wraps around to the next line" />
                                    <ProjectCard image="" title="Project 4" date='2025' description="This is a project with a long description that wraps around to the next line" />
                                    <ProjectCard image="" title="Project 5" date='2025' description="This is a project with a long description that wraps around to the next line" />
                                    <ProjectCard image="" title="Project 6" date='2025' description="This is a project with a long description that wraps around to the next line" />
                                    <ProjectCard image="" title="Project 7" date='2025' description="" />
                                    <ProjectCard image="" title="Project 8" date='2025' description="This is a project with a long description that wraps around to the next line" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ColorShiftingBackground>
    );
}