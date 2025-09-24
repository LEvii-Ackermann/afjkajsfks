// src/pages/ChatInterface.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext.jsx';
import geminiService from '../../services/api/geminiService';

const ChatInterface = ({ onNavigate }) => {
  const { currentLanguage } = useContext(LanguageContext);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const messagesEndRef = useRef(null);

  // Multilingual text
  const text = {
    en: {
      title: "Chat with Health Assistant",
      subtitle: "Ask follow-up questions about your health analysis",
      placeholder: "Ask your health-related question...",
      send: "Send",
      typing: "AI Assistant is typing...",
      initialMessage: "Hello! I'm your AI health assistant. I have your previous analysis results. What would you like to know more about?",
      errorMessage: "Sorry, I couldn't process that. Please try again.",
      disclaimer: "This chat is for informational purposes only. Consult a healthcare professional for medical advice.",
      backToResults: "← Back to Results",
      clearChat: "Clear Chat"
    },
    hi: {
      title: "स्वास्थ्य सहायक के साथ चैट",
      subtitle: "अपने स्वास्थ्य विश्लेषण के बारे में अतिरिक्त प्रश्न पूछें",
      placeholder: "अपना स्वास्थ्य संबंधी प्रश्न पूछें...",
      send: "भेजें",
      typing: "AI सहायक टाइप कर रहा है...",
      initialMessage: "नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूं। मेरे पास आपके पिछले विश्लेषण परिणाम हैं। आप इसके बारे में और क्या जानना चाहेंगे?",
      errorMessage: "क्षमा करें, मैं इसे प्रोसेस नहीं कर सका। कृपया पुनः प्रयास करें।",
      disclaimer: "यह चैट केवल जानकारी के उद्देश्य से है। चिकित्सा सलाह के लिए स्वास्थ्य पेशेवर से सलाह लें।",
      backToResults: "← परिणामों पर वापस",
      clearChat: "चैट साफ़ करें"
    }
  };

  const getText = (key) => {
    const currentText = text[currentLanguage] || text.en;
    return currentText[key] || text.en[key] || key;
  };

  // Load patient data and initial message
  useEffect(() => {
    const storedResults = localStorage.getItem('analysisResults');
    const storedPatientData = localStorage.getItem('patientData');
    
    if (storedResults && storedPatientData) {
      setPatientData({
        analysisResults: JSON.parse(storedResults),
        patientInfo: JSON.parse(storedPatientData)
      });
    }

    // Add initial AI message
    setMessages([{
      id: Date.now(),
      type: 'ai',
      content: getText('initialMessage'),
      timestamp: new Date()
    }]);
  }, [currentLanguage]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Prepare context for AI
      const context = patientData ? {
        symptoms: patientData.patientInfo?.symptoms || 'Not specified',
        severity: patientData.patientInfo?.severity || 'Not specified',
        duration: patientData.patientInfo?.duration || 'Not specified',
        age: patientData.patientInfo?.ageGroup || 'Not specified',
        previousAnalysis: patientData.analysisResults?.possibleConditions?.slice(0, 2) || []
      } : {};

      const response = await geminiService.getChatResponse(inputMessage, context);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: getText('errorMessage'),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      type: 'ai',
      content: getText('initialMessage'),
      timestamp: new Date()
    }]);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{getText('title')}</h1>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
              {getText('subtitle')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={clearChat}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {getText('clearChat')}
            </button>
            <button
              onClick={() => onNavigate('results')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {getText('backToResults')}
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        height: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 2rem'
      }}>
        {/* Messages Container */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start'
              }}
            >
              {/* AI Avatar */}
              {message.type === 'ai' && (
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(76, 175, 80, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem',
                  flexShrink: 0,
                  color: 'white',
                  fontSize: '1.2rem'
                }}>
                  🏥
                </div>
              )}

              {/* Message Bubble */}
              <div style={{
                maxWidth: '70%',
                backgroundColor: message.type === 'user' 
                  ? 'rgba(33, 150, 243, 0.9)' 
                  : 'rgba(255, 255, 255, 0.95)',
                color: message.type === 'user' ? 'white' : '#333',
                borderRadius: message.type === 'user' 
                  ? '20px 20px 5px 20px' 
                  : '20px 20px 20px 5px',
                padding: '1rem 1.25rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <p style={{ 
                  margin: 0, 
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word'
                }}>
                  {message.content}
                </p>
                <div style={{
                  fontSize: '0.75rem',
                  opacity: 0.7,
                  marginTop: '0.5rem',
                  textAlign: message.type === 'user' ? 'right' : 'left'
                }}>
                  {formatTime(message.timestamp)}
                </div>
              </div>

              {/* User Avatar */}
              {message.type === 'user' && (
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(33, 150, 243, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '0.75rem',
                  flexShrink: 0,
                  color: 'white',
                  fontSize: '1.2rem'
                }}>
                  👤
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(76, 175, 80, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.2rem'
              }}>
                🏥
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '1rem 1.25rem',
                color: '#666',
                fontStyle: 'italic'
              }}>
                {getText('typing')}
                <span style={{ animation: 'pulse 1.5s infinite' }}>...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '25px',
          padding: '1rem',
          margin: '1rem 0',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-end'
        }}>
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getText('placeholder')}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'white',
              fontSize: '1rem',
              resize: 'none',
              minHeight: '24px',
              maxHeight: '120px',
              lineHeight: '1.5',
              fontFamily: 'inherit'
            }}
            rows={1}
            disabled={isTyping}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            style={{
              background: inputMessage.trim() && !isTyping 
                ? 'linear-gradient(135deg, #4CAF50, #45a049)' 
                : 'rgba(255, 255, 255, 0.3)',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              color: 'white',
              cursor: inputMessage.trim() && !isTyping ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              transition: 'all 0.3s ease'
            }}
          >
            ➤
          </button>
        </div>

        {/* Disclaimer */}
        <div style={{
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.8rem',
          padding: '0.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: '0.5rem'
        }}>
          {getText('disclaimer')}
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 50%, 100% { opacity: 1; }
            25%, 75% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export default ChatInterface;