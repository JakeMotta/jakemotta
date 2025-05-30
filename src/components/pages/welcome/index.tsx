import React from 'react';
import { ColorShiftingBackground } from '../../templates';
import { useNavigate } from 'react-router-dom';
import { useCommonStore } from '../../../store/common';
import { Button } from 'antd';
import './index.scss';

export const Welcome = () => {
    let navigate = useNavigate();

    const setMusicEnabled = useCommonStore((store) => store.setMusicEnabled);
    const setIsMusicPlaying = useCommonStore((store) => store.setIsMusicPlaying);

    return (
        <ColorShiftingBackground>
            <div className='flex flex-col justify-center items-center gap-4 h-screen'>
                <Button type='primary' size='large' className='text-6xl p-8 py-12' onClick={() => {
                    setMusicEnabled(true);
                    setIsMusicPlaying(true);
                    navigate('/home');
                }}>Enter with Music</Button>
                <Button type='text' size='large' className='text-lg' onClick={() => {
                    setMusicEnabled(false);
                    setIsMusicPlaying(false);
                    navigate('/home');
                }}>Enter without Music</Button>
            </div>
        </ColorShiftingBackground>
    );
}