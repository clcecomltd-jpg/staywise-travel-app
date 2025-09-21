import React from 'react';
import { GlassTopBar } from '../ui/glass-top-bar';
import { HeroWelcomeCard } from '../ui/hero-welcome-card';
import { QuickAccessGrid } from '../ui/quick-access-grid';
import { HostCard } from '../ui/host-card';
import { GlassBottomNav } from '../ui/glass-bottom-nav';

interface WelcomeScreenProps {
  userName?: string;
  propertyName?: string;
  checkInDate?: string;
  checkOutDate?: string;
  darkMode?: boolean;
  activeTab?: string;
  onLogoClick?: () => void;
  onDarkModeToggle?: () => void;
  onPropertyClick?: () => void;
  onQuickAccessClick?: (itemId: string) => void;
  onViewAllClick?: () => void;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  userName = 'Guest',
  propertyName = 'Sunset Villa Bangkok',
  checkInDate = 'Dec 25',
  checkOutDate = 'Dec 28',
  darkMode = false,
  activeTab = 'home',
  onLogoClick,
  onDarkModeToggle,
  onPropertyClick,
  onQuickAccessClick,
  onViewAllClick,
  onTabChange,
  className = ''
}) => {
  return (
    <div className={`min-h-screen w-full max-w-[430px] mx-auto app-background relative ${className}`}>
      {/* Top Bar - Liquid Glass Header */}
      <GlassTopBar
        sectionName="Home"
        onLogoClick={onLogoClick}
        darkMode={darkMode}
        onDarkModeToggle={onDarkModeToggle}
      />

      {/* Main Content Area */}
      <div className="px-5 pb-24 space-y-6">
        {/* Hero Card - Welcome Section */}
        <div className="pt-6">
          <HeroWelcomeCard
            userName={userName}
            propertyName={propertyName}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            onPropertyClick={onPropertyClick}
            tone={darkMode ? 'dark' : 'light'}
          />
        </div>

        {/* Quick Access Grid - 3×2 Layout */}
        <div>
          <QuickAccessGrid
            onItemClick={onQuickAccessClick}
            onViewAllClick={onViewAllClick}
          />
        </div>

        {/* Enhanced Host Card */}
        <div>
          <HostCard
            hostName="Sarah Chen"
            isOnline={true}
            isSuperHost={true}
            guestsToday={8}
            totalBookings={247}
            monthlyEarnings={3240}
            onHostClick={() => onQuickAccessClick?.('chat')}
          />
        </div>
      </div>

      {/* Bottom Navigation - Liquid Glass */}
      <GlassBottomNav
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
  );
};

export default WelcomeScreen;
