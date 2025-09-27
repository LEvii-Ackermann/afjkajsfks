// src/components/emergency/EmergencyActions.jsx
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const EmergencyActions = ({ onNavigate, onBack, patientData }) => {
  const { currentLanguage } = useContext(LanguageContext);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  // Multilingual text
  const text = {
    en: {
      title: "Emergency Services & Actions",
      subtitle: "Get immediate help",
      callEmergency: "Call Emergency Services",
      emergencyNumbers: "Emergency Numbers",
      yourLocation: "Your Location",
      locationSharing: "Share Location",
      emergencyContacts: "Emergency Contacts",
      nearestHospital: "Nearest Hospital",
      instructions: "While waiting for help:",
      preparingCall: "Preparing emergency call...",
      locationDetected: "Location detected",
      locationFailed: "Location detection failed",
      shareLocation: "Share Location with Emergency Services",
      callInProgress: "Emergency call in progress...",
      backToOptions: "Back to Emergency Options"
    },
    hi: {
      title: "आपातकालीन सेवाएं और कार्रवाई",
      subtitle: "तत्काल सहायता प्राप्त करें",
      callEmergency: "आपातकालीन सेवाओं को कॉल करें",
      emergencyNumbers: "आपातकालीन नंबर",
      yourLocation: "आपका स्थान",
      locationSharing: "स्थान साझा करें",
      emergencyContacts: "आपातकालीन संपर्क",
      nearestHospital: "निकटतम अस्पताल",
      instructions: "सहायता का इंतजार करते समय:",
      preparingCall: "आपातकालीन कॉल तैयार की जा रही है...",
      locationDetected: "स्थान का पता चला",
      locationFailed: "स्थान का पता लगाना विफल",
      shareLocation: "आपातकालीन सेवाओं के साथ स्थान साझा करें",
      callInProgress: "आपातकालीन कॉल जारी है...",
      backToOptions: "आपातकालीन विकल्पों पर वापस"
    }
  };

  const getText = (key) => {
    const currentText = text[currentLanguage] || text.en;
    return currentText[key] || text.en[key] || key;
  };

  // Emergency numbers for different countries/regions
  const emergencyNumbers = {
    US: { number: '911', label: 'USA Emergency', flag: '🇺🇸' },
    IN: { number: '108', label: 'India Emergency Medical', flag: '🇮🇳' },
    UK: { number: '999', label: 'UK Emergency', flag: '🇬🇧' },
    EU: { number: '112', label: 'Europe Emergency', flag: '🇪🇺' },
    AU: { number: '000', label: 'Australia Emergency', flag: '🇦🇺' }
  };

  // Get user's location for emergency services
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.error('Location error:', error);
          setLocationError(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    }
  }, []);

  // Emergency contact suggestions based on patient data
  useEffect(() => {
    const contacts = [];
    
    if (patientData?.emergencyContact) {
      contacts.push({
        name: 'Emergency Contact',
        number: patientData.emergencyContact,
        type: 'personal'
      });
    }

    // Add default emergency contacts
    contacts.push(
      { name: 'Police', number: '100', type: 'police', icon: '👮' },
      { name: 'Fire Department', number: '101', type: 'fire', icon: '🚒' },
      { name: 'Ambulance', number: '108', type: 'medical', icon: '🚑' }
    );

    setEmergencyContacts(contacts);
  }, [patientData]);

  const makeEmergencyCall = (number) => {
    // Prepare emergency information
    const emergencyInfo = {
      symptoms: patientData?.symptoms || 'Medical emergency',
      severity: patientData?.severity || 'Unknown',
      location: userLocation ? `${userLocation.latitude}, ${userLocation.longitude}` : 'Location not available'
    };

    // Store emergency info for potential use
    localStorage.setItem('emergencyCall', JSON.stringify({
      number,
      timestamp: new Date().toISOString(),
      patientInfo: emergencyInfo
    }));

    // Make the call
    window.open(`tel:${number}`);
  };

  const shareLocationSMS = () => {
    if (userLocation) {
      const locationText = `Emergency: I need help. My location is: https://maps.google.com/?q=${userLocation.latitude},${userLocation.longitude}`;
      window.open(`sms:?body=${encodeURIComponent(locationText)}`);
    }
  };

  const formatLocation = (location) => {
    if (!location) return 'Location not available';
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  };

  return (
    <div style={{
      backgroundColor: 'white',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      padding: '2rem',
      maxWidth: '600px',
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
          🚨 {getText('title')}
        </h2>
        <p style={{ margin: 0, fontSize: '1rem', opacity: 0.8 }}>
          {getText('subtitle')}
        </p>
      </div>

      {/* Primary Emergency Numbers */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          margin: '0 0 1rem 0',
          fontSize: '1.3rem',
          color: '#ffeb3b'
        }}>
          {getText('emergencyNumbers')}
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {Object.entries(emergencyNumbers).map(([country, info]) => (
            <button
              key={country}
              onClick={() => makeEmergencyCall(info.number)}
              style={{
                background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 25px rgba(244, 67, 54, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {info.flag} 📞
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                {info.number}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                {info.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Location Information */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          margin: '0 0 1rem 0',
          fontSize: '1.2rem',
          color: '#4CAF50'
        }}>
          📍 {getText('yourLocation')}
        </h3>
        
        {userLocation ? (
          <div>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontFamily: 'monospace' }}>
              {formatLocation(userLocation)}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={shareLocationSMS}
                style={{
                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.8rem 1.5rem',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                📱 {getText('shareLocation')}
              </button>
              
              <button
                onClick={() => window.open(`https://maps.google.com/?q=${userLocation.latitude},${userLocation.longitude}`)}
                style={{
                  background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.8rem 1.5rem',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                🗺️ Open Maps
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ 
              margin: '0 0 1rem 0', 
              color: locationError ? '#f44336' : '#ff9800',
              fontSize: '0.9rem'
            }}>
              {locationError ? `${getText('locationFailed')}: ${locationError}` : 'Detecting location...'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Retry Location Detection
            </button>
          </div>
        )}
      </div>

      {/* Additional Emergency Contacts */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          margin: '0 0 1rem 0',
          fontSize: '1.2rem',
          color: '#ffeb3b'
        }}>
          {getText('emergencyContacts')}
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '0.8rem'
        }}>
          {emergencyContacts.slice(1).map((contact, index) => (
            <button
              key={index}
              onClick={() => makeEmergencyCall(contact.number)}
              style={{
                background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                border: 'none',
                borderRadius: '8px',
                padding: '0.8rem',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                fontSize: '0.9rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 15px rgba(255, 152, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>
                {contact.icon} 📞
              </div>
              <div style={{ fontWeight: 'bold' }}>
                {contact.name}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                {contact.number}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Patient Information Summary */}
      {patientData && (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            fontSize: '1.2rem',
            color: '#4CAF50'
          }}>
            📋 Patient Information Summary
          </h3>
          
          <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
            {patientData.symptoms && (
              <div style={{ marginBottom: '0.8rem' }}>
                <strong>Symptoms:</strong> {patientData.symptoms}
              </div>
            )}
            
            {patientData.severity && (
              <div style={{ marginBottom: '0.8rem' }}>
                <strong>Severity:</strong> {patientData.severity}/10
              </div>
            )}
            
            {patientData.duration && (
              <div style={{ marginBottom: '0.8rem' }}>
                <strong>Duration:</strong> {patientData.duration}
              </div>
            )}
            
            {patientData.ageGroup && (
              <div style={{ marginBottom: '0.8rem' }}>
                <strong>Age Group:</strong> {patientData.ageGroup}
              </div>
            )}
            
            <div style={{
              marginTop: '1rem',
              padding: '0.8rem',
              backgroundColor: 'rgba(255, 193, 7, 0.2)',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontStyle: 'italic'
            }}>
              💡 Have this information ready when emergency services answer
            </div>
          </div>
        </div>
      )}

      {/* Instructions While Waiting */}
      <div style={{
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        borderLeft: '4px solid #2196F3',
        padding: '1.5rem',
        marginBottom: '2rem',
        borderRadius: '0 8px 8px 0'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2196F3' }}>
          {getText('instructions')}
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Stay calm and keep the patient calm</li>
          <li style={{ marginBottom: '0.5rem' }}>Do not leave the patient alone</li>
          <li style={{ marginBottom: '0.5rem' }}>Keep airways clear and monitor breathing</li>
          <li style={{ marginBottom: '0.5rem' }}>Note any changes in condition</li>
          <li style={{ marginBottom: '0.5rem' }}>Have identification and medical information ready</li>
          <li>Be prepared to follow dispatcher instructions</li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => makeEmergencyCall('108')}
          style={{
            background: 'linear-gradient(135deg, #f44336, #d32f2f)',
            border: 'none',
            borderRadius: '12px',
            padding: '1.2rem',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 8px 25px rgba(244, 67, 54, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          🚑 Call Ambulance Now
        </button>

        <button
          onClick={() => onNavigate('chat')}
          style={{
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            border: 'none',
            borderRadius: '12px',
            padding: '1.2rem',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          💬 Emergency Chat Support
        </button>
      </div>

      {/* Back Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            padding: '1rem 2rem',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          ← {getText('backToOptions')}
        </button>
      </div>
    </div>
  );
};

export default EmergencyActions;