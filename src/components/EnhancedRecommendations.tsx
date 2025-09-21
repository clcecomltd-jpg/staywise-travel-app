import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Heart, MapPin, Star, Clock, Users, Filter, Search, ExternalLink, Navigation } from 'lucide-react';
import { apiService } from '../services/api';
import { toast } from 'sonner';
import GoogleMap from './GoogleMap';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  placeDetails?: {
    placeId: string;
    name: string;
    formattedAddress: string;
    location: { lat: number; lng: number };
    rating?: number;
    userRatingsTotal?: number;
    priceLevel?: number;
    photos?: Array<{
      photoReference: string;
      height: number;
      width: number;
    }>;
    openingHours?: {
      openNow: boolean;
      weekdayText: string[];
    };
    website?: string;
    phoneNumber?: string;
  };
  engagementStats?: {
    views: number;
    favorites: number;
    clicks: number;
    shares: number;
  };
  personalizedScore?: number;
  reasons?: string[];
}

interface EnhancedRecommendationsProps {
  propertyId: string;
  userLocation?: { lat: number; lng: number };
  onRecommendationClick?: (recommendation: Recommendation) => void;
  showMap?: boolean;
  enablePersonalization?: boolean;
}

const EnhancedRecommendations: React.FC<EnhancedRecommendationsProps> = ({
  propertyId,
  userLocation,
  onRecommendationClick,
  showMap = true,
  enablePersonalization = true
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🏷️' },
    { id: 'food', name: 'Food & Dining', icon: '🍽️' },
    { id: 'tours', name: 'Tours & Activities', icon: '🎯' },
    { id: 'events', name: 'Events', icon: '🎉' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'nightlife', name: 'Nightlife', icon: '🍸' },
    { id: 'culture', name: 'Culture & Arts', icon: '🎨' },
    { id: 'nature', name: 'Nature & Parks', icon: '🌳' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎪' }
  ];

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    loadRecommendations();
    loadFavorites();
  }, [propertyId]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (enablePersonalization && activeTab === 'personalized') {
        // Get user preferences from localStorage or context
        const userPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
        response = await apiService.getPersonalizedRecommendations(propertyId, userPreferences);
      } else if (activeTab === 'nearby' && userLocation) {
        response = await apiService.getNearbyRecommendations(propertyId, userLocation);
      } else {
        const filters: any = {};
        if (categoryFilter !== 'all') filters.category = categoryFilter;
        if (priorityFilter !== 'all') filters.priority = priorityFilter;
        if (searchQuery) filters.search = searchQuery;
        
        response = await apiService.getRecommendations(propertyId, filters);
      }

      if (response.success) {
        setRecommendations(response.data || []);
      } else {
        setError(response.error || 'Failed to load recommendations');
      }
    } catch (err) {
      setError('Failed to load recommendations');
      console.error('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await apiService.getFavorites();
      if (response.success) {
        const favoriteIds = new Set(response.data.map((fav: any) => fav.id));
        setFavorites(favoriteIds);
      }
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  };

  const handleToggleFavorite = async (recommendation: Recommendation) => {
    try {
      if (favorites.has(recommendation.id)) {
        await apiService.removeFromFavorites(recommendation.id);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(recommendation.id);
          return newSet;
        });
        toast.success('Removed from favorites');
      } else {
        await apiService.addToFavorites(recommendation.id);
        setFavorites(prev => new Set(prev).add(recommendation.id));
        toast.success('Added to favorites');
      }
    } catch (err) {
      toast.error('Failed to update favorites');
      console.error('Error toggling favorite:', err);
    }
  };

  const handleRecommendationClick = async (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation);
    onRecommendationClick?.(recommendation);
    
    // Track engagement
    try {
      await apiService.trackEngagement(recommendation.id, 'click');
    } catch (err) {
      console.error('Error tracking engagement:', err);
    }
  };

  const handleViewOnMap = (recommendation: Recommendation) => {
    if (recommendation.placeDetails?.location) {
      setSelectedRecommendation(recommendation);
    }
  };

  const getPhotoUrl = (recommendation: Recommendation): string | null => {
    if (recommendation.placeDetails?.photos?.[0]) {
      const photo = recommendation.placeDetails.photos[0];
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photoReference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
    }
    return null;
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (searchQuery && !rec.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !rec.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const mapRecommendations = recommendations
    .filter(rec => rec.placeDetails?.location)
    .map(rec => ({
      id: rec.id,
      title: rec.title,
      description: rec.description,
      category: rec.category,
      rating: rec.placeDetails?.rating,
      placeId: rec.placeDetails?.placeId,
      location: rec.placeDetails!.location
    }));

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadRecommendations}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search recommendations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={loadRecommendations} variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    {cat.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="personalized">For You</TabsTrigger>
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <RecommendationsList
            recommendations={filteredRecommendations}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onRecommendationClick={handleRecommendationClick}
            onViewOnMap={handleViewOnMap}
            getPhotoUrl={getPhotoUrl}
            priorityColors={priorityColors}
          />
        </TabsContent>

        <TabsContent value="personalized" className="space-y-4">
          {enablePersonalization ? (
            <RecommendationsList
              recommendations={filteredRecommendations}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onRecommendationClick={handleRecommendationClick}
              onViewOnMap={handleViewOnMap}
              getPhotoUrl={getPhotoUrl}
              priorityColors={priorityColors}
              showPersonalization={true}
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Personalization not available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="nearby" className="space-y-4">
          {userLocation ? (
            <RecommendationsList
              recommendations={filteredRecommendations}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onRecommendationClick={handleRecommendationClick}
              onViewOnMap={handleViewOnMap}
              getPhotoUrl={getPhotoUrl}
              priorityColors={priorityColors}
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Location required for nearby recommendations</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="map">
          {showMap && userLocation ? (
            <GoogleMap
              center={userLocation}
              recommendations={mapRecommendations}
              onRecommendationClick={handleRecommendationClick}
              height="500px"
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Map view not available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface RecommendationsListProps {
  recommendations: Recommendation[];
  favorites: Set<string>;
  onToggleFavorite: (recommendation: Recommendation) => void;
  onRecommendationClick: (recommendation: Recommendation) => void;
  onViewOnMap: (recommendation: Recommendation) => void;
  getPhotoUrl: (recommendation: Recommendation) => string | null;
  priorityColors: Record<string, string>;
  showPersonalization?: boolean;
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
  favorites,
  onToggleFavorite,
  onRecommendationClick,
  onViewOnMap,
  getPhotoUrl,
  priorityColors,
  showPersonalization = false
}) => {
  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No recommendations found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-96">
      <div className="space-y-4">
        {recommendations.map((recommendation) => (
          <Card key={recommendation.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {getPhotoUrl(recommendation) ? (
                    <img
                      src={getPhotoUrl(recommendation)!}
                      alt={recommendation.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      {categories.find(cat => cat.id === recommendation.category)?.icon || '📍'}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg truncate">{recommendation.title}</h3>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge className={priorityColors[recommendation.priority]}>
                        {recommendation.priority}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onToggleFavorite(recommendation)}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favorites.has(recommendation.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                          }`}
                        />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {recommendation.description}
                  </p>

                  {/* Personalization reasons */}
                  {showPersonalization && recommendation.reasons && recommendation.reasons.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-blue-600 mb-1">Why we recommend this:</p>
                      <div className="flex flex-wrap gap-1">
                        {recommendation.reasons.map((reason, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Place details */}
                  {recommendation.placeDetails && (
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      {recommendation.placeDetails.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{recommendation.placeDetails.rating}</span>
                          {recommendation.placeDetails.userRatingsTotal && (
                            <span>({recommendation.placeDetails.userRatingsTotal})</span>
                          )}
                        </div>
                      )}
                      {recommendation.placeDetails.priceLevel && (
                        <div className="flex">
                          {[...Array(4)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${
                                i < recommendation.placeDetails!.priceLevel! ? 'text-green-600' : 'text-gray-300'
                              }`}
                            >
                              $
                            </span>
                          ))}
                        </div>
                      )}
                      {recommendation.placeDetails.openingHours && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {recommendation.placeDetails.openingHours.openNow ? 'Open now' : 'Closed'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => onRecommendationClick(recommendation)}
                    >
                      View Details
                    </Button>
                    {recommendation.placeDetails?.location && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewOnMap(recommendation)}
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        Map
                      </Button>
                    )}
                    {recommendation.placeDetails?.website && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(recommendation.placeDetails!.website, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Website
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default EnhancedRecommendations;