import React, { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import ProfileScreen from './screens/ProfileScreen';
import CheckInScreen from './screens/CheckInScreen';
import WifiScreen from './screens/WifiScreen';
import EssentialsScreen from './screens/EssentialsScreen';
import ChatScreen from './screens/ChatScreen';
import PropertyScreen from './screens/PropertyScreen';
import HostRecommendationsScreen from './screens/HostRecommendationsScreen';
import SettingsScreen from './screens/SettingsScreen';
import BottomNavigation from './BottomNavigation';

interface OnboardingData {
  mode: 'guest' | 'host';
  tripPurpose?: string[];
  preferences?: string[];
  propertyProvider?: string;
  hostGoals?: string[];
}

interface MainAppProps {
  onBackToOnboarding?: () => void;
  onboardingData?: OnboardingData;
}

const MainApp: React.FC<MainAppProps> = ({ onBackToOnboarding, onboardingData }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState<string | null>(null);

  const handleNavigateToScreen = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleBackToHome = () => {
    setCurrentScreen(null);
    setActiveTab('home');
  };

  const handleReturnToHome = () => {
    setCurrentScreen(null);
    setActiveTab('home');
  };

  const handleQuickAccessClick = (itemId: string) => {
    switch (itemId) {
      case 'wifi':
        setCurrentScreen('wifi');
        break;
      case 'checkin':
        setCurrentScreen('checkin');
        break;
      case 'directions':
      case 'tips':
        setActiveTab('explore');
        break;
      case 'rules':
      case 'emergency':
        setCurrentScreen('essentials');
        break;
      default:
        break;
    }
  };

  const handleViewAllClick = () => {
    setActiveTab('explore');
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentScreen(null); // Clear any specific screen when switching tabs
  };

  const handlePropertyClick = () => {
    setCurrentScreen('property');
  };

  const renderActiveScreen = () => {
    // If we have a specific screen to show (like CheckIn, WiFi, Property, Essentials, or Chat), show that instead
    if (currentScreen === 'checkin') {
      return <CheckInScreen onBack={handleBackToHome} onBackToOnboarding={onBackToOnboarding} />;
    }
    if (currentScreen === 'wifi') {
      return <WifiScreen onBack={handleBackToHome} onBackToOnboarding={onBackToOnboarding} />;
    }
    if (currentScreen === 'property') {
      return (
        <PropertyScreen 
          onBack={handleBackToHome}
          onNavigateToChat={() => setCurrentScreen('chat')}
          onNavigateToMap={() => setActiveTab('favorites')}
          onNavigateToExplore={() => setActiveTab('explore')}
          onBackToOnboarding={onBackToOnboarding}
        />
      );
    }
    if (currentScreen === 'essentials') {
      return <EssentialsScreen onBack={handleBackToHome} onBackToOnboarding={onBackToOnboarding} />;
    }
    if (currentScreen === 'chat') {
      return <ChatScreen onBack={handleBackToHome} onBackToOnboarding={onBackToOnboarding} />;
    }
    if (currentScreen === 'host-recommendations') {
      return <HostRecommendationsScreen onBack={handleBackToHome} onBackToOnboarding={onBackToOnboarding} />;
    }
    if (currentScreen === 'settings') {
      return <SettingsScreen onBack={handleBackToHome} onBackToOnboarding={onBackToOnboarding} />;
    }

    // Otherwise, show the regular tab-based screens
    const baseContainerClass = 'min-h-screen w-full pb-28';

    switch (activeTab) {
      case 'home':
        return (
          <div className={baseContainerClass}>
            <HomeScreen
              onNavigate={handleNavigateToScreen}
              onBackToOnboarding={onBackToOnboarding}
              mode="guest"
              onboardingData={onboardingData}
            />
          </div>
        );
      case 'explore':
        return (
          <div className={baseContainerClass}>
            <ExploreScreen />
          </div>
        );
      case 'favorites':
        return (
          <div className={baseContainerClass}>
            <FavoritesScreen />
          </div>
        );
      case 'profile':
        return (
          <div className={baseContainerClass}>
            <ProfileScreen />
          </div>
        );
      default:
        return (
          <div className={baseContainerClass}>
            <HomeScreen
              onNavigate={handleNavigateToScreen}
              onBackToOnboarding={onBackToOnboarding}
              mode="guest"
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen app-background transition-colors duration-300">
      <main className="flex-1">
        {renderActiveScreen()}
      </main>
      
      {/* Use the external BottomNavigation component only when not showing specific screens */}
      {!currentScreen && (
        <BottomNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
        />
      )}
    </div>
  );
};

export default MainApp;
