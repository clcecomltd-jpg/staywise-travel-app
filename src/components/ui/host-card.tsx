import React from 'react';
import { User, Star, Users, Calendar, DollarSign } from 'lucide-react';

interface HostCardProps {
  hostName?: string;
  isOnline?: boolean;
  isSuperHost?: boolean;
  guestsToday?: number;
  totalBookings?: number;
  monthlyEarnings?: number;
  onHostClick?: () => void;
  className?: string;
}

export const HostCard: React.FC<HostCardProps> = ({
  hostName = 'Sarah Chen',
  isOnline = true,
  isSuperHost = true,
  guestsToday = 8,
  totalBookings = 247,
  monthlyEarnings = 3240,
  onHostClick,
  className = ''
}) => {
  return (
    <button
      onClick={onHostClick}
      className={`w-full glass-card rounded-2xl p-6 text-left hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group ${className}`}
    >
      {/* Subtle golden glow overlay - adapts to theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-amber-500/5 rounded-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 dark:from-yellow-400/8 dark:to-amber-400/8" />
      
      {/* Gentle pulsing glow effect - adapts to theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/3 via-transparent to-amber-400/3 rounded-2xl animate-pulse dark:from-yellow-400/5 dark:to-amber-400/5" style={{ animationDuration: '3s' }} />
      
      <div className="relative z-10 space-y-4">
        {/* Host Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Host Profile Icon */}
            <div className="w-12 h-12 rounded-full glass-button flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/15 dark:to-purple-400/15">
              <User className="w-6 h-6 text-blue-300 dark:text-blue-200" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white/95 dark:text-white/95 light:text-foreground">{hostName}</h3>
              <div className="flex items-center space-x-2">
                {/* Online Status */}
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'} ${isOnline ? 'animate-pulse' : ''}`} />
                <span className="text-sm text-white/70 dark:text-white/70 light:text-muted-foreground">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Super Host Badge */}
          {isSuperHost && (
            <div className="relative">
              {/* Subtle glow for Super Host badge */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/15 to-amber-500/15 rounded-lg blur-sm animate-pulse" style={{ animationDuration: '2s' }} />
              <div className="relative px-3 py-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-lg border border-yellow-400/15 backdrop-blur-sm dark:from-yellow-500/20 dark:to-amber-500/20 dark:border-yellow-400/25">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium text-yellow-200 dark:text-yellow-200 light:text-yellow-600">Super Host</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Guests Today */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-medium text-white/95 dark:text-white/95 light:text-foreground">{guestsToday}</div>
            <div className="text-xs text-white/60 dark:text-white/60 light:text-muted-foreground">Today</div>
          </div>
          
          {/* Total Bookings */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-xl font-medium text-white/95 dark:text-white/95 light:text-foreground">{totalBookings}</div>
            <div className="text-xs text-white/60 dark:text-white/60 light:text-muted-foreground">Bookings</div>
          </div>
          
          {/* Monthly Earnings */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-medium text-white/95 dark:text-white/95 light:text-foreground">${monthlyEarnings.toLocaleString()}</div>
            <div className="text-xs text-white/60 dark:text-white/60 light:text-muted-foreground">This Month</div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default HostCard;