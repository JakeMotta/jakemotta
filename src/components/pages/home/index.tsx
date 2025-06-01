import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { ColorShiftingBackground } from '../../templates';
import { useNavigate } from 'react-router-dom';
import { ProjectCard } from '../../atoms';
import { useAudioStore } from '../../../store/audio';
import './index.scss';

/**
 * Build a backend. Hookup spotify API, and listen for my play events. Whatever i'm listening to, play that 
 * on the site. May need to use Youtube. Maybe show cover art. Maybe match bpm via server song analysis. If it's from 
 * spotify, that may have the details. Also musicbrainz. 
 */

const SECTIONS = {
    music: 'Music',
    stats: 'Stats',
    about: 'About',
    blog: 'Blog',
    goals: 'Goals',
    skills: 'Skills',
    projects: 'Projects',
    work: 'Work',
    contact: 'Contact'
} as const;

const musicList = [
    {
        image: '/images/marceline.jpg',
        title: 'S3RL feat. Sara - Marceline the Vampire Queen (A Bad Remix)',
        description: 'My second attempt at a remix',
        url: '/music/marceline.mp3',
        date: '2022'
    },
    {
        image: '/images/super_bitch.jpg',
        title: 'Super Bitch (ft. Anzu)',
        description: 'A valid description',
        url: '/music/super_bitch.wav',
        date: '2022'
    },
    {
        image: '/images/hide_and_seek.jpg',
        title: 'Hide & Seek - Les Edit',
        description: 'My first attempt at a remix',
        url: '/music/hide_and_seek.mp3',
        date: '2016'
    },
]

const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
};

/**
 * Ideas
 * - Timeline of my life (https://ant.design/components/timeline)
 * 
 */

export const Home = () => {
    let navigate = useNavigate();
    const { primaryColor, primaryDark } = useTheme();
    const setAudioUrl = useAudioStore((store) => store.setAudioUrl);

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
                    <div className='section-wrapper'>
                        <div className='flex text-primary-dark text-2xl font-bold mb-4'>
                            Music
                        </div>

                        <div className='item-wrapper pr-4'>
                            <div className='flex flex-col'>
                                {
                                    musicList.map((item) => (
                                        <div className='flex flex-col cursor-pointer rounded-lg py-2 hover:bg-primary-dark group' key={item.title} onClick={() => {
                                            setAudioUrl(item.url);
                                        }}>
                                            <div className='flex flex-row items-center px-2'>
                                                <div className='flex w-[50px] h-[50px]'>
                                                    <img src={item.image} className='w-full h-full object-cover rounded-lg' />
                                                </div>
                                                <div className='flex flex-col ml-2'>
                                                    <div className='flex text-primary-dark text-lg font-bold group-hover:text-primary'>
                                                        {item.title}
                                                    </div>
                                                    <div className='flex text-primary-dark text-sm font-bold group-hover:text-primary'>
                                                        {item.date} - {item.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <div className='section-wrapper'>
                        <div className='flex text-primary-dark text-2xl font-bold mb-4'>
                            Projects
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
                </div>
            </div>
        </ColorShiftingBackground>
    );
}