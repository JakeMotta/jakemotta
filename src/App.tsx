import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, Welcome } from './components/pages';
import { ConfigProvider } from 'antd';
import { ThemeProvider, useTheme, generateRandomHue } from './contexts/ThemeContext';
import { TsParticleBackground, MusicPlayer } from './components/atoms';
import { useAudioStore } from './store/audio';

import 'antd/dist/reset.css';
import './global.scss';
import './App.scss';

const AppContent = () => {
  const { randomStartHue, primaryColor, primaryDark, setPrimaryColor } = useTheme();
  const audioUrl = useAudioStore((store) => store.audioUrl);

  useEffect(() => {
    let startTime = Date.now();
    const duration = 30000; // 30 seconds in milliseconds

    const updateColor = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;
      const hue = (randomStartHue + Math.floor(progress * 360)) % 360;
      setPrimaryColor(`hsl(${hue}, 40%, 60%)`);

      // Pastel colors (soft, light)
      // setPrimaryColor(`hsl(${hue}, 70%, 85%)`);

      // Warm colors (rich, vibrant)
      // setPrimaryColor(`hsl(${hue}, 80%, 65%)`);

      // Earth tones (natural, subdued)
      // setPrimaryColor(`hsl(${hue}, 30%, 45%)`);

      // Current implementation (balanced)
      // setPrimaryColor(`hsl(${hue}, 50%, 80%)`);
      requestAnimationFrame(updateColor);
    };

    requestAnimationFrame(updateColor);
  }, [setPrimaryColor, randomStartHue]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Slider: {
            trackBg: primaryDark,
            trackHoverBg: primaryDark,
          },
          Pagination: {
            itemActiveBg: primaryDark,
            itemBg: primaryDark,
            colorPrimary: primaryColor,
            colorText: primaryColor,
            fontWeightStrong: 600,
          },
        },
        token: {
          colorPrimary: primaryDark,
        }
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>

      {/* Particle background */}
      <TsParticleBackground />

      {/* Music player */}
      <MusicPlayer />

    </ConfigProvider >
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