// src/context/LanguageContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Create the context with default values for better Fast Refresh compatibility
export const LanguageContext = createContext({
  currentLanguage: 'en',
  changeLanguage: () => {},
  getCurrentLanguage: () => ({}),
  getAvailableLanguages: () => ([]),
  getTranslation: () => '',
  translations: {},
  loadingTranslations: false,
  availableLanguages: []
});

// Expanded language data with major Indian languages
const languages = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    translations: {
      welcome: 'Welcome to AI Health Assistant',
      getStarted: 'Get Started',
      emergency: 'Emergency Call 108',
      chooseLanguage: 'Choose Your Language',
      back: 'Back',
      // Medical terms
      symptoms: 'Symptoms',
      severity: 'Severity',
      duration: 'Duration',
      analyze: 'Analyze Symptoms',
      loading: 'Analyzing your symptoms...',
      results: 'Analysis Results',
      // Emergency terms
      emergencyDetected: 'Emergency Detected',
      callEmergency: 'Call Emergency Services',
      getGuidance: 'Get Emergency Guidance'
    }
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    translations: {
      welcome: 'एआई स्वास्थ्य सहायक में आपका स्वागत है',
      getStarted: 'शुरू करें',
      emergency: 'आपातकाल कॉल 108',
      chooseLanguage: 'अपनी भाषा चुनें',
      back: 'वापस',
      // Medical terms
      symptoms: 'लक्षण',
      severity: 'गंभीरता',
      duration: 'अवधि',
      analyze: 'लक्षणों का विश्लेषण करें',
      loading: 'आपके लक्षणों का विश्लेषण कर रहे हैं...',
      results: 'विश्लेषण परिणाम',
      // Emergency terms
      emergencyDetected: 'आपातकाल का पता चला',
      callEmergency: 'आपातकालीन सेवाओं को कॉल करें',
      getGuidance: 'आपातकालीन मार्गदर्शन प्राप्त करें'
    }
  },
  // Bengali
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🟡',
    translations: {} // Will be translated dynamically
  },
  // Tamil
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🔴',
    translations: {} // Will be translated dynamically
  },
  // Telugu
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🟢',
    translations: {} // Will be translated dynamically
  },
  // Gujarati
  gu: {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    flag: '🟠',
    translations: {} // Will be translated dynamically
  },
  // Marathi
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🟣',
    translations: {} // Will be translated dynamically
  },
  // Kannada
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🔵',
    translations: {} // Will be translated dynamically
  },
  // Malayalam
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    flag: '🟤',
    translations: {} // Will be translated dynamically
  },
  // Punjabi
  pa: {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    flag: '⚫',
    translations: {} // Will be translated dynamically
  }
};

// Translation cache to avoid repeated API calls
const translationCache = {};

// Translation Service Class
class TranslationService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
    this.baseURL = 'https://translation.googleapis.com/language/translate/v2';
  }

  async translateText(text, targetLanguage, sourceLanguage = 'en') {
    // Check cache first
    const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    // If no API key, return original text
    if (!this.apiKey) {
      console.warn('Google Translate API key not found. Using original text.');
      return text;
    }

    try {
      const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          source: sourceLanguage,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.data.translations[0].translatedText;
      
      // Cache the translation
      translationCache[cacheKey] = translatedText;
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    }
  }

  async translateObject(textObject, targetLanguage) {
    const translatedObject = {};
    
    for (const [key, value] of Object.entries(textObject)) {
      if (typeof value === 'string') {
        translatedObject[key] = await this.translateText(value, targetLanguage);
      } else {
        translatedObject[key] = value;
      }
    }
    
    return translatedObject;
  }
}

const translationService = new TranslationService();

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [loadingTranslations, setLoadingTranslations] = useState(false);

  const changeLanguage = async (languageCode) => {
    setCurrentLanguage(languageCode);
    
    // If it's English or Hindi, no translation needed (already have static translations)
    if (languageCode === 'en' || languageCode === 'hi') {
      return;
    }

    // Check if translations already exist
    if (languages[languageCode] && Object.keys(languages[languageCode].translations).length > 0) {
      return;
    }

    // Translate dynamically for other languages
    setLoadingTranslations(true);
    try {
      const englishTranslations = languages.en.translations;
      const translatedObject = await translationService.translateObject(
        englishTranslations, 
        languageCode
      );
      
      // Update the language object with translations
      languages[languageCode].translations = translatedObject;
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Fallback to English
      setCurrentLanguage('en');
    }
    setLoadingTranslations(false);
  };

  const getCurrentLanguage = () => {
    return languages[currentLanguage] || languages.en;
  };

  const getAvailableLanguages = () => {
    return Object.values(languages);
  };

  // Get translations with fallback
  const getTranslation = (key) => {
    const currentLang = getCurrentLanguage();
    return currentLang.translations[key] || languages.en.translations[key] || key;
  };

  // Context value
  const contextValue = {
    currentLanguage,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    getTranslation,
    translations: getCurrentLanguage().translations,
    loadingTranslations,
    
    // Backwards compatibility with your existing code
    availableLanguages: getAvailableLanguages(),
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for backwards compatibility
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// No default export needed - using named export above