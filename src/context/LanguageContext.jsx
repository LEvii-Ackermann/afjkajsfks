// src/context/LanguageContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Create the context
export const LanguageContext = createContext({
  currentLanguage: 'en',
  changeLanguage: () => {},
  getCurrentLanguage: () => ({}),
  getAvailableLanguages: () => ([]),
  getTranslation: () => '',
  loadingTranslations: false,
  availableLanguages: []
});

// Available languages - clean and simple
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
      loadingTranslations: 'Loading translations...',
      ready: '✓ Ready',
      autoTranslate: 'Auto-translate',
      // Landing Page
      appTitle: "Health Garden",
      appSubtitle: "Get instant medical guidance in your language",
      appDescription: "Describe your symptoms and get preliminary medical advice, find nearby healthcare providers, and access health education resources.",
      feature1: "🏥 AI-powered symptom analysis",
      feature2: "🗣️ Support for Indian languages",
      feature3: "📍 Find nearby healthcare providers",
      feature4: "💬 24/7 health support chat",
      trustText: "This platform provides preliminary guidance only. Always consult healthcare professionals for serious medical concerns.",
      // Basic Information Page
      basicInfoTitle: "Basic Information",
      basicInfoSubtitle: "Help us provide better assistance",
      ageGroupLabel: "Age Group",
      ageChild: "0-12 years",
      ageTeen: "13-19 years",
      ageAdult: "20-59 years",
      ageSenior: "60+ years",
      genderLabel: "Gender (Optional)",
      genderMale: "Male",
      genderFemale: "Female",
      genderOther: "Other",
      genderPreferNot: "Prefer not to say",
      locationLabel: "Location (City, State)",
      locationPlaceholder: "e.g., Mumbai, Maharashtra",
      emergencyContactLabel: "Emergency Contact (Optional)",
      emergencyContactPlaceholder: "Phone number of family member",
      continueToSymptoms: "Continue to Symptoms",
      fieldRequired: "This field is required",
      privacyNotice: "🔒 Your information is kept private and secure"
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
      loadingTranslations: 'अनुवाद लोड हो रहा है...',
      ready: '✓ तैयार',
      autoTranslate: 'ऑटो-अनुवाद',
      // Landing Page
      appTitle: "AI स्वास्थ्य सहायक",
      appSubtitle: "अपनी भाषा में तुरंत चिकित्सा सहायता प्राप्त करें",
      appDescription: "अपने लक्षण बताएं और प्रारंभिक चिकित्सा सलाह प्राप्त करें, आस-पास के स्वास्थ्य सेवा प्रदाता खोजें।",
      feature1: "🏥 AI-संचालित लक्षण विश्लेषण",
      feature2: "🗣️ भारतीय भाषाओं का समर्थन",
      feature3: "📍 नजदीकी डॉक्टर खोजें",
      feature4: "💬 24/7 स्वास्थ्य सहायता",
      trustText: "यह प्लेटफ़ॉर्म केवल प्रारंभिक मार्गदर्शन प्रदान करता है। गंभीर चिकित्सा समस्याओं के लिए हमेशा डॉक्टर से सलाह लें।",
      // Basic Information Page
      basicInfoTitle: "बुनियादी जानकारी",
      basicInfoSubtitle: "बेहतर सहायता के लिए हमारी मदद करें",
      ageGroupLabel: "आयु समूह",
      ageChild: "0-12 साल",
      ageTeen: "13-19 साल",
      ageAdult: "20-59 साल",
      ageSenior: "60+ साल",
      genderLabel: "लिंग (वैकल्पिक)",
      genderMale: "पुरुष",
      genderFemale: "महिला",
      genderOther: "अन्य",
      genderPreferNot: "नहीं बताना चाहते",
      locationLabel: "स्थान (शहर, राज्य)",
      locationPlaceholder: "जैसे मुंबई, महाराष्ट्र",
      emergencyContactLabel: "आपातकालीन संपर्क (वैकल्पिक)",
      emergencyContactPlaceholder: "परिवार के सदस्य का फोन नंबर",
      continueToSymptoms: "लक्षणों के लिए जारी रखें",
      fieldRequired: "यह फ़ील्ड आवश्यक है",
      privacyNotice: "🔒 आपकी जानकारी निजी और सुरक्षित रखी जाती है"
    }
  },
  // Other Indian languages - minimal data, API handles translation
  bn: { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🟡' },
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🔴' },
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🟢' },
  gu: { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🟠' },
  mr: { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🟣' },
  kn: { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🔵' },
  ml: { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🟤' },
  pa: { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '⚫' }
};

// Translation cache
const translationCache = {};

// Simple Translation Service
class TranslationService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
    this.baseURL = 'https://translation.googleapis.com/language/translate/v2';
    this.requestDelay = 200;
  }

  async translateText(text, targetLanguage, sourceLanguage = 'en') {
    const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    if (!this.apiKey) {
      return text;
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, this.requestDelay));

    try {
      const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          source: sourceLanguage,
          format: 'text'
        })
      });

      if (!response.ok) throw new Error(`Translation API error: ${response.status}`);

      const data = await response.json();
      const translatedText = data.data.translations[0].translatedText;
      
      translationCache[cacheKey] = translatedText;
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }
}

const translationService = new TranslationService();

// Language Provider
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [loadingTranslations, setLoadingTranslations] = useState(false);

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
  };

  const getCurrentLanguage = () => {
    return languages[currentLanguage] || languages.en;
  };

  const getAvailableLanguages = () => {
    return Object.values(languages);
  };

  // Main translation function - this is where the magic happens
  const getTranslation = (key) => {
    const currentLang = getCurrentLanguage();
    
    // For English/Hindi, use static translations
    if (currentLanguage === 'en' || currentLanguage === 'hi') {
      return currentLang.translations[key] || languages.en.translations[key] || key;
    }
    
    // For other languages, use API translation
    const englishText = languages.en.translations[key];
    if (!englishText) return key;
    
    // Check cache first
    const cacheKey = `${englishText}_en_${currentLanguage}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }
    
    // Translate async (will update cache for next time)
    translationService.translateText(englishText, currentLanguage).then(translated => {
      // This will be available on next render
    });
    
    // Return English as fallback while translation loads
    return englishText;
  };

  const contextValue = {
    currentLanguage,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    getTranslation,
    loadingTranslations,
    availableLanguages: getAvailableLanguages()
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};