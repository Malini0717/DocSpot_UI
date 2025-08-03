// src/components/MessageList.js
import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages, isTyping }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
        >
          {msg.text}
        </div>
      ))}
      {isTyping && <div className="typing-indicator">Doctor is typing...</div>}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
