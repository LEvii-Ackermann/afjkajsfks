// src/services/api/geminiService.js
import axios from 'axios';

// Updated to use the correct model endpoint
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!this.apiKey) {
      console.warn('Gemini API key not found. Using mock responses.');
    }
  }

  // NEW: Emergency detection method
  detectEmergency(patientData) {
    const { symptoms, severity, duration, ageGroup, selectedSymptoms } = patientData;
    
    if (!symptoms) {
      return { isEmergency: false, level: 'none', type: null };
    }

    const symptomsLower = symptoms.toLowerCase();
    const severityNum = parseInt(severity) || 0;
    
    // Emergency keywords for different categories
    const emergencyKeywords = {
      cardiac: [
        'chest pain', 'heart attack', 'crushing chest pain', 'severe chest pain',
        'chest pressure', 'heart racing', 'chest tightness'
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
        'broken bone', 'head injury', 'accident'
      ],
      allergic: [
        'allergic reaction', 'anaphylaxis', 'swelling throat', 'swelling tongue',
        'severe allergic', 'throat closing'
      ]
    };

    // Check for immediate emergency keywords
    for (const [type, keywords] of Object.entries(emergencyKeywords)) {
      for (const keyword of keywords) {
        if (symptomsLower.includes(keyword)) {
          return {
            isEmergency: true,
            level: 'critical',
            type: type,
            reason: `Critical symptoms detected: ${keyword}`,
            confidence: 0.95
          };
        }
      }
    }

    // Check critical symptom combinations
    const criticalCombinations = [
      ['chest pain', 'shortness of breath'],
      ['chest pain', 'nausea'],
      ['severe headache', 'confusion'],
      ['difficulty breathing', 'chest pain'],
      ['swelling', 'throat'],
      ['severe bleeding', 'weakness']
    ];

    for (const combination of criticalCombinations) {
      if (combination.every(symptom => symptomsLower.includes(symptom))) {
        return {
          isEmergency: true,
          level: 'high',
          type: 'combination',
          reason: 'Critical symptom combination detected',
          confidence: 0.90
        };
      }
    }

    // Check severity-based emergency
    if (severityNum >= 9) {
      return {
        isEmergency: true,
        level: 'critical',
        type: 'high_severity',
        reason: 'Extremely high severity level (9-10/10)',
        confidence: 0.85
      };
    }

    // Age-based severity thresholds
    const ageThresholds = {
      '18-30': 8,
      '31-50': 7,
      '51-65': 6,
      '65+': 6
    };

    const threshold = ageThresholds[ageGroup] || 7;
    if (severityNum >= threshold) {
      const concerningSymptoms = ['chest pain', 'breathing', 'headache', 'dizziness'];
      const hasConcerningSymptom = concerningSymptoms.some(symptom => 
        symptomsLower.includes(symptom)
      );

      if (hasConcerningSymptom) {
        return {
          isEmergency: true,
          level: 'high',
          type: 'age_severity',
          reason: `High severity with concerning symptoms for age group`,
          confidence: 0.80
        };
      }
    }

    // Check selected emergency symptoms
    const emergencySymptomIds = ['chest-pain', 'breathing', 'severe-headache'];
    const hasEmergencySymptom = selectedSymptoms?.some(symptom => 
      emergencySymptomIds.includes(symptom)
    );

    if (hasEmergencySymptom && severityNum >= 7) {
      return {
        isEmergency: true,
        level: 'moderate',
        type: 'selected_symptoms',
        reason: 'High severity with emergency symptom categories',
        confidence: 0.75
      };
    }

    return { isEmergency: false, level: 'none', type: null };
  }

  async analyzeSymptoms(patientData) {
    // Check for emergency first
    const emergencyCheck = this.detectEmergency(patientData);
    if (emergencyCheck.isEmergency) {
      return {
        isEmergency: true,
        emergencyData: emergencyCheck,
        urgencyLevel: 'emergency',
        possibleConditions: [
          {
            condition: 'EMERGENCY SITUATION DETECTED',
            probability: emergencyCheck.confidence * 100,
            description: emergencyCheck.reason
          }
        ],
        recommendations: [
          {
            action: 'Call emergency services immediately',
            priority: 'critical'
          },
          {
            action: 'Do not delay seeking professional medical help',
            priority: 'critical'
          }
        ],
        whenToSeekHelp: [
          'Immediately - this is a potential emergency',
          'Call 911 (US) or 108 (India) now'
        ],
        disclaimer: 'EMERGENCY DETECTED: Seek immediate professional medical attention.'
      };
    }

    // If no emergency, continue with normal analysis
    if (!this.apiKey) {
      return this.getMockResponse(patientData);
    }

    try {
      const prompt = this.buildMedicalPrompt(patientData);
      
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 1,
            topP: 1,
            maxOutputTokens: 1000,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      const parsedResponse = this.parseAIResponse(aiResponse);
      
      // Add emergency flag to normal responses
      return {
        ...parsedResponse,
        isEmergency: false
      };

    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Handle specific API errors
      if (error.response?.status === 429) {
        console.error('Rate limit exceeded. Using fallback response.');
      } else if (error.response?.status === 400) {
        console.error('Invalid request. Check API key and request format.');
      } else if (error.response?.status === 404) {
        console.error('API endpoint not found. Check model name and URL.');
      }
      
      // Fallback to mock response on API failure
      const mockResponse = this.getMockResponse(patientData);
      return {
        ...mockResponse,
        isEmergency: false
      };
    }
  }

  // Chat functionality for follow-up questions
  async getChatResponse(userMessage, context = {}) {
    if (!this.apiKey) {
      console.log('Gemini API key not found. Using mock chat response.');
      return this.getMockChatResponse(userMessage);
    }

    try {
      const prompt = this.buildChatPrompt(userMessage, context);
      
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 800,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      return aiResponse.trim();

    } catch (error) {
      console.error('Gemini Chat Error:', error);
      return this.getMockChatResponse(userMessage);
    }
  }

  buildMedicalPrompt(patientData) {
    const { symptoms, severity, duration, age, gender, location } = patientData;
    
    return `You are a medical AI assistant providing preliminary health information. You must:
1. Never provide definitive diagnoses - only suggest possible conditions
2. Always recommend consulting healthcare professionals
3. Provide structured, helpful information
4. Use appropriate medical terminology
5. Assess urgency levels appropriately
6. Return responses in valid JSON format

IMPORTANT: This is for informational purposes only and should not replace professional medical advice.

Please analyze the following patient information:

Patient Information:
- Age Group: ${age || 'Not specified'}
- Gender: ${gender || 'Not specified'}  
- Location: ${location || 'Not specified'}
- Symptoms: ${symptoms}
- Severity: ${severity}/10
- Duration: ${duration}

Please provide your response in the following JSON format only (no additional text):

{
  "urgencyLevel": "low|moderate|high|emergency",
  "possibleConditions": [
    {
      "condition": "Condition name",
      "probability": 85,
      "description": "Brief description of condition"
    }
  ],
  "recommendations": [
    {
      "action": "Specific recommended action",
      "priority": "high|medium|low"
    }
  ],
  "whenToSeekHelp": [
    "Warning sign requiring immediate attention",
    "Another warning sign"
  ],
  "disclaimer": "Important medical disclaimer text"
}

Consider these factors in your analysis:
1. Symptom severity (${severity}/10) and duration (${duration})
2. Age-appropriate conditions for ${age || 'unspecified age'}
3. Urgency assessment based on symptom combination
4. Appropriate recommendations for the severity level
5. Clear warning signs for when to seek immediate care

Provide helpful, accurate information while emphasizing the need for professional medical consultation. Return only valid JSON without any additional formatting or text.`;
  }

  // Build chat prompt for follow-up questions
  buildChatPrompt(userMessage, context) {
    const contextInfo = context.symptoms ? `
Previous Analysis Context:
- Patient's reported symptoms: ${context.symptoms}
- Severity level: ${context.severity}/10
- Duration: ${context.duration}
- Age group: ${context.age}
- Previous analysis showed possible conditions: ${context.previousAnalysis?.map(c => c.condition).join(', ') || 'Not available'}
` : '';

    return `You are a helpful medical AI assistant providing follow-up support after a symptom analysis. 

${contextInfo}

User's Current Question: "${userMessage}"

Please provide a helpful, medically responsible response that:
- Addresses their specific question about their health analysis
- Provides educational information when appropriate
- Always emphasizes the importance of consulting healthcare professionals for medical decisions
- Is supportive and empathetic
- Keeps responses concise but informative (2-3 paragraphs maximum)
- Avoids providing definitive medical diagnoses
- References their previous analysis when relevant
- Uses simple, understandable language

IMPORTANT GUIDELINES:
- Never recommend specific medications without professional consultation
- Always encourage seeking professional medical advice for treatment decisions
- Provide general health education and guidance
- Be supportive but medically responsible
- If asked about emergency symptoms, immediately recommend seeking urgent care

Remember: This is for informational purposes only and should not replace professional medical consultation.`;
  }

  parseAIResponse(aiResponse) {
    try {
      // Remove markdown formatting if present
      let cleanResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Try to extract JSON from the response
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return this.validateResponse(parsedResponse);
      }
      
      // If no valid JSON found, create structured response
      return this.createStructuredResponse(aiResponse);
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return this.createDefaultResponse(aiResponse);
    }
  }

  validateResponse(response) {
    // Ensure all required fields exist
    const validResponse = {
      urgencyLevel: response.urgencyLevel || 'moderate',
      possibleConditions: Array.isArray(response.possibleConditions) ? response.possibleConditions : [
        {
          condition: 'Medical Evaluation Needed',
          probability: 75,
          description: 'Professional medical assessment recommended'
        }
      ],
      recommendations: Array.isArray(response.recommendations) ? response.recommendations : [
        {
          action: 'Consult with healthcare provider',
          priority: 'high'
        }
      ],
      whenToSeekHelp: Array.isArray(response.whenToSeekHelp) ? response.whenToSeekHelp : [
        'Symptoms worsen or persist',
        'New concerning symptoms develop'
      ],
      disclaimer: response.disclaimer || 'This analysis is for informational purposes only and should not replace professional medical advice.'
    };

    // Validate urgency level
    if (!['low', 'moderate', 'high', 'emergency'].includes(validResponse.urgencyLevel)) {
      validResponse.urgencyLevel = 'moderate';
    }

    return validResponse;
  }

  createStructuredResponse(aiResponse) {
    // Basic parsing if JSON format fails
    return {
      urgencyLevel: 'moderate',
      possibleConditions: [
        {
          condition: 'AI Analysis Available',
          probability: 75,
          description: aiResponse.substring(0, 200) + (aiResponse.length > 200 ? '...' : '')
        }
      ],
      recommendations: [
        {
          action: 'Consult with a healthcare provider for proper evaluation',
          priority: 'high'
        },
        {
          action: 'Monitor symptoms and seek care if they worsen',
          priority: 'medium'
        }
      ],
      whenToSeekHelp: [
        'Symptoms significantly worsen',
        'New concerning symptoms develop',
        'No improvement after reasonable time'
      ],
      disclaimer: 'This analysis is for informational purposes only and should not replace professional medical advice.'
    };
  }

  createDefaultResponse(aiResponse) {
    return {
      urgencyLevel: 'moderate',
      possibleConditions: [
        {
          condition: 'Professional Consultation Recommended',
          probability: 80,
          description: 'Based on your symptoms, professional medical evaluation is recommended for proper assessment'
        }
      ],
      recommendations: [
        {
          action: 'Schedule appointment with healthcare provider',
          priority: 'high'
        },
        {
          action: 'Keep track of symptom changes and duration',
          priority: 'medium'
        },
        {
          action: 'Rest and maintain good hydration',
          priority: 'medium'
        }
      ],
      whenToSeekHelp: [
        'Symptoms worsen or persist beyond expected timeframe',
        'New symptoms develop',
        'You feel concerned about your condition'
      ],
      disclaimer: 'AI analysis encountered an issue. Please consult a healthcare professional for proper medical advice.'
    };
  }

  // Mock chat responses for when API is unavailable
  getMockChatResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('pain') || message.includes('hurt')) {
      return "Pain management can involve rest, over-the-counter pain relievers (as appropriate for your age and health conditions), and avoiding activities that worsen the pain. However, if pain is severe, persistent, or accompanied by other concerning symptoms, it's important to consult with a healthcare professional for proper evaluation and treatment. They can assess your specific situation and recommend the most appropriate treatment plan.";
    }
    
    if (message.includes('fever') || message.includes('temperature')) {
      return "Fever is often your body's way of fighting infection. Stay hydrated, rest, and consider fever-reducing medication if appropriate for your situation. However, high fevers (over 103°F/39.4°C), persistent fevers, or fevers accompanied by severe symptoms require medical attention. Always consult a healthcare provider for guidance specific to your situation, especially if you have underlying health conditions.";
    }
    
    if (message.includes('medication') || message.includes('medicine') || message.includes('drug')) {
      return "I cannot recommend specific medications as this requires professional medical evaluation. The choice of medication depends on your specific condition, medical history, current medications, allergies, and other individual factors. Please consult with a healthcare provider or pharmacist who can properly assess your situation and recommend appropriate treatment options.";
    }
    
    if (message.includes('emergency') || message.includes('urgent') || message.includes('serious')) {
      return "If you're experiencing a medical emergency, please call your local emergency number immediately (911 in the US, 108 in India). Emergency signs include severe chest pain, difficulty breathing, severe bleeding, loss of consciousness, or severe allergic reactions. When in doubt about the severity of your condition, it's always better to seek immediate medical attention rather than wait.";
    }

    if (message.includes('when') && (message.includes('doctor') || message.includes('hospital'))) {
      return "You should consider seeing a healthcare provider if your symptoms are worsening, persisting longer than expected, or if you're concerned about your condition. Specific situations that warrant medical attention include high fever, severe pain, difficulty breathing, persistent symptoms that interfere with daily activities, or any symptoms that worry you. Trust your instincts - if you feel something isn't right, it's worth getting checked by a professional.";
    }

    if (message.includes('how long') || message.includes('recovery') || message.includes('heal')) {
      return "Recovery time varies greatly depending on the specific condition, your overall health, age, and how well you follow treatment recommendations. While some minor conditions may resolve in a few days, others might take weeks or require ongoing management. It's important to follow up with a healthcare provider if your symptoms persist beyond expected recovery times or if they worsen at any point during your recovery.";
    }
    
    return "I understand your concern about your health. While I can provide general health information based on your previous analysis, every person's situation is unique. For personalized medical advice, proper diagnosis, and treatment recommendations, I strongly encourage you to consult with a qualified healthcare professional who can properly evaluate your specific condition and circumstances. They can provide guidance tailored to your individual needs and medical history.";
  }

  getMockResponse(patientData) {
    // Enhanced mock response based on actual symptoms
    const { symptoms, severity, duration } = patientData;
    
    let urgencyLevel = 'moderate';
    let conditions = [];
    
    // Basic symptom analysis for mock response
    const symptomLower = (symptoms || '').toLowerCase();
    
    // High severity or concerning symptoms
    if (symptomLower.includes('chest pain') || 
        symptomLower.includes('difficulty breathing') || 
        symptomLower.includes('severe pain') ||
        severity >= 8) {
      urgencyLevel = 'high';
      conditions = [
        {
          condition: 'Requires Immediate Medical Attention',
          probability: 90,
          description: 'High severity symptoms require professional evaluation without delay'
        }
      ];
    } 
    // Common symptoms
    else if (symptomLower.includes('headache')) {
      conditions = [
        {
          condition: 'Tension Headache',
          probability: 75,
          description: 'Common headache potentially related to stress, dehydration, or tension'
        },
        {
          condition: 'Migraine',
          probability: 45,
          description: 'Severe headache that may include sensitivity to light or sound'
        }
      ];
    } 
    else if (symptomLower.includes('fever') || symptomLower.includes('cold') || symptomLower.includes('cough')) {
      conditions = [
        {
          condition: 'Viral Upper Respiratory Infection',
          probability: 80,
          description: 'Common cold or flu-like illness affecting the upper respiratory system'
        },
        {
          condition: 'Bacterial Infection',
          probability: 30,
          description: 'Possible bacterial infection requiring medical evaluation'
        }
      ];
    }
    // General symptoms
    else {
      conditions = [
        {
          condition: 'General Health Concern',
          probability: 65,
          description: 'Symptoms require medical evaluation for proper diagnosis and treatment plan'
        }
      ];
    }

    return {
      urgencyLevel,
      possibleConditions: conditions,
      recommendations: [
        {
          action: 'Rest and maintain adequate hydration',
          priority: 'high'
        },
        {
          action: 'Monitor symptoms for changes or worsening',
          priority: 'medium'
        },
        {
          action: 'Consult healthcare provider if symptoms persist or worsen',
          priority: 'high'
        },
        {
          action: 'Avoid strenuous activity until feeling better',
          priority: 'medium'
        }
      ],
      whenToSeekHelp: [
        'Symptoms worsen significantly or rapidly',
        'Fever above 101°F (38.3°C) that persists',
        'Difficulty breathing or shortness of breath',
        'Severe pain or discomfort',
        'Symptoms persist beyond expected recovery time'
      ],
      disclaimer: 'This is a mock analysis for demonstration. Please consult with qualified healthcare professionals for actual medical advice and proper diagnosis.'
    };
  }
}

export default new GeminiService();