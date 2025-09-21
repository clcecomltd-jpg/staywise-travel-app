import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  Star, 
  Clock, 
  Phone, 
  Globe, 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Heart,
  Share2,
  X
} from 'lucide-react';
import { apiService } from '../services/api';
import { toast } from 'sonner';

interface RecommendationModalProps {
  recommendation: {
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
      internationalPhoneNumber?: string;
      reviews?: Array<{
        authorName: string;
        rating: number;
        text: string;
        time: number;
      }>;
    };
    engagementStats?: {
      views: number;
      favorites: number;
      clicks: number;
      shares: number;
    };
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToFavorites?: (recommendationId: string) => void;
  onRemoveFromFavorites?: (recommendationId: string) => void;
  isFavorite?: boolean;
}

const RecommendationModal: React.FC<RecommendationModalProps> = ({
  recommendation,
  isOpen,
  onClose,
  onAddToFavorites,
  onRemoveFromFavorites,
  isFavorite = false
}) => {
  const [loading, setLoading] = useState(false);
  const [placeDetails, setPlaceDetails] = useState<any>(null);

  useEffect(() => {
    if (recommendation?.placeDetails?.placeId && isOpen) {
      loadPlaceDetails();
    }
  }, [recommendation, isOpen]);

  const loadPlaceDetails = async () => {
    if (!recommendation?.placeDetails?.placeId) return;

    try {
      setLoading(true);
      const response = await apiService.getPlaceDetails(recommendation.placeDetails.placeId);
      
      if (response.success) {
        setPlaceDetails(response.data);
      }
    } catch (error) {
      console.error('Error loading place details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!recommendation) return;

    if (isFavorite) {
      onRemoveFromFavorites?.(recommendation.id);
    } else {
      onAddToFavorites?.(recommendation.id);
    }
  };

  const handleShare = async () => {
    if (!recommendation) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: recommendation.title,
          text: recommendation.description,
          url: window.location.href
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(
          `${recommendation.title}\n${recommendation.description}\n${window.location.href}`
        );
        toast.success('Link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleGetDirections = () => {
    if (!placeDetails?.location) return;

    const { lat, lng } = placeDetails.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const getPhotoUrl = (photoReference: string, maxWidth: number = 800) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
  };

  const formatPriceLevel = (priceLevel?: number) => {
    if (!priceLevel) return null;
    return '$'.repeat(priceLevel);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (!recommendation) return null;

  const details = placeDetails || recommendation.placeDetails;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            {recommendation.title}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleToggleFavorite}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                }`}
              />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Hero Image */}
            {details?.photos?.[0] && (
              <div className="relative h-48 rounded-lg overflow-hidden">
                <img
                  src={getPhotoUrl(details.photos[0].photoReference)}
                  alt={recommendation.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-gray-900">
                    {recommendation.category}
                  </Badge>
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{recommendation.title}</h3>
                <p className="text-muted-foreground">{recommendation.description}</p>
              </div>

              {/* Rating and Price */}
              <div className="flex items-center gap-4">
                {details?.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{details.rating}</span>
                    {details.userRatingsTotal && (
                      <span className="text-sm text-muted-foreground">
                        ({details.userRatingsTotal} reviews)
                      </span>
                    )}
                  </div>
                )}
                
                {details?.priceLevel && (
                  <div className="text-sm font-medium">
                    {formatPriceLevel(details.priceLevel)}
                  </div>
                )}
              </div>

              {/* Address */}
              {details?.formattedAddress && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {details.formattedAddress}
                  </span>
                </div>
              )}

              {/* Opening Hours */}
              {details?.openingHours && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">
                      {details.openingHours.openNow ? 'Open now' : 'Closed'}
                    </span>
                  </div>
                  
                  {details.openingHours.weekdayText && (
                    <div className="ml-6 space-y-1">
                      {details.openingHours.weekdayText.map((day, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          {day}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-2">
                {details?.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={`tel:${details.phoneNumber}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {details.phoneNumber}
                    </a>
                  </div>
                )}
                
                {details?.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={details.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Reviews */}
            {details?.reviews && details.reviews.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Recent Reviews</h4>
                <div className="space-y-3">
                  {details.reviews.slice(0, 3).map((review: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{review.authorName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(review.time)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.text}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Engagement Stats */}
            {recommendation.engagementStats && (
              <div className="space-y-2">
                <h4 className="font-semibold">Popularity</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Views:</span>
                    <span>{recommendation.engagementStats.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Favorites:</span>
                    <span>{recommendation.engagementStats.favorites}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Clicks:</span>
                    <span>{recommendation.engagementStats.clicks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shares:</span>
                    <span>{recommendation.engagementStats.shares}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          {details?.location && (
            <Button onClick={handleGetDirections} className="flex-1">
              <Navigation className="w-4 h-4 mr-2" />
              Get Directions
            </Button>
          )}
          
          {details?.website && (
            <Button
              variant="outline"
              onClick={() => window.open(details.website, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Website
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecommendationModal;