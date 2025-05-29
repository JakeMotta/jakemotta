import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, Welcome } from './components/pages';
import { ConfigProvider } from 'antd';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import 'antd/dist/reset.css';
import './global.scss';
import './App.scss';

const AppContent = () => {
  const { primaryColor } = useTheme();

  return (
    <ConfigProvider
      theme={{
        components: {
          Slider: {},
        },
        token: { colorPrimary: primaryColor }
      }}
    >
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