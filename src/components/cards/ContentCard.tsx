import React from 'react';
import { Heart, Star, MapPin, Clock, DollarSign, Users } from 'lucide-react';

export interface ContentCardProps {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  rating?: number;
  price?: string;
  priceFrom?: boolean;
  meta?: {
    location?: string;
    duration?: string;
    capacity?: number;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    category?: string;
  };
  actions?: {
    primary?: {
      label: string;
      onClick: () => void;
    };
    secondary?: {
      label: string;
      onClick: () => void;
    };
  };
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
  className?: string;
  isDarkMode?: boolean;
}

const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const colors = {
    Easy: 'bg-green-500/20 text-green-400 border-green-400/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
    Hard: 'bg-red-500/20 text-red-400 border-red-400/30'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[difficulty as keyof typeof colors]}`}>
      {difficulty}
    </span>
  );
};

export const ContentCard: React.FC<ContentCardProps> = ({
  id,
  image,
  title,
  subtitle,
  description,
  rating,
  price,
  priceFrom = true,
  meta = {},
  actions,
  onFavorite,
  isFavorite = false,
  className = "",
  isDarkMode = true
}) => {
  const {
    location,
    duration,
    capacity,
    difficulty,
    category
  } = meta;

  return (
    <div 
      className={`glass-card rounded-2xl overflow-hidden group hover:glass-card-hover transition-all duration-300 ${className}`}
      role="article"
      aria-labelledby={`card-title-${id}`}
    >
      {/* Image with overlays */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category badge */}
        {category && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-semibold bg-blue-500/90 text-white rounded-full backdrop-blur-sm">
              {category}
            </span>
          </div>
        )}
        
        {/* Difficulty badge */}
        {difficulty && (
          <div className="absolute top-3 right-12">
            <DifficultyBadge difficulty={difficulty} />
          </div>
        )}
        
        {/* Favorite button */}
        {onFavorite && (
          <button
            onClick={() => onFavorite(id)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full glass-button flex items-center justify-center hover:scale-110 transition-all duration-200"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`w-4 h-4 transition-all duration-200 ${
                isFavorite 
                  ? 'text-red-500 fill-current animate-heart-bounce' 
                  : isDarkMode 
                    ? 'text-white/70' 
                    : 'text-gray-600'
              }`} 
            />
          </button>
        )}
        
        {/* Rating overlay */}
        {rating && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/50 text-white rounded-full backdrop-blur-sm">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-medium">{rating}</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and subtitle */}
        <div>
          <h3 
            id={`card-title-${id}`}
            className="font-bold text-white/95 dark:text-white/95 light:text-gray-900 text-lg mb-1 line-clamp-1"
          >
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-white/70 dark:text-white/70 light:text-gray-600 line-clamp-1">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="text-sm text-white/60 dark:text-white/60 light:text-gray-500 line-clamp-2 mt-2">
              {description}
            </p>
          )}
        </div>
        
        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-white/60 dark:text-white/60 light:text-gray-500">
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{location}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{duration}</span>
            </div>
          )}
          {capacity && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>Up to {capacity}</span>
            </div>
          )}
        </div>
        
        {/* Price and actions */}
        <div className="flex items-center justify-between">
          {price && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="font-bold text-white/90 dark:text-white/90 light:text-gray-900">
                {priceFrom && "From "}{price}
              </span>
            </div>
          )}
          
          {/* Action buttons */}
          {actions && (
            <div className="flex gap-2">
              {actions.primary && (
                <button
                  onClick={actions.primary.onClick}
                  className="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {actions.primary.label}
                </button>
              )}
              {actions.secondary && (
                <button
                  onClick={actions.secondary.onClick}
                  className="px-3 py-2 glass-button text-white/80 text-sm font-medium rounded-lg hover:text-white/95 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {actions.secondary.label}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
