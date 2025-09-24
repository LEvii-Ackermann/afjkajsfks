// src/components/emergency/EmergencyDetector.jsx
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const EmergencyDetector = () => {
  const { currentLanguage } = useContext(LanguageContext);

  // Emergency keyword patterns for different languages
  const emergencyKeywords = {
    en: {
      cardiac: [
        'chest pain', 'heart attack', 'crushing chest pain', 'severe chest pain',
        'chest pressure', 'heart racing', 'chest tightness', 'angina'
      ],
      respiratory: [
        'can\'t breathe', 'difficulty breathing', 'shortness of breath',
        'choking', 'gasping', 'respiratory distress', 'suffocating'
      ],
      neurological: [
        'stroke', 'severe headache', 'sudden confusion', 'paralysis',
        'facial drooping', 'speech problems', 'vision loss', 'seizure'
      ],
      trauma: [
        'severe bleeding', 'heavy bleeding', 'major injury', 'unconscious',
        'broken bone', 'head injury', 'accident', 'trauma'
      ],
      allergic: [
        'allergic reaction', 'anaphylaxis', 'swelling throat', 'swelling tongue',
        'severe allergic', 'throat closing', 'hives all over'
      ],
      poisoning: [
        'poisoning', 'overdose', 'toxic', 'ingested', 'swallowed poison'
      ]
    },
    hi: {
      cardiac: [
        'सीने में दर्द', 'दिल का दौरा', 'सीने में दबाव', 'हृदय की समस्या',
        'छाती में दर्द', 'हृदयगति', 'सांस लेने में तकलीफ'
      ],
      respiratory: [
        'सांस नहीं आ रही', 'सांस लेने में कठिनाई', 'दम घुट रहा है',
        'सांस फूल रही है', 'गला रुंध रहा है'
      ],
      neurological: [
        'स्ट्रोक', 'तेज सिरदर्द', 'लकवा', 'चेहरे की समस्या',
        'बोलने में कठिनाई', 'दौरा', 'बेहोशी'
      ],
      trauma: [
        'तेज खून बह रहा है', 'गंभीर चोट', 'बेहोश', 'हड्डी टूटी है',
        'सिर की चोट', 'दुर्घटना'
      ],
      allergic: [
        'एलर्जी की प्रतिक्रिया', 'गले में सूजन', 'जीभ में सूजन',
        'गंभीर एलर्जी', 'सांस लेने में तकलीफ एलर्जी से'
      ]
    }
  };

  // Critical symptom combinations that indicate emergency
  const criticalCombinations = [
    ['chest pain', 'shortness of breath'],
    ['chest pain', 'nausea'],
    ['severe headache', 'confusion'],
    ['severe headache', 'vision problems'],
    ['difficulty breathing', 'chest pain'],
    ['swelling', 'throat'],
    ['swelling', 'tongue'],
    ['severe bleeding', 'weakness'],
    ['unconscious', 'not responding']
  ];

  // Age-based emergency thresholds
  const ageBasedThresholds = {
    '18-30': { severityThreshold: 9, concernKeywords: ['chest pain', 'severe headache'] },
    '31-50': { severityThreshold: 8, concernKeywords: ['chest pain', 'breathing', 'headache'] },
    '51-65': { severityThreshold: 7, concernKeywords: ['chest pain', 'breathing', 'dizziness'] },
    '65+': { severityThreshold: 6, concernKeywords: ['chest pain', 'breathing', 'confusion', 'falls'] }
  };

  /**
   * Main emergency detection function
   * @param {Object} patientData - Patient symptoms and information
   * @returns {Object} Emergency assessment result
   */
  const detectEmergency = (patientData) => {
    const { symptoms, severity, duration, ageGroup, selectedSymptoms } = patientData;
    
    if (!symptoms) {
      return { isEmergency: false, level: 'none', type: null };
    }

    const symptomsLower = symptoms.toLowerCase();
    const severityNum = parseInt(severity) || 0;
    
    // Check for immediate emergency keywords
    const emergencyCheck = checkEmergencyKeywords(symptomsLower);
    if (emergencyCheck.isEmergency) {
      return {
        isEmergency: true,
        level: 'critical',
        type: emergencyCheck.type,
        reason: 'Critical symptoms detected',
        confidence: 0.95
      };
    }

    // Check critical symptom combinations
    const combinationCheck = checkCriticalCombinations(symptomsLower);
    if (combinationCheck.isEmergency) {
      return {
        isEmergency: true,
        level: 'high',
        type: combinationCheck.type,
        reason: 'Critical symptom combination detected',
        confidence: 0.90
      };
    }

    // Check severity-based emergency
    const severityCheck = checkSeverityBasedEmergency(severityNum, ageGroup, symptomsLower);
    if (severityCheck.isEmergency) {
      return {
        isEmergency: true,
        level: severityCheck.level,
        type: 'high_severity',
        reason: severityCheck.reason,
        confidence: 0.80
      };
    }

    // Check duration-based concerns
    const durationCheck = checkDurationConcerns(symptomsLower, duration, severityNum);
    if (durationCheck.isEmergency) {
      return {
        isEmergency: true,
        level: 'moderate',
        type: 'persistent_severe',
        reason: durationCheck.reason,
        confidence: 0.70
      };
    }

    return { isEmergency: false, level: 'none', type: null };
  };

  /**
   * Check for emergency keywords in symptoms
   */
  const checkEmergencyKeywords = (symptoms) => {
    const currentKeywords = emergencyKeywords[currentLanguage] || emergencyKeywords.en;
    
    for (const [type, keywords] of Object.entries(currentKeywords)) {
      for (const keyword of keywords) {
        if (symptoms.includes(keyword)) {
          return {
            isEmergency: true,
            type: type,
            keyword: keyword
          };
        }
      }
    }
    
    return { isEmergency: false };
  };

  /**
   * Check for critical symptom combinations
   */
  const checkCriticalCombinations = (symptoms) => {
    for (const combination of criticalCombinations) {
      if (combination.every(symptom => symptoms.includes(symptom))) {
        return {
          isEmergency: true,
          type: 'combination',
          combination: combination
        };
      }
    }
    
    return { isEmergency: false };
  };

  /**
   * Check severity-based emergency criteria
   */
  const checkSeverityBasedEmergency = (severity, ageGroup, symptoms) => {
    if (!severity || severity < 6) return { isEmergency: false };

    const ageThreshold = ageBasedThresholds[ageGroup] || ageBasedThresholds['31-50'];
    
    // Critical severity regardless of age
    if (severity >= 9) {
      return {
        isEmergency: true,
        level: 'critical',
        reason: 'Extremely high severity level (9-10/10)'
      };
    }

    // Age-based severity thresholds
    if (severity >= ageThreshold.severityThreshold) {
      const concernKeywordFound = ageThreshold.concernKeywords.some(keyword => 
        symptoms.includes(keyword)
      );

      if (concernKeywordFound) {
        return {
          isEmergency: true,
          level: 'high',
          reason: `High severity (${severity}/10) with concerning symptoms for age group`
        };
      }
    }

    return { isEmergency: false };
  };

  /**
   * Check duration-based emergency concerns
   */
  const checkDurationConcerns = (symptoms, duration, severity) => {
    if (!duration || severity < 7) return { isEmergency: false };

    const durationLower = duration.toLowerCase();
    
    // Sudden onset severe symptoms
    if ((durationLower.includes('sudden') || durationLower.includes('just started')) && severity >= 8) {
      return {
        isEmergency: true,
        reason: 'Sudden onset of severe symptoms'
      };
    }

    // Persistent severe symptoms
    if (durationLower.includes('days') && severity >= 7) {
      if (symptoms.includes('chest pain') || symptoms.includes('difficulty breathing')) {
        return {
          isEmergency: true,
          reason: 'Persistent severe cardiorespiratory symptoms'
        };
      }
    }

    return { isEmergency: false };
  };

  /**
   * Get emergency recommendations based on detected type
   */
  const getEmergencyRecommendations = (emergencyResult) => {
    if (!emergencyResult.isEmergency) return null;

    const recommendations = {
      cardiac: {
        immediate: ['Call emergency services immediately', 'Take aspirin if not allergic', 'Sit upright', 'Loosen tight clothing'],
        avoid: ['Do not drive yourself', 'Do not ignore symptoms', 'Do not take nitroglycerin unless prescribed']
      },
      respiratory: {
        immediate: ['Call emergency services', 'Stay calm', 'Sit upright', 'Use rescue inhaler if prescribed'],
        avoid: ['Do not lie down', 'Do not leave the person alone', 'Do not give food or water']
      },
      neurological: {
        immediate: ['Call emergency services immediately', 'Note time symptoms started', 'Stay with patient', 'Check FAST signs'],
        avoid: ['Do not give medications', 'Do not give food or water', 'Do not move patient unnecessarily']
      },
      trauma: {
        immediate: ['Call emergency services', 'Control bleeding with pressure', 'Keep patient still', 'Monitor consciousness'],
        avoid: ['Do not move patient', 'Do not remove embedded objects', 'Do not give food or water']
      },
      allergic: {
        immediate: ['Call emergency services', 'Use EpiPen if available', 'Remove allergen source', 'Position upright if conscious'],
        avoid: ['Do not induce vomiting', 'Do not give antihistamines for severe reactions', 'Do not leave patient alone']
      }
    };

    return recommendations[emergencyResult.type] || recommendations.cardiac;
  };

  /**
   * Real-time symptom monitoring for continuous detection
   */
  const monitorSymptoms = (patientData, onEmergencyDetected) => {
    const emergencyResult = detectEmergency(patientData);
    
    if (emergencyResult.isEmergency) {
      const recommendations = getEmergencyRecommendations(emergencyResult);
      
      onEmergencyDetected({
        ...emergencyResult,
        recommendations,
        timestamp: new Date().toISOString()
      });
    }
  };

  return {
    detectEmergency,
    getEmergencyRecommendations,
    monitorSymptoms,
    emergencyKeywords: emergencyKeywords[currentLanguage] || emergencyKeywords.en
  };
};

export default EmergencyDetector;