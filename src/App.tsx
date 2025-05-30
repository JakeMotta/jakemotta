import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, Welcome } from './components/pages';
import { ConfigProvider } from 'antd';
import { ThemeProvider, useTheme, generateRandomHue } from './contexts/ThemeContext';
import { TsParticleBackground, MusicPlayer } from './components/atoms';
import { useCommonStore } from './store/common';
import { AudioVisualizer } from './components/atoms/AudioVisualizer';

import 'antd/dist/reset.css';
import './global.scss';
import './App.scss';

const AppContent = () => {
  const { randomStartHue, primaryDark, setPrimaryColor } = useTheme();
  const musicEnabled = useCommonStore((store) => store.musicEnabled);

  useEffect(() => {
    let startTime = Date.now();
    const duration = 30000; // 30 seconds in milliseconds

    const updateColor = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;
      const hue = (randomStartHue + Math.floor(progress * 360)) % 360;
      setPrimaryColor(`hsl(${hue}, 40%, 60%)`);
      requestAnimationFrame(updateColor);
    };

    requestAnimationFrame(updateColor);
  }, [setPrimaryColor, randomStartHue]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Slider: {},
        },
        token: {
          colorPrimary: primaryDark,
        }
      }}
    >
      {/* Music visualizer */}
      <AudioVisualizer />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>

      {/* Particle background */}
      <TsParticleBackground />

      {/* Music player */}
      {musicEnabled && <MusicPlayer />}

    </ConfigProvider>
  );
};

export default function App() {
  const initialHue = generateRandomHue();
  return (
    <ThemeProvider initialHue={initialHue}>
      <AppContent />
    </ThemeProvider>
  );
}