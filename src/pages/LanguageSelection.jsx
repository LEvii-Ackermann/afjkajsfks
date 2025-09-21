import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';

const LanguageSelection = ({ onNavigate }) => {
  const { availableLanguages, changeLanguage } = useLanguage();

  const handleLanguageSelect = (languageCode) => {
    changeLanguage(languageCode);
    onNavigate('basic-info'); // Navigate to Basic Information page
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '2rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          Choose Your Language / अपनी भाषा चुनें
        </h1>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {availableLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '1.5rem',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {language.flag}
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {language.nativeName}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                {language.name}
              </div>
            </button>
          ))}
        </div>

        <Button 
          onClick={() => onNavigate('landing')} 
          variant="outline"
          size="medium"
        >
          ← Back / वापस
        </Button>
      </div>
    </div>
  );
};

export default LanguageSelection;