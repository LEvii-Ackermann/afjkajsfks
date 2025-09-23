// src/pages/ProviderListing.jsx
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import Button from '../components/common/Button';
import GoogleMapsService from '../services/api/googleMapsService';

const ProviderListing = ({ onNavigate }) => {
  const { currentLanguage } = useContext(LanguageContext);
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('requesting');
  const [manualLocation, setManualLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapsService, setMapsService] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [filters, setFilters] = useState({
    type: 'hospital',
    radius: 10000, // 10km in meters
    rating: 'all',
    openNow: false
  });

  // Text content for multilingual support
  const text = {
    en: {
      title: 'Real Healthcare Providers Near You',
      loadingProviders: 'Finding nearby healthcare providers...',
      locationDetected: 'Location detected',
      locationDenied: 'Location access denied. Please enter manually:',
      enterLocation: 'Enter your location (e.g., Chandigarh, India)',
      searchLocation: 'Search',
      mapView: 'Map View',
      listView: 'List View',
      filterByType: 'Type',
      filterByRadius: 'Radius',
      filterByRating: 'Minimum Rating',
      openNowOnly: 'Open Now Only',
      hospital: 'Hospitals',
      doctor: 'Doctors',
      pharmacy: 'Pharmacies',
      dentist: 'Dentists',
      physiotherapist: 'Physiotherapists',
      rating: 'Rating',
      reviews: 'reviews',
      openNow: 'Open Now',
      closed: 'Closed',
      getDirections: 'Directions',
      call: 'Call',
      website: 'Website',
      viewDetails: 'View Details',
      backToResults: 'Back to Results',
      noProviders: 'No healthcare providers found in your area. Try expanding your search radius.',
      detecting: 'Detecting your location...',
      kmAway: 'km away',
      loadingMap: 'Loading map...',
      mapError: 'Error loading map. Please try again.',
      searchError: 'Error searching for providers. Please try again.',
      noGoogleMapsKey: 'Google Maps API key not configured. Showing demo mode.'
    },
    hi: {
      title: 'आपके निकट वास्तविक स्वास्थ्य प्रदाता',
      loadingProviders: 'निकटवर्ती स्वास्थ्य प्रदाताओं को खोजा जा रहा है...',
      locationDetected: 'स्थान का पता चल गया',
      locationDenied: 'स्थान पहुंच अस्वीकृत। कृपया मैन्युअल रूप से दर्ज करें:',
      enterLocation: 'अपना स्थान दर्ज करें (जैसे चंडीगढ़, भारत)',
      searchLocation: 'खोजें',
      mapView: 'मैप व्यू',
      listView: 'लिस्ट व्यू',
      filterByType: 'प्रकार',
      filterByRadius: 'त्रिज्या',
      filterByRating: 'न्यूनतम रेटिंग',
      openNowOnly: 'केवल खुले हुए',
      hospital: 'अस्पताल',
      doctor: 'डॉक्टर',
      pharmacy: 'फार्मेसी',
      dentist: 'दंत चिकित्सक',
      physiotherapist: 'फिजियोथेरेपिस्ट',
      rating: 'रेटिंग',
      reviews: 'समीक्षाएं',
      openNow: 'अभी खुला',
      closed: 'बंद',
      getDirections: 'दिशा-निर्देश',
      call: 'कॉल',
      website: 'वेबसाइट',
      viewDetails: 'विवरण देखें',
      backToResults: 'परिणामों पर वापस',
      noProviders: 'आपके क्षेत्र में कोई स्वास्थ्य प्रदाता नहीं मिला।',
      detecting: 'आपका स्थान खोजा जा रहा है...',
      kmAway: 'किमी दूर',
      loadingMap: 'मैप लोड हो रहा है...',
      mapError: 'मैप लोड करने में त्रुटि। कृपया पुन: प्रयास करें।',
      searchError: 'प्रदाताओं की खोज में त्रुटि। कृपया पुन: प्रयास करें।',
      noGoogleMapsKey: 'Google Maps API key कॉन्फ़िगर नहीं है। डेमो मोड दिखाया जा रहा है।'
    }
  };

  const getText = (key) => {
    const currentText = text[currentLanguage] || text.en;
    return currentText[key] || text.en[key] || key;
  };

  // Initialize Google Maps Service
  useEffect(() => {
    const service = new GoogleMapsService();
    setMapsService(service);
    
    // Request location permission
    requestLocationPermission();
  }, []);

  // Search for providers when location or filters change
  useEffect(() => {
    if (userLocation && mapsService) {
      searchNearbyProviders();
    }
  }, [userLocation, filters, mapsService]);

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

  const handleManualLocationSearch = async () => {
    if (!manualLocation.trim() || !mapsService) return;
    
    setLoading(true);
    try {
      // Use Google Geocoding API to convert address to coordinates
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(manualLocation)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const location = {
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng
        };
        setUserLocation(location);
        setLocationPermission('granted');
      } else {
        alert('Location not found. Please try a different address.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Error finding location. Please try again.');
    }
    setLoading(false);
  };

  const searchNearbyProviders = async () => {
    if (!userLocation || !mapsService) return;
    
    setLoading(true);
    try {
      // Check if Google Maps API key is available
      if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
        console.warn('Google Maps API key not found. Using demo data.');
        setProviders(getDemoProviders());
        setFilteredProviders(getDemoProviders());
        setLoading(false);
        return;
      }

      // Initialize map if not already done and in map view
      if (!mapLoaded && viewMode === 'map') {
        await mapsService.initializeMap('map-container', userLocation);
        setMapLoaded(true);
      }

      // Search for nearby providers using Google Places API
      const results = await mapsService.findNearbyHealthcareProviders(
        userLocation,
        filters.radius,
        filters.type
      );

      // Calculate distances and add additional info
      const providersWithDistance = results.map(provider => ({
        ...provider,
        distance: calculateDistance(userLocation, provider.location),
        phone: null, // Will be fetched with getPlaceDetails if needed
        website: null,
        openingHours: null
      }));

      // Apply filters
      let filtered = [...providersWithDistance];
      
      if (filters.rating !== 'all') {
        const minRating = parseFloat(filters.rating);
        filtered = filtered.filter(provider => provider.rating >= minRating);
      }

      if (filters.openNow) {
        filtered = filtered.filter(provider => provider.isOpen === true);
      }

      // Sort by distance
      filtered.sort((a, b) => a.distance - b.distance);

      setProviders(providersWithDistance);
      setFilteredProviders(filtered);

      // Add markers to map if in map view
      if (mapLoaded && viewMode === 'map' && mapsService.addMarkersToMap) {
        mapsService.addMarkersToMap(filtered, userLocation);
      }

    } catch (error) {
      console.error('Error searching providers:', error);
      alert(getText('searchError'));
      // Fallback to demo data
      const demoData = getDemoProviders();
      setProviders(demoData);
      setFilteredProviders(demoData);
    }
    setLoading(false);
  };

  // Calculate distance between two coordinates
  const calculateDistance = (point1, point2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Demo data fallback when Google Maps API is not available
  const getDemoProviders = () => [
    {
      id: 'demo1',
      name: 'Apollo Hospital Demo',
      address: 'Sector 26, Chandigarh',
      location: { lat: 30.7333, lng: 76.7794 },
      rating: 4.5,
      totalRatings: 150,
      distance: calculateDistance(userLocation || { lat: 30.7333, lng: 76.7794 }, { lat: 30.7333, lng: 76.7794 }),
      isOpen: true,
      types: ['hospital', 'health']
    },
    {
      id: 'demo2',
      name: 'Fortis Hospital Demo',
      address: 'Sector 62, Mohali',
      location: { lat: 30.7046, lng: 76.7179 },
      rating: 4.7,
      totalRatings: 230,
      distance: calculateDistance(userLocation || { lat: 30.7333, lng: 76.7794 }, { lat: 30.7046, lng: 76.7179 }),
      isOpen: true,
      types: ['hospital', 'health']
    },
    {
      id: 'demo3',
      name: 'PGI Chandigarh Demo',
      address: 'Sector 12, Chandigarh',
      location: { lat: 30.7194, lng: 76.7646 },
      rating: 4.8,
      totalRatings: 500,
      distance: calculateDistance(userLocation || { lat: 30.7333, lng: 76.7794 }, { lat: 30.7194, lng: 76.7646 }),
      isOpen: true,
      types: ['hospital', 'health']
    }
  ];

  const handleViewModeChange = async (mode) => {
    setViewMode(mode);
    
    if (mode === 'map' && !mapLoaded && mapsService && userLocation) {
      try {
        setLoading(true);
        await mapsService.initializeMap('map-container', userLocation);
        setMapLoaded(true);
        
        if (filteredProviders.length > 0 && mapsService.addMarkersToMap) {
          mapsService.addMarkersToMap(filteredProviders, userLocation);
        }
      } catch (error) {
        console.error('Error loading map:', error);
        alert(getText('mapError'));
      }
      setLoading(false);
    }
  };

  const getDirections = (provider) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${provider.location.lat},${provider.location.lng}&destination_place_id=${provider.placeId || ''}`;
    window.open(url, '_blank');
  };

  const callProvider = async (provider) => {
    // In real app, fetch phone number using getPlaceDetails
    if (mapsService && provider.placeId && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      try {
        const details = await mapsService.getPlaceDetails(provider.placeId);
        if (details.phone) {
          window.open(`tel:${details.phone}`, '_self');
        } else {
          alert(`Phone number not available for ${provider.name}`);
        }
      } catch (error) {
        alert(`Unable to get contact details for ${provider.name}`);
      }
    } else {
      alert(`Calling ${provider.name}. In real app with API key, phone number would be fetched from Google Places API.`);
    }
  };

  const openWebsite = async (provider) => {
    if (mapsService && provider.placeId && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      try {
        const details = await mapsService.getPlaceDetails(provider.placeId);
        if (details.website) {
          window.open(details.website, '_blank');
        } else {
          alert(`Website not available for ${provider.name}`);
        }
      } catch (error) {
        alert(`Unable to get website details for ${provider.name}`);
      }
    } else {
      alert(`Opening website for ${provider.name}. In real app with API key, website would be fetched from Google Places API.`);
    }
  };

  const viewProviderDetails = async (provider) => {
    if (mapsService && provider.placeId && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      try {
        setLoading(true);
        const details = await mapsService.getPlaceDetails(provider.placeId);
        
        // Create a detailed info modal or alert
        const detailsText = `
${details.name}
Address: ${details.address}
Phone: ${details.phone || 'Not available'}
Website: ${details.website || 'Not available'}
Rating: ${details.rating || 'No rating'} (${details.totalRatings || 0} reviews)
        `;
        
        alert(detailsText);
      } catch (error) {
        console.error('Error getting place details:', error);
        alert(`Unable to get detailed information for ${provider.name}`);
      }
      setLoading(false);
    } else {
      const basicInfo = `
${provider.name}
Address: ${provider.address}
Rating: ${provider.rating || 'No rating'} (${provider.totalRatings || 0} reviews)
Distance: ${provider.distance?.toFixed(1)} km away
Status: ${provider.isOpen ? 'Open Now' : 'Closed'}
      `;
      alert(basicInfo);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2.5rem', 
            marginBottom: '0.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🏥 {getText('title')}
          </h1>
          
          {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
            <div style={{
              backgroundColor: 'rgba(255, 193, 7, 0.9)',
              color: '#000',
              padding: '0.8rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              ⚠️ {getText('noGoogleMapsKey')}
            </div>
          )}
        </div>

        {/* Location Section */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
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
              <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                📍 {getText('locationDetected')}
              </div>
            </div>
          )}

          {locationPermission === 'denied' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                📍 {getText('locationDenied')}
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder={getText('enterLocation')}
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  style={{
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: 'none',
                    minWidth: '250px'
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleManualLocationSearch();
                    }
                  }}
                />
                <button
                  onClick={handleManualLocationSearch}
                  disabled={loading}
                  style={{
                    padding: '0.8rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? '...' : getText('searchLocation')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filters and View Toggle */}
        {userLocation && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            color: 'white'
          }}>
            {/* View Toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <button
                onClick={() => handleViewModeChange('list')}
                style={{
                  padding: '0.8rem 1.5rem',
                  borderRadius: '25px',
                  border: 'none',
                  backgroundColor: viewMode === 'list' ? '#4CAF50' : 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                📋 {getText('listView')}
              </button>
              <button
                onClick={() => handleViewModeChange('map')}
                style={{
                  padding: '0.8rem 1.5rem',
                  borderRadius: '25px',
                  border: 'none',
                  backgroundColor: viewMode === 'map' ? '#4CAF50' : 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🗺️ {getText('mapView')}
              </button>
            </div>

            {/* Filters */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              {/* Type Filter */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  {getText('filterByType')}
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <option value="hospital">{getText('hospital')}</option>
                  <option value="doctor">{getText('doctor')}</option>
                  <option value="pharmacy">{getText('pharmacy')}</option>
                  <option value="dentist">{getText('dentist')}</option>
                  <option value="physiotherapist">{getText('physiotherapist')}</option>
                </select>
              </div>

              {/* Radius Filter */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  {getText('filterByRadius')}
                </label>
                <select
                  value={filters.radius}
                  onChange={(e) => setFilters(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <option value={2000}>2 km</option>
                  <option value={5000}>5 km</option>
                  <option value={10000}>10 km</option>
                  <option value={20000}>20 km</option>
                  <option value={50000}>50 km</option>
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
                  <option value="all">All Ratings</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              {/* Open Now Filter */}
              <div>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  cursor: 'pointer',
                  marginTop: '1.5rem'
                }}>
                  <input
                    type="checkbox"
                    checked={filters.openNow}
                    onChange={(e) => setFilters(prev => ({ ...prev, openNow: e.target.checked }))}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span style={{ fontWeight: 'bold' }}>{getText('openNowOnly')}</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '2rem',
            textAlign: 'center',
            color: 'white',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
            <p>{getText('loadingProviders')}</p>
          </div>
        )}

        {/* Content Area */}
        {userLocation && !loading && (
          <>
            {viewMode === 'map' ? (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '15px',
                padding: '1rem',
                marginBottom: '1.5rem',
                height: '500px'
              }}>
                <div 
                  id="map-container" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f0f0f0'
                  }}
                >
                  {!mapLoaded && (
                    <div style={{ textAlign: 'center', color: '#666' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🗺️</div>
                      <p>{getText('loadingMap')}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Providers List */
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
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Provider Header */}
                      <div style={{ marginBottom: '1rem' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', fontWeight: 'bold' }}>
                          🏥 {provider.name}
                        </h3>
                        <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                          📍 {provider.address}
                        </p>
                        {provider.distance && (
                          <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.8rem' }}>
                            📏 {provider.distance.toFixed(1)} {getText('kmAway')}
                          </p>
                        )}
                      </div>

                      {/* Provider Details */}
                      <div style={{ marginBottom: '1rem' }}>
                        {provider.rating > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#FFD700' }}>⭐</span>
                            <span>{provider.rating.toFixed(1)} ({provider.totalRatings} {getText('reviews')})</span>
                          </div>
                        )}
                        
                        {provider.isOpen !== undefined && (
                          <div style={{ 
                            display: 'inline-block',
                            backgroundColor: provider.isOpen ? '#4CAF50' : '#f44336',
                            color: 'white',
                            padding: '0.2rem 0.8rem',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}>
                            {provider.isOpen ? getText('openNow') : getText('closed')}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '0.5rem'
                      }}>
                        <Button
                          onClick={() => getDirections(provider)}
                          variant="primary"
                          size="small"
                          style={{ fontSize: '0.8rem' }}
                        >
                          🧭 {getText('getDirections')}
                        </Button>
                        <Button
                          onClick={() => callProvider(provider)}
                          variant="secondary"
                          size="small"
                          style={{ fontSize: '0.8rem' }}
                        >
                          📞 {getText('call')}
                        </Button>
                        <Button
                          onClick={() => openWebsite(provider)}
                          variant="outline"
                          size="small"
                          style={{ fontSize: '0.8rem' }}
                        >
                          🌐 {getText('website')}
                        </Button>
                        <Button
                          onClick={() => viewProviderDetails(provider)}
                          variant="outline"
                          size="small"
                          style={{ fontSize: '0.8rem' }}
                        >
                          📋 {getText('viewDetails')}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

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