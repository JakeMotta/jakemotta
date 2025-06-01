import React, { useState } from 'react';
import { ColorShiftingBackground } from '../../templates';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { useAudioStore } from '../../../store/audio';
import './index.scss';

export const Welcome = () => {
    let navigate = useNavigate();
    const setAudioUrl = useAudioStore((store) => store.setAudioUrl);

    const [isHoveringNoMusic, setIsHoveringNoMusic] = useState(false);

    return (
        <ColorShiftingBackground>
            <div className='flex flex-col justify-center items-center gap-4 h-screen'>
                <Button type='primary' size='large' className='text-primary text-6xl p-8 py-12 w-[500px]' onClick={() => {
                    setAudioUrl("/music/dancin.mp3");
                    navigate('/home');
                }}>Enter with Music</Button>

                <Button type='text' size='large' className='text-lg w-[500px]' onClick={() => {
                    navigate('/home');
                }}
                    onMouseEnter={() => setIsHoveringNoMusic(true)}
                    onMouseLeave={() => setIsHoveringNoMusic(false)}
                >
                    {isHoveringNoMusic ? "Click here if you're lame" : 'Enter without Music'}
                </Button>
            </div>
        </ColorShiftingBackground>
    );
}