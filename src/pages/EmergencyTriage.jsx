// src/pages/EmergencyTriage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import EmergencyActions from '../components/emergency/EmergencyActions';
import FirstAidGuide from '../components/emergency/FirstAidGuide';

const EmergencyTriage = ({ onNavigate, emergencyType, patientData }) => {
  const { currentLanguage } = useContext(LanguageContext);
  const [currentStep, setCurrentStep] = useState('assessment'); // assessment, actions, firstaid
  const [emergencyLevel, setEmergencyLevel] = useState('high');
  const [selectedCondition, setSelectedCondition] = useState(null);

  // Multilingual text
  const text = {
    en: {
      title: "MEDICAL EMERGENCY DETECTED",
      subtitle: "Immediate attention required",
      assessment: "Emergency Assessment",
      callEmergency: "Call Emergency Services",
      getFirstAid: "Get First Aid Instructions",
      backToSymptoms: "Back to Symptoms",
      disclaimer: "This is an emergency situation. Professional medical help is strongly recommended.",
      emergencyDetected: "Based on your symptoms, this may be a medical emergency requiring immediate attention.",
      nextSteps: "Choose your next action:",
      warningText: "If you are experiencing a life-threatening emergency, call emergency services immediately."
    },
    hi: {
      title: "चिकित्सा आपातकाल का पता चला",
      subtitle: "तत्काल ध्यान देने की आवश्यकता",
      assessment: "आपातकालीन मूल्यांकन",
      callEmergency: "आपातकालीन सेवाएं कॉल करें",
      getFirstAid: "प्राथमिक चिकित्सा निर्देश प्राप्त करें",
      backToSymptoms: "लक्षणों पर वापस जाएं",
      disclaimer: "यह एक आपातकालीन स्थिति है। पेशेवर चिकित्सा सहायता की दृढ़ता से सिफारिश की जाती है।",
      emergencyDetected: "आपके लक्षणों के आधार पर, यह एक चिकित्सा आपातकाल हो सकता है जिसे तत्काल ध्यान देने की आवश्यकता है।",
      nextSteps: "अपनी अगली कार्रवाई चुनें:",
      warningText: "यदि आप जीवन-घातक आपातकाल का सामना कर रहे हैं, तो तुरंत आपातकालीन सेवाओं को कॉल करें।"
    }
  };

  const getText = (key) => {
    const currentText = text[currentLanguage] || text.en;
    return currentText[key] || text.en[key] || key;
  };

  // Determine emergency condition based on symptoms
  useEffect(() => {
    if (patientData?.symptoms) {
      const symptoms = patientData.symptoms.toLowerCase();
      
      if (symptoms.includes('chest pain') || symptoms.includes('heart')) {
        setSelectedCondition('cardiac');
      } else if (symptoms.includes('breath') || symptoms.includes('choking')) {
        setSelectedCondition('respiratory');
      } else if (symptoms.includes('bleeding') || symptoms.includes('injury')) {
        setSelectedCondition('trauma');
      } else if (symptoms.includes('stroke') || symptoms.includes('paralysis')) {
        setSelectedCondition('stroke');
      } else if (symptoms.includes('allergic') || symptoms.includes('swelling')) {
        setSelectedCondition('allergic');
      } else {
        setSelectedCondition('general');
      }
    }
  }, [patientData]);

  const renderAssessment = () => (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      padding: '2rem',
      border: '2px solid rgba(244, 67, 54, 0.5)',
      maxWidth: '600px',
      width: '100%'
    }}>
      {/* Emergency Warning */}
      <div style={{
        backgroundColor: 'rgba(244, 67, 54, 0.9)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 8px 25px rgba(244, 67, 54, 0.3)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚠️</div>
        <h2 style={{ margin: 0, fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          {getText('title')}
        </h2>
        <p style={{ margin: 0, fontSize: '1rem' }}>
          {getText('subtitle')}
        </p>
      </div>

      {/* Emergency Description */}
      <div style={{ marginBottom: '2rem', textAlign: 'center', color: 'white' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
          {getText('emergencyDetected')}
        </p>
        
        {patientData?.symptoms && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#ffeb3b' }}>Reported Symptoms:</h4>
            <p style={{ margin: 0, fontStyle: 'italic' }}>{patientData.symptoms}</p>
            {patientData.severity && (
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                Severity: {patientData.severity}/10
              </p>
            )}
          </div>
        )}

        <div style={{
          backgroundColor: 'rgba(255, 193, 7, 0.2)',
          borderLeft: '4px solid #ffc107',
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '0 8px 8px 0'
        }}>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            {getText('warningText')}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>
          {getText('nextSteps')}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            onClick={() => setCurrentStep('actions')}
            style={{
              background: 'linear-gradient(135deg, #f44336, #d32f2f)',
              border: 'none',
              borderRadius: '12px',
              padding: '1.2rem 2rem',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: '0 4px 15px rgba(244, 67, 54, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(244, 67, 54, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(244, 67, 54, 0.4)';
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🚨</span>
            {getText('callEmergency')}
          </button>

          <button
            onClick={() => setCurrentStep('firstaid')}
            style={{
              background: 'linear-gradient(135deg, #ff9800, #f57c00)',
              border: 'none',
              borderRadius: '12px',
              padding: '1.2rem 2rem',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: '0 4px 15px rgba(255, 152, 0, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(255, 152, 0, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(255, 152, 0, 0.4)';
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🏥</span>
            {getText('getFirstAid')}
          </button>

          <button
            onClick={() => onNavigate('symptom-input')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '1rem 2rem',
              color: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            ← {getText('backToSymptoms')}
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '0.9rem',
        fontStyle: 'italic'
      }}>
        {getText('disclaimer')}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      {currentStep === 'assessment' && renderAssessment()}
      
      {currentStep === 'actions' && (
        <EmergencyActions
          onNavigate={onNavigate}
          onBack={() => setCurrentStep('assessment')}
          patientData={patientData}
        />
      )}
      
      {currentStep === 'firstaid' && (
        <FirstAidGuide
          condition={selectedCondition}
          onNavigate={onNavigate}
          onBack={() => setCurrentStep('assessment')}
          patientData={patientData}
        />
      )}
    </div>
  );
};

export default EmergencyTriage;