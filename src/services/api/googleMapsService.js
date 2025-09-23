// src/services/api/googleMapsService.js
class GoogleMapsService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    this.placesService = null;
    this.map = null;
  }

  // Initialize Google Maps
  async initializeMap(elementId, userLocation) {
    if (!this.apiKey) {
      throw new Error('Google Maps API key not found');
    }

    // Load Google Maps script dynamically
    await this.loadGoogleMapsScript();

    const mapOptions = {
      center: userLocation,
      zoom: 13,
      styles: [
        {
          featureType: 'poi.medical',
          stylers: [{ color: '#ff6b6b' }]
        }
      ]
    };

    this.map = new google.maps.Map(document.getElementById(elementId), mapOptions);
    this.placesService = new google.maps.places.PlacesService(this.map);

    return this.map;
  }

  // Load Google Maps script
  loadGoogleMapsScript() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Find nearby healthcare providers using Google Places API
  async findNearbyHealthcareProviders(userLocation, radius = 10000, type = 'hospital') {
    if (!this.placesService) {
      throw new Error('Google Maps not initialized');
    }

    const request = {
      location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
      radius: radius, // radius in meters
      type: type, // 'hospital', 'doctor', 'pharmacy', 'physiotherapist'
    };

    return new Promise((resolve, reject) => {
      this.placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const providers = results.map(place => ({
            id: place.place_id,
            name: place.name,
            address: place.vicinity,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            },
            rating: place.rating || 0,
            totalRatings: place.user_ratings_total || 0,
            priceLevel: place.price_level,
            types: place.types,
            photo: place.photos?.[0]?.getUrl() || null,
            isOpen: place.opening_hours?.open_now,
            placeId: place.place_id
          }));
          resolve(providers);
        } else {
          reject(new Error(`Places search failed: ${status}`));
        }
      });
    });
  }

  // Get detailed information about a specific place
  async getPlaceDetails(placeId) {
    if (!this.placesService) {
      throw new Error('Google Maps not initialized');
    }

    const request = {
      placeId: placeId,
      fields: [
        'name', 'formatted_address', 'formatted_phone_number',
        'website', 'rating', 'user_ratings_total', 'reviews',
        'opening_hours', 'photos', 'geometry'
      ]
    };

    return new Promise((resolve, reject) => {
      this.placesService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve({
            name: place.name,
            address: place.formatted_address,
            phone: place.formatted_phone_number,
            website: place.website,
            rating: place.rating,
            totalRatings: place.user_ratings_total,
            reviews: place.reviews?.slice(0, 3), // Top 3 reviews
            photos: place.photos?.slice(0, 5)?.map(photo => photo.getUrl()),
            openingHours: place.opening_hours,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            }
          });
        } else {
          reject(new Error(`Place details failed: ${status}`));
        }
      });
    });
  }

  // Add markers to map
  addMarkersToMap(providers, userLocation) {
    // Clear existing markers
    if (this.markers) {
      this.markers.forEach(marker => marker.setMap(null));
    }
    this.markers = [];

    // Add user location marker
    const userMarker = new google.maps.Marker({
      position: userLocation,
      map: this.map,
      title: 'Your Location',
      icon: {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiM0Q0FGNTC/></svg>',
        scaledSize: new google.maps.Size(30, 30)
      }
    });
    this.markers.push(userMarker);

    // Add provider markers
    providers.forEach((provider, index) => {
      const marker = new google.maps.Marker({
        position: provider.location,
        map: this.map,
        title: provider.name,
        icon: {
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xNCA2IDYgOC4xNCA2IDEyYzAgNS4yNSA2IDEwIDYgMTBzNi00Ljc1IDYtMTBjMC0zLjg2LTIuMTQtNi02LTZ6bTAgOGMtMS4xIDAtMi0uOS0yLTJzLjktMiAyLTIgMiAuOSAyIDItLjkgMi0yIDJ6IiBmaWxsPSIjZmY2YjZiIi8+Cjwvc3ZnPg==',
          scaledSize: new google.maps.Size(25, 25)
        }
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 10px 0;">${provider.name}</h3>
            <p style="margin: 5px 0;"><strong>Address:</strong> ${provider.address}</p>
            ${provider.rating ? `<p style="margin: 5px 0;"><strong>Rating:</strong> ⭐ ${provider.rating}/5 (${provider.totalRatings} reviews)</p>` : ''}
            ${provider.isOpen !== undefined ? `<p style="margin: 5px 0;"><strong>Status:</strong> ${provider.isOpen ? 'Open Now' : 'Closed'}</p>` : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });

      this.markers.push(marker);
    });
  }

  // Calculate distance between two points
  calculateDistance(point1, point2) {
    return google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(point1.lat, point1.lng),
      new google.maps.LatLng(point2.lat, point2.lng)
    ) / 1000; // Convert to kilometers
  }
}

export default GoogleMapsService;