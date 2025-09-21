import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, MapPin, Clock, Star, Heart, Share2, ExternalLink } from 'lucide-react';

export interface DetailsModalContent {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  images?: string[];
  rating?: number;
  price?: string;
  priceFrom?: boolean;
  meta?: {
    location?: string;
    duration?: string;
    capacity?: number;
    difficulty?: string;
    category?: string;
    host?: {
      name: string;
      avatar?: string;
      rating?: number;
      isSuperhost?: boolean;
    };
  };
  tags?: string[];
  amenities?: string[];
  onBook?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  onDirections?: () => void;
  isSaved?: boolean;
}

export interface DetailsModalProps {
  content: DetailsModalContent | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

const ImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (images.length === 0) return null;

  return (
    <div className="relative">
      <div className="aspect-video overflow-hidden rounded-t-2xl">
        <img
          src={images[currentIndex]}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      
      {images.length > 1 && (
        <>
          {/* Navigation dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const TagChip: React.FC<{ tag: string }> = ({ tag }) => (
  <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30">
    {tag}
  </span>
);

const AmenityItem: React.FC<{ amenity: string }> = ({ amenity }) => (
  <div className="flex items-center gap-2 text-sm text-white/80">
    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
    <span>{amenity}</span>
  </div>
);

export const DetailsModal: React.FC<DetailsModalProps> = ({
  content,
  isOpen,
  onOpenChange,
  className = ""
}) => {
  if (!content) return null;

  const {
    title,
    subtitle,
    description,
    images = [],
    rating,
    price,
    priceFrom = true,
    meta = {},
    tags = [],
    amenities = [],
    onBook,
    onSave,
    onShare,
    onDirections,
    isSaved = false
  } = content;

  const { location, duration, capacity, difficulty, category, host } = meta;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content
          className={`fixed inset-4 md:inset-8 lg:inset-16 z-50 ${className}`}
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="w-full h-full glass-card rounded-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <Dialog.Title id="modal-title" className="text-lg font-bold text-white/95">
                {title}
              </Dialog.Title>
              <div className="flex items-center gap-2">
                {onShare && (
                  <button
                    onClick={onShare}
                    className="w-8 h-8 rounded-full glass-button flex items-center justify-center hover:scale-105 transition-all duration-200"
                    aria-label="Share"
                  >
                    <Share2 className="w-4 h-4 text-white/80" />
                  </button>
                )}
                {onSave && (
                  <button
                    onClick={onSave}
                    className="w-8 h-8 rounded-full glass-button flex items-center justify-center hover:scale-105 transition-all duration-200"
                    aria-label={isSaved ? "Remove from saved" : "Save"}
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        isSaved ? 'text-red-400 fill-current' : 'text-white/80'
                      }`} 
                    />
                  </button>
                )}
                <Dialog.Close asChild>
                  <button
                    className="w-8 h-8 rounded-full glass-button flex items-center justify-center hover:scale-105 transition-all duration-200"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4 text-white/80" />
                  </button>
                </Dialog.Close>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Image carousel */}
              {images.length > 0 && <ImageCarousel images={images} />}

              {/* Main content */}
              <div className="p-6 space-y-6">
                {/* Title and rating */}
                <div className="space-y-2">
                  {subtitle && (
                    <p className="text-sm text-white/70">{subtitle}</p>
                  )}
                  <div className="flex items-center gap-4">
                    {rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-white/90">{rating}</span>
                      </div>
                    )}
                    {category && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full">
                        {category}
                      </span>
                    )}
                    {difficulty && (
                      <span className="px-2 py-1 text-xs font-medium bg-orange-500/20 text-orange-300 rounded-full">
                        {difficulty}
                      </span>
                    )}
                  </div>
                </div>

                {/* Meta information */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {location && (
                    <div className="flex items-center gap-2 text-white/70">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span>{location}</span>
                    </div>
                  )}
                  {duration && (
                    <div className="flex items-center gap-2 text-white/70">
                      <Clock className="w-4 h-4 text-green-400" />
                      <span>{duration}</span>
                    </div>
                  )}
                  {capacity && (
                    <div className="flex items-center gap-2 text-white/70">
                      <span className="w-4 h-4 text-center text-purple-400">👥</span>
                      <span>Up to {capacity} people</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-white/95">About</h3>
                  <p className="text-white/80 leading-relaxed">{description}</p>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-white/95">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <TagChip key={index} tag={tag} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {amenities.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-white/95">Amenities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {amenities.map((amenity, index) => (
                        <AmenityItem key={index} amenity={amenity} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Host information */}
                {host && (
                  <div className="space-y-3 p-4 glass-card rounded-xl">
                    <h3 className="font-semibold text-white/95">Hosted by</h3>
                    <div className="flex items-center gap-3">
                      {host.avatar ? (
                        <img
                          src={host.avatar}
                          alt={host.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {host.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white/95">{host.name}</span>
                          {host.isSuperhost && (
                            <span className="px-2 py-1 text-xs font-bold bg-yellow-500/20 text-yellow-300 rounded-full">
                              Superhost
                            </span>
                          )}
                        </div>
                        {host.rating && (
                          <div className="flex items-center gap-1 text-sm text-white/70">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span>{host.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer with actions */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {price && (
                    <span className="text-lg font-bold text-white/95">
                      {priceFrom && "From "}{price}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  {onDirections && (
                    <button
                      onClick={onDirections}
                      className="px-4 py-2 glass-button text-white/80 font-medium rounded-lg hover:text-white/95 transition-colors"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Directions
                    </button>
                  )}
                  {onBook && (
                    <button
                      onClick={onBook}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      {price ? 'Book Now' : 'Learn More'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DetailsModal;
