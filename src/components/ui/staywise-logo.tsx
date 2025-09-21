import React from 'react';
import goldenCompassImage from '../../assets/golden-compass.png';

interface StayWiseLogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StayWiseLogo: React.FC<StayWiseLogoProps> = ({ 
  variant = 'full', 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      text: 'text-lg'
    },
    md: {
      container: 'w-16 h-16',
      icon: 'w-8 h-8', 
      text: 'text-xl'
    },
    lg: {
      container: 'w-20 h-20',
      icon: 'w-10 h-10',
      text: 'text-2xl'
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Golden Compass */}
      <div className={`${sizeClasses[size].container} relative flex items-center justify-center`}>
        <img
          src={goldenCompassImage}
          alt="Golden Compass"
          className={`${sizeClasses[size].icon} object-contain`}
        />
      </div>
      
      {/* StayWise Wordmark */}
      {variant === 'full' && (
        <div>
          <h1 className={`${sizeClasses[size].text} font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent text-glow-gold`}>
            StayWise
          </h1>
        </div>
      )}
    </div>
  );
};

export default StayWiseLogo;