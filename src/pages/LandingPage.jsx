import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';

const LandingPage = ({ onNavigate }) => {
  const { getCurrentLanguage, changeLanguage } = useLanguage();
  const currentLang = getCurrentLanguage();

  // Content in different languages
  const content = {
    en: {
      title: "Health Garden",
      subtitle: "Get instant medical guidance in your language",
      description: "Describe your symptoms and get preliminary medical advice, find nearby healthcare providers, and access health education resources.",
      features: [
        "🏥 AI-powered symptom analysis",
        "🗣️ Support for Indian languages",
        "📍 Find nearby healthcare providers",
        "💬 24/7 health support chat"
      ],
      getStarted: "Get Started",
      emergency: "Emergency? Call 108",
      trustText: "This platform provides preliminary guidance only. Always consult healthcare professionals for serious medical concerns."
    },
    hi: {
      title: "AI स्वास्थ्य सहायक",
      subtitle: "अपनी भाषा में तुरंत चिकित्सा सहायता प्राप्त करें",
      description: "अपने लक्षण बताएं और प्रारंभिक चिकित्सा सलाह प्राप्त करें, आस-पास के स्वास्थ्य सेवा प्रदाता खोजें।",
      features: [
        "🏥 AI-संचालित लक्षण विश्लेषण",
        "🗣️ भारतीय भाषाओं का समर्थन",
        "📍 नजदीकी डॉक्टर खोजें",
        "💬 24/7 स्वास्थ्य सहायता"
      ],
      getStarted: "शुरू करें",
      emergency: "आपातकाल? 108 पर कॉल करें",
      trustText: "यह प्लेटफ़ॉर्म केवल प्रारंभिक मार्गदर्शन प्रदान करता है। गंभीर चिकित्सा समस्याओं के लिए हमेशा डॉक्टर से सलाह लें।"
    }
  };

  const currentContent = content[currentLang?.code] || content.en;

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <div className="landing-page">
      {/* Header with language selector */}
      <header className="landing-header">
        <div className="language-selector">
          <select 
            value={currentLang?.code} 
            onChange={handleLanguageChange}
            className="language-dropdown"
          >
            <option value="en">🇺🇸 English</option>
            <option value="hi">🇮🇳 हिन्दी</option>
          </select>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{currentContent.title}</h1>
          <p className="hero-subtitle">{currentContent.subtitle}</p>
          <p className="hero-description">{currentContent.description}</p>

          {/* Features */}
          <div className="features-grid">
            {currentContent.features.map((feature, index) => (
              <div key={index} className="feature-item">{feature}</div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <Button 
              onClick={() => onNavigate('language-selection')}
              variant="primary"
              size="large"
            >
              {currentContent.getStarted}
            </Button>
            
            <Button 
              onClick={() => window.open('tel:108', '_self')}
              variant="emergency"
              size="large"
            >
              {currentContent.emergency}
            </Button>
          </div>

          {/* Trust Indicator */}
          <div className="trust-section">
            <p className="trust-text">{currentContent.trustText}</p>
          </div>
        </div>
      </main>

      {/* Styles */}
      <style>{`
        .landing-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .landing-header {
          padding: 1rem 2rem;
          display: flex;
          justify-content: flex-end;
        }

        .language-dropdown {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: none;
          background: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          cursor: pointer;
        }

        .hero-section {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          padding: 0 2rem;
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .hero-subtitle {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }

        .hero-description {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          opacity: 0.8;
          line-height: 1.6;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .feature-item {
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 10px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .trust-section {
          max-width: 600px;
          margin: 0 auto;
        }

        .trust-text {
          font-size: 0.9rem;
          opacity: 0.7;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
