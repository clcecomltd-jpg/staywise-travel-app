import React from 'react';
import { Home, Bell, User2 } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

interface StayWiseHeaderProps {
  onLogoClick?: () => void;
  notificationCount?: number;
  userAvatar?: string;
  userName?: string;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

const StayWiseHeader: React.FC<StayWiseHeaderProps> = ({
  onLogoClick,
  notificationCount = 0,
  userAvatar,
  userName = 'Host',
  onNotificationClick,
  onProfileClick
}) => {
  return (
    <div className="sticky top-0 z-50 glass-header">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* StayWise Logo & Wordmark */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={onLogoClick}
          >
            <div className="w-10 h-10 glass-float rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Home className="w-5 h-5 text-white/90" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-white/95 group-hover:text-white transition-colors">
                StayWise
              </h1>
              <p className="text-xs text-white/60 -mt-1">Travel Guide</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button 
              className="glass-button h-9 w-9 rounded-lg flex items-center justify-center relative hover:scale-105 transition-transform"
              onClick={onNotificationClick}
            >
              <Bell className="w-4 h-4 text-white/80" />
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </div>
              )}
            </button>

            {/* Profile Avatar */}
            <div 
              className="w-9 h-9 glass-button rounded-full cursor-pointer hover:scale-105 transition-all overflow-hidden" 
              onClick={onProfileClick}
            >
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/90 text-sm font-medium">
                  {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StayWiseHeader;