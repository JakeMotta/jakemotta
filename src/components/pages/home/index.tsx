import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { ColorShiftingBackground } from '../../templates';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import './index.scss';

/**
 * Build a backend. Hookup spotify API, and listen for my play events. Whatever i'm listening to, play that 
 * on the site. May need to use Youtube. Maybe show cover art. Maybe match bpm via server song analysis. If it's from 
 * spotify, that may have the details. Also musicbrainz. 
 */

export const Home = () => {
    let navigate = useNavigate();
    const { primaryColor, primaryDark } = useTheme();

    return (
        <ColorShiftingBackground>
            <div className='flex flex-col items-center gap-4 py-8 px-16 h-screen '>

                {/* <div className='flex flex-col w-full overflow-y-hidden overflow-x-auto'>
                    <div className='flex text-primary-dark text-2xl font-bold'>Jake Motta</div>
                    <div className='flex text-primary-dark text-lg font-regular'>You do you</div>
                </div> */}

                <div className='flex flex-row w-full gap-4 overflow-y-hidden overflow-x-auto'>
                    <div className='nav-item'>Stats</div>
                    <div className='nav-item'>Projects</div>
                    <div className='nav-item'>Music</div>
                    <div className='nav-item'>Work</div>
                    <div className='nav-item'>Contact</div>
                </div>

                {/* <div className='flex flex-col bg-black bg-opacity-60 rounded-lg z-10 w-[80%] gap-4 max-h-[500px] overflow-y-auto overflow-x-hidden'> */}
                <div className='item-wrapper'>
                    <div className='flex flex-col gap-4'>
                        <div className='flex w-[500px] h-[500px] bg-red-500'>a</div>
                        <div className='flex w-[500px] h-[500px] bg-red-500'>a</div>
                        <div className='flex w-[500px] h-[500px] bg-red-500'>a</div>
                        <div className='flex w-[500px] h-[500px] bg-red-500'>a</div>
                        <div className='flex w-[500px] h-[500px] bg-red-500'>a</div>
                        <div className='flex w-[500px] h-[500px] bg-red-500'>a</div>
                    </div>
                </div>
            </div>
        </ColorShiftingBackground>
    );
}