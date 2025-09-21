import React from 'react';
import { 
  Compass, 
  Heart, 
  MessageCircle, 
  MapPin, 
  Wifi, 
  Utensils,
  LucideIcon
} from 'lucide-react';
import { useDeepLinks, DeepLinkKey } from '../../hooks/useDeepLinks';
import { GRID_LINKS } from '../../data/grid.links';

export interface QuickActionsGridProps {
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  compass: Compass,
  heart: Heart,
  'message-circle': MessageCircle,
  'map-pin': MapPin,
  wifi: Wifi,
  utensils: Utensils
};

const QuickActionTile: React.FC<{
  icon: string;
  label: string;
  description: string;
  onClick: () => void;
  index: number;
}> = ({ icon, label, description, onClick, index }) => {
  const IconComponent = iconMap[icon] || Compass;
  
  return (
    <button
      onClick={onClick}
      className={`
        relative rounded-xl p-4 text-left group overflow-hidden
        transform-gpu transition-all duration-300
        hover:scale-[0.98] active:scale-95
        motion-reduce:transform-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100
        grid-row-animate
      `}
      style={{
        animationDelay: `${Math.floor(index / 3) * 0.4 + (index % 3) * 0.1}s`,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: `
          0 8px 16px rgba(0,0,0,0.1),
          0 4px 8px rgba(0,0,0,0.05),
          inset 0 1px 0 rgba(255,255,255,0.1),
          inset 0 -1px 0 rgba(0,0,0,0.1)
        `
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.boxShadow = `
          0 4px 8px rgba(0,0,0,0.2),
          0 2px 4px rgba(0,0,0,0.1),
          inset 0 1px 0 rgba(255,255,255,0.05),
          inset 0 -1px 0 rgba(0,0,0,0.2)
        `;
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.boxShadow = `
          0 8px 16px rgba(0,0,0,0.1),
          0 4px 8px rgba(0,0,0,0.05),
          inset 0 1px 0 rgba(255,255,255,0.1),
          inset 0 -1px 0 rgba(0,0,0,0.1)
        `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `
          0 8px 16px rgba(0,0,0,0.1),
          0 4px 8px rgba(0,0,0,0.05),
          inset 0 1px 0 rgba(255,255,255,0.1),
          inset 0 -1px 0 rgba(0,0,0,0.1)
        `;
      }}
      aria-label={`${label}: ${description}`}
    >
      {/* Inner highlight */}
      <div
        className="absolute inset-px rounded-[11px] opacity-50"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)'
        }}
      />
      
      {/* 3D Icon Container with layered depth */}
      <div
        className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.3) 100%)',
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.3),
            inset 0 -1px 0 rgba(0,0,0,0.2),
            0 4px 8px rgba(59,130,246,0.2)
          `
        }}
      >
        {/* Icon with subtle 3D effect */}
        <div
          className="relative"
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
          }}
        >
          <IconComponent
            className="w-6 h-6 text-blue-300 dark:text-blue-300 light:text-blue-600"
            aria-hidden="true"
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 space-y-1">
        <h3 className="font-semibold text-white dark:text-white light:text-gray-900 group-hover:text-white/95 transition-colors duration-200">
          {label}
        </h3>
        <p className="text-sm text-white/70 dark:text-white/70 light:text-gray-600 group-hover:text-white/80 line-clamp-2 transition-colors duration-200">
          {description}
        </p>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)',
            boxShadow: '0 0 20px rgba(59,130,246,0.3)'
          }}
        />
      </div>
    </button>
  );
};

const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ className = "" }) => {
  const { navigate } = useDeepLinks();

  const handleTileClick = (key: DeepLinkKey) => {
    // Add haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    navigate(key);
  };

  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-lg font-bold text-white dark:text-white light:text-gray-900 mb-4 px-1">
        Quick Actions
      </h2>
      
      {/* Grid: 2×3 on mobile, 3×2 on larger screens */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {GRID_LINKS.map((link, index) => (
          <QuickActionTile
            key={link.key}
            icon={link.icon}
            label={link.label}
            description={link.description}
            onClick={() => handleTileClick(link.key)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActionsGrid;
