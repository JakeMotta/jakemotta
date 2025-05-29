import React, { useEffect, useState, useRef } from 'react';
import { TsParticleBackground } from '../../atoms';
import { InputNumberProps, Slider, Button } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useTheme } from '../../../contexts/ThemeContext';
import './index.scss';
// import colors from 'tailwindcss/colors';

/**
 * Build a backend. Hookup spotify API, and listen for my play events. Whatever i'm listening to, play that 
 * on the site. May need to use Youtube. Maybe show cover art. Maybe match bpm via server song analysis. If it's from 
 * spotify, that may have the details. Also musicbrainz. 
 */

export const Home = () => {

    const [inputValue, setInputValue] = useState(1);
    const { primaryColor, setPrimaryColor } = useTheme();
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPlayButton, setShowPlayButton] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        let startTime = Date.now();
        const duration = 30000; // 30 seconds in milliseconds
        const randomStartHue = Math.floor(Math.random() * 360);

        // const updateColor = () => {
        //     const elapsed = Date.now() - startTime;
        //     const progress = (elapsed % duration) / duration;
        //     const hue = (randomStartHue + Math.floor(progress * 360)) % 360;
        //     // Pastel colors (soft, light)
        //     // setPrimaryColor(`hsl(${hue}, 70%, 85%)`);

        //     // Warm colors (rich, vibrant)
        //     // setPrimaryColor(`hsl(${hue}, 80%, 65%)`);

        //     // Cool colors (deep, muted)
        //     setPrimaryColor(`hsl(${hue}, 40%, 60%)`);

        //     // Earth tones (natural, subdued)
        //     // setPrimaryColor(`hsl(${hue}, 30%, 45%)`);

        //     // Current implementation (balanced)
        //     // setPrimaryColor(`hsl(${hue}, 50%, 80%)`);
        //     requestAnimationFrame(updateColor);
        // };

        // requestAnimationFrame(updateColor);

        // Try to autoplay when component mounts
        const attemptAutoplay = async () => {
            if (audioRef.current) {
                try {
                    // Set volume to 0 first (some browsers allow muted autoplay)
                    audioRef.current.volume = 0;
                    await audioRef.current.play();
                    // If successful, gradually increase volume
                    audioRef.current.volume = 1;
                    setIsPlaying(true);
                } catch (error) {
                    // If autoplay fails, show the play button
                    console.log('Autoplay failed, showing play button');
                    setShowPlayButton(true);
                }
            }
        };

        // Try autoplay after a short delay
        const timer = setTimeout(attemptAutoplay, 1000);
        return () => clearTimeout(timer);
    }, [setPrimaryColor]);

    const onChange: InputNumberProps['onChange'] = (newValue) => {
        const value = newValue as number;
        setInputValue(value);
        // Use the slider value directly as the hue (0-360)
        const color = `hsl(${value}, 50%, 80%)`;
        setPrimaryColor(color);
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <div className='flex flex-col bg-black bg-opacity-80 text-white rounded-lg w-1/2 z-10'>
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-2xl font-bold' style={{ color: primaryColor }}>Jake Motta</h1>
                    <p className='text-sm' style={{ color: primaryColor }}>Software Engineer</p>

                    <Slider
                        min={0}
                        max={359}
                        onChange={onChange}
                        value={typeof inputValue === 'number' ? inputValue : 0}
                        className='w-1/2'
                        style={{ transition: "unset" }}
                        tooltip={{ formatter: null }}
                    />
                </div>
            </div>

            <div className='overlay-screen'>
                <TsParticleBackground />
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                    {showPlayButton && (
                        <Button
                            type="text"
                            icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                            onClick={togglePlay}
                            style={{ color: primaryColor, fontSize: '24px' }}
                        />
                    )}
                    <audio
                        autoPlay={true}
                        ref={audioRef}
                        src="/dancin.mp3"
                        loop
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    >
                        Your browser does not support the audio element.
                    </audio>
                </div>
            </div>
            <div className='flex h-screen w-full absolute top-0 left-0 z-[-1] transition-all duration-100' style={{ backgroundColor: primaryColor }}></div>
        </div>
    );
}