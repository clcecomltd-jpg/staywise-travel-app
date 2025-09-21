import React, { useMemo, useState } from 'react';
import { ArrowLeft, Heart, Star, Wifi, Snowflake, ChefHat, Waves, Bed, Car, ShieldCheck, Coffee, MapPin, MessageCircle, Calendar, Navigation, Share, ExternalLink, ChevronRight, Grid3X3, User, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { useProperty } from '../contexts/PropertyContext';
import type { ImportedProperty } from '../../lib/propertyImport';

interface PropertyScreenProps {
  onBack: () => void;
  onNavigateToChat: () => void;
  onNavigateToMap: () => void;
  onNavigateToExplore: () => void;
}

const PropertyScreen: React.FC<PropertyScreenProps> = ({ 
  onBack, 
  onNavigateToChat, 
  onNavigateToMap, 
  onNavigateToExplore 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const { property: importedProperty } = useProperty();

  const fallbackProperty: ImportedProperty = useMemo(
    () => ({
      provider: 'manual',
      name: 'Modern Riverside Apartment',
      headline: '2 guests · 1 bedroom · 1 bath',
      description:
        'Wake up to panoramic river views in this thoughtfully designed apartment featuring curated amenities, touchless check-in, and a locally-inspired welcome guide.',
      location: 'Vientiane, Laos',
      photos: [
        'https://images.unsplash.com/photo-1594873604892-b599f847e859?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1611234688667-76b6d8fadd75?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1603072819161-e864800276cd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1737233536991-8ee3f92b7781?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1630699376682-84df40131d22?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=600&fit=crop'
      ],
      amenities: [
        'Fast Wi-Fi',
        'Air conditioning',
        'Full kitchen',
        'Washer & dryer',
        'Queen bed',
        'Rain shower',
        'Private entrance',
        'Free parking',
        'Coffee maker',
        'Hair dryer',
        'Iron & board',
        'Smart TV'
      ],
      checkIn: '3:00 PM - 9:00 PM',
      checkOut: '11:00 AM',
    }),
    [],
  );

  const property = importedProperty ?? fallbackProperty;
  const propertyPhotos = property.photos?.length ? property.photos : fallbackProperty.photos;
  const propertySubtitle = property.headline ?? property.location ?? fallbackProperty.headline;
  const propertyDescription = property.description ?? fallbackProperty.description;
  const propertyAmenities = property.amenities?.length ? property.amenities : fallbackProperty.amenities;

  // Property data
  const propertyTitle = property.name ?? fallbackProperty.name;
  const rating = (importedProperty as unknown as { rating?: number })?.rating ?? 4.8;
  const reviewCount = (importedProperty as unknown as { reviewCount?: number })?.reviewCount ?? 120;

  const defaultAmenityIcons = [
    Wifi,
    Snowflake,
    ChefHat,
    Waves,
    Bed,
    User,
    ShieldCheck,
    Car,
    Coffee,
    Sparkles,
    Sparkles,
    Sparkles,
  ];

  const amenities = propertyAmenities.map((label, index) => ({
    icon: defaultAmenityIcons[index] ?? Sparkles,
    label,
    featured: index < 6,
  }));

  const hostRecommendations = [
    {
      id: 1,
      icon: '🌅',
      title: 'Best sunset spot nearby',
      description: 'Mekong riverside walkway - perfect for evening strolls',
      action: 'View on Map',
      actionType: 'map' as const
    },
    {
      id: 2,
      icon: '☕',
      title: 'Morning coffee at Café Vanille',
      description: '5 minute walk - try their Vietnamese drip coffee',
      action: 'View Details',
      actionType: 'explore' as const
    },
    {
      id: 3,
      icon: '🛍️',
      title: "Don't miss the Vientiane Night Market",
      description: 'Local crafts, street food, and souvenirs every evening',
      action: 'View on Map',
      actionType: 'map' as const
    },
    {
      id: 4,
      icon: '🍜',
      title: 'Authentic Lao cuisine',
      description: 'Tamnak Lao Restaurant - ask for the traditional laap',
      action: 'View Details',
      actionType: 'explore' as const
    }
  ];

  const checkInInfo = {
    checkIn: property.checkIn ?? fallbackProperty.checkIn ?? '3:00 PM - 9:00 PM',
    checkOut: property.checkOut ?? fallbackProperty.checkOut ?? '11:00 AM',
    rules: [
      'No smoking',
      'Quiet hours after 10 PM',
      'No pets allowed',
      'Self check-in with lockbox'
    ]
  };

  const handleImageSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && currentImageIndex < propertyPhotos.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (direction === 'left' && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleRecommendationAction = (recommendation: typeof hostRecommendations[0]) => {
    if (recommendation.actionType === 'map') {
      onNavigateToMap();
      toast.success(`Opening ${recommendation.title} on map`);
    } else {
      onNavigateToExplore();
      toast.success(`Exploring ${recommendation.title}`);
    }
  };

  const handleMessageHost = () => {
    onNavigateToChat();
    toast.success('Opening chat with host');
  };

  const handleBookNow = () => {
    toast.info('Booking flow coming soon');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Hero Section with Image Carousel */}
      <div className="relative">
        <div className="relative h-80 overflow-hidden">
          <ImageWithFallback
            src={propertyPhotos[currentImageIndex]}
            alt={propertyTitle}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {propertyPhotos.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Swipe Areas */}
          <div className="absolute inset-0 flex">
            <div 
              className="flex-1" 
              onClick={() => handleImageSwipe('left')}
            />
            <div 
              className="flex-1" 
              onClick={() => handleImageSwipe('right')}
            />
          </div>
        </div>

        {/* Header Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-10 w-10 p-0 bg-white/90 hover:bg-white rounded-full shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorited(!isFavorited)}
            className="h-10 w-10 p-0 bg-white/90 hover:bg-white rounded-full shadow-md"
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-900'}`} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-6 space-y-8">
          {/* Property Title & Meta Info */}
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-foreground">{property.title}</h1>
            <p className="text-muted-foreground">{property.subtitle}</p>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                <span className="font-medium">{property.rating}</span>
              </div>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground underline">{property.reviewCount} reviews</span>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">What this place offers</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {amenities.filter(a => a.featured).map((amenity, index) => {
                const IconComponent = amenity.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{amenity.label}</span>
                  </div>
                );
              })}
            </div>

            <Dialog open={showAllAmenities} onOpenChange={setShowAllAmenities}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4 w-full justify-between">
                  <span>View all amenities</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>All Amenities</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {amenities.map((amenity, index) => {
                    const IconComponent = amenity.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3 py-2">
                        <IconComponent className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">{amenity.label}</span>
                      </div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Instructions Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Check-in & House Rules</h3>
            
            <Card className="shadow-sm">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">Check-in</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{checkInInfo.checkIn}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">Check-out</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{checkInInfo.checkOut}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-2">House Rules</h4>
                  <ul className="space-y-1">
                    {checkInInfo.rules.map((rule, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full mr-3" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleMessageHost}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Host
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Host Recommendations Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Host Recommendations</h3>
            <p className="text-sm text-muted-foreground">Handpicked local favorites from your host</p>
            
            <div className="space-y-3">
              {hostRecommendations.map((recommendation) => (
                <Card key={recommendation.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">{recommendation.icon}</div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground mb-1">{recommendation.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{recommendation.description}</p>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRecommendationAction(recommendation)}
                          className="text-primary border-primary hover:bg-primary/10"
                        >
                          {recommendation.action}
                          {recommendation.actionType === 'map' ? (
                            <Navigation className="w-3 h-3 ml-2" />
                          ) : (
                            <ExternalLink className="w-3 h-3 ml-2" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Extended Gallery Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Photo Gallery</h3>
            
            <ScrollArea orientation="horizontal" className="w-full">
              <div className="flex space-x-3 pb-2">
                {property.images.map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-24 h-20 cursor-pointer rounded-lg overflow-hidden"
                    onClick={() => setShowImageGallery(true)}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`Property photo ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Dialog open={showImageGallery} onOpenChange={setShowImageGallery}>
              <DialogContent className="max-w-2xl">
                <div className="relative">
                  <ImageWithFallback
                    src={property.images[currentImageIndex]}
                    alt={`Property photo ${currentImageIndex + 1}`}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Where you'll be</h3>
            
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <div className="h-48 bg-muted/30 rounded-t-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <MapPin className="w-8 h-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">Interactive map preview</p>
                    <p className="text-xs text-muted-foreground">Central Vientiane, Laos</p>
                  </div>
                </div>
                
                <div className="p-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onNavigateToMap}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom spacing for sticky footer */}
          <div className="h-20" />
        </div>
      </ScrollArea>

      {/* Sticky CTA Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleMessageHost}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message Host
          </Button>
          <Button
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleBookNow}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyScreen;
