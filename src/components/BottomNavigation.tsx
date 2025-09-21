import React from 'react';
import { Home, Compass, Heart, User } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: Compass
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Heart,
      badge: 3
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User
    }
  ];

  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2">
      <div className="glass-nav py-2 px-4 safe-area-inset-bottom">
        <div className="flex items-center justify-around">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center space-y-1 py-2 px-3 rounded-xl relative transition-all duration-300"
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive
                        ? 'text-[#007AFF]'
                        : isDarkMode
                          ? 'text-white/60'
                          : 'text-gray-500'
                    }`}
                  />
                  {item.badge && item.badge > 0 && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs animate-pulse">
                      {item.badge > 9 ? '9+' : item.badge}
                    </div>
                  )}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isActive
                      ? 'text-[#007AFF]'
                      : isDarkMode
                        ? 'text-white/60'
                        : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 w-6 h-0.5 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#007AFF] to-blue-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
