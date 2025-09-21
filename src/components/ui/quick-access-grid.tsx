import React from 'react';
import { Wifi, MapPin, Navigation, FileText, Heart, AlertTriangle, Grid2X2 } from 'lucide-react';

interface QuickAccessItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}

interface QuickAccessGridProps {
  onItemClick?: (itemId: string) => void;
  onViewAllClick?: () => void;
  className?: string;
}

export const QuickAccessGrid: React.FC<QuickAccessGridProps> = ({
  onItemClick,
  onViewAllClick,
  className = ''
}) => {
  const quickAccessItems: QuickAccessItem[] = [
    {
      id: 'wifi',
      icon: <Wifi className="w-8 h-8 text-blue-400" />,
      title: 'Wi-Fi',
      onClick: () => onItemClick?.('wifi')
    },
    {
      id: 'checkin',
      icon: <MapPin className="w-8 h-8 text-green-400" />,
      title: 'Check-In Guide',
      onClick: () => onItemClick?.('checkin')
    },
    {
      id: 'directions',
      icon: <Navigation className="w-8 h-8 text-purple-400" />,
      title: 'Directions',
      onClick: () => onItemClick?.('directions')
    },
    {
      id: 'rules',
      icon: <FileText className="w-8 h-8 text-orange-400" />,
      title: 'House Rules',
      onClick: () => onItemClick?.('rules')
    },
    {
      id: 'tips',
      icon: <Heart className="w-8 h-8 text-pink-400" />,
      title: 'Local Tips',
      onClick: () => onItemClick?.('tips')
    }
  ];

  return (
    <div className={`${className}`}>
      {/* Fixed 3×2 Grid Layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* First Row */}
        {quickAccessItems.slice(0, 3).map((item, index) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center hover:-translate-y-1 transition-all duration-300 animate-fade-in h-28"
            style={{ animationDelay: `${200 + index * 120}ms` }}
          >
            <div className="mb-3 opacity-90 hover:opacity-100 transition-opacity">
              {React.cloneElement(item.icon as React.ReactElement, { className: "w-9 h-9 text-current" })}
            </div>
            <span className="text-base font-medium text-white/95 text-center leading-tight">
              {item.title}
            </span>
          </button>
        ))}
        
        {/* Second Row */}
        {quickAccessItems.slice(3, 5).map((item, index) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center hover:-translate-y-1 transition-all duration-300 animate-fade-in h-28"
            style={{ animationDelay: `${500 + index * 120}ms` }}
          >
            <div className="mb-3 opacity-90 hover:opacity-100 transition-opacity">
              {React.cloneElement(item.icon as React.ReactElement, { className: "w-9 h-9 text-current" })}
            </div>
            <span className="text-base font-medium text-white/95 text-center leading-tight">
              {item.title}
            </span>
          </button>
        ))}
        
        {/* View All with 2×2 Grid Icon - Third position in second row */}
        <button
          onClick={onViewAllClick}
          className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center hover:-translate-y-1 transition-all duration-300 animate-fade-in h-28"
          style={{ animationDelay: '620ms' }}
        >
          <div className="mb-3 opacity-90 hover:opacity-100 transition-opacity">
            <Grid2X2 className="w-9 h-9 text-indigo-400" />
          </div>
          <span className="text-base font-medium text-white/95 text-center leading-tight">
            View All
          </span>
        </button>
      </div>
    </div>
  );
};

export default QuickAccessGrid;