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
            <Button type='primary' size='large' onClick={() => navigate('/home')}>Enter</Button>
        </ColorShiftingBackground>
    );
}