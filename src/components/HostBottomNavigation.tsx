import React from 'react';
import { BarChart3, Calendar, Users, MessageCircle, DollarSign } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface HostBottomNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  unreadMessages?: number;
  pendingBookings?: number;
  newNotifications?: number;
}

const HostBottomNavigation: React.FC<HostBottomNavigationProps> = ({
  activeTab,
  onTabChange,
  unreadMessages = 0,
  pendingBookings = 0,
  newNotifications = 0
}) => {
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: Calendar,
      badge: pendingBookings
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageCircle,
      badge: unreadMessages
    },
    {
      id: 'earnings',
      label: 'Earnings',
      icon: DollarSign
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-nav">
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 relative min-w-0 flex-1 ${
                isActive 
                  ? 'text-white scale-105 glass-button' 
                  : 'text-white/60 hover:text-white/90 hover:scale-105'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 mb-1 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs animate-pulse">
                    {item.badge > 9 ? '9+' : item.badge}
                  </div>
                )}
              </div>
              <span className={`text-xs leading-none transition-all duration-200 ${isActive ? 'font-medium' : ''}`}>{item.label}</span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white/80 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HostBottomNavigation;