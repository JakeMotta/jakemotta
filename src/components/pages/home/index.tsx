import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { ColorShiftingBackground } from '../../templates';
import { useNavigate } from 'react-router-dom';
import { ProjectCard } from '../../atoms';
import { useAudioStore } from '../../../store/audio';
import './index.scss';
import { Tabs, TabsProps } from 'antd';

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

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'My Music',
    },
    {
        key: '2',
        label: 'Favorite Artists',
    },
    {
        key: '3',
        label: 'Recommended Songs',
    },
];


const musicList = [
    {
        image: '/images/ctrl_alt_del.jpeg',
        title: 'Uprising',
        description: 'My second attempt at a remix',
        url: '/music/uprising.mp3',
        date: '2022'
    },
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
        image: '/images/alone.jpg',
        title: 'Alone',
        description: 'My first attempt at a remix',
        url: '/music/alone.mp3',
        date: '2019'
    },
    {
        image: '/images/memories.jpg',
        title: 'Memories',
        description: 'My first attempt at a remix',
        url: '/music/memories.mp3',
        date: '2018'
    },
    {
        image: '/images/ctrl_alt_del.jpeg',
        title: 'Anguish',
        description: 'My first attempt at a remix',
        url: '/music/anguish.mp3',
        date: '2017'
    },
    {
        image: '/images/ctrl_alt_del.jpeg',
        title: 'Breathe',
        description: 'My first attempt at a remix',
        url: '/music/breathe.mp3',
        date: '2017'
    },
    {
        image: '/images/ctrl_alt_del.jpeg',
        title: 'Fearless',
        description: 'My first attempt at a remix',
        url: '/music/fearless.mp3',
        date: '2016'
    },
    {
        image: '/images/hide_and_seek.jpg',
        title: 'Hide & Seek - Les Edit',
        description: 'My first attempt at a remix',
        url: '/music/hide_and_seek.mp3',
        date: '2016'
    },
    {
        image: '/images/transition.jpg',
        title: 'Transition',
        description: 'My first attempt at a remix',
        url: '/music/transition.mp3',
        date: '2015'
    },
    {
        image: '/images/ctrl_alt_del.jpeg',
        title: 'Identity',
        description: 'My first attempt at a remix',
        url: '/music/identity.mp3',
        date: '2015'
    },
    {
        image: '/images/ctrl_alt_del.jpeg',
        title: 'Stepping Clouds',
        description: 'My first attempt at a remix',
        url: '/music/stepping_clouds.mp3',
        date: '2015'
    },
    {
        image: '/images/ctrl_alt_del.jpeg',
        title: 'Innocence',
        description: 'My first attempt at a remix',
        url: '/music/innocence.mp3',
        date: '2012'
    },
]

const favoriteArtists = [
    {
        image: '/images/marceline.jpg',
        title: 'S3RL',
        description: 'My second attempt at a remix',
        url: '/music/marceline.mp3',
        date: '2022'
    },
    {
        image: '/images/super_bitch.jpg',
        title: 'WeAreCastor',
        description: 'A valid description',
        url: '/music/super_bitch.wav',
        date: '2022'
    },
    {
        image: '',
        title: 'Dancin',
        description: 'My first attempt at a remix',
        url: '/music/dancin.mp3',
        date: '2016'
    },
]

/**
 * Ideas
 * - Timeline of my life (https://ant.design/components/timeline)
 * 
 */

export const Home = () => {
    let navigate = useNavigate();
    const { primaryColor, primaryDark } = useTheme();
    const setAudioUrl = useAudioStore((store) => store.setAudioUrl);
    const [activeTab, setActiveTab] = useState('1');



    const onTabChange = (key: string) => {
        setActiveTab(key);
    };

    const scrollToSection = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <ColorShiftingBackground>
            <div className='flex flex-col items-center gap-4 py-8 h-screen'>
                <div className='flex flex-row w-full gap-4 overflow-y-hidden overflow-x-auto mb-4 px-16'>
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

                <div className='flex flex-col overflow-y-auto overflow-x-hidden h-full w-full px-16'>
                    <div className='section-wrapper'>
                        <div className='flex text-primary-dark text-2xl font-bold'>
                            Music
                        </div>

                        <Tabs defaultActiveKey="1" items={items} onChange={onTabChange} />

                        <div className='item-wrapper pr-4'>
                            <div className='flex flex-col'>
                                {
                                    activeTab === '1' && musicList.map((item) => (
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

                                {
                                    activeTab === '2' && favoriteArtists.map((item) => (
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
                            <div className='flex flex-row flex-wrap justify-between'>
                                <ProjectCard image="" title="Ambii" date='2025' description="This is a project with a long description that wraps around to the next line This is a project with a long description that wraps around to the next line" onClick={() => {
                                    navigate('/projects/');
                                }} />
                                <ProjectCard image="" title="Black Chamber" date='2025' description="" onClick={() => {
                                    navigate('/projects/black-chamber');
                                }} />
                                <ProjectCard image="" title="Pistol Art" date='2025' description="This is a project with a long description that wraps around to the next line" onClick={() => {
                                    navigate('/projects/pistol-art');
                                }} />
                                <ProjectCard image="" title="NinjaDonut" date='2025' description="This is a project with a long description that wraps around to the next line" onClick={() => { }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ColorShiftingBackground>
    );
}