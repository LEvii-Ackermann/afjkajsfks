// src/pages/AnalysisLoading.jsx
import React, { useEffect, useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import geminiService from '../services/api/geminiService';

const AnalysisLoading = ({ onNavigate, patientData }) => {
  const { currentLanguage } = useContext(LanguageContext);
  const [loadingStage, setLoadingStage] = useState('processing');
  const [error, setError] = useState(null);

  const text = {
    en: {
      analyzing: "Analyzing Your Symptoms...",
      processing: "Our AI is processing your information",
      completing: "Almost done, preparing results...",
      error: "Analysis Error",
      errorMessage: "Unable to complete analysis. Using standard recommendations.",
      retry: "Try Again",
      poweredBy: "Powered by Google Gemini AI"
    },
    hi: {
      analyzing: "आपके लक्षणों का विश्लेषण कर रहे हैं...",
      processing: "हमारी AI आपकी जानकारी को संसाधित कर रही है",
      completing: "लगभग हो गया, परिणाम तैयार कर रहे हैं...",
      error: "विश्लेषण त्रुटि",
      errorMessage: "विश्लेषण पूरा करने में असमर्थ। मानक सुझाव का उपयोग कर रहे हैं।",
      retry: "पुनः प्रयास करें",
      poweredBy: "Google Gemini AI द्वारा संचालित"
    }
  };

  // Safe function to get text with fallback
  const getText = (key) => {
    const currentText = text[currentLanguage] || text.en;
    return currentText[key] || text.en[key] || key;
  };

  useEffect(() => {
    const performAnalysis = async () => {
      try {
        // Stage 1: Processing (0-2 seconds)
        setLoadingStage('processing');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Stage 2: Completing (2-3 seconds)
        setLoadingStage('completing');
        
        // Make actual API call to Gemini
        const analysisResult = await geminiService.analyzeSymptoms(patientData);
        
        // Store results for ResultsPage to use
        localStorage.setItem('analysisResults', JSON.stringify(analysisResult));
        localStorage.setItem('patientData', JSON.stringify(patientData));
        
        // Small delay to show completion stage
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Navigate to results
        onNavigate('results');
        
      } catch (error) {
        console.error('Analysis error:', error);
        setError(error.message);
        
        // On error, still provide some results after delay
        setTimeout(() => {
          const fallbackResult = geminiService.getMockResponse(patientData);
          localStorage.setItem('analysisResults', JSON.stringify(fallbackResult));
          localStorage.setItem('patientData', JSON.stringify(patientData));
          onNavigate('results');
        }, 2000);
      }
    };

    performAnalysis();
  }, [onNavigate, patientData]);

  const handleRetry = () => {
    setError(null);
    setLoadingStage('processing');
    // Trigger re-analysis by reloading (you could make this more elegant)
    window.location.reload();
  };

  const getLoadingMessage = () => {
    switch(loadingStage) {
      case 'processing':
        return getText('processing');
      case 'completing':
        return getText('completing');
      default:
        return getText('processing');
    }
  };

  const getProgressPercentage = () => {
    switch(loadingStage) {
      case 'processing':
        return '33%';
      case 'completing':
        return '85%';
      default:
        return '10%';
    }
  };

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.5rem',
        textAlign: 'center',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '2rem'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>⚠️</div>
        <h2 style={{ marginBottom: '1rem', color: '#ffeb3b' }}>
          {getText('error')}
        </h2>
        <p style={{ 
          opacity: 0.9, 
          fontSize: '1rem', 
          marginBottom: '2rem',
          maxWidth: '400px'
        }}>
          {getText('errorMessage')}
        </p>
        <button
          onClick={handleRetry}
          style={{
            padding: '1rem 2rem',
            borderRadius: '25px',
            border: '2px solid rgba(255, 255, 255, 0.5)',
            backgroundColor: 'transparent',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          {getText('retry')}
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '1.5rem',
      textAlign: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '2rem', animation: 'pulse 1.5s infinite' }}>
        🔍
      </div>
      <h2 style={{ marginBottom: '1rem' }}>
        {getText('analyzing')}
      </h2>
      <p style={{ opacity: 0.8, fontSize: '1rem' }}>
        {getLoadingMessage()}
      </p>
      
      {/* Enhanced Progress Bar */}
      <div style={{
        width: '300px',
        height: '6px',
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '3px',
        marginTop: '2rem',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          width: getProgressPercentage(),
          height: '100%',
          background: 'linear-gradient(90deg, #4285f4, #34a853, #fbbc05, #ea4335)',
          borderRadius: '3px',
          transition: 'width 0.5s ease'
        }}></div>
        
        {/* Shimmer effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          animation: 'shimmer 2s infinite ease-in-out'
        }}></div>
      </div>

      {/* Loading Stages Indicator */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginTop: '2rem',
        fontSize: '0.8rem'
      }}>
        <div style={{
          padding: '0.5rem 1rem',
          borderRadius: '15px',
          backgroundColor: loadingStage === 'processing' ? 'rgba(66, 133, 244, 0.8)' : 'rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease'
        }}>
          Processing Symptoms
        </div>
        <div style={{
          padding: '0.5rem 1rem',
          borderRadius: '15px',
          backgroundColor: loadingStage === 'completing' ? 'rgba(52, 168, 83, 0.8)' : 'rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease'
        }}>
          Generating Results
        </div>
      </div>

      {/* Powered by Gemini */}
      <div style={{
        marginTop: '2rem',
        fontSize: '0.7rem',
        opacity: 0.6
      }}>
        {getText('poweredBy')}
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default AnalysisLoading;