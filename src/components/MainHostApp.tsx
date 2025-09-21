import React, { useState, useCallback, useMemo } from 'react';
import StayWiseHeader from './StayWiseHeader';
import HostBottomNavigation from './HostBottomNavigation';
import HostBookingsScreen from './screens/HostBookingsScreen';
import HostMessagesScreen from './screens/HostMessagesScreen';
import HostEarningsScreen from './screens/HostEarningsScreen';
import HomeScreen from './screens/HomeScreen';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { 
  BarChart3, Calendar, Users, Settings, TrendingUp, DollarSign, Star, Eye, MessageCircle, 
  Phone, Mail, MapPin, Clock, Home, CheckCircle, XCircle, AlertCircle, PlusCircle, Edit, 
  Trash2, Download, Filter, Search, Bell, User2, CreditCard, Shield, Globe, Moon, Sun, 
  LogOut, RefreshCw, FileText, Plus, Zap, Sparkles, Camera, Heart, ThumbsUp, Award, 
  Target, TrendingDown, Activity, Wifi, WifiOff, ChevronRight, ChevronDown, MoreHorizontal,
  BookOpen, Lightbulb, HelpCircle, ExternalLink, Copy, Share2, Calendar as CalendarIcon,
  Clock3, Currency, Users2, Building, Bed, Bath, CarIcon, Timer, Bookmark, Flag, Tag,
  Hash, Image as ImageIcon, Video, Mic, Headphones, Monitor, Smartphone, Tablet,
  Package, Truck, Gift, Coffee, UtensilsCrossed, Leaf, TreePine, Waves, Mountain,
  Plane, Train, Bus, Fuel, Wrench, Lightbulb as LightbulbIcon, Key
} from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { useProperty } from './contexts/PropertyContext';
import type { ImportedProperty } from '../lib/propertyImport';
import { toast } from 'sonner@2.0.3';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface OnboardingData {
  mode: 'guest' | 'host';
  tripPurpose?: string[];
  preferences?: string[];
  propertyProvider?: string;
  hostGoals?: string[];
  propertyDetails?: ImportedProperty | null;
}

interface MainHostAppProps {
  testingMode?: boolean;
  onBack?: () => void;
  onboardingData?: OnboardingData;
}

interface HostProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  joinDate: string;
  superhost: boolean;
  responseRate: number;
  rating: number;
  reviewCount: number;
  languages: string[];
  verifications: string[];
}

interface QuickStat {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface RecentActivity {
  id: string;
  type: 'booking' | 'message' | 'review' | 'payout' | 'inquiry';
  title: string;
  description: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
}

interface Notification {
  id: string;
  type: 'booking' | 'message' | 'review' | 'payment' | 'maintenance' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
  priority: 'low' | 'medium' | 'high';
}

const MainHostApp: React.FC<MainHostAppProps> = ({ testingMode = false, onBack, onboardingData }) => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [loading, setLoading] = useState(false);
  const { property } = useProperty();

  const fallbackProperty = useMemo(
    () => ({
      name: 'Modern Riverside Apartment',
      location: 'Vientiane, Laos',
      provider: 'manual',
      photos: [
        'https://images.unsplash.com/photo-1594873604892-b599f847e859?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1611234688667-76b6d8fadd75?w=1200&h=800&fit=crop',
      ],
      amenities: ['Fast Wi-Fi', 'Self check-in', 'Full kitchen'],
    }),
    [],
  );

  const activeProperty = property ?? onboardingData?.propertyDetails ?? fallbackProperty;

  // Mock data for host profile
  const hostProfile: HostProfile = useMemo(() => ({
    name: 'Maria Santos',
    email: 'maria@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80',
    location: 'San Francisco, CA',
    joinDate: '2019-03-15',
    superhost: true,
    responseRate: 98,
    rating: 4.9,
    reviewCount: 247,
    languages: ['English', 'Spanish', 'Portuguese'],
    verifications: ['Email', 'Phone', 'ID', 'Address']
  }), []);

  // Mock quick stats
  const quickStats: QuickStat[] = useMemo(() => [
    {
      label: 'Total Revenue',
      value: '$45,670',
      change: 12.5,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      label: 'Active Bookings',
      value: 8,
      change: 2,
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      label: 'Occupancy Rate',
      value: '87%',
      change: 5.3,
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      label: 'Response Rate',
      value: '98%',
      change: 1.2,
      icon: MessageCircle,
      color: 'text-orange-600'
    }
  ], []);

  // Mock recent activity
  const recentActivity: RecentActivity[] = useMemo(() => [
    {
      id: '1',
      type: 'booking',
      title: 'New Booking Request',
      description: 'Sarah Johnson wants to book Downtown Loft for 5 nights',
      timestamp: '2 hours ago',
      priority: 'high',
      actionRequired: true
    },
    {
      id: '2',
      type: 'review',
      title: 'New 5-Star Review',
      description: 'Mike Chen left an amazing review for Beach House',
      timestamp: '4 hours ago',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'message',
      title: 'Guest Message',
      description: 'Emma Wilson asking about early check-in',
      timestamp: '6 hours ago',
      priority: 'medium',
      actionRequired: true
    },
    {
      id: '4',
      type: 'payout',
      title: 'Payout Processed',
      description: '$2,150 transferred to your bank account',
      timestamp: '1 day ago',
      priority: 'low'
    },
    {
      id: '5',
      type: 'inquiry',
      title: 'Property Inquiry',
      description: 'David Rodriguez inquiring about accessibility features',
      timestamp: '2 days ago',
      priority: 'medium'
    }
  ], []);

  // Mock notifications
  const notifications: Notification[] = useMemo(() => [
    {
      id: '1',
      type: 'booking',
      title: 'Booking Expires Soon',
      message: 'Booking request from Sarah Johnson expires in 2 hours',
      timestamp: '2 hours ago',
      read: false,
      actionRequired: true,
      priority: 'high'
    },
    {
      id: '2',
      type: 'maintenance',
      title: 'Maintenance Reminder',
      message: 'AC unit cleaning scheduled for Downtown Loft tomorrow',
      timestamp: '4 hours ago',
      read: false,
      actionRequired: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'system',
      title: 'New Feature Available',
      message: 'Smart pricing is now available for your properties',
      timestamp: '1 day ago',
      read: true,
      actionRequired: false,
      priority: 'low'
    }
  ], []);

  // Chart data for dashboard
  const chartData = useMemo(() => ({
    revenue: [
      { month: 'Aug', value: 7200 },
      { month: 'Sep', value: 8100 },
      { month: 'Oct', value: 7800 },
      { month: 'Nov', value: 8900 },
      { month: 'Dec', value: 8200 },
      { month: 'Jan', value: 8920 },
      { month: 'Feb', value: 9500 }
    ],
    bookings: [
      { month: 'Aug', value: 15 },
      { month: 'Sep', value: 18 },
      { month: 'Oct', value: 16 },
      { month: 'Nov', value: 22 },
      { month: 'Dec', value: 19 },
      { month: 'Jan', value: 21 },
      { month: 'Feb', value: 24 }
    ]
  }), []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="w-4 h-4" />;
      case 'message': return <MessageCircle className="w-4 h-4" />;
      case 'review': return <Star className="w-4 h-4" />;
      case 'payout': return <DollarSign className="w-4 h-4" />;
      case 'inquiry': return <HelpCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'message': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'review': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'payout': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'inquiry': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive" className="text-xs">High</Badge>;
      case 'medium': return <Badge variant="default" className="text-xs">Medium</Badge>;
      case 'low': return <Badge variant="secondary" className="text-xs">Low</Badge>;
      default: return null;
    }
  };

  const handleQuickAction = useCallback(async (action: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    switch (action) {
      case 'add-property':
        setShowAddProperty(true);
        break;
      case 'quick-message':
        toast.success('Opening quick message composer...');
        break;
      case 'view-calendar':
        toast.success('Opening calendar view...');
        break;
      case 'payout':
        toast.success('Payout request initiated!');
        break;
      default:
        toast.info(`${action} completed`);
    }
    
    setLoading(false);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = 3; // Mock unread messages count
  const pendingBookings = 2; // Mock pending bookings count

  // Dashboard content
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                Welcome back, {hostProfile.name}! 👋
              </h2>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                You have {pendingBookings} pending booking{pendingBookings !== 1 ? 's' : ''} and {unreadMessages} unread message{unreadMessages !== 1 ? 's' : ''}.
              </p>
              <div className="flex space-x-2">
                <Button onClick={() => setActiveTab('bookings')} size="sm">
                  View Bookings
                </Button>
                <Button onClick={() => setActiveTab('messages')} variant="outline" size="sm">
                  Check Messages
                </Button>
              </div>
            </div>
            {hostProfile.superhost && (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <Badge variant="default" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                  Superhost
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Property Snapshot */}
      <Card className="border-blue-200/60 dark:border-blue-800/40">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                Active Listing
              </p>
              <h3 className="text-2xl font-semibold mb-1">{activeProperty.name}</h3>
              {activeProperty.location && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{activeProperty.location}</span>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {activeProperty.provider && (
                  <Badge variant="secondary" className="capitalize">
                    {activeProperty.provider}
                  </Badge>
                )}
                {(activeProperty.amenities ?? []).slice(0, 3).map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            {activeProperty.photos?.[0] && (
              <div className="relative w-full lg:w-60 h-40 rounded-2xl overflow-hidden shadow-md">
                <img
                  src={activeProperty.photos[0]}
                  alt={activeProperty.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <div className="absolute bottom-3 right-3 text-xs text-white/80 bg-black/40 px-2 py-1 rounded-full">
                  {activeProperty.photos.length} photos synced
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.change && (
                      <div className="flex items-center text-sm mt-1">
                        <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                        <span className="text-green-600">+{stat.change}%</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-muted/30 rounded-full">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2" 
              onClick={() => handleQuickAction('add-property')}
              disabled={loading}
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm">Add Property</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => handleQuickAction('quick-message')}
              disabled={loading}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-sm">Quick Message</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => handleQuickAction('view-calendar')}
              disabled={loading}
            >
              <Calendar className="w-6 h-6" />
              <span className="text-sm">View Calendar</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => handleQuickAction('payout')}
              disabled={loading}
            >
              <CreditCard className="w-6 h-6" />
              <span className="text-sm">Request Payout</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.revenue}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Booking Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.bookings}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, 'Bookings']} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-muted/30 rounded-lg transition-colors">
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{activity.title}</h4>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(activity.priority)}
                      {activity.actionRequired && (
                        <Badge variant="destructive" className="text-xs">Action</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'properties':
        return renderDashboard(); // Placeholder - would show properties screen
      case 'bookings':
        return <HostBookingsScreen />;
      case 'messages':
        return <HostMessagesScreen />;
      case 'earnings':
        return <HostEarningsScreen />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <StayWiseHeader
        onLogoClick={() => setActiveTab('dashboard')}
        notificationCount={unreadNotifications}
        userAvatar={hostProfile.avatar}
        userName={hostProfile.name}
        onNotificationClick={() => setShowNotifications(true)}
        onProfileClick={() => setShowProfile(true)}
      />

      {/* Testing Mode Indicator */}
      {testingMode && (
        <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-b border-purple-200 dark:border-purple-800/30">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm text-purple-800 dark:text-purple-200 font-medium">
              Enhanced Host Dashboard - Full Feature Set Active
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 py-6">
        {renderContent()}
      </div>

      {/* Enhanced Bottom Navigation */}
      <HostBottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        unreadMessages={unreadMessages}
        pendingBookings={pendingBookings}
        newNotifications={unreadNotifications}
      />

      {/* Notifications Sheet */}
      <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadNotifications}
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-full mt-6 pb-20">
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border rounded-lg transition-colors cursor-pointer hover:bg-muted/30 ${
                    !notification.read ? 'bg-primary/5 border-primary/20' : 'bg-background'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {getPriorityBadge(notification.priority)}
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                    {notification.actionRequired && (
                      <Button size="sm" variant="outline">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Profile Sheet */}
      <Sheet open={showProfile} onOpenChange={setShowProfile}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Profile & Settings</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-full mt-6 pb-20">
            <div className="space-y-6">
              {/* Profile Info */}
              <div className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={hostProfile.avatar} alt={hostProfile.name} />
                  <AvatarFallback className="text-lg">{hostProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{hostProfile.name}</h3>
                <p className="text-muted-foreground">{hostProfile.email}</p>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-current text-yellow-500 mr-1" />
                    <span>{hostProfile.rating}</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{hostProfile.reviewCount} reviews</span>
                  {hostProfile.superhost && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <Badge variant="default" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                        Superhost
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{hostProfile.responseRate}%</p>
                  <p className="text-sm text-muted-foreground">Response Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {new Date().getFullYear() - new Date(hostProfile.joinDate).getFullYear()}
                  </p>
                  <p className="text-sm text-muted-foreground">Years Hosting</p>
                </div>
              </div>

              <Separator />

              {/* Verifications */}
              <div>
                <h4 className="font-medium mb-3">Verifications</h4>
                <div className="grid grid-cols-2 gap-2">
                  {hostProfile.verifications.map((verification) => (
                    <div key={verification} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{verification}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className="font-medium mb-3">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {hostProfile.languages.map((language) => (
                    <Badge key={language} variant="outline">{language}</Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                  </div>
                  <Switch 
                    checked={theme === 'dark'} 
                    onCheckedChange={toggleTheme}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified about bookings and messages</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Updates</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button className="w-full" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
                <Button className="w-full" variant="outline">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help & Support
                </Button>
                <Button 
                  className="w-full" 
                  variant="destructive"
                  onClick={() => {
                    toast.success('Logged out successfully');
                    onBack?.();
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Add Property Dialog */}
      <Dialog open={showAddProperty} onOpenChange={setShowAddProperty}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property-name">Property Name</Label>
                <Input id="property-name" placeholder="Enter property name" />
              </div>
              <div>
                <Label htmlFor="property-type">Property Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="room">Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Enter full address" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="0" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0,1,2,3,4,5].map(n => (
                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="1" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5].map(n => (
                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="max-guests">Max Guests</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="2" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,8,10].map(n => (
                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="price">Price per Night ($)</Label>
              <Input id="price" type="number" placeholder="100" />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe your property..."
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  'WiFi', 'Kitchen', 'AC', 'Parking', 'Pool', 'Garden', 
                  'Gym', 'Pet-friendly', 'Washer', 'Dryer', 'TV', 'Heating'
                ].map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox id={amenity} />
                    <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddProperty(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast.success('Property added successfully!');
                setShowAddProperty(false);
              }}>
                Add Property
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainHostApp;
