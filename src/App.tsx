import React, { useEffect, useState } from 'react';
import { Background, TsParticleBackground } from './components';
import { ConfigProvider, InputNumberProps, Slider } from 'antd';

// import colors from 'tailwindcss/colors';
import 'antd/dist/reset.css';
import './global.scss';
import './App.scss';

/**
 * Build a backend. Hookup spotify API, and listen for my play events. Whatever i'm listening to, play that 
 * on the site. May need to use Youtube. Maybe show cover art. Maybe match bpm via server song analysis. If it's from 
 * spotify, that may have the details. Also musicbrainz. 
 */

function App() {

  const [inputValue, setInputValue] = useState(1);
  const [primaryColor, setPrimaryColor] = useState('#E6B3B3');

  useEffect(() => {
    let startTime = Date.now();
    const duration = 30000; // 1 minute in milliseconds
    const randomStartHue = Math.floor(Math.random() * 360);

    const updateColor = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;
      const hue = (randomStartHue + Math.floor(progress * 360)) % 360;
      // Pastel colors (soft, light)
      // setPrimaryColor(`hsl(${hue}, 70%, 85%)`);

      // Warm colors (rich, vibrant)
      // setPrimaryColor(`hsl(${hue}, 80%, 65%)`);

      // Cool colors (deep, muted)
      setPrimaryColor(`hsl(${hue}, 40%, 60%)`);

      // Earth tones (natural, subdued)
      // setPrimaryColor(`hsl(${hue}, 30%, 45%)`);

      // Current implementation (balanced)
      // setPrimaryColor(`hsl(${hue}, 50%, 80%)`);
      requestAnimationFrame(updateColor);
    };

    requestAnimationFrame(updateColor);
  }, []);

  const onChange: InputNumberProps['onChange'] = (newValue) => {
    const value = newValue as number;
    setInputValue(value);
    // Use the slider value directly as the hue (0-360)
    const color = `hsl(${value}, 50%, 80%)`;
    setPrimaryColor(color);
  };

  return (
    <ConfigProvider theme={{
      // algorithm: theme.darkAlgorithm,
      components: {
        Slider: {
          // railBg: colors.gray[700],
        },
      }, token: { colorPrimary: primaryColor, }
    }}>
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
        </div>
        <div className='flex h-screen w-full absolute top-0 left-0 z-[-1] transition-all duration-100 ' style={{ backgroundColor: primaryColor }}></div>
      </div>
    </ConfigProvider>
  );
}

export default App;
