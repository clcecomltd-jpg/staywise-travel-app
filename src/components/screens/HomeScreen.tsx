import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { HeroWelcomeCard } from '../ui/hero-welcome-card';
import { QuickAccessGrid } from '../ui/quick-access-grid';
import { SectionHeroBanner } from '../ui/section-hero-banner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useTheme } from '../contexts/ThemeContext';
import { recommendationService } from '../../services/recommendationService';
import { toast } from 'sonner';
import OfflineBadge from '../OfflineBadge';
import OfflineInfo from '../OfflineInfo';
import ScreenHeader from '../ScreenHeader';

// Mock recommendations data for Explore section
const mockRecommendations = [
  {
    id: "1",
    category: "food",
    title: "Thai Cooking Class",
    description: "Learn authentic recipes with a local chef",
    price: 50,
    currency: "USD",
    imageUrl: "/mock/cooking.jpg"
  },
  {
    id: "2",
    category: "tours",
    title: "Canal Boat Ride",
    description: "Explore Bangkok's hidden waterways",
    price: 30,
    currency: "USD",
    imageUrl: "/mock/boat.jpg"
  },
  {
    id: "3",
    category: "events",
    title: "Night Market Festival",
    description: "15,000 stalls of food and crafts",
    price: 0,
    currency: "FREE",
    imageUrl: "/mock/market.jpg"
  },
  {
    id: "4",
    category: "food",
    title: "Street Food Tour",
    description: "Authentic local street food experience",
    price: 25,
    currency: "USD",
    imageUrl: "/mock/street-food.jpg"
  },
  {
    id: "5",
    category: "tours",
    title: "Temple Exploration",
    description: "Visit ancient temples and learn history",
    price: 40,
    currency: "USD",
    imageUrl: "/mock/temple.jpg"
    }
  ];
  
  // Mock favorites data for Favorites section
  const mockFavorites = [
    {
      id: 'place_1',
      title: 'Café Vanille',
      category: 'Café',
      type: 'cafes',
      emoji: '☕',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
      rating: 4.7,
      reviewCount: 245,
      distance: '300m',
      address: '123 Main Street, Downtown',
      openingHours: 'Open until 9 PM',
      savedDate: '2024-01-15'
    },
    {
      id: 'place_2',
      title: 'Bor Pen Nyang',
      category: 'Bar',
      type: 'bars',
      emoji: '🍸',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
      rating: 4.4,
      reviewCount: 378,
      distance: '800m',
      address: '456 Sunset Boulevard',
      openingHours: 'Open until 2 AM',
      savedDate: '2024-01-12'
    },
    {
      id: 'place_3',
      title: 'Night Market',
      category: 'Attraction',
      type: 'attractions',
      emoji: '🗺️',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      rating: 4.6,
      reviewCount: 1205,
      distance: '1.2 km',
      address: '789 Market Street',
      openingHours: 'Open 6 PM - 12 AM',
      savedDate: '2024-01-10'
    }
  ];

// Currency Picker Dropdown Component
const CurrencyPickerDropdown: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onSelect: (currency: string) => void;
  currentCurrency: string;
  isDarkMode: boolean;
}> = ({ isOpen, onClose, onSelect, currentCurrency, isDarkMode }) => {
  if (!isOpen) return null;

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' }
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-12 right-0 z-50 w-56 glass-card rounded-2xl p-3 dropdown-slide">
        <div className="space-y-1">
          <div className={`px-3 py-2 text-xs font-medium uppercase tracking-wide ${
            isDarkMode ? 'text-white/60' : 'text-gray-600'
          }`}>
            Select Currency
          </div>
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => { onSelect(currency.code); onClose(); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${
                currentCurrency === currency.code 
                  ? 'bg-[#007AFF]/20 text-[#007AFF]' 
                  : isDarkMode 
                    ? 'hover:bg-white/10 text-white/90' 
                    : 'hover:bg-black/5 text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{currency.symbol}</span>
                <div>
                  <div className="text-sm font-medium">{currency.code}</div>
                  <div className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                    {currency.name}
                  </div>
                </div>
              </div>
              {currentCurrency === currency.code && (
                <div className="w-2 h-2 bg-[#007AFF] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

// Language Picker Dropdown Component
const LanguagePickerDropdown: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onSelect: (language: string) => void;
  currentLanguage: string;
  isDarkMode: boolean;
}> = ({ isOpen, onClose, onSelect, currentLanguage, isDarkMode }) => {
  if (!isOpen) return null;

  const languages = [
    { code: 'en', flag: '🇺🇸', name: 'English' },
    { code: 'th', flag: '🇹🇭', name: 'ไทย' },
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
    { code: 'ja', flag: '🇯🇵', name: '日本語' },
    { code: 'ko', flag: '🇰🇷', name: '한국어' },
    { code: 'zh', flag: '🇨🇳', name: '中文' }
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-12 right-0 z-50 w-56 glass-card rounded-2xl p-3 dropdown-slide">
        <div className="space-y-1">
          <div className={`px-3 py-2 text-xs font-medium uppercase tracking-wide ${
            isDarkMode ? 'text-white/60' : 'text-gray-600'
          }`}>
            Select Language
          </div>
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => { onSelect(language.code); onClose(); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${
                currentLanguage === language.code 
                  ? 'bg-[#007AFF]/20 text-[#007AFF]' 
                  : isDarkMode 
                    ? 'hover:bg-white/10 text-white/90' 
                    : 'hover:bg-black/5 text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg" aria-label={`${language.name} flag`}>
                  {language.flag}
                </span>
                <div className={`text-sm font-medium ${
                  currentLanguage === language.code ? 'text-[#007AFF]' : ''
                }`}>
                  {language.name}
                </div>
              </div>
              {currentLanguage === language.code && (
                <div className="w-2 h-2 bg-[#007AFF] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

// Settings Dropdown Component
const SettingsDropdown: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onNavigate?: (screen: string) => void;
  onShowCurrency: () => void;
  onShowLanguage: () => void;
  isDarkMode: boolean;
}> = ({ isOpen, onClose, onNavigate, onShowCurrency, onShowLanguage, isDarkMode }) => {
  if (!isOpen) return null;

  const handleLogout = () => {
    onNavigate?.('onboarding');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-12 right-0 z-50 w-48 glass-card rounded-2xl p-3 dropdown-slide">
        <div className="space-y-2">
          <button
            onClick={() => { onNavigate?.('settings'); onClose(); }}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors text-left ${
              isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#007AFF]" />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-white/90' : 'text-gray-700'
            }`}>App Settings</span>
          </button>

          <button 
            onClick={() => { onNavigate?.('profile'); onClose(); }}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors text-left ${
              isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'
            }`}
          >
            <User className="w-4 h-4 text-[#007AFF]" />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-white/90' : 'text-gray-700'
            }`}>Profile Settings</span>
          </button>
          
          <button 
            onClick={() => { onShowCurrency(); onClose(); }}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors text-left ${
              isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'
            }`}
          >
            <DollarSign className="w-4 h-4 text-[#007AFF]" />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-white/90' : 'text-gray-700'
            }`}>Currency Picker</span>
          </button>
          
          <button 
            onClick={() => { onShowLanguage(); onClose(); }}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors text-left ${
              isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'
            }`}
          >
            <Globe className="w-4 h-4 text-[#007AFF]" />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-white/90' : 'text-gray-700'
            }`}>Language Picker</span>
          </button>
          
          <div className={`border-t my-2 ${
            isDarkMode ? 'border-white/10' : 'border-gray-200'
          }`} />
          
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/20 transition-colors text-left`}
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Category Filter Chips Component
const CategoryChips: React.FC<{ 
  categories: string[]; 
  activeCategory: string; 
  onCategoryChange: (category: string) => void; 
  isDarkMode: boolean;
}> = ({ categories, activeCategory, onCategoryChange, isDarkMode }) => {
  return (
    <div className="flex gap-3 px-1">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-1.5 rounded-full transition-all duration-300 chip-tap-glow ${
            activeCategory === category
              ? 'glass-card border-2 border-white/20 backdrop-blur-md'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 border-2 border-blue-600/50'
          }`}
        >
          <span className={`text-sm font-medium ${
            activeCategory === category
              ? isDarkMode ? 'text-white/90' : 'text-gray-700'
              : 'text-white'
          }`}>{category}</span>
        </button>
      ))}
    </div>
  );
};

// Guest Card Component
const GuestCard: React.FC<{ onNavigate?: (screen: string) => void; isDarkMode: boolean; hostMessage?: string }> = ({ onNavigate, isDarkMode, hostMessage }) => {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 animate-rise-in group border border-white/20 backdrop-blur-xl shadow-[0_24px_48px_-12px_rgba(15,23,42,0.25)]"
      style={{
        background: isDarkMode
          ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(59, 130, 246, 0.08) 50%, rgba(16, 185, 129, 0.08) 100%)'
          : 'linear-gradient(135deg, rgba(147, 51, 234, 0.03) 0%, rgba(59, 130, 246, 0.03) 50%, rgba(16, 185, 129, 0.03) 100%)'
      }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div
          className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-15 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)',
            animationDelay: '0.5s'
          }}
        />
        <div
          className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full opacity-10 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
            animationDelay: '1.2s'
          }}
        />
      </div>

      {/* Glass overlay */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 50%, rgba(255,255,255,0.03) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%)'
        }}
      />

      <div className="relative z-10 space-y-5">
        {/* Header with avatar and badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg"
              style={{
                boxShadow: isDarkMode ? '0 8px 32px rgba(147, 51, 234, 0.3)' : '0 8px 32px rgba(147, 51, 234, 0.2)'
              }}
            >
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Host Maria
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>
                Bangkok Local Expert
              </p>
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r backdrop-blur-sm border ${
            isDarkMode
              ? 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30 text-yellow-200'
              : 'from-yellow-100 to-orange-100 border-yellow-300 text-yellow-700'
          }`}>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              Superhost
            </div>
          </div>
        </div>

        {/* Message content */}
        <div className={`p-4 rounded-2xl backdrop-blur-sm border ${
          isDarkMode
            ? 'bg-gradient-to-br from-white/5 to-white/2 border-white/10'
            : 'bg-gradient-to-br from-white/50 to-white/20 border-white/30'
        }`}>
          <p className={`text-sm leading-relaxed ${
            isDarkMode ? 'text-white/80' : 'text-slate-700'
          }`}>
            {hostMessage || "Welcome to Bangkok! I've prepared some special recommendations just for you. Don't hesitate to reach out if you need anything during your stay. 🇹🇭"}
          </p>
        </div>

        {/* Action buttons */}
        <div className={`transition-all duration-500 ${showButtons ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
          <div className="grid grid-cols-2 gap-3">
            <button
              className="relative py-3 px-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-[0_12px_24px_-8px_rgba(59,130,246,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_16px_32px_-8px_rgba(59,130,246,0.5)] active:scale-[0.98]"
              onClick={() => onNavigate?.('chat')}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 transition-opacity duration-300 hover:opacity-20" />
              <div className="relative flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Contact Me
              </div>
            </button>

            <button
              className="relative py-3 px-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_12px_24px_-8px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_16px_32px_-8px_rgba(16,185,129,0.5)] active:scale-[0.98]"
              onClick={() => onNavigate?.('host-recommendations')}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 transition-opacity duration-300 hover:opacity-20" />
              <div className="relative flex items-center justify-center gap-2">
                <Star className="w-4 h-4 fill-current" />
                Tips & Spots
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Host Recommendations Carousel Component
const HostRecommendationsCarousel: React.FC<{
  onNavigate?: (screen: string) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isDarkMode: boolean;
  onboardingData?: OnboardingData;
}> = ({ onNavigate, activeCategory, onCategoryChange, isDarkMode, onboardingData }) => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const categories = ['Events', 'Food', 'Tours'];
  
  // Get personalized recommendations based on onboarding data and active category
  const getFilteredRecommendations = () => {
    return recommendationService.getRecommendationsByCategory(activeCategory, onboardingData);
  };

  const filteredRecommendations = getFilteredRecommendations();

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full glass-button flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className={`text-lg font-bold ${
            isDarkMode ? 'text-white/95' : 'text-gray-900'
          }`}>Host Recommendations</h3>
        </div>
        <button 
          onClick={() => onNavigate?.('host-recommendations')}
          className={`flex items-center space-x-1 text-sm transition-colors ${
            isDarkMode 
              ? 'text-white/70 hover:text-white/90' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Category Filter Chips */}
      <CategoryChips 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
        isDarkMode={isDarkMode}
      />

      {/* Horizontal Carousel - Shows exactly 2 cards at a time */}
      <div className="carousel-container">
        {filteredRecommendations.map((item, index) => (
          <div
            key={item.id}
            className="carousel-item glass-card hover:glass-card-hover rounded-2xl overflow-hidden animate-rise-in"
            style={{ animationDelay: `${600 + (index * 100)}ms` }}
          >
            {/* Square Photo with Overlays */}
            <div className="relative aspect-square">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover"
                style={{ borderRadius: '16px' }}
              />
              
              {/* Category Chip - Top Left */}
              <div className="absolute top-3 left-3">
                <Badge 
                  className="text-xs px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-600/50 backdrop-blur-md chip-tap-glow"
                  style={{ borderRadius: '999px' }}
                >
                  {item.category}
                </Badge>
              </div>

              {/* Heart - Top Right */}
              <button 
                onClick={() => toggleFavorite(item.id)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full glass-button flex items-center justify-center hover:scale-110 transition-all duration-200"
              >
                <Heart 
                  className={`w-4 h-4 transition-all duration-200 ${
                    favorites.has(item.id) 
                      ? 'text-red-500 fill-current animate-heart-bounce' 
                      : isDarkMode 
                        ? 'text-white/70' 
                        : 'text-gray-600'
                  }`} 
                />
              </button>
            </div>

            {/* Description Section */}
            <div className="p-4 space-y-3">
              <div>
                <h4 className={`text-sm font-medium mb-1 line-clamp-1 ${
                  isDarkMode ? 'text-white/95' : 'text-gray-900'
                }`}>{item.title}</h4>
                <p className={`text-xs line-clamp-2 leading-relaxed ${
                  isDarkMode ? 'text-white/70' : 'text-gray-600'
                }`}>{item.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  className="flex-1 h-10 rounded-xl bg-gradient-to-r from-blue-900/80 to-indigo-900/80 text-white text-xs font-medium hover:scale-105 transition-all duration-200 button-press"
                  onClick={() => onNavigate?.('property')}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  Directions
                </Button>
                <Button 
                  size="sm"
                  className="flex-1 h-10 rounded-xl bg-gradient-to-r from-blue-900/80 to-indigo-900/80 text-white text-xs font-medium hover:scale-105 transition-all duration-200 button-press"
                  onClick={() => onNavigate?.('explore')}
                >
                  <Info className="w-3 h-3 mr-1" />
                  Info
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main HomeScreen Component
interface OnboardingData {
  mode: 'guest' | 'host';
  tripPurpose?: string[];
  preferences?: string[];
  propertyProvider?: string;
  hostGoals?: string[];
}

interface HomeScreenProps {
  onNavigate?: (screen: string) => void;
  onBackToOnboarding?: () => void;
  mode?: 'guest' | 'host';
  onboardingData?: OnboardingData;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onBackToOnboarding, mode = 'guest', onboardingData }) => {
  const { theme, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  // Generate personalized content based on onboarding data
  const getPersonalizedWelcome = () => {
    if (!onboardingData?.tripPurpose?.length) {
      return {
        title: "Welcome to StayWise",
        subtitle: "Your personalized travel guide awaits"
      };
    }

    const purposes = onboardingData.tripPurpose;

    if (purposes.includes('foodie')) {
      return {
        title: "Ready for culinary adventures?",
        subtitle: "We've curated the best local food experiences for you"
      };
    } else if (purposes.includes('culture')) {
      return {
        title: "Discover authentic culture",
        subtitle: "Explore hidden gems and local traditions"
      };
    } else if (purposes.includes('relax')) {
      return {
        title: "Time to unwind",
        subtitle: "We've found the perfect spots for relaxation"
      };
    } else if (purposes.includes('city-break')) {
      return {
        title: "Your urban adventure begins",
        subtitle: "The best of the city curated just for you"
      };
    } else if (purposes.includes('nightlife')) {
      return {
        title: "Ready to paint the town?",
        subtitle: "Discover the hottest nightlife spots"
      };
    } else if (purposes.includes('group')) {
      return {
        title: "Perfect for your group",
        subtitle: "Activities and spots everyone will love"
      };
    }

    return {
      title: "Your personalized journey",
      subtitle: "Tailored recommendations based on your interests"
    };
  };

  const getPersonalizedHostMessage = () => {
    if (!onboardingData?.tripPurpose?.length) {
      return "Welcome! I've prepared some special recommendations just for you. Don't hesitate to reach out if you need anything during your stay.";
    }

    const purposes = onboardingData.tripPurpose;

    if (purposes.includes('foodie')) {
      return "Welcome, fellow foodie! I've handpicked the most authentic local restaurants and hidden culinary gems. The night market recommendations are my personal favorites!";
    } else if (purposes.includes('culture')) {
      return "Welcome! I'm excited to share the cultural treasures of our city with you. I've included some off-the-beaten-path temples and art galleries that locals love.";
    } else if (purposes.includes('relax')) {
      return "Welcome to your peaceful retreat! I've curated the most serene spots in the city, including some secret gardens and quiet cafes perfect for unwinding.";
    } else if (purposes.includes('nightlife')) {
      return "Welcome, night owl! I've mapped out the best nightlife circuit, from rooftop bars with stunning views to underground clubs where locals party.";
    }

    return "Welcome! I've personalized all my recommendations based on what you're looking for. Feel free to ask for more specific suggestions anytime!";
  };
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Events');
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [exploreTab, setExploreTab] = useState('activities');
  const [exploreSearch, setExploreSearch] = useState('');
  const isDarkMode = theme === 'dark';

  // Section data
  const sections = [
    {
      id: 'explore',
      title: 'Explore',
      description: 'Discover activities, restaurants, and day trips',
      icon: Compass,
      content: 'explore'
    },
    {
      id: 'favorites',
      title: 'Favourites',
      description: 'Your saved places and recommendations',
      icon: Heart,
      content: 'favorites'
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Chat with your host and get support',
      icon: MessageCircle,
      content: 'messages'
    },
    {
      id: 'essentials',
      title: 'Essentials',
      description: 'Property info, Wi-Fi, and local services',
      icon: Home,
      content: 'essentials'
    }
  ];
  
  // Essentials data
  const propertyInfo = {
    address: "1234 Sunset Villa Lane, Bangkok 10110, Thailand",
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    hostName: "Maria Santos",
    hostPhone: "+66 91 234 5678"
  };
  
  const nearbyEssentials = [
    {
      id: 'convenience',
      icon: ShoppingBag,
      title: 'Nearest Convenience Store',
      info: '7-Eleven, 3 min walk',
      distance: '150m',
      description: 'Open 24/7, has ATM inside'
    },
    {
      id: 'pharmacy',
      icon: Plus,
      title: 'Nearest Pharmacy',
      info: 'PharmaCare, 5 min walk',
      distance: '280m',
      description: 'Open 8 AM - 10 PM daily'
    },
    {
      id: 'taxi',
      icon: Car,
      title: 'Taxi / Grab Info',
      info: 'Grab app recommended',
      distance: 'Available',
      description: 'Download Grab for best rates'
    }
  ];
  
  // Mock chat messages for Messages section
  const mockMessages = [
    {
      id: '1',
      text: "Welcome to Sunset Villa! I'm Maria, your host. Feel free to ask me anything about your stay. 😊",
      sender: 'host',
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: '2',
      text: "Hi Maria! Thank you for the warm welcome. The place looks amazing!",
      sender: 'guest',
      timestamp: new Date(Date.now() - 1000 * 60 * 25)
    },
    {
      id: '3',
      text: "So glad you like it! Let me know if you need any assistance during your stay. I'm here to help! 🏡",
      sender: 'host',
      timestamp: new Date(Date.now() - 1000 * 60 * 20)
    }
  ];
  
  // Quick request options for chat
  const quickRequests = [
    {
      id: 'checkin',
      icon: Home,
      text: 'Check-in Instructions',
      message: "Hi Maria! Could you please share the check-in instructions?"
    },
    {
      id: 'wifi',
      icon: Wifi,
      text: 'Wi-Fi Details',
      message: "Hi! Could I get the Wi-Fi network name and password please?"
    },
    {
      id: 'cleaning',
      icon: Home,
      text: 'Fresh Towels',
      message: "Hi! Could we get some fresh towels please?"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleQuickAccess = (itemId: string) => {
    switch (itemId) {
      case 'wifi':
        onNavigate?.('wifi');
        break;
      case 'checkin':
        onNavigate?.('checkin');
        break;
      case 'directions':
        onNavigate?.('property');
        break;
      case 'rules':
        onNavigate?.('essentials');
        break;
      case 'tips':
        onNavigate?.('explore');
        break;
      default:
        break;
    }
  };

  // Get filtered recommendations for explore section
  const getExploreRecommendations = () => {
    let filtered = mockRecommendations;
    if (exploreTab === 'restaurants') {
      filtered = filtered.filter(rec => rec.category === 'food');
    } else if (exploreTab === 'activities') {
      filtered = filtered.filter(rec => rec.category === 'tours' || rec.category === 'events');
    } else if (exploreTab === 'daytrips') {
      filtered = filtered.filter(rec => rec.category === 'tours');
    }
    if (exploreSearch) {
      filtered = filtered.filter(rec => rec.title.toLowerCase().includes(exploreSearch.toLowerCase()));
    }
    return filtered;
  };

  // Render section content
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'explore':
        const exploreRecommendations = getExploreRecommendations();
        return (
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-2">
              <Input
                placeholder="Search recommendations..."
                value={exploreSearch}
                onChange={(e) => setExploreSearch(e.target.value)}
                className="flex-1 h-10"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate?.('explore')}
                className="h-10 px-4"
              >
                View All
              </Button>
            </div>

            {/* Tabs */}
            <Tabs value={exploreTab} onValueChange={setExploreTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                <TabsTrigger value="daytrips">Day Trips</TabsTrigger>
              </TabsList>

              <TabsContent value={exploreTab} className="mt-4">
                <div className="space-y-3">
                  {exploreRecommendations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No recommendations found
                    </div>
                  ) : (
                    exploreRecommendations.slice(0, 3).map((rec) => (
                      <Card key={rec.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">📍</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{rec.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{rec.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm font-medium">
                                {rec.price === 0 ? 'Free' : `${rec.currency} ${rec.price}`}
                              </span>
                              <Button size="sm" variant="outline" onClick={() => onNavigate?.('explore')}>
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case 'favorites':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{mockFavorites.length} saved places</h3>
              <Button variant="outline" size="sm" onClick={() => onNavigate?.('favorites')}>
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {mockFavorites.map((venue) => (
                <Card key={venue.id} className="shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-0">
                    <div className="flex h-20">
                      <div className="w-20 h-20 flex-shrink-0 relative">
                        <ImageWithFallback
                          src={venue.image}
                          alt={venue.title}
                          className="w-full h-full object-cover rounded-l-lg"
                        />
                      </div>

                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground text-sm">{venue.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {venue.category} {venue.emoji} | {venue.distance}
                          </p>

                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-current text-yellow-400" />
                              <span className="text-xs font-medium">{venue.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{venue.openingHours}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.success('Removed from favorites')}
                            className="h-6 w-6 p-0 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Heart className="w-3 h-3 fill-current text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-4">
            {/* Host info */}
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl">
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" />
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Maria Santos</h4>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => onNavigate?.('chat')}>
                Open Chat
              </Button>
            </div>

            {/* Recent messages */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recent Messages</h4>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {mockMessages.slice(-2).map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'guest' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-3 py-2 rounded-lg text-xs ${
                        message.sender === 'guest'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}>
                        <p className="line-clamp-2">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Quick requests */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Quick Requests</h4>
              <div className="grid grid-cols-1 gap-2">
                {quickRequests.map((request) => {
                  const IconComponent = request.icon;
                  return (
                    <Button
                      key={request.id}
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info(`Sent: ${request.message}`)}
                      className="justify-start h-auto p-3"
                    >
                      <IconComponent className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-left">{request.text}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'essentials':
        return (
          <div className="space-y-4">
            {/* Property Information */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Home className="w-4 h-4 text-primary" />
                  <span>Property Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Address */}
                <div className="bg-muted/30 rounded-lg p-3 border">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-muted-foreground">Property Address</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.success('Address copied')}
                      className="h-6 px-2"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm font-medium">{propertyInfo.address}</p>
                </div>

                {/* Check-in/out Times */}
                <div className="bg-muted/30 rounded-lg p-3 border">
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="w-3 h-3 text-primary" />
                    <p className="text-xs text-muted-foreground">Check-in / Check-out Times</p>
                  </div>
                  <p className="text-sm font-medium">
                    Check-in: {propertyInfo.checkIn} | Check-out: {propertyInfo.checkOut}
                  </p>
                </div>

                {/* Host Contact */}
                <div className="bg-muted/30 rounded-lg p-3 border">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-3 h-3 text-primary" />
                    <p className="text-xs text-muted-foreground">Host Contact</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{propertyInfo.hostName}</p>
                      <p className="text-xs text-muted-foreground">{propertyInfo.hostPhone}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info('Calling host...')}
                        className="h-7 px-2"
                      >
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info('Opening WhatsApp...')}
                        className="h-7 px-2"
                      >
                        <MessageCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Essentials */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Nearby Essentials</h4>
                <Button variant="ghost" size="sm" onClick={() => onNavigate?.('essentials')}>
                  View All
                </Button>
              </div>

              {nearbyEssentials.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-medium text-sm">{item.title}</h5>
                            <Badge variant="secondary" className="text-xs">
                              {item.distance}
                            </Badge>
                          </div>

                          <p className="text-sm text-foreground mb-1">{item.info}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'app-background' : 'app-background'}`}>
      {/* iPhone 16 Frame (430×932px) with clip content */}
      <div className={`max-w-[430px] mx-auto min-h-[932px] relative overflow-hidden ${
        isDarkMode
          ? 'bg-gradient-to-b from-background via-background to-muted/10'
          : 'bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100/50'
      }`}>

        {/* Top Bar - Liquid Glass, Pinned */}
        <header className="glass-header sticky top-0 z-50 px-5 py-3 h-16 flex items-center justify-between">
          {/* Left: StayWise Compass Icon + Text - Fixed, Always Links to Onboarding */}
          <button
            onClick={onBackToOnboarding}
            className="flex items-center space-x-2 hover:scale-105 transition-all duration-200"
            aria-label="Return to onboarding flow"
          >
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 flex items-center justify-center`}
                 style={{
                   filter: isDarkMode 
                     ? 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.3))' 
                     : 'none'
                 }}>
              <Compass className="w-4 h-4 text-blue-100" />
            </div>
            <h1 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white text-glow-gold' : 'text-gray-900'
            }`}>
              StayWise
            </h1>
          </button>
          
          {/* Right: Dark Mode Toggle (left) + Settings Gear (right) */}
          <div className="flex items-center space-x-2 relative">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full glass-button flex items-center justify-center hover:scale-105 transition-all duration-200"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-[#007AFF]" />
              ) : (
                <Moon className="w-5 h-5 text-[#007AFF]" />
              )}
            </button>
            <button
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              className="w-10 h-10 rounded-full glass-button flex items-center justify-center hover:scale-105 transition-all duration-200"
              aria-label="Open settings menu"
              aria-expanded={showSettingsDropdown}
              aria-haspopup="true"
            >
              <Settings className="w-5 h-5 text-[#007AFF]" />
            </button>
            
            {/* Settings Dropdown */}
            <SettingsDropdown 
              isOpen={showSettingsDropdown}
              onClose={() => setShowSettingsDropdown(false)}
              onNavigate={onNavigate}
              onShowCurrency={() => setShowCurrencyDropdown(true)}
              onShowLanguage={() => setShowLanguageDropdown(true)}
              isDarkMode={isDarkMode}
            />

            {/* Currency Picker Dropdown */}
            <CurrencyPickerDropdown 
              isOpen={showCurrencyDropdown}
              onClose={() => setShowCurrencyDropdown(false)}
              onSelect={setCurrentCurrency}
              currentCurrency={currentCurrency}
              isDarkMode={isDarkMode}
            />

            {/* Language Picker Dropdown */}
            <LanguagePickerDropdown 
              isOpen={showLanguageDropdown}
              onClose={() => setShowLanguageDropdown(false)}
              onSelect={setCurrentLanguage}
              currentLanguage={currentLanguage}
              isDarkMode={isDarkMode}
            />
          </div>
        </header>

        {/* Content Area with Safe Areas */}
        <main className="px-5 pb-24 pt-6 space-y-6">
          
          {/* Hero Card - Textured Liquid Glass */}
          <section aria-labelledby="welcome-section" className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 id="welcome-section" className="sr-only">Welcome Information</h2>
            <HeroWelcomeCard
              guestName="Guest"
              propertyName="Sunset Villa Bangkok"
              checkInTime="15:00"
              checkOutTime="11:00"
              temperatureC={28}
              weatherIcon="sun"
              onPropertyClick={() => onNavigate?.('property')}
              tone={isDarkMode ? 'dark' : 'light'}
              subheadline={getPersonalizedWelcome().subtitle}
            />
          </section>

          {/* Selected Section Content */}
          {selectedSection && (
            <section aria-labelledby="selected-section" className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 id="selected-section" className="sr-only">Selected Section Content</h2>
              <div className="space-y-6">
                {/* Hero Banner for Selected Section */}
                {(() => {
                  const section = sections.find(s => s.id === selectedSection);
                  if (!section) return null;
                  return (
                    <SectionHeroBanner
                      title={section.title}
                      icon={section.icon}
                      description={section.description}
                      isOpen={true}
                    />
                  );
                })()}

                {/* Section Content */}
                <div className="space-y-4">
                  {renderSectionContent(selectedSection)}
                </div>
              </div>
            </section>
          )}

          {/* Collapsible Grid Menu */}
          <section aria-labelledby="grid-menu-section" className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 id="grid-menu-section" className="sr-only">Grid Menu</h2>
            <div className="space-y-4">
              {sections.map((section) => (
                <div
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className="cursor-pointer"
                >
                  <SectionHeroBanner
                    title={section.title}
                    icon={section.icon}
                    description={section.description}
                    isOpen={false}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Guest Mode Card */}
          <section aria-labelledby="host-message-section" className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            <h2 id="host-message-section" className="sr-only">Message from Your Host</h2>
            <GuestCard onNavigate={onNavigate} isDarkMode={isDarkMode} hostMessage={getPersonalizedHostMessage()} />
          </section>

          {/* Host Recommendations Section */}
          <section aria-labelledby="recommendations-section" className={`transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            <h2 id="recommendations-section" className="sr-only">Host Recommendations</h2>
            <HostRecommendationsCarousel
              onNavigate={onNavigate}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              isDarkMode={isDarkMode}
              onboardingData={onboardingData}
            />
          </section>

        </main>

      </div>
    </div>
  );
};

export default HomeScreen;
