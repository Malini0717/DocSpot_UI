// src/components/Chatbot.js
import React, { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import VideoPlayer from './VideoPlayer';
import '../App.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const videoControlRef = useRef(null);
  const [conversationState, setConversationState] = useState("initial");

  useEffect(() => {
    const speakInitial = () => {
      const initialMessage = "Type 'Hi' to begin the diagnosis.";
      setMessages([{ text: initialMessage, sender: 'bot' }]);
      speak(initialMessage);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', speakInitial);
    } else {
      speakInitial();
    }

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', speakInitial);
    };
  }, []);

  const handleSendMessage = async (text) => {
    window.speechSynthesis.cancel();
    if (!text.trim()) return;

    const userMessage = { text, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const { response, nextState } = await getBotResponse(text);
    setConversationState(nextState);

    setMessages((prevMessages) => [...prevMessages, { text: response.text, sender: 'bot' }]);

    if (response.options) {
      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, { options: response.options, sender: 'bot' }]);
      }, 500);
    }

    speak(response.text, response.options);
  };

  const getBotResponse = (userMessage) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let response = {};
        let nextState = conversationState;
        const lowerUserMessage = userMessage.toLowerCase();

        if (conversationState === "initial") {
          if (lowerUserMessage.includes('hi') || lowerUserMessage.includes('hello')) {
            response.text = "What health issue are you facing today?";
            response.options = ["Fever", "Cough", "Headache", "Body Pain"];
            nextState = "symptom_selection";
          } else {
            response.text = "Please type 'Hi' to begin the diagnosis.";
          }
        } 
        else if (conversationState === "symptom_selection") {
          if (lowerUserMessage === "fever") {
            response.text = "How many days have you had a fever?";
            response.options = ["1-2 days", "3-4 days", "5+ days"];
            nextState = "fever_duration";
          } else if (lowerUserMessage === "cough") {
            response.text = "Is your cough dry or productive?";
            response.options = ["Dry", "Productive"];
            nextState = "cough_type";
          } else if (lowerUserMessage === "headache") {
            response.text = "Is the headache sharp or dull?";
            response.options = ["Sharp", "Dull"];
            nextState = "headache_type";
          } else if (lowerUserMessage === "body pain") {
            response.text = "Can you describe the location and intensity of the pain?";
            response.options = ["Mild and localized", "Severe and widespread"];
            nextState = "pain_description";
          } else {
            response.text = "Thank you for the information. A doctor will be with you shortly.";
            response.options = ["Finish", "Wait for a doctor"];
            nextState = "completed";
          }
        }
        else if (conversationState === "fever_duration") {
          response.text = "What is your temperature?";
          response.options = ["99-100°F", "101-102°F", "103°F+"];
          nextState = "fever_temp";
        }
        else if (conversationState === "fever_temp") {
          if (userMessage === "99-100°F") {
            response.text = "Based on your symptoms, it seems you have a low-grade fever. Rest and hydration are recommended. Consult a doctor if symptoms persist.";
          } else if (userMessage === "101-102°F") {
            response.text = "Based on your symptoms, you have a moderate fever. We suggest taking an over-the-counter fever reducer and consulting a doctor for a more detailed diagnosis.";
          } else if (userMessage === "103°F+") {
            response.text = "Based on your symptoms, you have a high fever. Please seek immediate medical attention or consult a doctor promptly.";
          }
          response.options = ["Finish", "Wait for a doctor"];
          nextState = "completed";
        }
        else if (conversationState === "cough_type") {
          response.text = `Thank you. A doctor will review your cough symptoms shortly.`;
          response.options = ["Finish", "Wait for a doctor"];
          nextState = "completed";
        }
        else if (conversationState === "headache_type") {
          response.text = `Thank you. A doctor will review your headache symptoms shortly.`;
          response.options = ["Finish", "Wait for a doctor"];
          nextState = "completed";
        }
        else if (conversationState === "pain_description") {
          response.text = `Thank you for the details. A doctor will review your case shortly.`;
          response.options = ["Finish", "Wait for a doctor"];
          nextState = "completed";
        }
        else if (conversationState === "completed" && lowerUserMessage === "finish") {
          response.text = "Type 'Hi' to begin a new diagnosis.";
          nextState = "initial";
        } else {
          response.text = "I'm sorry, I'm a simple bot. Please wait for a human agent or type 'Hi' to restart.";
          nextState = "initial";
        }

        resolve({ response, nextState });
      }, 500);
    });
  };

  const speak = (text, options = []) => {
    window.speechSynthesis.cancel();

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice =>
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('zira') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('google us english')
    );

    const textUtterance = new SpeechSynthesisUtterance(text);
    if (femaleVoice) textUtterance.voice = femaleVoice;

    textUtterance.onstart = () => setIsSpeaking(true);

    if (options.length > 0) {
      textUtterance.onend = () => {
        options.forEach((option, index) => {
          setTimeout(() => {
            const optionUtterance = new SpeechSynthesisUtterance(option);
            if (femaleVoice) optionUtterance.voice = femaleVoice;
            window.speechSynthesis.speak(optionUtterance);
            if (index === options.length - 1) {
              optionUtterance.onend = () => setIsSpeaking(false);
            }
          }, 200 * index); // 🔊 Reduced delay between options (faster)
        });
      };
      window.speechSynthesis.speak(textUtterance);
    } else {
      textUtterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(textUtterance);
    }
  };

  return (
    <div className="app-container">
      <div className="video-player-container">
        <VideoPlayer isSpeaking={isSpeaking} ref={videoControlRef} />
      </div>
      <div className="chatbot-container">
        <div className="chatbot-header">Welcome to DocSpot</div>
        <div className="chatbot-body">
          <MessageList messages={messages} onSendMessage={handleSendMessage} />
          
          {/* ✅ "Hi" button shown only during initial state */}
          {conversationState === 'initial' && (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <button
                onClick={() => handleSendMessage('Hi')}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Hi
              </button>
            </div>
          )}
        </div>
        <div className="chatbot-footer">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
