// src/components/emergency/FirstAidGuide.jsx
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const FirstAidGuide = ({ condition, onNavigate, onBack, patientData }) => {
  const { currentLanguage } = useContext(LanguageContext);
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // First aid instructions for different conditions
  const firstAidInstructions = {
    cardiac: {
      en: {
        title: "Heart Attack / Chest Pain First Aid",
        warning: "Call emergency services immediately before starting first aid",
        steps: [
          {
            title: "Call Emergency Services",
            instruction: "Call 911 (US) or 108 (India) immediately. State 'possible heart attack'",
            icon: "📞",
            duration: null
          },
          {
            title: "Position the Person",
            instruction: "Help them sit upright, leaning against a wall or chair. This reduces strain on the heart.",
            icon: "🪑",
            duration: null
          },
          {
            title: "Give Aspirin (if safe)",
            instruction: "If person is conscious and not allergic, give 325mg aspirin to chew slowly.",
            icon: "💊",
            duration: null
          },
          {
            title: "Loosen Clothing",
            instruction: "Loosen any tight clothing around neck, chest, and waist to help breathing.",
            icon: "👔",
            duration: null
          },
          {
            title: "Monitor & Reassure",
            instruction: "Stay calm, keep them calm, monitor breathing. Be prepared to perform CPR if needed.",
            icon: "❤️",
            duration: null
          }
        ],
        warnings: [
          "Do NOT drive the person to hospital yourself",
          "Do NOT give nitroglycerin unless prescribed to them",
          "Do NOT give food or water"
        ]
      },
      hi: {
        title: "दिल का दौरा / सीने में दर्द प्राथमिक चिकित्सा",
        warning: "प्राथमिक चिकित्सा शुरू करने से पहले तुरंत आपातकालीन सेवाओं को कॉल करें",
        steps: [
          {
            title: "आपातकालीन सेवाओं को कॉल करें",
            instruction: "तुरंत 108 पर कॉल करें। कहें 'संभावित दिल का दौरा'",
            icon: "📞",
            duration: null
          },
          {
            title: "व्यक्ति को बैठाएं",
            instruction: "उन्हें दीवार या कुर्सी के सहारे सीधा बैठने में मदद करें।",
            icon: "🪑",
            duration: null
          },
          {
            title: "एस्प्रिन दें (यदि सुरक्षित है)",
            instruction: "यदि व्यक्ति होश में है और एलर्जी नहीं है, तो 325mg एस्प्रिन चबाने को दें।",
            icon: "💊",
            duration: null
          },
          {
            title: "कपड़े ढीले करें",
            instruction: "गर्दन, छाती और कमर के आसपास के कपड़े ढीले करें।",
            icon: "👔",
            duration: null
          },
          {
            title: "निगरानी और आश्वासन",
            instruction: "शांत रहें, उन्हें शांत रखें, सांस की निगरानी करें।",
            icon: "❤️",
            duration: null
          }
        ],
        warnings: [
          "व्यक्ति को खुद अस्पताल न ले जाएं",
          "बिना प्रिस्क्रिप्शन के नाइट्रोग्लिसरीन न दें",
          "खाना या पानी न दें"
        ]
      }
    },
    respiratory: {
      en: {
        title: "Breathing Emergency / Choking First Aid",
        warning: "For severe breathing difficulties, call emergency services immediately",
        steps: [
          {
            title: "Call Emergency Services",
            instruction: "Call 911 (US) or 108 (India) for severe breathing problems",
            icon: "📞",
            duration: null
          },
          {
            title: "Position Upright",
            instruction: "Help person sit upright or lean forward slightly. Never lay them down.",
            icon: "🧍",
            duration: null
          },
          {
            title: "Use Inhaler (if available)",
            instruction: "If they have a rescue inhaler, help them use it according to instructions",
            icon: "💨",
            duration: null
          },
          {
            title: "For Choking - Back Blows",
            instruction: "Give 5 sharp back blows between shoulder blades with heel of hand",
            icon: "✋",
            duration: null
          },
          {
            title: "Heimlich Maneuver",
            instruction: "Stand behind person, place fist above navel, thrust upward and inward 5 times",
            icon: "🤝",
            duration: null
          }
        ],
        warnings: [
          "Do NOT force person to lie down during breathing difficulty",
          "Do NOT leave person alone",
          "Do NOT give food or water during breathing emergency"
        ]
      },
      hi: {
        title: "सांस की आपातकाल / गला रुंधना प्राथमिक चिकित्सा",
        warning: "गंभीर सांस की कठिनाई के लिए तुरंत आपातकालीन सेवाओं को कॉल करें",
        steps: [
          {
            title: "आपातकालीन सेवाओं को कॉल करें",
            instruction: "गंभीर सांस की समस्याओं के लिए 108 पर कॉल करें",
            icon: "📞",
            duration: null
          },
          {
            title: "सीधा बैठाएं",
            instruction: "व्यक्ति को सीधा बैठने या थोड़ा आगे झुकने में मदद करें।",
            icon: "🧍",
            duration: null
          },
          {
            title: "इन्हेलर का उपयोग करें",
            instruction: "यदि उनके पास रेस्क्यू इन्हेलर है, तो उपयोग में मदद करें",
            icon: "💨",
            duration: null
          },
          {
            title: "गला रुंधने पर - पीठ पर मारें",
            instruction: "कंधे की ब्लेड के बीच हथेली से 5 तेज़ वार करें",
            icon: "✋",
            duration: null
          },
          {
            title: "हैमलिक मैन्यूवर",
            instruction: "व्यक्ति के पीछे खड़े हों, नाभि के ऊपर मुट्ठी रखें, 5 बार ऊपर की ओर धक्का दें",
            icon: "🤝",
            duration: null
          }
        ],
        warnings: [
          "सांस की कठिनाई के दौरान व्यक्ति को लेटने को मजबूर न करें",
          "व्यक्ति को अकेला न छोड़ें",
          "सांस की आपातकाल के दौरान खाना या पानी न दें"
        ]
      }
    },
    stroke: {
      en: {
        title: "Stroke First Aid",
        warning: "TIME IS CRITICAL - Call emergency services immediately",
        steps: [
          {
            title: "Call Emergency Services NOW",
            instruction: "Call 911 (US) or 108 (India) immediately. Say 'possible stroke'",
            icon: "📞",
            duration: null
          },
          {
            title: "Check FAST Signs",
            instruction: "Face drooping, Arms weakness, Speech difficulty, Time to call emergency",
            icon: "🧠",
            duration: null
          },
          {
            title: "Keep Person Still",
            instruction: "Do not move them unless in immediate danger. Support head if sitting",
            icon: "🛑",
            duration: null
          },
          {
            title: "Monitor Breathing",
            instruction: "Check if they are breathing normally. Be ready to perform rescue breathing",
            icon: "👃",
            duration: null
          },
          {
            title: "Note Time",
            instruction: "Record when symptoms first appeared - this is crucial for treatment",
            icon: "⏰",
            duration: null
          }
        ],
        warnings: [
          "Do NOT give aspirin for stroke",
          "Do NOT give food or water",
          "Do NOT leave person alone"
        ]
      }
    },
    trauma: {
      en: {
        title: "Severe Bleeding / Trauma First Aid",
        warning: "Call emergency services while providing first aid",
        steps: [
          {
            title: "Call Emergency Services",
            instruction: "Call 911 (US) or 108 (India) immediately for severe bleeding",
            icon: "📞",
            duration: null
          },
          {
            title: "Apply Direct Pressure",
            instruction: "Use clean cloth, press firmly on wound. Do not remove if cloth soaks through, add more",
            icon: "✋",
            duration: null
          },
          {
            title: "Elevate if Possible",
            instruction: "Raise injured area above heart level if no broken bones suspected",
            icon: "⬆️",
            duration: null
          },
          {
            title: "Check for Shock",
            instruction: "Watch for pale skin, rapid weak pulse, shallow breathing. Keep person warm",
            icon: "🌡️",
            duration: null
          },
          {
            title: "Monitor Consciousness",
            instruction: "Keep talking to person. If unconscious, check breathing and pulse",
            icon: "👁️",
            duration: null
          }
        ],
        warnings: [
          "Do NOT remove embedded objects",
          "Do NOT move person if spinal injury suspected",
          "Do NOT give food or water"
        ]
      }
    },
    allergic: {
      en: {
        title: "Severe Allergic Reaction First Aid",
        warning: "Anaphylaxis can be fatal - act quickly",
        steps: [
          {
            title: "Call Emergency Services",
            instruction: "Call 911 (US) or 108 (India) immediately for severe allergic reaction",
            icon: "📞",
            duration: null
          },
          {
            title: "Use EpiPen if Available",
            instruction: "Inject epinephrine auto-injector into outer thigh through clothing if prescribed",
            icon: "💉",
            duration: null
          },
          {
            title: "Remove Allergen",
            instruction: "Remove or avoid the cause if known (food, medication, insect stinger)",
            icon: "🚫",
            duration: null
          },
          {
            title: "Position Properly",
            instruction: "If conscious, sit upright. If unconscious with breathing, recovery position",
            icon: "🧍",
            duration: null
          },
          {
            title: "Monitor & Reassure",
            instruction: "Watch breathing closely. Be prepared for second reaction wave",
            icon: "👀",
            duration: null
          }
        ],
        warnings: [
          "Do NOT induce vomiting",
          "Do NOT give oral medications during severe reaction",
          "Do NOT leave person alone"
        ]
      }
    },
    general: {
      en: {
        title: "General Emergency First Aid",
        warning: "When in doubt, call emergency services",
        steps: [
          {
            title: "Assess the Situation",
            instruction: "Check for immediate dangers to you and the patient before approaching",
            icon: "👁️",
            duration: null
          },
          {
            title: "Call for Help",
            instruction: "Call emergency services if situation seems serious or you're unsure",
            icon: "📞",
            duration: null
          },
          {
            title: "Check Responsiveness",
            instruction: "Tap shoulders and shout 'Are you okay?' Check if person responds",
            icon: "🤝",
            duration: null
          },
          {
            title: "Check Breathing",
            instruction: "Look for chest movement, listen for breath sounds, feel for breath on cheek",
            icon: "👃",
            duration: null
          },
          {
            title: "Provide Comfort",
            instruction: "Keep person calm, warm, and still until emergency services arrive",
            icon: "🤗",
            duration: null
          }
        ],
        warnings: [
          "Do NOT move person unnecessarily",
          "Do NOT give food or water unless specifically advised",
          "Do NOT leave person alone if seriously ill"
        ]
      }
    }
  };

  const getText = (key) => {
    const currentText = text[currentLanguage] || text.en;
    return currentText[key] || text.en[key] || key;
  };

  const text = {
    en: {
      title: "First Aid Instructions",
      step: "Step",
      of: "of",
      next: "Next Step",
      previous: "Previous Step",
      complete: "Complete",
      warnings: "Important Warnings",
      callEmergency: "Call Emergency Services",
      backToEmergency: "Back to Emergency Options",
      timerStart: "Start Timer",
      timerStop: "Stop Timer",
      timerReset: "Reset Timer"
    },
    hi: {
      title: "प्राथमिक चिकित्सा निर्देश",
      step: "चरण",
      of: "का",
      next: "अगला चरण",
      previous: "पिछला चरण",
      complete: "पूर्ण",
      warnings: "महत्वपूर्ण चेतावनी",
      callEmergency: "आपातकालीन सेवाएं कॉल करें",
      backToEmergency: "आपातकालीन विकल्पों पर वापस",
      timerStart: "टाइमर शुरू करें",
      timerStop: "टाइमर रोकें",
      timerReset: "टाइमर रीसेट करें"
    }
  };

  // Get current condition instructions
  const currentInstructions = firstAidInstructions[condition] || firstAidInstructions.general;
  const instructions = currentInstructions[currentLanguage] || currentInstructions.en;

  // Timer functionality for timed steps
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isTimerRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const nextStep = () => {
    if (currentStep < instructions.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      padding: '2rem',
      maxWidth: '700px',
      width: '100%',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
        paddingBottom: '1rem'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          {instructions.title}
        </h2>
        
        {/* Emergency Warning */}
        <div style={{
          backgroundColor: 'rgba(244, 67, 54, 0.8)',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '1rem',
          fontSize: '1rem',
          fontWeight: 'bold'
        }}>
          ⚠️ {instructions.warning}
        </div>
      </div>

      {/* Progress Indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '2rem',
        gap: '1rem'
      }}>
        <span style={{ fontSize: '1.1rem' }}>
          {getText('step')} {currentStep + 1} {getText('of')} {instructions.steps.length}
        </span>
        <div style={{
          flex: 1,
          height: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            backgroundColor: '#4CAF50',
            width: `${((currentStep + 1) / instructions.steps.length) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Current Step */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {instructions.steps[currentStep].icon}
        </div>
        
        <h3 style={{
          margin: '0 0 1rem 0',
          fontSize: '1.4rem',
          color: '#ffeb3b'
        }}>
          {instructions.steps[currentStep].title}
        </h3>
        
        <p style={{
          fontSize: '1.1rem',
          lineHeight: '1.6',
          margin: 0
        }}>
          {instructions.steps[currentStep].instruction}
        </p>

        {/* Timer for timed steps */}
        {instructions.steps[currentStep].duration && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              {formatTime(timer)}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: isTimerRunning ? '#f44336' : '#4CAF50',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                {isTimerRunning ? getText('timerStop') : getText('timerStart')}
              </button>
              
              <button
                onClick={() => { setTimer(0); setIsTimerRunning(false); }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#ff9800',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                {getText('timerReset')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        gap: '1rem'
      }}>
        <button
          onClick={previousStep}
          disabled={currentStep === 0}
          style={{
            padding: '1rem 2rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: currentStep === 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            opacity: currentStep === 0 ? 0.5 : 1
          }}
        >
          ← {getText('previous')}
        </button>

        <button
          onClick={nextStep}
          disabled={currentStep === instructions.steps.length - 1}
          style={{
            padding: '1rem 2rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: currentStep === instructions.steps.length - 1 ? 'rgba(76, 175, 80, 0.8)' : 'rgba(33, 150, 243, 0.8)',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          {currentStep === instructions.steps.length - 1 ? getText('complete') : getText('next')} →
        </button>
      </div>

      {/* Warnings */}
      <div style={{
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        borderLeft: '4px solid #ffc107',
        padding: '1.5rem',
        marginBottom: '2rem',
        borderRadius: '0 8px 8px 0'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#ffc107' }}>
          {getText('warnings')}:
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          {instructions.warnings.map((warning, index) => (
            <li key={index} style={{ marginBottom: '0.5rem', lineHeight: '1.4' }}>
              {warning}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <button
          onClick={() => window.open('tel:108')}
          style={{
            background: 'linear-gradient(135deg, #f44336, #d32f2f)',
            border: 'none',
            borderRadius: '12px',
            padding: '1.2rem 2rem',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>🚨</span>
          {getText('callEmergency')}
        </button>

        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            padding: '1rem 2rem',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          ← {getText('backToEmergency')}
        </button>
      </div>
    </div>
  );
};

export default FirstAidGuide;