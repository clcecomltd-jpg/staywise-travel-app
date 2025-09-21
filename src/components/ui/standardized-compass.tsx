import React from 'react';
import { ONBOARDING_CONFIG } from '../../constants/onboarding';
import goldenCompassImage from '@/assets/golden-compass.png';

interface StandardizedCompassProps {
  className?: string;
  showGlow?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const StandardizedCompass: React.FC<StandardizedCompassProps> = ({
  className = '',
  showGlow = true,
  size = 'large'
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',    // 64px
    medium: 'w-24 h-24',   // 96px  
    large: 'w-32 h-32'     // 128px
  };

  const glowStyles = showGlow ? {
    filter: ONBOARDING_CONFIG.VISUAL.COMPASS_GLOW,
    transform: ONBOARDING_CONFIG.VISUAL.COMPASS_TRANSFORM,
  } : {};

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <div 
        className="w-full h-full flex items-center justify-center compass-glow"
        style={glowStyles}
      >
        <img
          src={goldenCompassImage}
          alt="StayWise golden compass logo"
          className="w-full h-full object-contain"
          style={{
            filter: ONBOARDING_CONFIG.VISUAL.COMPASS_FILTER,
            transform: 'translateZ(10px)'
          }}
          onError={(e) => {
            // Fallback to Unsplash compass image
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1643598778711-c118e8d6d71f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYXNzJTIwaWNvbiUyMGdvbGQlMjBtZXRhbGxpY3xlbnwxfHx8fDE3NTg0NDczOTV8MA&ixlib=rb-4.1.0&q=80&w=400";
          }}
        />
      </div>
    </div>
  );
};

interface StandardizedTitleProps {
  title: string;
  subtitle?: string;
  variant?: 'hero' | 'page';
  className?: string;
}

export const StandardizedTitle: React.FC<StandardizedTitleProps> = ({
  title,
  subtitle,
  variant = 'hero',
  className = ''
}) => {
  const titleSize = variant === 'hero' 
    ? ONBOARDING_CONFIG.TYPOGRAPHY.HERO_TITLE 
    : ONBOARDING_CONFIG.TYPOGRAPHY.PAGE_TITLE;

  return (
    <div className={`text-center ${className}`}>
      <h1
        className="font-bold text-white mb-2"
        style={{
          fontSize: titleSize,
          lineHeight: '1.2'
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="text-white/80"
          style={{
            fontSize: ONBOARDING_CONFIG.TYPOGRAPHY.BODY_TEXT,
            lineHeight: '1.5'
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

interface StandardizedBackgroundProps {
  backgroundImage?: string;
  children: React.ReactNode;
  className?: string;
}

export const StandardizedBackground: React.FC<StandardizedBackgroundProps> = ({
  backgroundImage,
  children,
  className = ''
}) => {
  return (
    <div className={`min-h-screen w-full max-w-[430px] mx-auto relative overflow-hidden ${className}`}>
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt="Background"
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              (e.target as HTMLImageElement).style.background = 'linear-gradient(135deg, #1a1a2e, #16213e)';
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: ONBOARDING_CONFIG.BACKGROUND.OVERLAY_GRADIENT,
              opacity: ONBOARDING_CONFIG.BACKGROUND.OVERLAY_OPACITY
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default StandardizedCompass;
