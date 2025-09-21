import React from 'react';
import { Home, Search, Heart, User } from 'lucide-react';

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

interface GlassBottomNavProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export const GlassBottomNav: React.FC<GlassBottomNavProps> = ({
  activeTab = 'home',
  onTabChange,
  className = ''
}) => {
  const navItems: NavItem[] = [
    {
      id: 'home',
      icon: <Home className="w-5 h-5" />,
      label: 'Home',
      active: activeTab === 'home'
    },
    {
      id: 'explore',
      icon: <Search className="w-5 h-5" />,
      label: 'Explore',
      active: activeTab === 'explore'
    },
    {
      id: 'favorites',
      icon: <Heart className="w-5 h-5" />,
      label: 'Favorites',
      active: activeTab === 'favorites'
    },
    {
      id: 'profile',
      icon: <User className="w-5 h-5" />,
      label: 'Profile',
      active: activeTab === 'profile'
    }
  ];

  return (
    <div className={`glass-nav fixed bottom-0 left-0 right-0 px-5 py-3 safe-area-inset-bottom ${className}`}>
      <div className="flex items-center justify-around max-w-[430px] mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange?.(item.id)}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-all duration-300 relative ${
              item.active 
                ? 'text-white scale-105' 
                : 'text-white/70 hover:text-white/90 hover:scale-105'
            }`}
          >
            {/* Active state gradient underline */}
            {item.active && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-fade-in" />
            )}
            
            <div className={`transition-all duration-200 ${item.active ? 'scale-110' : ''}`}>
              {item.icon}
            </div>
            
            <span className="text-xs font-medium">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlassBottomNav;