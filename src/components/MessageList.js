// src/components/MessageList.js
import React, { useEffect, useRef } from 'react';

// MessageList now also receives the onSendMessage prop.
const MessageList = ({ messages, isTyping, onSendMessage }) => {
  const bottomRef = useRef(null);

  // Auto-scroll to the bottom whenever a new message is added.
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="message-list">
      {messages.map((msg, index) => {
        // We now check if the message object contains an 'options' array.
        if (msg.options) {
          // If it does, we render buttons instead of a text message.
          return (
            <div key={index} className="bot-options-container">
              {msg.options.map((option, i) => (
                <button
                  key={i}
                  className="option-button"
                  onClick={() => onSendMessage(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          );
        } else {
          // Otherwise, we render a regular text message.
          return (
            <div
              key={index}
              className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
            >
              {msg.text}
            </div>
          );
        }
      })}
      {isTyping && <div className="typing-indicator">Doctor is typing...</div>}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
