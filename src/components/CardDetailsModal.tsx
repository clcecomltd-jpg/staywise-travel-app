import React from 'react';
import { X, Star, MapPin, Navigation, Heart, Share, Clock, Phone, Globe, Calendar, User } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

export interface CardData {
  id: string | number;
  title: string;
  subtitle?: string;
  category?: string;
  distance?: string;
  rating?: number;
  image: string;
  images?: string[]; // For image gallery
  description?: string;
  hostNote?: string;
  address?: string;
  phone?: string;
  website?: string;
  hours?: string;
  availability?: string;
  price?: string;
  priceDescription?: string;
  ctaText?: string;
  secondaryCtaText?: string;
  type?: 'venue' | 'offer' | 'event' | 'recommendation' | 'essential';
  emoji?: string;
  tag?: string; // For host recommendations
}

interface CardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CardData | null;
}

export const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  const handlePrimaryAction = () => {
    if (data.type === 'offer') {
      toast.success(`Booking ${data.title}...`);
    } else if (data.type === 'venue') {
      toast.success(`Opening ${data.title} details...`);
    } else if (data.type === 'event') {
      toast.success(`Getting tickets for ${data.title}...`);
    } else {
      toast.success(`Opening ${data.title}...`);
    }
    onClose();
  };

  const handleSecondaryAction = () => {
    toast.success(`Added ${data.title} to favorites`);
  };

  const handleDirections = () => {
    toast.success(`Opening directions to ${data.title}...`);
  };

  const handleShare = () => {
    toast.success(`Sharing ${data.title}...`);
  };

  const handleCall = () => {
    if (data.phone) {
      toast.success(`Calling ${data.title}...`);
    }
  };

  const handleWebsite = () => {
    if (data.website) {
      toast.success(`Opening ${data.title} website...`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[85vh] p-0 gap-0 bg-background border-0 shadow-2xl overflow-hidden">
        <DialogDescription className="sr-only">
          Details for {data.title}
        </DialogDescription>
        
        {/* Header with Image */}
        <div className="relative">
          <ImageWithFallback
            src={data.image}
            alt={data.title}
            className="w-full h-48 object-cover"
          />
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10 p-0 bg-background/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-background"
          >
            <X className="w-5 h-5" />
          </Button>
          
          {/* Quick Action Buttons */}
          <div className="absolute top-4 left-4 flex space-x-2">
            {data.tag && (
              <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-foreground">
                {data.tag}
              </Badge>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Title and Basic Info */}
            <div className="space-y-3">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold leading-tight">
                  {data.title}
                </DialogTitle>
              </DialogHeader>
              
              {data.subtitle && (
                <p className="text-muted-foreground">{data.subtitle}</p>
              )}
              
              <div className="flex items-center space-x-4 text-sm">
                {data.category && (
                  <span className="text-muted-foreground">{data.category}</span>
                )}
                {data.distance && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{data.distance}</span>
                  </div>
                )}
                {data.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{data.rating}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {(data.description || data.hostNote) && (
              <div className="space-y-2">
                <h4 className="font-medium">About</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {data.description || data.hostNote}
                </p>
              </div>
            )}

            {/* Contact & Details */}
            <div className="space-y-4">
              {data.hours && (
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-sm text-muted-foreground">{data.hours}</p>
                  </div>
                </div>
              )}

              {data.availability && (
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Availability</p>
                    <p className="text-sm text-muted-foreground">{data.availability}</p>
                  </div>
                </div>
              )}

              {data.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{data.address}</p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto text-primary"
                      onClick={handleDirections}
                    >
                      View on Map
                    </Button>
                  </div>
                </div>
              )}

              {data.phone && (
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto text-primary"
                      onClick={handleCall}
                    >
                      {data.phone}
                    </Button>
                  </div>
                </div>
              )}

              {data.website && (
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Website</p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto text-primary"
                      onClick={handleWebsite}
                    >
                      Visit Website
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Price Information */}
            {data.price && (
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">{data.price}</p>
                    {data.priceDescription && (
                      <p className="text-sm text-muted-foreground">{data.priceDescription}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer with Actions */}
        <div className="border-t bg-background p-4">
          <div className="flex space-x-3">
            <Button
              onClick={handlePrimaryAction}
              className="flex-1 h-12"
            >
              {data.ctaText || 'View Details'}
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-12 w-12 p-0"
                onClick={handleSecondaryAction}
              >
                <Heart className="w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="h-12 w-12 p-0"
                onClick={handleShare}
              >
                <Share className="w-5 h-5" />
              </Button>
              
              {data.address && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-12 w-12 p-0"
                  onClick={handleDirections}
                >
                  <Navigation className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailsModal;