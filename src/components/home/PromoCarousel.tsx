import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Clock, MapPin } from 'lucide-react';

export interface PromoData {
  id: string;
  title: string;
  tag: string;
  image: string;
  ctaLabel: string;
  href: string;
  description?: string;
  price?: string;
  rating?: number;
  duration?: string;
  location?: string;
}

export interface PromoCarouselProps {
  promos?: PromoData[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const DEFAULT_PROMOS: PromoData[] = [
  {
    id: "1",
    title: "Sunset Rooftop Dinner",
    tag: "Exclusive",
    image: "/api/placeholder/300/200",
    ctaLabel: "Reserve Spot",
    href: "/book/sunset-dinner",
    description: "Enjoy a romantic dinner with panoramic city views",
    price: "From $89",
    rating: 4.9,
    duration: "2 hours",
    location: "Sky Bar Bangkok"
  },
  {
    id: "2",
    title: "Temple Tour Experience",
    tag: "Cultural",
    image: "/api/placeholder/300/200",
    ctaLabel: "Book Tour",
    href: "/book/temple-tour",
    description: "Guided tour of Bangkok's most sacred temples",
    price: "From $45",
    rating: 4.8,
    duration: "4 hours",
    location: "Wat Pho & Grand Palace"
  },
  {
    id: "3",
    title: "Floating Market Adventure",
    tag: "Local",
    image: "/api/placeholder/300/200",
    ctaLabel: "Join Tour",
    href: "/book/floating-market",
    description: "Explore authentic floating markets and local life",
    price: "From $35",
    rating: 4.7,
    duration: "6 hours",
    location: "Damnoen Saduak"
  },
  {
    id: "4",
    title: "Cooking Class & Market",
    tag: "Food",
    image: "/api/placeholder/300/200",
    ctaLabel: "Learn to Cook",
    href: "/book/cooking-class",
    description: "Master authentic Thai cooking techniques",
    price: "From $65",
    rating: 4.9,
    duration: "3 hours",
    location: "Local Kitchen Studio"
  }
];

const PromoCard: React.FC<{
  promo: PromoData;
  isDarkMode?: boolean;
}> = ({ promo, isDarkMode = true }) => {
  return (
    <div className="flex-shrink-0 w-72 glass-card rounded-2xl overflow-hidden group hover:glass-card-hover transition-all duration-300">
      {/* Image with overlay */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={promo.image}
          alt={promo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Tag */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-xs font-semibold bg-blue-500/90 text-white rounded-full backdrop-blur-sm">
            {promo.tag}
          </span>
        </div>
        
        {/* Rating */}
        {promo.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 text-white rounded-full backdrop-blur-sm">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-medium">{promo.rating}</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-white/95 dark:text-white/95 light:text-gray-900 text-lg mb-1">
            {promo.title}
          </h3>
          <p className="text-sm text-white/70 dark:text-white/70 light:text-gray-600 line-clamp-2">
            {promo.description}
          </p>
        </div>
        
        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-white/60 dark:text-white/60 light:text-gray-500">
          {promo.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{promo.duration}</span>
            </div>
          )}
          {promo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{promo.location}</span>
            </div>
          )}
        </div>
        
        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          {promo.price && (
            <span className="font-bold text-white/90 dark:text-white/90 light:text-gray-900">
              {promo.price}
            </span>
          )}
          <button
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={() => {
              // In a real app, this would navigate to the booking page
              console.log(`Navigate to: ${promo.href}`);
            }}
          >
            {promo.ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export const PromoCarousel: React.FC<PromoCarouselProps> = ({
  promos = DEFAULT_PROMOS,
  className = "",
  autoPlay = true,
  autoPlayInterval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = 288; // w-72 = 288px
      const gap = 16; // gap-4 = 16px
      const scrollPosition = index * (cardWidth + gap);
      
      scrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % promos.length);
    scrollToIndex((currentIndex + 1) % promos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + promos.length) % promos.length);
    scrollToIndex((currentIndex - 1 + promos.length) % promos.length);
  };

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isHovered) {
      intervalRef.current = setInterval(nextSlide, autoPlayInterval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, isHovered, autoPlayInterval, currentIndex]);

  return (
    <div 
      className={`space-y-4 ${className}`}
      role="region"
      aria-labelledby="promo-carousel-title"
      aria-roledescription="carousel"
    >
      <div className="flex items-center justify-between">
        <h2 id="promo-carousel-title" className="text-lg font-bold text-white/95 dark:text-white/95 light:text-gray-900">
          Special Offers
        </h2>
        
        {/* Navigation arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="w-8 h-8 rounded-full glass-button flex items-center justify-center hover:scale-105 transition-all duration-200"
            aria-label="Previous offer"
          >
            <ChevronLeft className="w-4 h-4 text-white/80" />
          </button>
          <button
            onClick={nextSlide}
            className="w-8 h-8 rounded-full glass-button flex items-center justify-center hover:scale-105 transition-all duration-200"
            aria-label="Next offer"
          >
            <ChevronRight className="w-4 h-4 text-white/80" />
          </button>
        </div>
      </div>

      {/* Carousel container */}
      <div
        ref={scrollRef}
        className="relative overflow-x-auto scrollbar-hide carousel-snap"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex gap-4 pb-2">
          {promos.map((promo, index) => (
            <div
              key={promo.id}
              className="flex-shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <PromoCard 
                promo={promo} 
                isDarkMode={true} // This should come from theme context
              />
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
      <div className="flex justify-center gap-2">
        {promos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              scrollToIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-blue-400 w-6'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoCarousel;
