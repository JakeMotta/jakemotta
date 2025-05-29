import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, Welcome } from './components/pages';
import { ConfigProvider } from 'antd';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import 'antd/dist/reset.css';
import './global.scss';
import './App.scss';
import { TsParticleBackground } from './components/atoms';

const AppContent = () => {
  const { primaryColor, setPrimaryColor } = useTheme();

  useEffect(() => {
    let startTime = Date.now();
    const duration = 30000; // 30 seconds in milliseconds
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
  }, [setPrimaryColor]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Slider: {},
        },
        token: { colorPrimary: primaryColor }
      }}
    >
      {/* Particle background */}
      <div className='overlay-screen'>
        <TsParticleBackground />
      </div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>

    </ConfigProvider>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}