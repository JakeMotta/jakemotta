import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.scss';

// The muted preview server (the "dev" launch config) sets REACT_APP_MUTE_AUDIO, so the music plays
// silently while it's checked in a browser. The production build drops this line.
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_MUTE_AUDIO) require('./muteAudio');

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
