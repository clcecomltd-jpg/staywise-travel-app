import React from 'react';
import { Home, Clock, Thermometer } from 'lucide-react';

export interface HomeTopCardProps {
  guestName?: string;
  propertyName: string;
  checkInTime: string;
  checkOutTime: string;
  temperatureC?: number;
  weatherIcon?: "sun" | "cloud" | "rain" | "storm" | "partly";
  onPropertyClick?: () => void;
  className?: string;
}

const WeatherIcon: React.FC<{ type: HomeTopCardProps['weatherIcon'] }> = ({ type }) => {
  const iconMap = {
    sun: '☀️',
    cloud: '☁️',
    rain: '🌧️',
    storm: '⛈️',
    partly: '⛅'
  };
  
  return <span className="text-2xl" aria-hidden="true">{iconMap[type || 'sun']}</span>;
};

const HomeTopCard: React.FC<HomeTopCardProps> = ({
  guestName = "Guest",
  propertyName,
  checkInTime,
  checkOutTime,
  temperatureC,
  weatherIcon = "sun",
  onPropertyClick,
  className = ""
}) => {
  return (
    <div
      className={`relative glass-card glass-shimmer rounded-2xl p-6 mb-6 safe-area-inset-top overflow-hidden ${className}`}
      role="region"
      aria-labelledby="welcome-heading"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 20px rgba(255,165,0,0.1), 0 0 40px rgba(255,165,0,0.05)',
        borderRadius: '20px'
      }}
    >
      {/* Warm micro-glow top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-60"
        style={{
          background: 'linear-gradient(90deg, rgba(255,165,0,0.3) 0%, rgba(255,215,0,0.2) 50%, rgba(255,165,0,0.3) 100%)',
          filter: 'blur(2px)'
        }}
      />
      {/* Warm micro-glow bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-60"
        style={{
          background: 'linear-gradient(90deg, rgba(255,165,0,0.3) 0%, rgba(255,215,0,0.2) 50%, rgba(255,165,0,0.3) 100%)',
          filter: 'blur(2px)'
        }}
      />
      {/* Welcome Header */}
      <div className="mb-4">
        <h1 
          id="welcome-heading"
          className="text-xl font-bold text-white dark:text-white light:text-gray-900 mb-1"
        >
          Welcome Home, {guestName}
        </h1>
        
        {/* Property Button */}
        <button
          onClick={onPropertyClick}
          className="glass-button px-4 py-2 rounded-full flex items-center gap-2 hover:scale-105 transition-transform duration-200 button-press"
          aria-label={`View details for ${propertyName}`}
        >
          <Home className="w-4 h-4 text-blue-400" aria-hidden="true" />
          <span className="text-sm font-medium text-white dark:text-white light:text-gray-800">
            {propertyName}
          </span>
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/20 dark:bg-white/20 light:bg-gray-200 mb-4" />

      {/* Check-in/out and Weather Row */}
      <div className="flex items-center justify-between">
        {/* Check-in/out Times */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-400 light:text-blue-500" aria-hidden="true" />
            <div className="text-sm">
              <span className="text-white/70 dark:text-white/70 light:text-gray-600">Check-in</span>
              <div className="font-mono font-medium text-white dark:text-white light:text-gray-900">
                {checkInTime}
              </div>
            </div>
          </div>
          
          <div className="w-px h-8 bg-white/20 dark:bg-white/20 light:bg-gray-200" />
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400 light:text-blue-500" aria-hidden="true" />
            <div className="text-sm">
              <span className="text-white/70 dark:text-white/70 light:text-gray-600">Check-out</span>
              <div className="font-mono font-medium text-white dark:text-white light:text-gray-900">
                {checkOutTime}
              </div>
            </div>
          </div>
        </div>

        {/* Weather */}
        {temperatureC && (
          <div className="flex items-center gap-2">
            <WeatherIcon type={weatherIcon} />
            <div className="text-right">
              <div className="font-mono font-bold text-lg text-white dark:text-white light:text-gray-900">
                {temperatureC}°C
              </div>
              <div className="text-xs text-white/60 dark:text-white/60 light:text-gray-500">
                Current
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeTopCard;
