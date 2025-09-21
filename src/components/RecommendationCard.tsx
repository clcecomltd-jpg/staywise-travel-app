
import React, { useState } from 'react';
import { Heart, Share2 } from 'lucide-react';
import { Recommendation } from '../types/database';
import { Button } from './ui/button';
import RecommendationModal from './RecommendationModal';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { title, category, description, price, currency, imageUrl } = recommendation;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal
    setIsFavorite(!isFavorite);
    // In a real app, you would also call an API to save the favorite status
    // and show a toast notification (e.g., using Sonner)
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Share functionality here
    navigator.clipboard.writeText(window.location.href);
    // Show toast notification
  };

  return (
    <>
      <article 
        className="glass-card-hover animate-rise-in group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg" 
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative h-48 w-full">
          {/* Loading skeleton */}
          {!imageLoaded && !imageError && (
            <div className="h-full w-full bg-gray-300/20 animate-pulse rounded-lg"></div>
          )}

          {/* Error state */}
          {imageError && (
            <div className="h-full w-full bg-gray-200/20 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <span className="text-2xl">🖼️</span>
                <p className="text-sm mt-2">Image unavailable</p>
              </div>
            </div>
          )}

          {/* Main image */}
          <img
            src={imageUrl}
            alt={`${title} - ${category} experience`}
            className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />

          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}></div>
          <div className="absolute right-3 top-3 flex gap-2">
            <button
              onClick={handleShareClick}
              className="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              aria-label={`Share ${title}`}
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={handleFavoriteClick}
              className={`rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30 ${isFavorite ? 'animate-heart-bounce' : ''}`}
              aria-label={isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
              aria-pressed={isFavorite}
            >
              <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <p className="uppercase text-primary">{category}</p>
            {price > 0 && <p>{`${price} ${currency}`}</p>}
            {price === 0 && <p className="text-green-500">FREE</p>}
          </div>
          <h3 className="mt-2 truncate text-gray-900 dark:text-white">{title}</h3>
          <p className="mt-1 text-gray-600 dark:text-gray-300 line-clamp-2">{description}</p>
          <Button className="mt-4 w-full" variant="outline" onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}>View Details</Button>
        </div>
      </article>
      <RecommendationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} recommendation={recommendation} />
    </>
  );
};

export default RecommendationCard;
