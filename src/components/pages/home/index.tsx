import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { ColorShiftingBackground } from '../../templates';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import './index.scss';
// import colors from 'tailwindcss/colors';

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
            <div className='flex flex-col bg-black bg-opacity-80 text-white rounded-lg w-1/2 z-10'>
                <div className='flex flex-col items-center justify-center bg-'>
                    <div className="text-primary">
                        This text will use the rotating primary color
                    </div>
                    <div className="text-primary-dark">
                        This text will use the rotating primary color
                    </div>
                    <h1 className='text-2xl font-bold' style={{ color: primaryColor }}>Jake Motta</h1>
                    <p className='text-sm' style={{ color: primaryColor }}>Software Engineer</p>
                    <Button type='primary' size='large' onClick={() => navigate('/')}>Back</Button>
                </div>
            </div>
        </ColorShiftingBackground>
    );
}