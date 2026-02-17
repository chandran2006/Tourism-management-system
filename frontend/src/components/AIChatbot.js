import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AIChatbot.css';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Quick action prompts
  const quickActions = [
    'Suggest places to visit',
    'Recommend hotels',
    'Plan my itinerary',
    'Estimate budget',
    'Transport options'
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Load chat history
      loadChatHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_URL}/chat/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const formattedMessages = response.data.data.messages.map(msg => ({
          text: msg.content,
          sender: msg.role === 'user' ? 'user' : 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Add welcome message if no history
      if (messages.length === 0) {
        addBotMessage('Hello! 👋 I\'m your AI travel assistant. How can I help you plan your perfect trip today?');
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, {
      text,
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = messageText.trim();
    addUserMessage(userMessage);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        addBotMessage('Please log in to use the AI chat assistant.');
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/chat`,
        { message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        addBotMessage(response.data.data.message);
      } else {
        addBotMessage('Sorry, I encountered an error. Please try again.');
      }
    } catch (error) {
      console.error('Chat error:', error);
      if (error.response?.status === 401) {
        addBotMessage('Your session has expired. Please log in again.');
      } else if (error.response?.data?.message) {
        addBotMessage(error.response.data.message);
      } else {
        addBotMessage('Sorry, I\'m having trouble connecting. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleQuickAction = (action) => {
    sendMessage(action);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/chat/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([]);
      addBotMessage('Chat history cleared! How can I help you today?');
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  return (
    <div className="ai-chatbot">
      {/* Floating Icon */}
      {!isOpen && (
        <div className="chatbot-icon" onClick={() => setIsOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="chatbot-title">
                <h3>Travel Assistant</h3>
                <p>AI-powered travel guide</p>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)} title="Close">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.length === 0 ? (
              <div className="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h4>Start a Conversation</h4>
                <p>Ask me anything about your travel plans!</p>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.sender}`}>
                    {msg.sender === 'bot' && (
                      <div className="message-avatar bot">🤖</div>
                    )}
                    <div>
                      <div className="message-content">
                        {msg.text}
                      </div>
                      <div className="message-time">{msg.time}</div>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="message-avatar user">👤</div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="chat-message bot">
                    <div className="message-avatar bot">🤖</div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="chatbot-input-area">
            {messages.length === 0 && (
              <div className="quick-actions">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="quick-action-btn"
                    onClick={() => handleQuickAction(action)}
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={handleSubmit} className="chatbot-input-wrapper">
              <textarea
                className="chatbot-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows="1"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="chatbot-send-btn"
                disabled={isLoading || !inputMessage.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
