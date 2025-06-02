import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { ColorShiftingBackground } from '../../templates';
import { useNavigate } from 'react-router-dom';
import { MusicTile, ProjectCard } from '../../atoms';
import { useAudioStore } from '../../../store/audio';
import { Tabs } from 'antd';
import { siteSections, musicTabs, musicList, favoriteArtists } from '../../../common/constants';
import './index.scss';

/**
 * Build a backend. Hookup spotify API, and listen for my play events. Whatever i'm listening to, play that 
 * on the site. May need to use Youtube. Maybe show cover art. Maybe match bpm via server song analysis. If it's from 
 * spotify, that may have the details. Also musicbrainz. 
 */

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
                    {Object.entries(siteSections).map(([id, label]) => (
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

                        <Tabs defaultActiveKey="1" items={musicTabs} onChange={onTabChange} />

                        <div className='item-wrapper pr-4'>
                            <div className='flex flex-col'>
                                {/* My Music */}
                                {activeTab === '1' && musicList.map((item) => (
                                    <MusicTile key={item.title} item={item} onClick={() => { setAudioUrl(item.url) }} />
                                ))}

                                {/* Favorite Artists */}
                                {activeTab === '2' && favoriteArtists.map((item) => (
                                    <MusicTile key={item.title} item={item} onClick={() => { setAudioUrl(item.url) }} />
                                ))}
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