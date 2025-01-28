import React from 'react';
import { Background } from './components';
import './App.css';

function App() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className='flex flex-col bg-black text-white rounded-lg w-1/2 z-10'>
        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-2xl font-bold'>Jake Motta</h1>
          <p className='text-sm'>Software Engineer</p>
        </div>
      </div>
      <div className='flex h-screen w-full absolute top-0 left-0 z-0'>
        <Background  />
      </div>
      <div className='flex h-screen w-full absolute top-0 left-0 z-[-1]' style={{backgroundColor: "#FFF"}}></div>
    </div>
  );
}

export default App;
