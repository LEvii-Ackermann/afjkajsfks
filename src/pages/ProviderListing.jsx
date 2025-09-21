// src/pages/ProviderListing.jsx
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import Button from '../components/common/Button';

const ProviderListing = ({ onNavigate }) => {
  const { currentLanguage } = useContext(LanguageContext);
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('requesting');
  const [manualLocation, setManualLocation] = useState('');
  const [filters, setFilters] = useState({
    specialty: 'all',
    distance: 'all',
    availability: 'all',
    rating: 'all'
  });
  const [radiusKm, setRadiusKm] = useState(10);

  // Mock provider data with coordinates
  const mockProviders = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      specialty: 'General Physician',
      experience: 15,
      rating: 4.8,
      photo: '👨‍⚕️',
      hospital: 'Apollo Hospital',
      location: 'Sector 26, Chandigarh',
      coordinates: { lat: 30.7333, lng: 76.7794 }, // Chandigarh coordinates
      distance: 2.3,
      availability: 'available',
      consultationFee: 500,
      nextSlot: 'Today 3:00 PM',
      languages: ['Hindi', 'English', 'Punjabi']
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      specialty: 'Pediatrics',
      experience: 12,
      rating: 4.9,
      photo: '👩‍⚕️',
      hospital: 'Fortis Hospital',
      location: 'Sector 62, Mohali',
      coordinates: { lat: 30.7046, lng: 76.7179 },
      distance: 8.5,
      availability: 'available',
      consultationFee: 600,
      nextSlot: 'Tomorrow 10:00 AM',
      languages: ['Hindi', 'English']
    },
    {
      id: 3,
      name: 'Dr. Amit Singh',
      specialty: 'Cardiology',
      experience: 20,
      rating: 4.7,
      photo: '👨‍⚕️',
      hospital: 'PGI Chandigarh',
      location: 'Sector 12, Chandigarh',
      coordinates: { lat: 30.7194, lng: 76.7646 },
      distance: 5.2,
      availability: 'busy',
      consultationFee: 800,
      nextSlot: 'Tomorrow 2:00 PM',
      languages: ['Hindi', 'English']
    },
    {
      id: 4,
      name: 'Dr. Sunita Rani',
      specialty: 'Dermatology',
      experience: 10,
      rating: 4.6,
      photo: '👩‍⚕️',
      hospital: 'Max Hospital',
      location: 'Sector 82, Mohali',
      coordinates: { lat: 30.6942, lng: 76.7221 },
      distance: 12.1,
      availability: 'available',
      consultationFee: 700,
      nextSlot: 'Today 5:00 PM',
      languages: ['Hindi', 'English', 'Punjabi']
    },
    {
      id: 5,
      name: 'Dr. Vikram Mehta',
      specialty: 'Orthopedics',
      experience: 18,
      rating: 4.8,
      photo: '👨‍⚕️',
      hospital: 'Grecian Super Speciality Hospital',
      location: 'Sector 69, Mohali',
      coordinates: { lat: 30.7081, lng: 76.6956 },
      distance: 15.3,
      availability: 'offline',
      consultationFee: 750,
      nextSlot: 'Day after tomorrow 11:00 AM',
      languages: ['Hindi', 'English']
    },
    {
      id: 6,
      name: 'Dr. Meera Gupta',
      specialty: 'Gynecology',
      experience: 14,
      rating: 4.9,
      photo: '👩‍⚕️',
      hospital: 'Apollo Cradle',
      location: 'Sector 43, Chandigarh',
      coordinates: { lat: 30.7184, lng: 76.8131 },
      distance: 6.8,
      availability: 'available',
      consultationFee: 650,
      nextSlot: 'Today 4:30 PM',
      languages: ['Hindi', 'English']
    }
  ];

  // Text content for multilingual support
  const text = {
    en: {
      title: 'Healthcare Providers Near You',
      locationDetected: 'Location detected',
      locationDenied: 'Location access denied. Please enter manually:',
      enterLocation: 'Enter your location',
      searchLocation: 'Search',
      radiusLabel: 'Search within',
      km: 'km',
      filterBySpecialty: 'Filter by Specialty',
      filterByDistance: 'Distance',
      filterByAvailability: 'Availability',
      filterByRating: 'Rating',
      allSpecialties: 'All Specialties',
      allDistances: 'All Distances',
      allAvailability: 'All Status',
      allRatings: 'All Ratings',
      available: 'Available',
      busy: 'Busy',
      offline: 'Offline',
      experience: 'Experience',
      years: 'years',
      rating: 'Rating',
      fee: 'Consultation Fee',
      nextSlot: 'Next Slot',
      book: 'Book',
      call: 'Call',
      message: 'Message',
      video: 'Video Call',
      backToResults: 'Back to Results',
      noProviders: 'No providers found in your area. Try expanding your search radius.',
      detecting: 'Detecting your location...'
    },
    hi: {
      title: 'आपके निकट स्वास्थ्य प्रदाता',
      locationDetected: 'स्थान का पता चल गया',
      locationDenied: 'स्थान पहुंच अस्वीकृत। कृपया मैन्युअल रूप से दर्ज करें:',
      enterLocation: 'अपना स्थान दर्ज करें',
      searchLocation: 'खोजें',
      radiusLabel: 'इसके भीतर खोजें',
      km: 'किमी',
      filterBySpecialty: 'विशेषता के अनुसार फ़िल्टर करें',
      filterByDistance: 'दूरी',
      filterByAvailability: 'उपलब्धता',
      filterByRating: 'रेटिंग',
      allSpecialties: 'सभी विशेषताएं',
      allDistances: 'सभी दूरी',
      allAvailability: 'सभी स्थिति',
      allRatings: 'सभी रेटिंग',
      available: 'उपलब्ध',
      busy: 'व्यस्त',
      offline: 'ऑफलाइन',
      experience: 'अनुभव',
      years: 'साल',
      rating: 'रेटिंग',
      fee: 'परामर्श शुल्क',
      nextSlot: 'अगला स्लॉट',
      book: 'बुक करें',
      call: 'कॉल',
      message: 'संदेश',
      video: 'वीडियो कॉल',
      backToResults: 'परिणामों पर वापस',
      noProviders: 'आपके क्षेत्र में कोई प्रदाता नहीं मिला। अपनी खोज त्रिज्या बढ़ाने का प्रयास करें।',
      detecting: 'आपका स्थान खोजा जा रहा है...'
    }
  };

  const getText = (key) => {
    const currentText = text[currentLanguage] || text.en;
    return currentText[key] || text.en[key] || key;
  };

  // Request location permission on component mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Filter providers when location or filters change
  useEffect(() => {
    filterProviders();
  }, [providers, userLocation, filters, radiusKm]);

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      setLocationPermission('requesting');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setLocationPermission('granted');
          calculateDistances(location);
        },
        (error) => {
          console.error('Location error:', error);
          setLocationPermission('denied');
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setLocationPermission('denied');
    }
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateDistances = (userLoc) => {
    const providersWithDistance = mockProviders.map(provider => ({
      ...provider,
      distance: calculateDistance(
        userLoc.lat, 
        userLoc.lng, 
        provider.coordinates.lat, 
        provider.coordinates.lng
      )
    }));
    
    // Sort by distance
    providersWithDistance.sort((a, b) => a.distance - b.distance);
    setProviders(providersWithDistance);
  };

  const filterProviders = () => {
    let filtered = [...providers];

    // Filter by distance radius
    if (userLocation) {
      filtered = filtered.filter(provider => provider.distance <= radiusKm);
    }

    // Filter by specialty
    if (filters.specialty !== 'all') {
      filtered = filtered.filter(provider => 
        provider.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
      );
    }

    // Filter by availability
    if (filters.availability !== 'all') {
      filtered = filtered.filter(provider => provider.availability === filters.availability);
    }

    // Filter by rating
    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(provider => provider.rating >= minRating);
    }

    // Sort by distance if location available, otherwise by rating
    if (userLocation) {
      filtered.sort((a, b) => a.distance - b.distance);
    } else {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProviders(filtered);
  };

  const handleManualLocationSearch = async () => {
    if (manualLocation.trim()) {
      // In a real app, you'd use Google Geocoding API here
      // For demo, we'll use approximate coordinates for Chandigarh
      const mockLocation = { lat: 30.7333, lng: 76.7794 };
      setUserLocation(mockLocation);
      calculateDistances(mockLocation);
      setLocationPermission('granted');
    }
  };

  const getAvailabilityColor = (status) => {
    switch(status) {
      case 'available': return '#4CAF50';
      case 'busy': return '#FF9800';
      case 'offline': return '#f44336';
      default: return '#757575';
    }
  };

  const getAvailabilityText = (status) => {
    switch(status) {
      case 'available': return getText('available');
      case 'busy': return getText('busy');
      case 'offline': return getText('offline');
      default: return status;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2.5rem', 
            marginBottom: '0.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🏥 {getText('title')}
          </h1>
        </div>

        {/* Location Section */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: '1.5rem',
          marginBottom: '2rem',
          color: 'white'
        }}>
          {locationPermission === 'requesting' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📍</div>
              <p>{getText('detecting')}</p>
            </div>
          )}

          {locationPermission === 'granted' && userLocation && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📍 {getText('locationDetected')}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                <label>{getText('radiusLabel')}</label>
                <select 
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(parseInt(e.target.value))}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <option value={5}>5 {getText('km')}</option>
                  <option value={10}>10 {getText('km')}</option>
                  <option value={20}>20 {getText('km')}</option>
                  <option value={50}>50 {getText('km')}</option>
                </select>
              </div>
            </div>
          )}

          {locationPermission === 'denied' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📍 {getText('locationDenied')}</div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder={getText('enterLocation')}
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  style={{
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: 'none',
                    minWidth: '200px'
                  }}
                />
                <button
                  onClick={handleManualLocationSearch}
                  style={{
                    padding: '0.8rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {getText('searchLocation')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: '1.5rem',
          marginBottom: '2rem',
          color: 'white'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            {/* Specialty Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                {getText('filterBySpecialty')}
              </label>
              <select
                value={filters.specialty}
                onChange={(e) => setFilters(prev => ({ ...prev, specialty: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                <option value="all">{getText('allSpecialties')}</option>
                <option value="general">General Physician</option>
                <option value="cardiology">Cardiology</option>
                <option value="pediatrics">Pediatrics</option>
                <option value="dermatology">Dermatology</option>
                <option value="orthopedics">Orthopedics</option>
                <option value="gynecology">Gynecology</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                {getText('filterByAvailability')}
              </label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                <option value="all">{getText('allAvailability')}</option>
                <option value="available">{getText('available')}</option>
                <option value="busy">{getText('busy')}</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                {getText('filterByRating')}
              </label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                <option value="all">{getText('allRatings')}</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Providers Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {filteredProviders.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              color: 'white',
              padding: '3rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <p style={{ fontSize: '1.2rem' }}>{getText('noProviders')}</p>
            </div>
          ) : (
            filteredProviders.map(provider => (
              <div
                key={provider.id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  color: '#333',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px)';
                  e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {/* Provider Header */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '3rem', marginRight: '1rem' }}>
                    {provider.photo}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem' }}>
                      {provider.name}
                    </h3>
                    <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                      {provider.specialty}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem', 
                      marginTop: '0.5rem' 
                    }}>
                      <span style={{ fontSize: '0.8rem', color: '#666' }}>
                        {provider.experience} {getText('years')} {getText('experience')}
                      </span>
                      <div style={{
                        backgroundColor: getAvailabilityColor(provider.availability),
                        color: 'white',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '10px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>
                        {getAvailabilityText(provider.availability)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Provider Details */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>
                      🏥 {provider.hospital}
                    </span>
                    {userLocation && (
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>
                        📍 {provider.distance.toFixed(1)} {getText('km')}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                    📍 {provider.location}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#FFD700' }}>⭐</span>
                      <span>{provider.rating} {getText('rating')}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                      ₹{provider.consultationFee}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                    ⏰ {getText('nextSlot')}: {provider.nextSlot}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.5rem'
                }}>
                  <Button
                    onClick={() => console.log('Book appointment:', provider.name)}
                    variant="primary"
                    size="small"
                    style={{ fontSize: '0.8rem' }}
                  >
                    📅 {getText('book')}
                  </Button>
                  <Button
                    onClick={() => console.log('Call:', provider.name)}
                    variant="secondary"
                    size="small"
                    style={{ fontSize: '0.8rem' }}
                  >
                    📞 {getText('call')}
                  </Button>
                  <Button
                    onClick={() => console.log('Message:', provider.name)}
                    variant="outline"
                    size="small"
                    style={{ fontSize: '0.8rem' }}
                  >
                    💬 {getText('message')}
                  </Button>
                  <Button
                    onClick={() => console.log('Video call:', provider.name)}
                    variant="secondary"
                    size="small"
                    style={{ fontSize: '0.8rem' }}
                  >
                    📹 {getText('video')}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back Button */}
        <div style={{ textAlign: 'center' }}>
          <Button
            onClick={() => onNavigate('results')}
            variant="outline"
            size="large"
            style={{ color: 'white', borderColor: 'white' }}
          >
            ← {getText('backToResults')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProviderListing;