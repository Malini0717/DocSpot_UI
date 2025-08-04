// src/App.js
import React from 'react';
import VideoPlayer from './components/VideoPlayer';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="video-container">
        <VideoPlayer videoSource="/doctor.mp4" />
      </div>
      <div className="chat-container">
        <h1 className="chat-heading">Welcome to DocSpot</h1>
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
