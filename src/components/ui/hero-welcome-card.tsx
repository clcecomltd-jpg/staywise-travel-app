import React from 'react';
import { Home, LogIn, LogOut, Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';
import { cn } from '../../lib/utils';

// Define the props type as specified in the prompt
export type HeroWelcomeCardProps = {
  guestName?: string;
  propertyName: string;
  checkInTime: string;
  checkOutTime: string;
  temperatureC?: number;
  weatherIcon?: "sun" | "cloud" | "rain" | "storm" | "partly";
  onPropertyClick?: () => void;
  className?: string;
  tone?: 'dark' | 'light';
  headline?: string;
  subheadline?: string;
  "data-testid"?: string;
};

export const HeroWelcomeCard: React.FC<HeroWelcomeCardProps> = ({
  guestName = 'Guest',
  propertyName,
  checkInTime,
  checkOutTime,
  temperatureC,
  weatherIcon = 'sun',
  onPropertyClick,
  className = '',
  tone = 'dark',
  headline,
  subheadline,
  ...rest
}) => {
  const isDark = tone === 'dark';
  const headlineText = headline ?? `Welcome Home, ${guestName}`;

  const WeatherIcon = (() => {
    switch (weatherIcon) {
      case 'cloud': return Cloud;
      case 'rain': return CloudRain;
      case 'storm': return CloudLightning;
      case 'partly': return Sun;
      default: return Sun;
    }
  })();

  return (
    <section
      role="region"
      aria-labelledby="home-topcard-title"
      className={cn(
        'relative overflow-hidden rounded-3xl animate-fade-in shadow-2xl',
        'px-6 py-6',
        'transition-all duration-300',
        'hover:shadow-2xl hover:-translate-y-[1px]',
        'backdrop-blur-xl border border-white/10',
        isDark
          ? 'bg-gradient-to-br from-slate-900/80 to-blue-900/60'
          : 'bg-gradient-to-br from-white/80 to-blue-50/60',
        className
      )}
      style={{ 
        minHeight: '240px',
        background: isDark 
          ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 58, 138, 0.6) 100%), url("https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5na29rJTIwc2t5bGluZXxlbnwwfHx8fDE3NTY2MTY4ODd8MA&auto=format&fit=crop&w=1000&q=80") center/cover'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(239, 246, 255, 0.6) 100%), url("https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5na29rJTIwc2t5bGluZXxlbnwwfHx8fDE3NTY2MTY4ODd8MA&auto=format&fit=crop&w=1000&q=80") center/cover'
      }}
      {...rest}
    >
      {/* iOS 26 Liquid Glass Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-white/5" />
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent via-white/10 to-white/20" />
      
      {/* Blue glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/10" />
      
      {/* Bangkok skyline overlay */}
      <div className="absolute right-0 top-0 w-32 h-full opacity-20">
        <div 
          className="w-full h-full rounded-l-3xl"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5na29rJTIwc2t5bGluZXxlbnwwfHx8fDE3NTY2MTY4ODd8MA&auto=format&fit=crop&w=500&q=80")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.7) contrast(1.2)'
          }}
        />
        <div className="absolute inset-0 rounded-l-3xl bg-gradient-to-l from-transparent to-blue-900/40" />
      </div>
      
      <div className="relative z-10 h-full flex flex-col justify-between space-y-3">
        {/* Top Section: Header with StayWise branding and Weather */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h1
              id="home-topcard-title"
              className={cn(
                'text-3xl font-black leading-tight',
                isDark ? 'text-white drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]' : 'text-blue-900'
              )}
              style={{ 
                textShadow: isDark 
                  ? '2px 2px 4px rgba(0,0,0,0.6), 0 0 12px rgba(59, 130, 246, 0.3)' 
                  : '1px 1px 2px rgba(0,0,0,0.2)',
                fontFamily: 'serif'
              }}>
              {headlineText}
            </h1>
            
            {subheadline && (
              <p className={cn(
                'mt-1 text-sm leading-relaxed',
                isDark ? 'text-blue-200' : 'text-blue-700'
              )}>
                {subheadline}
              </p>
            )}
          </div>
          
          {/* Weather — Top Right */}
          <div className="flex flex-col items-end">
            <WeatherIcon
              className={cn(
                'h-6 w-6 drop-shadow-lg',
                isDark ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'text-blue-600 drop-shadow-[0_0_4px_rgba(59,130,246,0.4)]'
              )}
              aria-hidden="true"
            />
            {typeof temperatureC === 'number' && (
              <div className={cn(
                'mt-1 text-sm font-bold tabular-nums',
                isDark ? 'text-blue-100' : 'text-blue-900'
              )}>
                {Math.round(temperatureC)}°
              </div>
            )}
          </div>
        </div>

        {/* Postcard-style separator line with decorative elements */}
        <div className="flex items-center space-x-2">
          <div className={cn(
            'h-px flex-1',
            isDark 
              ? 'bg-gradient-to-r from-transparent via-blue-400/60 to-transparent' 
              : 'bg-gradient-to-r from-transparent via-blue-500/60 to-transparent'
          )} />
          <div className={cn(
            'w-2 h-2 rounded-full',
            isDark ? 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-blue-500 shadow-[0_0_4px_rgba(59,130,246,0.4)]'
          )} />
          <div className={cn(
            'h-px flex-1',
            isDark 
              ? 'bg-gradient-to-r from-transparent via-blue-400/60 to-transparent' 
              : 'bg-gradient-to-r from-transparent via-blue-500/60 to-transparent'
          )} />
        </div>

        {/* Bottom Section: Property Button and Check-in/out on same line */}
        <div className="flex items-center justify-between space-x-3">
          {/* Property Name Button */}
          <button
            type="button"
            onClick={onPropertyClick}
            className={cn(
              'flex-1 h-10 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.02]',
              isDark
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-500 hover:to-indigo-600'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-400 hover:to-indigo-500'
            )}
            style={{
              boxShadow: isDark 
                ? '0 4px 12px rgba(59, 130, 246, 0.3)' 
                : '0 4px 12px rgba(59, 130, 246, 0.2)'
            }}
            aria-label={`Open property: ${propertyName}`}
          >
            {propertyName}
          </button>

          {/* Check-in / Check-out Dates */}
          <div className="flex items-center space-x-3">
            {/* Check-in */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <LogIn className={cn(
                  'w-3 h-3',
                  isDark ? 'text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]' : 'text-blue-600 drop-shadow-[0_0_3px_rgba(59,130,246,0.4)]'
                )} />
                <p className={cn(
                  'text-xs uppercase tracking-wide font-semibold',
                  isDark ? 'text-blue-200' : 'text-blue-700'
                )}>Check-in</p>
              </div>
              <p className={cn(
                'text-base font-bold',
                isDark ? 'text-white drop-shadow-[0_0_6px_rgba(59,130,246,0.3)]' : 'text-blue-900'
              )}>{checkInTime}</p>
            </div>

            {/* Divider */}
            <div className={cn(
              'h-5 w-px',
              isDark ? 'bg-blue-400/40' : 'bg-blue-500/40'
            )} />

            {/* Check-out */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <LogOut className={cn(
                  'w-3 h-3',
                  isDark ? 'text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]' : 'text-blue-600 drop-shadow-[0_0_3px_rgba(59,130,246,0.4)]'
                )} />
                <p className={cn(
                  'text-xs uppercase tracking-wide font-semibold',
                  isDark ? 'text-blue-200' : 'text-blue-700'
                )}>Check-out</p>
              </div>
              <p className={cn(
                'text-base font-bold',
                isDark ? 'text-white drop-shadow-[0_0_6px_rgba(59,130,246,0.3)]' : 'text-blue-900'
              )}>{checkOutTime}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroWelcomeCard;
