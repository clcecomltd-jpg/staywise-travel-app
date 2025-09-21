import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Navigation, ExternalLink, Star } from 'lucide-react';

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  recommendations?: Array<{
    id: string;
    title: string;
    description: string;
    location: { lat: number; lng: number };
    category: string;
    rating?: number;
    placeId?: string;
  }>;
  onRecommendationClick?: (recommendation: any) => void;
  height?: string;
  showDirections?: boolean;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center,
  zoom = 13,
  recommendations = [],
  onRecommendationClick,
  height = '400px',
  showDirections = true,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [directions, setDirections] = useState<any>(null);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;

      window.initMap = () => {
        setIsLoaded(true);
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
        delete window.initMap;
      };
    };

    loadGoogleMaps();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapInstanceRef.current = map;

    // Add markers for recommendations
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    recommendations.forEach((rec, index) => {
      const marker = new window.google.maps.Marker({
        position: rec.location,
        map,
        title: rec.title,
        icon: {
          url: getMarkerIcon(rec.category),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32)
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">${rec.title}</h3>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${rec.description}</p>
            ${rec.rating ? `
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="color: #fbbf24;">★</span>
                <span style="font-size: 12px;">${rec.rating}</span>
              </div>
            ` : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        setSelectedRecommendation(rec);
        onRecommendationClick?.(rec);
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers
    if (recommendations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      recommendations.forEach(rec => {
        bounds.extend(rec.location);
      });
      map.fitBounds(bounds);
    }

  }, [isLoaded, center, zoom, recommendations, onRecommendationClick]);

  const getMarkerIcon = (category: string): string => {
    const colors: Record<string, string> = {
      food: '#ef4444',
      tours: '#3b82f6',
      events: '#8b5cf6',
      shopping: '#f59e0b',
      nightlife: '#ec4899',
      culture: '#10b981',
      nature: '#22c55e',
      entertainment: '#f97316'
    };

    const color = colors[category] || '#6b7280';
    
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="16" r="4" fill="white"/>
      </svg>
    `)}`;
  };

  const getDirections = async (destination: { lat: number; lng: number }) => {
    if (!mapInstanceRef.current) return;

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true
    });

    directionsRenderer.setMap(mapInstanceRef.current);

    try {
      const result = await directionsService.route({
        origin: center,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      });

      directionsRenderer.setDirections(result);
      setDirections(result);
    } catch (error) {
      console.error('Directions request failed:', error);
    }
  };

  const clearDirections = () => {
    if (mapInstanceRef.current) {
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsRenderer.setMap(mapInstanceRef.current);
      directionsRenderer.setDirections({ routes: [] });
      setDirections(null);
    }
  };

  if (!isLoaded) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="font-medium">Loading Google Maps...</p>
                <p className="text-sm text-muted-foreground">
                  Please wait while we load the interactive map
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardContent className="p-0">
          <div className="relative">
            <div
              ref={mapRef}
              style={{ height }}
              className="w-full rounded-lg"
            />
            
            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              {selectedRecommendation && showDirections && (
                <Button
                  size="sm"
                  onClick={() => getDirections(selectedRecommendation.location)}
                  className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Directions
                </Button>
              )}
              
              {directions && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearDirections}
                  className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                >
                  Clear Route
                </Button>
              )}
            </div>

            {/* Recommendation Info Panel */}
            {selectedRecommendation && (
              <div className="absolute bottom-4 left-4 right-4">
                <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {selectedRecommendation.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {selectedRecommendation.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {selectedRecommendation.category}
                          </Badge>
                          {selectedRecommendation.rating && (
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span>{selectedRecommendation.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        {selectedRecommendation.placeId && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const url = `https://www.google.com/maps/place/?q=place_id:${selectedRecommendation.placeId}`;
                              window.open(url, '_blank');
                            }}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedRecommendation(null)}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleMap;