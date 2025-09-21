import React from 'react';
import { Card } from './card';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface StickyCardProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
  onClick?: () => void;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const StickyCard: React.FC<StickyCardProps> = ({
  title,
  subtitle,
  imageUrl,
  imageAlt = 'Card image',
  className = '',
  onClick,
  badge,
  badgeVariant = 'secondary'
}) => {
  return (
    <Card 
      className={`
        sticky top-16 z-40 
        p-5 
        bg-card/95 backdrop-blur-md 
        border-border/50 
        shadow-lg dark:shadow-2xl 
        transition-all duration-300 ease-out
        hover:shadow-xl dark:hover:shadow-3xl
        hover:scale-[1.015]
        cursor-pointer
        overflow-hidden
        rounded-2xl
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center gap-4 h-20">
        {/* Left side - Title and subtitle */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-card-foreground truncate">
              {title}
            </h3>
            {badge && (
              <span className={`
                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                ${badgeVariant === 'default' ? 'bg-primary text-primary-foreground' : ''}
                ${badgeVariant === 'secondary' ? 'bg-secondary text-secondary-foreground' : ''}
                ${badgeVariant === 'destructive' ? 'bg-destructive text-destructive-foreground' : ''}
                ${badgeVariant === 'outline' ? 'border border-border text-foreground' : ''}
              `}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right side - Image with proper curves */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted/50 border border-border/30 shadow-sm">
            {imageUrl ? (
              <ImageWithFallback
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted via-muted/80 to-muted/70">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/10"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Material 3 ripple effect overlay */}
      <div className="absolute inset-0 bg-accent/0 hover:bg-accent/5 transition-colors duration-200 pointer-events-none rounded-2xl"></div>
    </Card>
  );
};

export default StickyCard;