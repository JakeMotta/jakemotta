import React, { lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './components/pages/home';
import { ThemeProvider, useTheme, generateRandomHue, applyHue } from './contexts/ThemeContext';
import { useCommonStore } from './store/common';
import { TsParticleBackground, MusicPlayer, ListenAlong, YouTubePlayer } from './components/atoms';

import 'antd/dist/reset.css';
import './global.scss';
import './App.scss';

// Each overlay is a chunk of its own, so the board, which everyone sees first, loads without them. They're
// fetched as soon as the browser is idle after that, so opening one doesn't wait on the network.
const loadLibrary = () => import('./components/pages/music');
const loadMinecraft = () => import('./components/pages/minecraft');
const loadDevlog = () => import('./components/pages/devlog');
const loadGallery = () => import('./components/pages/project-gallery');
const loadViewer = () => import('./components/pages/project');
const MusicLibrary = lazy(() => loadLibrary().then((page) => ({ default: page.MusicLibrary })));
const Minecraft = lazy(() => loadMinecraft().then((page) => ({ default: page.Minecraft })));
const Devlog = lazy(() => loadDevlog().then((page) => ({ default: page.Devlog })));
const ProjectGallery = lazy(() => loadGallery().then((page) => ({ default: page.ProjectGallery })));
const ProjectViewer = lazy(() => loadViewer().then((page) => ({ default: page.ProjectViewer })));

const preloadOverlays = () => [loadLibrary, loadMinecraft, loadDevlog, loadGallery, loadViewer].forEach((load) => load().catch(() => {}));

const AppContent = () => {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const idle = window.requestIdleCallback(preloadOverlays, { timeout: 4000 });
      return () => window.cancelIdleCallback(idle);
    }
    const timer = setTimeout(preloadOverlays, 2000);
    return () => clearTimeout(timer);
  }, []);

  const { randomStartHue } = useTheme();

  // The hue goes round once every 30s, without pause, even behind an overlay. It's written straight onto
  // the CSS variables, and only when the whole-degree hue changes, so the page restyles about twelve
  // times a second and React never re-renders for it. Behind an overlay it moves at the same speed in
  // 2° steps, half as many restyles, which leaves more of the thread to a framed game; a 2° step on the
  // overlay's dark panel is too small to see.
  useEffect(() => {
    const duration = 30000; // 30 seconds in milliseconds
    const start = performance.now();
    let shown = randomStartHue;
    let frame = 0;

    const updateColor = (now: number) => {
      const progress = ((now - start) % duration) / duration;
      const step = useCommonStore.getState().overlayOpen ? 2 : 1;
      const hue = (randomStartHue + Math.floor((progress * 360) / step) * step) % 360;
      if (hue !== shown) {
        shown = hue;
        applyHue(hue);
      }
      frame = requestAnimationFrame(updateColor);
    };

    frame = requestAnimationFrame(updateColor);
    return () => cancelAnimationFrame(frame);
  }, [randomStartHue]);

  return (
    <>
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
            <Route path="project/:id/:page?" element={<ProjectViewer />} />
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

    </>
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