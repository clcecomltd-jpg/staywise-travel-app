import React, { useState } from 'react';
import { Settings, Bell, Heart, MapPin, Star, Calendar, Share, HelpCircle, LogOut, Moon, Sun, Globe, DollarSign, Camera, Edit3, Shield, Lock, Eye, MessageCircle, BookOpen, FileText, Mail, Phone, ChevronRight, User, CreditCard, Smartphone, Volume2, Users, UserPlus, Wifi, Car, Plane, Building, Gift, ShoppingBag, Zap, Navigation, ExternalLink, Grid3X3, List } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { StandardizedCard } from '../ui/standardized-card';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { toast } from 'sonner@2.0.3';
import CardDetailsModal from '../CardDetailsModal';
import { useCardModal } from '../hooks/useCardModal';

const ProfileScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  // Add error handling for useSettings
  let settings;
  try {
    settings = useSettings();
  } catch (error) {
    console.warn('Settings context not available:', error);
    settings = null;
  }
  
  const { currency, language } = settings || { currency: null, language: null };
  const { isModalOpen, selectedCard, openModal, closeModal } = useCardModal();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Profile data
  const profileData = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    badges: [
      { label: '⭐ Superhost', type: 'premium' },
      { label: 'Level 3', type: 'level' },
      { label: 'Verified', type: 'verified' }
    ]
  };

  // Account & Settings Menu Items
  const accountMenuItems = [
    { 
      id: 'bookings', 
      label: 'My Bookings', 
      icon: Calendar, 
      emoji: '📅',
      description: 'View and manage your reservations',
      action: () => toast.info('Opening My Bookings...')
    },
    { 
      id: 'payment', 
      label: 'Payment Methods', 
      icon: CreditCard, 
      emoji: '💳',
      description: 'Manage cards and payment options',
      action: () => toast.info('Opening Payment Methods...')
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell, 
      emoji: '🔔',
      description: 'Customize notification preferences',
      action: () => setShowNotificationSettings(true)
    },
    { 
      id: 'favorites', 
      label: 'Saved Favourites', 
      icon: Heart, 
      emoji: '💙',
      description: 'View your saved places and experiences',
      action: () => toast.info('Opening Favourites page...')
    },
    { 
      id: 'language', 
      label: 'Language & Region', 
      icon: Globe, 
      emoji: '🌐',
      description: 'Change app language and region',
      action: () => setShowLanguageDialog(true)
    },
    { 
      id: 'support', 
      label: 'Support & Help', 
      icon: HelpCircle, 
      emoji: '❓',
      description: 'Get help and contact support',
      action: () => toast.info('Opening Support Center...')
    },
    { 
      id: 'invite', 
      label: 'Invite Friends', 
      icon: UserPlus, 
      emoji: '👥',
      description: 'Share the app with friends',
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: 'Travel Guide App',
            text: 'Check out this amazing travel guide app!',
            url: 'https://travelguide.app'
          });
        } else {
          toast.success('Referral link copied to clipboard!');
        }
      }
    }
  ];

  // Monetization Offers
  const exclusiveOffers = [
    {
      id: 'esim',
      title: 'Travel eSIM Deals',
      subtitle: 'Stay connected anywhere',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop',
      icon: Wifi,
      emoji: '🌐',
      ctaText: 'View Offers',
      featured: true,
      action: () => toast.success('Opening eSIM marketplace...')
    },
    {
      id: 'city-pass',
      title: 'City Tour Pass',
      subtitle: 'Access top attractions',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=300&h=200&fit=crop',
      icon: Building,
      emoji: '🎟️',
      ctaText: 'Book Now',
      featured: false,
      action: () => toast.success('Opening City Pass booking...')
    },
    {
      id: 'airport-transfer',
      title: 'Airport Transfer',
      subtitle: 'Flat-rate taxi service',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop',
      icon: Car,
      emoji: '🚖',
      ctaText: 'Reserve Ride',
      featured: false,
      action: () => toast.success('Opening transfer booking...')
    },
    {
      id: 'travel-insurance',
      title: 'Travel Insurance',
      subtitle: 'Protection for your trip',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=200&fit=crop',
      icon: Shield,
      emoji: '🛡️',
      ctaText: 'Get Quote',
      featured: false,
      action: () => toast.success('Opening insurance quotes...')
    },
    {
      id: 'currency-exchange',
      title: 'Currency Exchange',
      subtitle: 'Best rates guaranteed',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&h=200&fit=crop',
      icon: DollarSign,
      emoji: '💱',
      ctaText: 'Exchange Now',
      featured: false,
      action: () => toast.success('Opening currency exchange...')
    }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    toast.success('Successfully logged out');
    // Handle logout logic here
  };

  const handleAvatarUpload = () => {
    toast.info('Opening photo gallery...');
  };

  const handleAppSettings = () => {
    toast.info('Opening app settings...');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border/20">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditProfile}
            className="border-primary/30 text-primary hover:bg-primary/10 h-9 px-4 rounded-full"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="px-4 py-4 space-y-6 pb-24">
          
          {/* Profile Card */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileData.avatar} alt={profileData.name} />
                    <AvatarFallback className="text-lg">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    onClick={handleAvatarUpload}
                    className="absolute -bottom-1 -right-1 h-7 w-7 p-0 rounded-full shadow-md"
                  >
                    <Camera className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{profileData.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditProfile}
                      className="h-6 w-6 p-0 hover:bg-muted/50"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{profileData.email}</p>
                  
                  {/* Badge Row */}
                  <div className="flex flex-wrap gap-2">
                    {profileData.badges.map((badge, index) => (
                      <Badge 
                        key={index}
                        variant={badge.type === 'premium' ? 'default' : 'secondary'}
                        className={`text-xs ${
                          badge.type === 'premium' ? 'bg-primary/10 text-primary border-primary/20' :
                          badge.type === 'verified' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                          'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {badge.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid/List Toggle */}
          <div className="flex justify-center">
            <div className="flex rounded-lg bg-muted/30 p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Account & Settings Sections */}
          <div className={viewMode === 'grid' ? "space-y-3" : "space-y-2"}>
            {accountMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Card key={item.id} className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                  <CardContent className="p-0">
                    <Button
                      variant="ghost"
                      onClick={item.action}
                      className={`w-full justify-between text-left hover:bg-muted/50 transition-colors ${
                        viewMode === 'grid' ? 'p-4 h-auto' : 'p-3 h-12'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {viewMode === 'grid' ? (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-lg">{item.emoji}</span>
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground">{item.label}</h4>
                          {viewMode === 'grid' && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Monetization Section - Exclusive Offers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Exclusive Offers</h3>
              <Badge variant="secondary" className="text-xs">
                Limited Time
              </Badge>
            </div>
            
{viewMode === 'grid' ? (
              <ScrollArea orientation="horizontal" className="w-full">
                <div className="flex space-x-4 pb-2">
                  {exclusiveOffers.map((offer) => (
                    <StandardizedCard
                      key={offer.id}
                      data={{
                        id: offer.id,
                        title: offer.title,
                        subtitle: offer.subtitle,
                        image: offer.image,
                        emoji: offer.emoji,
                        ctaText: offer.ctaText,
                        tag: offer.featured ? "⭐ Featured" : undefined,
                        type: 'offer'
                      }}
                      onClick={() => openModal(offer, 'offer')}
                      variant="detailed"
                      texturePattern="brushed"
                      className="flex-shrink-0 w-72"
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="space-y-3">
                {exclusiveOffers.map((offer) => (
                  <StandardizedCard
                    key={offer.id}
                    data={{
                      id: offer.id,
                      title: offer.title,
                      subtitle: offer.subtitle,
                      image: offer.image,
                      emoji: offer.emoji,
                      ctaText: offer.ctaText,
                      tag: offer.featured ? "⭐ Featured" : undefined,
                      type: 'offer'
                    }}
                    onClick={() => openModal(offer, 'offer')}
                    variant="minimal"
                    texturePattern="brushed"
                    showCTA={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="space-y-3">
            {/* App Settings */}
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  onClick={handleAppSettings}
                  className="w-full justify-between p-4 h-auto text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground">App Settings</h4>
                      <p className="text-sm text-muted-foreground">Customize app preferences</p>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </Button>
              </CardContent>
            </Card>

            {/* Log Out */}
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-between p-4 h-auto text-left hover:bg-destructive/5 text-destructive hover:text-destructive transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                      <LogOut className="w-5 h-5 text-destructive" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">Log Out</h4>
                      <p className="text-sm text-muted-foreground">Sign out of your account</p>
                    </div>
                  </div>
                  
                  <span className="text-2xl">🚪</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Version Info */}
          <div className="text-center pt-4">
            <p className="text-xs text-muted-foreground">
              Travel Guide v2.1.0
            </p>
          </div>
        </div>
      </ScrollArea>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information and preferences
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Avatar Section */}
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  <AvatarFallback className="text-lg">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  onClick={handleAvatarUpload}
                  className="absolute -bottom-1 -right-1 h-8 w-8 p-0 rounded-full shadow-md"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Form Fields */}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input id="edit-name" defaultValue={profileData.name} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" defaultValue={profileData.email} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea 
                id="edit-bio" 
                placeholder="Tell us about yourself..." 
                defaultValue="Adventurous traveler exploring the world"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input id="edit-location" placeholder="Your current city" />
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowEditProfile(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={() => {
                  toast.success('Profile updated successfully!');
                  setShowEditProfile(false);
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Language Selection Dialog */}
      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Language & Region</DialogTitle>
            <DialogDescription>
              Choose your preferred language and region settings
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-80">
            <div className="space-y-2">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={language?.code === lang.code ? "default" : "ghost"}
                  onClick={() => {
                    toast.success(`Language changed to ${lang.name}`);
                    setShowLanguageDialog(false);
                  }}
                  className="w-full justify-start h-12"
                >
                  <span className="text-xl mr-3">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {language?.code === lang.code && (
                    <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                  )}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Notification Settings Dialog */}
      <Dialog open={showNotificationSettings} onOpenChange={setShowNotificationSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notification Preferences</DialogTitle>
            <DialogDescription>
              Choose what notifications you'd like to receive
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications on this device</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Email Updates</p>
                <p className="text-sm text-muted-foreground">Get updates via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Receive text messages</p>
              </div>
              <Switch />
            </div>
            
            <Button 
              className="w-full"
              onClick={() => {
                toast.success('Notification preferences saved');
                setShowNotificationSettings(false);
              }}
            >
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Log Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>
          
          <Alert>
            <LogOut className="h-4 w-4" />
            <AlertDescription>
              You'll need to sign in again to access your account and saved data.
            </AlertDescription>
          </Alert>
          
          <div className="flex space-x-2 pt-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="flex-1"
              onClick={confirmLogout}
            >
              Log Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Card Details Modal */}
      <CardDetailsModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        data={selectedCard}
      />
    </div>
  );
};

export default ProfileScreen;