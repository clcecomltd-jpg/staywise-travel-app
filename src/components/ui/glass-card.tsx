import React from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'float' | 'button' | 'shimmer' | 'hover';
  children: React.ReactNode;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantClasses = {
      default: 'glass-card',
      float: 'glass-float',
      button: 'glass-button',
      shimmer: 'glass-card glass-shimmer',
      hover: 'glass-card glass-card-hover'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard };