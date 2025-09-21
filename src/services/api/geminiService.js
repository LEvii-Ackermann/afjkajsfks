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

  async analyzeSymptoms(patientData) {
    // If no API key, return mock data
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
      return this.parseAIResponse(aiResponse);

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
      return this.getMockResponse(patientData);
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