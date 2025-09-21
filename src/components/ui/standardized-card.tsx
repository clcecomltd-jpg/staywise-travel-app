import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export interface StandardizedCardData {
  id: string | number;
  title: string;
  subtitle?: string;
  category?: string;
  distance?: string;
  rating?: number;
  image: string;
  emoji?: string;
  tag?: string;
  ctaText?: string;
  type?: 'venue' | 'offer' | 'event' | 'recommendation' | 'essential';
}

interface StandardizedCardProps {
  data: StandardizedCardData;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'minimal' | 'detailed';
  texturePattern?: 'none' | 'grain' | 'fabric' | 'paper' | 'brushed';
  showCTA?: boolean;
}

export const StandardizedCard: React.FC<StandardizedCardProps> = ({
  data,
  onClick,
  className = '',
  variant = 'default',
  texturePattern = 'none',
  showCTA = true
}) => {
  const getTextureStyle = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const textureColor = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)';
    const subtleColor = isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)';
    const lineColor = isDark ? 'rgba(128,128,128,0.15)' : 'rgba(209,213,219,0.3)';
    
    switch (texturePattern) {
      case 'grain':
        return {
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 1px,
            ${textureColor} 1px,
            ${textureColor} 2px
          )`,
          backgroundSize: '4px 4px'
        };
      case 'fabric':
        return {
          backgroundImage: `
            radial-gradient(circle at 20% 80%, ${subtleColor} 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${subtleColor} 0%, transparent 50%),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              ${isDark ? 'rgba(255,255,255,0.005)' : 'rgba(0,0,0,0.005)'} 2px,
              ${isDark ? 'rgba(255,255,255,0.005)' : 'rgba(0,0,0,0.005)'} 4px
            )
          `,
          backgroundSize: '40px 40px, 30px 30px, 3px 3px'
        };
      case 'paper':
        return {
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 23px,
            ${lineColor} 23px,
            ${lineColor} 24px
          )`,
          backgroundSize: '100% 24px'
        };
      case 'brushed':
        return {
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'} 1px,
            ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'} 2px
          )`,
          backgroundSize: '100% 3px'
        };
      default:
        return {};
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  const handleCTAClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <Card 
      className={`
        w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 
        cursor-pointer hover:scale-[1.02] relative 
        ${className}
      `}
      onClick={handleClick}
    >
      {/* Texture Overlay */}
      {texturePattern !== 'none' && (
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none z-0"
          style={getTextureStyle()}
        />
      )}
      
      <CardContent className="relative z-10 p-0">
        {variant === 'minimal' ? (
          // Minimal variant (list-style)
          <div className="flex h-20">
            <div className="w-20 h-20 flex-shrink-0 relative">
              <ImageWithFallback
                src={data.image}
                alt={data.title}
                className="w-full h-full object-cover rounded-l-lg"
              />
              {data.tag && (
                <div className="absolute top-1 left-1">
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                    {data.tag}
                  </Badge>
                </div>
              )}
              {data.emoji && (
                <div className="absolute top-1 right-1">
                  <div className="w-6 h-6 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-sm">{data.emoji}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1 p-4 flex items-center justify-between min-w-0">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold leading-tight truncate text-card-foreground">{data.title}</h4>
                <p className="text-sm text-muted-foreground truncate">{data.subtitle}</p>
                
                {/* Rating and Distance */}
                <div className="flex items-center space-x-2 mt-1">
                  {data.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current text-yellow-400" />
                      <span className="text-xs font-medium text-card-foreground">{data.rating}</span>
                    </div>
                  )}
                  {data.distance && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{data.distance}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {showCTA && data.ctaText && (
                <Button
                  onClick={handleCTAClick}
                  size="sm"
                  className="ml-3 h-8"
                >
                  {data.ctaText}
                </Button>
              )}
            </div>
          </div>
        ) : (
          // Default and detailed variants (grid-style)
          <div className="space-y-3">
            {/* Image Container with 16:9 aspect ratio */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
              <ImageWithFallback
                src={data.image}
                alt={data.title}
                className="w-full h-full object-cover"
              />
              
              {/* Top-left overlay (emoji or tag) */}
              <div className="absolute top-2 left-2">
                {data.emoji ? (
                  <div className="w-8 h-8 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-lg">{data.emoji}</span>
                  </div>
                ) : data.tag ? (
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-medium">
                    {data.tag}
                  </Badge>
                ) : null}
              </div>
              
              {/* Top-right overlay (rating) */}
              {data.rating && (
                <div className="absolute top-2 right-2">
                  <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                    <span className="text-white text-xs font-medium">{data.rating}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Content with consistent 16px padding */}
            <div className="p-4 space-y-2">
              <h4 className="font-semibold leading-tight truncate text-card-foreground">{data.title}</h4>
              
              {data.subtitle && (
                <p className="text-sm text-muted-foreground truncate">{data.subtitle}</p>
              )}
              
              {/* Category and Distance */}
              {(data.category || data.distance) && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  {data.category && <span>{data.category}</span>}
                  {data.category && data.distance && <span>•</span>}
                  {data.distance && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{data.distance}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* CTA Button */}
              {showCTA && data.ctaText && variant === 'detailed' && (
                <Button 
                  size="sm" 
                  className="w-full h-8 text-xs mt-3" 
                  onClick={handleCTAClick}
                >
                  {data.ctaText}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StandardizedCard;