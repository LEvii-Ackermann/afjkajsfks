import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';
import VoiceRecorder from '../components/symptom/VoiceRecorder';

const SymptomInput = ({ onNavigate }) => {
  const { getCurrentLanguage } = useLanguage();
  const currentLang = getCurrentLanguage();

  // State management
  const [symptomText, setSymptomText] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Multilingual content
  const content = {
    en: {
      title: "Describe Your Symptoms",
      subtitle: "Tell us what you're experiencing",
      textInput: {
        label: "Describe your symptoms in detail",
        placeholder: "I have been experiencing headache and fever since yesterday..."
      },
      voiceInput: {
        label: "Or record your voice",
        button: "🎤 Record Voice",
        recording: "🔴 Recording... Click to stop",
        recorded: "✅ Voice recorded successfully"
      },
      commonSymptoms: {
        label: "Common Symptoms (Select all that apply)",
        symptoms: [
          { id: 'fever', name: 'Fever', icon: '🌡️' },
          { id: 'headache', name: 'Headache', icon: '🤕' },
          { id: 'cough', name: 'Cough', icon: '😷' },
          { id: 'fatigue', name: 'Fatigue', icon: '😴' },
          { id: 'nausea', name: 'Nausea', icon: '🤢' },
          { id: 'stomach-pain', name: 'Stomach Pain', icon: '🫃' },
          { id: 'chest-pain', name: 'Chest Pain', icon: '💔' },
          { id: 'breathing', name: 'Breathing Issues', icon: '🫁' },
          { id: 'dizziness', name: 'Dizziness', icon: '😵‍💫' },
          { id: 'rash', name: 'Skin Rash', icon: '🟤' }
        ]
      },
      severity: {
        label: "How severe are your symptoms? (1-10)",
        levels: ['Mild', 'Moderate', 'Severe']
      },
      duration: {
        label: "How long have you had these symptoms?",
        options: [
          { value: 'few-hours', label: 'A few hours' },
          { value: 'today', label: 'Since today' },
          { value: '1-2-days', label: '1-2 days' },
          { value: '3-7-days', label: '3-7 days' },
          { value: 'over-week', label: 'More than a week' },
          { value: 'chronic', label: 'Chronic (ongoing)' }
        ]
      },
      analyze: "Analyze Symptoms",
      back: "← Back",
      emergency: "🚨 If this is an emergency, call 108 immediately"
    },
    hi: {
      title: "अपने लक्षणों का वर्णन करें",
      subtitle: "बताएं कि आप क्या अनुभव कर रहे हैं",
      textInput: {
        label: "अपने लक्षणों का विस्तार से वर्णन करें",
        placeholder: "कल से मुझे सिरदर्द और बुखार आ रहा है..."
      },
      voiceInput: {
        label: "या अपनी आवाज रिकॉर्ड करें",
        button: "🎤 आवाज रिकॉर्ड करें",
        recording: "🔴 रिकॉर्डिंग... रोकने के लिए क्लिक करें",
        recorded: "✅ आवाज सफलतापूर्वक रिकॉर्ड हुई"
      },
      commonSymptoms: {
        label: "आम लक्षण (जो लागू हों सभी चुनें)",
        symptoms: [
          { id: 'fever', name: 'बुखार', icon: '🌡️' },
          { id: 'headache', name: 'सिरदर्द', icon: '🤕' },
          { id: 'cough', name: 'खांसी', icon: '😷' },
          { id: 'fatigue', name: 'थकान', icon: '😴' },
          { id: 'nausea', name: 'जी मिचलाना', icon: '🤢' },
          { id: 'stomach-pain', name: 'पेट दर्द', icon: '🫃' },
          { id: 'chest-pain', name: 'छाती में दर्द', icon: '💔' },
          { id: 'breathing', name: 'सांस की समस्या', icon: '🫁' },
          { id: 'dizziness', name: 'चक्कर आना', icon: '😵‍💫' },
          { id: 'rash', name: 'त्वचा पर चकत्ते', icon: '🟤' }
        ]
      },
      severity: {
        label: "आपके लक्षण कितने गंभीर हैं? (1-10)",
        levels: ['हल्के', 'मध्यम', 'गंभीर']
      },
      duration: {
        label: "आपको ये लक्षण कब से हैं?",
        options: [
          { value: 'few-hours', label: 'कुछ घंटों से' },
          { value: 'today', label: 'आज से' },
          { value: '1-2-days', label: '1-2 दिन से' },
          { value: '3-7-days', label: '3-7 दिन से' },
          { value: 'over-week', label: 'एक सप्ताह से अधिक' },
          { value: 'chronic', label: 'पुराना (चल रहा)' }
        ]
      },
      analyze: "लक्षणों का विश्लेषण करें",
      back: "← वापस",
      emergency: "🚨 यदि यह आपातकाल है, तो तुरंत 108 पर कॉल करें"
    }
  };

  const currentContent = content[currentLang?.code] || content.en;

  // Handle symptom selection
  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(s => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  // Handle form submission
  const handleAnalyze = () => {
    const symptomData = {
      textDescription: symptomText,
      voiceRecording: null, // Will be implemented with voice recording
      selectedSymptoms,
      severity,
      duration,
      timestamp: new Date().toISOString(),
      language: currentLang?.code
    };

    // Store symptom data
    localStorage.setItem('symptomData', JSON.stringify(symptomData));
    
    // Navigate to loading/analysis page
    onNavigate('analysis-loading');
  };

  const getSeverityColor = (value) => {
    if (value <= 3) return '#4CAF50'; // Green for mild
    if (value <= 7) return '#FF9800'; // Orange for moderate  
    return '#f44336'; // Red for severe
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            {currentContent.title}
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            {currentContent.subtitle}
          </p>
        </div>

        {/* Emergency Banner */}
        <div style={{
          background: 'rgba(244, 67, 54, 0.2)',
          border: '2px solid #f44336',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '2rem',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          {currentContent.emergency}
        </div>

        {/* Main Form */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          marginBottom: '2rem'
        }}>
          {/* Text Input */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '1.2rem', 
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>
              {currentContent.textInput.label}
            </label>
            <textarea
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              placeholder={currentContent.textInput.placeholder}
              rows={4}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '10px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Voice Input */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '1.2rem', 
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>
              {currentContent.voiceInput.label}
            </label>
            <VoiceRecorder 
              onRecordingComplete={(audioBlob) => {
                // Handle voice recording
                console.log('Voice recorded:', audioBlob);
              }}
              currentContent={currentContent.voiceInput}
            />
          </div>

          {/* Common Symptoms */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '1.2rem', 
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>
              {currentContent.commonSymptoms.label}
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              {currentContent.commonSymptoms.symptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  style={{
                    background: selectedSymptoms.includes(symptom.id)
                      ? 'rgba(76, 175, 80, 0.3)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: selectedSymptoms.includes(symptom.id)
                      ? '2px solid #4CAF50'
                      : '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '1rem',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    {symptom.icon}
                  </div>
                  <div style={{ fontSize: '0.9rem' }}>
                    {symptom.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Severity Scale */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '1.2rem', 
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>
              {currentContent.severity.label}
            </label>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1.5rem',
              borderRadius: '12px'
            }}>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  background: `linear-gradient(to right, #4CAF50 0%, #FF9800 50%, #f44336 100%)`,
                  borderRadius: '5px',
                  outline: 'none'
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
                fontSize: '0.9rem'
              }}>
                <span>1 - {currentContent.severity.levels[0]}</span>
                <span style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: getSeverityColor(severity)
                }}>
                  {severity}
                </span>
                <span>10 - {currentContent.severity.levels[2]}</span>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '1.2rem', 
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>
              {currentContent.duration.label}
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1rem'
            }}>
              {currentContent.duration.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDuration(option.value)}
                  style={{
                    background: duration === option.value
                      ? 'rgba(76, 175, 80, 0.3)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: duration === option.value
                      ? '2px solid #4CAF50'
                      : '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '10px',
                    padding: '1rem',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          <Button 
            onClick={() => onNavigate('basic-info')}
            variant="outline"
          >
            {currentContent.back}
          </Button>
          
          <Button 
            onClick={handleAnalyze}
            variant="primary"
            size="large"
            disabled={!symptomText.trim() && selectedSymptoms.length === 0}
          >
            {currentContent.analyze}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SymptomInput;