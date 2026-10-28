import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Devlog, Home, Minecraft, MusicLibrary, ProjectGallery, ProjectViewer } from './components/pages';
import { ConfigProvider } from 'antd';
import { ThemeProvider, useTheme, generateRandomHue } from './contexts/ThemeContext';
import { useCommonStore } from './store/common';
import { TsParticleBackground, MusicPlayer, ListenAlong, YouTubePlayer } from './components/atoms';

import 'antd/dist/reset.css';
import './global.scss';
import './App.scss';

const AppContent = () => {
  const { randomStartHue, primaryDark, setPrimaryColor } = useTheme();
  // While an overlay is open the cycle rests, which gives a framed project (a Java game above all) the
  // thread it shares with the board; it picks up where it stopped. The cycle's clock only counts
  // time it ran, so the hue doesn't jump when it resumes.
  const overlayOpen = useCommonStore((store) => store.overlayOpen);
  const cycled = useRef(0);

  useEffect(() => {
    if (overlayOpen) return;
    const duration = 30000; // 30 seconds in milliseconds
    let last = performance.now();
    let frame = 0;

    const updateColor = (now: number) => {
      // Clamp, so a backgrounded tab doesn't leap the hue when it comes back
      cycled.current += Math.min(now - last, 100);
      last = now;
      const progress = (cycled.current % duration) / duration;
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
      frame = requestAnimationFrame(updateColor);
    };

    frame = requestAnimationFrame(updateColor);
    return () => cancelAnimationFrame(frame);
  }, [setPrimaryColor, randomStartHue, overlayOpen]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryDark,
        }
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* The board stays mounted; each opened tile is a route drawn over it */}
          <Route element={<Home />}>
            <Route index element={null} />
            <Route path="home" element={null} />
            {/* Not /music: public/music/ is a real folder, and the server would serve it instead of the app */}
            <Route path="library" element={<MusicLibrary />} />
            {/* The listening page became the library's Recent listens tab; old links land there */}
            <Route path="listening" element={<Navigate to="/library?tab=recent" replace />} />
            <Route path="minecraft" element={<Minecraft />} />
            <Route path="devlog" element={<Devlog />} />
            {/* /project, singular: /projects/ is the standalone sites' folder, which the server keeps from the app */}
            <Route path="project" element={<ProjectGallery />} />
            <Route path="project/:id" element={<ProjectViewer />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Particle background */}
      <TsParticleBackground />

      {/* Music player */}
      <MusicPlayer />

      {/* The songs that play from YouTube, in the same shuffle. Beside the player, so it survives navigation too */}
      <YouTubePlayer />

      {/* Listen along: the YouTube copy of what Jake has on Spotify. Beside the player, so it survives navigation too */}
      <ListenAlong />

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