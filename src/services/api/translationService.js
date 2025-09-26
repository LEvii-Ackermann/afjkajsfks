// src/services/api/translationService.js
import axios from 'axios';

class TranslationService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
    this.baseURL = 'https://translation.googleapis.com/language/translate/v2';
    this.cache = new Map(); // Cache translations to reduce API calls
    this.supportedLanguages = {
      'en': 'English',
      'hi': 'Hindi',
      'bn': 'Bengali', 
      'ta': 'Tamil',
      'te': 'Telugu',
      'gu': 'Gujarati',
      'mr': 'Marathi',
      'kn': 'Kannada',
      'ml': 'Malayalam',
      'pa': 'Punjabi',
      'ur': 'Urdu',
      'as': 'Assamese',
      'or': 'Odia'
    };

    if (!this.apiKey) {
      console.warn('Google Translate API key not found. Translation features will use fallback text.');
    }
  }

  // Translate single text
  async translateText(text, targetLanguage, sourceLanguage = 'en') {
    // Skip translation if same language or target is English
    if (sourceLanguage === targetLanguage || !text.trim()) {
      return text;
    }

    // Check cache first
    const cacheKey = `${text.substring(0, 50)}_${sourceLanguage}_${targetLanguage}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Return original text if no API key
    if (!this.apiKey) {
      return text;
    }

    try {
      const response = await axios.post(`${this.baseURL}?key=${this.apiKey}`, {
        q: text,
        target: targetLanguage,
        source: sourceLanguage,
        format: 'text'
      });

      const translatedText = response.data.data.translations[0].translatedText;
      
      // Cache the translation
      this.cache.set(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      
      // Handle specific errors
      if (error.response?.status === 403) {
        console.error('Translation API quota exceeded or invalid key');
      } else if (error.response?.status === 400) {
        console.error('Invalid translation request');
      }
      
      return text; // Return original text on error
    }
  }

  // Translate multiple texts in batch
  async translateBatch(texts, targetLanguage, sourceLanguage = 'en') {
    if (sourceLanguage === targetLanguage || !texts.length) {
      return texts;
    }

    if (!this.apiKey) {
      return texts;
    }

    try {
      // Split into smaller batches to avoid API limits
      const batchSize = 50;
      const results = [];
      
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        
        const response = await axios.post(`${this.baseURL}?key=${this.apiKey}`, {
          q: batch,
          target: targetLanguage,
          source: sourceLanguage,
          format: 'text'
        });

        const translations = response.data.data.translations.map(t => t.translatedText);
        results.push(...translations);
        
        // Small delay between batches to respect rate limits
        if (i + batchSize < texts.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      return results;
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts;
    }
  }

  // Translate medical symptoms specifically
  async translateMedicalTerms(terms, targetLanguage) {
    const medicalContext = {
      q: terms,
      target: targetLanguage,
      source: 'en',
      format: 'text',
      model: 'base' // Use base model for better medical translation
    };

    if (!this.apiKey) {
      return terms;
    }

    try {
      const response = await axios.post(`${this.baseURL}?key=${this.apiKey}`, medicalContext);
      return response.data.data.translations.map(t => t.translatedText);
    } catch (error) {
      console.error('Medical terms translation error:', error);
      return terms;
    }
  }

  // Auto-detect language of input text
  async detectLanguage(text) {
    if (!this.apiKey || !text.trim()) {
      return 'en'; // Default to English
    }

    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2/detect?key=${this.apiKey}`,
        { q: text }
      );
      
      return response.data.data.detections[0][0].language;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en';
    }
  }

  // Get supported languages
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  // Clear translation cache
  clearCache() {
    this.cache.clear();
  }

  // Check if API is available
  isApiAvailable() {
    return !!this.apiKey;
  }

  // Get usage statistics
  getCacheStats() {
    return {
      cachedTranslations: this.cache.size,
      supportedLanguages: Object.keys(this.supportedLanguages).length,
      apiAvailable: this.isApiAvailable()
    };
  }
}

export default new TranslationService();