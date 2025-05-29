import React from 'react';
import { ColorShiftingBackground } from '../../templates';
import { useTheme } from '../../../contexts/ThemeContext';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './index.scss';

export const Welcome = () => {
    let navigate = useNavigate();
    const { primaryColor } = useTheme();

    return (
        <ColorShiftingBackground>
            {/* <div className='flex flex-col bg-black bg-opacity-80 text-white rounded-lg w-1/2 z-10'>
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-2xl font-bold' style={{ color: primaryColor }}>Jake Motta</h1>
                    <p className='text-sm' style={{ color: primaryColor }}>Software Engineer</p>
                </div>
            </div> */}
            <Button type='primary' size='large' onClick={() => navigate('/home')}>Enter</Button>
        </ColorShiftingBackground>
    );
}