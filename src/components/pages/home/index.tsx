import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { ColorShiftingBackground } from '../../templates';
import { useNavigate } from 'react-router-dom';
import { MusicTile, ProjectCard, StickySectionTitle } from '../../atoms';
import { useAudioStore } from '../../../store/audio';
import { Pagination, Tabs } from 'antd';
import { musicTabs, musicList, favoriteArtists, homeProjectList } from '../../../common/constants';
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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const calculateItemsPerPage = () => {
            if (containerRef.current) {
                const containerHeight = containerRef.current.clientHeight;
                const itemHeight = 66; // Approximate height of each MusicTile in pixels
                const availableHeight = containerHeight - 2 * 66; // Subtract some space for pagination
                const calculatedItems = Math.floor(availableHeight / itemHeight);
                setItemsPerPage(Math.max(1, calculatedItems)); // Ensure at least 1 item per page
            }
        };

        calculateItemsPerPage();
        window.addEventListener('resize', calculateItemsPerPage);
        return () => window.removeEventListener('resize', calculateItemsPerPage);
    }, []);

    const onTabChange = (key: string) => {
        setActiveTab(key);
        setCurrentPage(1); // Reset to first page when changing tabs
    };

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Calculate paginated items
    const getPaginatedItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return activeTab === '1'
            ? musicList.slice(startIndex, endIndex)
            : favoriteArtists.slice(startIndex, endIndex);
    };

    const scrollToSection = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <ColorShiftingBackground>
            <div className='flex flex-col items-center gap-4 min-h-screen'>
                {/* <div className='flex flex-row w-full gap-4 overflow-y-hidden overflow-x-auto mb-4 px-16'>
                    {Object.entries(siteSections).map(([id, label]) => (
                        <div
                            key={id}
                            className='nav-item cursor-pointer'
                            onClick={() => scrollToSection(id)}
                        >
                            {label}
                        </div>
                    ))}
                </div> */}

                <div className='flex flex-col h-full w-full gap-2 px-16'>
                    <section className='flex w-full flex-col'>
                        <StickySectionTitle>Music</StickySectionTitle>
                        <div ref={containerRef} className='section-wrapper px-4 py-2 bg-black/10 rounded-lg'>
                            <Tabs defaultActiveKey="1" items={musicTabs} onChange={onTabChange} />

                            <div className='flex flex-col flex-1'>
                                <div className='flex flex-col'>
                                    {/* My Music */}
                                    {activeTab === '1' && getPaginatedItems().map((item) => (
                                        <MusicTile key={item.title} item={item} onClick={() => { setAudioUrl(item.url) }} />
                                    ))}

                                    {/* Favorite Artists */}
                                    {activeTab === '2' && getPaginatedItems().map((item) => (
                                        <MusicTile key={item.title} item={item} onClick={() => { setAudioUrl(item.url) }} />
                                    ))}
                                </div>

                                <div className='flex flex-1 items-end'>
                                    <Pagination
                                        current={currentPage}
                                        total={activeTab === '1' ? musicList.length : favoriteArtists.length}
                                        pageSize={itemsPerPage}
                                        onChange={onPageChange}
                                        className='flex pt-2'
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className='flex w-full flex-col'>
                        <StickySectionTitle>Projects</StickySectionTitle>
                        <div className='section-wrapper'>
                            <div className='projects-grid'>
                                {homeProjectList.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        image={project.image}
                                        title={project.title}
                                        date={project.date}
                                        description={project.description}
                                        onClick={() => {
                                            if (project.to) navigate(project.to);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </ColorShiftingBackground>
    );
}