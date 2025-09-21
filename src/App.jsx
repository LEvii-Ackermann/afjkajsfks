// src/App.jsx
import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import LandingPage from './pages/LandingPage';
import LanguageSelection from './pages/LanguageSelection';
import BasicInformation from './pages/BasicInformation';
import SymptomInput from './pages/SymptomInput';
import AnalysisLoading from './pages/AnalysisLoading';
import ResultsPage from './pages/ResultsPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [patientData, setPatientData] = useState({
    age: '',
    gender: '',
    location: '',
    emergencyContact: '',
    symptoms: '',
    severity: 1,
    duration: '',
    selectedSymptoms: []
  });

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const updatePatientData = (newData) => {
    setPatientData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigateTo} />;
        
      case 'language-selection':
        return <LanguageSelection onNavigate={navigateTo} />;
        
      case 'basic-info':
        return (
          <BasicInformation 
            onNavigate={navigateTo}
            patientData={patientData}
            updatePatientData={updatePatientData}
          />
        );
        
      case 'symptom-input':
        return (
          <SymptomInput 
            onNavigate={navigateTo}
            patientData={patientData}
            updatePatientData={updatePatientData}
          />
        );
        
      case 'analysis-loading':
        return (
          <AnalysisLoading 
            onNavigate={navigateTo}
            patientData={patientData}
          />
        );
        
      case 'results':
        return <ResultsPage onNavigate={navigateTo} />;
        
      case 'provider-listing':
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
            <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🏥</div>
            <h2 style={{ marginBottom: '1rem' }}>Healthcare Providers</h2>
            <p style={{ opacity: 0.8, fontSize: '1rem', marginBottom: '2rem' }}>
              Coming Soon - Find nearby healthcare providers
            </p>
            <button
              onClick={() => navigateTo('results')}
              style={{
                padding: '0.8rem 2rem',
                borderRadius: '25px',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                backgroundColor: 'transparent',
                color: 'white',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ← Back to Results
            </button>
          </div>
        );
        
      case 'follow-up-chat':
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
            <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>💬</div>
            <h2 style={{ marginBottom: '1rem' }}>Health Support Chat</h2>
            <p style={{ opacity: 0.8, fontSize: '1rem', marginBottom: '2rem' }}>
              Coming Soon - Chat with our AI health assistant
            </p>
            <button
              onClick={() => navigateTo('results')}
              style={{
                padding: '0.8rem 2rem',
                borderRadius: '25px',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                backgroundColor: 'transparent',
                color: 'white',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ← Back to Results
            </button>
          </div>
        );
        
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="App">
        {renderCurrentPage()}
      </div>
    </LanguageProvider>
  );
}

export default App;