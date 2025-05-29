import React, { useEffect, useState, useRef } from 'react';
import { TsParticleBackground } from '../../atoms';
import { ConfigProvider, InputNumberProps, Slider, Button } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import './index.scss';
// import colors from 'tailwindcss/colors';

/**
 * Build a backend. Hookup spotify API, and listen for my play events. Whatever i'm listening to, play that 
 * on the site. May need to use Youtube. Maybe show cover art. Maybe match bpm via server song analysis. If it's from 
 * spotify, that may have the details. Also musicbrainz. 
 */

export const Welcome = () => {

    return (
        <div>welcome</div>
    );
}