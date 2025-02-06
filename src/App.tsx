import React, { useState } from 'react';
import { Background } from './components';
import { ConfigProvider, InputNumberProps, Slider, theme } from 'antd';
// import colors from 'tailwindcss/colors';
import 'antd/dist/reset.css';
import './global.css';
import './App.css';


function App() {

  const [inputValue, setInputValue] = useState(1);
  const [primaryColor, setPrimaryColor] = useState('#ff0000');

  const onChange: InputNumberProps['onChange'] = (newValue) => {
    const value = newValue as number;
    setInputValue(value);
    // Use the slider value directly as the hue (0-360)
    const color = `hsl(${value}, 100%, 50%)`;
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
              max={360}
              onChange={onChange}
              value={typeof inputValue === 'number' ? inputValue : 0}
              className='w-1/2'
              tooltip={{ formatter: null }}
            />
          </div>
        </div>

        <div className='flex h-screen w-full absolute top-0 left-0 z-0'>
          <Background />
        </div>
        <div className='flex h-screen w-full absolute top-0 left-0 z-[-1]' style={{ backgroundColor: primaryColor }}></div>
      </div>
    </ConfigProvider>

  );
}

export default App;
