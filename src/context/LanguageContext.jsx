// src/context/LanguageContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Create the context
export const LanguageContext = createContext();

// Language data
const languages = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳'
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇧🇩'
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🏴'
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుগు',
    flag: '🏴'
  },
  gu: {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    flag: '🏴'
  }
};

// Translations
const translations = {
  en: {
    welcome: "Welcome to AI Healthcare",
    getStarted: "Get Started",
    emergency: "Emergency? Call 108",
    chooseLanguage: "Choose Your Language",
    back: "Back",
    continue: "Continue",
    next: "Next"
  },
  hi: {
    welcome: "AI स्वास्थ्य सेवा में आपका स्वागत है",
    getStarted: "शुरू करें",
    emergency: "आपातकाल? 108 पर कॉल करें",
    chooseLanguage: "अपनी भाषा चुनें",
    back: "वापस",
    continue: "जारी रखें",
    next: "अगला"
  },
  bn: {
    welcome: "AI স্বাস্থ্যসেবায় স্वাগতम",
    getStarted: "শুরু করুন",
    emergency: "জরুরি? ১০৮ এ কল করুন",
    chooseLanguage: "আপনার ভাষা বেছে নিন",
    back: "পিছনে",
    continue: "চালিয়ে যান",
    next: "পরবর্তী"
  },
  ta: {
    welcome: "AI சுகாதாரத்திற்கு வரவேற்கிறோம்",
    getStarted: "தொடங்குங்கள்",
    emergency: "அவசரம்? 108 க்கு அழைக்கவும்",
    chooseLanguage: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    back: "பின்னோக்கி",
    continue: "தொடরவும்",
    next: "அடுத்து"
  },
  te: {
    welcome: "AI ఆరోగ్య సేవకు స్వాగతం",
    getStarted: "ప్రారంభించండి",
    emergency: "అత్యవసరం? 108కు కాల్ చేయండి",
    chooseLanguage: "మీ భాషను ఎంచుకోండి",
    back: "వెనుకకు",
    continue: "కొనసాగించు",
    next: "తరువాత"
  },
  gu: {
    welcome: "AI આરોગ્યસેવામાં આપનું સ્વાગત છે",
    getStarted: "શરૂ કરો",
    emergency: "કટોકટી? 108 પર કૉલ કરો",
    chooseLanguage: "તમારી ભાષા પસંદ કરો",
    back: "પાછળ",
    continue: "ચાલુ રાખો",
    next: "આગલું"
  }
};

// Context Provider Component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const changeLanguage = (languageCode) => {
    if (languages[languageCode]) {
      setCurrentLanguage(languageCode);
      localStorage.setItem('selectedLanguage', languageCode);
    }
  };

  const getCurrentLanguage = () => {
    return languages[currentLanguage];
  };

  const getTranslation = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  const getAvailableLanguages = () => {
    return Object.values(languages);
  };

  // Initialize language from localStorage if available
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && languages[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const contextValue = {
    // New pattern (for files that want to use it)
    currentLanguage,
    changeLanguage,
    getCurrentLanguage,
    getTranslation,
    getAvailableLanguages,
    languages,
    translations: translations[currentLanguage] || translations.en,

    // Backwards compatible properties (for your existing files)
    availableLanguages: Object.values(languages),
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the Language Context - BACKWARDS COMPATIBLE
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  // Return backwards compatible structure
  return {
    currentLanguage: context.currentLanguage,
    changeLanguage: context.changeLanguage,
    getCurrentLanguage: context.getCurrentLanguage,
    getTranslation: context.getTranslation,
    translations: context.translations,
    
    // Your existing code expects these:
    availableLanguages: context.availableLanguages,
  };
};

// Export default for convenience
export default LanguageContext;