import React, { useState } from 'react';
import VoiceInput from './VoiceInput';

const ChatInput = ({ onSendMessage }) => {
  const [inputText, setInputText] = useState('');

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendClick = () => {
    onSendMessage(inputText);
    setInputText('');
  };

  const handleVoiceInput = (text) => {
    onSendMessage(text);
  };

  return (
    <div className="chat-input-container">
      <input
        type="text"
        value={inputText}
        onChange={handleTextChange}
        onKeyPress={(e) => e.key === 'Enter' && handleSendClick()}
        placeholder="Type your message..."
        className="chat-input-field"
      />
      <button onClick={handleSendClick} className="chat-send-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
             viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
             className="feather feather-send">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
      <VoiceInput onVoiceInput={handleVoiceInput} />
    </div>
  );
};

export default ChatInput;
