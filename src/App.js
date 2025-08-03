// src/App.js
import React from 'react';
import VideoPlayer from './components/VideoPlayer';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="doctor-model-container">
        <VideoPlayer videoSource="/doctor.mp4" />
      </div>
      <div className="chatbot-container">
        <Chatbot />
      </div>
    </div>
  );
}

export default App;