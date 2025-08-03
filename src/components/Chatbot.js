// src/components/Chatbot.js
import React, { useState, useRef } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import VideoPlayer from './VideoPlayer';
import '../App.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const videoControlRef = useRef(null); // Used to control the video externally

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { text, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const botResponse = await getBotResponse(text);
    speak(botResponse);

    const botMessage = { text: botResponse, sender: 'bot' };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const getBotResponse = (userMessage) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`I received your message: "${userMessage}". How can I help you further?`);
      }, 500);
    });
  };

  return (
    <div className="app-container">
      <div className="video-player-container">
        <VideoPlayer isSpeaking={isSpeaking} ref={videoControlRef} />
      </div>
      <div className="chatbot-container">
        <div className="chatbot-header">AI Healthcare Assistant</div>
        <div className="chatbot-body">
          <MessageList messages={messages} />
        </div>
        <div className="chatbot-footer">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
