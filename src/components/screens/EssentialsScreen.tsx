import React, { useState } from 'react';
import { Clock, Phone, MessageCircle, Copy, Check, MapPin, Building2, Plus, Car, Car as Taxi, Hospital, Zap, ShieldAlert, Map, ShoppingBag, User, Navigation, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import OfflineBadge from '../OfflineBadge';
import OfflineInfo from '../OfflineInfo';
import ScreenHeader from '../ScreenHeader';

interface EssentialsScreenProps {
  onBack: () => void;
  onBackToOnboarding?: () => void;
}

const EssentialsScreen: React.FC<EssentialsScreenProps> = ({ onBack, onBackToOnboarding }) => {
  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({});

  const propertyInfo = {
    address: "1234 Sunset Villa Lane, Bangkok 10110, Thailand",
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    hostName: "Maria Santos",
    hostPhone: "+66 91 234 5678",
    hostWhatsApp: "+66 91 234 5678"
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
      id: 'atm',
      icon: Building2,
      title: 'Nearest ATM',
      info: 'Kasikorn ATM, 200m',
      distance: '200m',
      description: 'Accepts international cards'
    },
    {
      id: 'taxi',
      icon: Taxi,
      title: 'Taxi / Grab Info',
      info: 'Grab app recommended',
      distance: 'Available',
      description: 'Download Grab for best rates'
    }
  ];

  const emergencyInfo = [
    {
      id: 'hospital',
      icon: Hospital,
      title: 'Emergency Hospital',
      info: 'Bangkok General Hospital',
      phone: '+66 2 310 3000',
      distance: '2.1 km',
      description: '24/7 emergency services, English speaking'
    },
    {
      id: 'utilities',
      icon: Zap,
      title: 'Utilities',
      info: 'Electric box near kitchen, water valve by bathroom',
      distance: 'In property',
      description: 'Main breaker and water shutoff locations'
    },
    {
      id: 'exits',
      icon: ShieldAlert,
      title: 'Emergency Exits',
      info: 'Front door + side stairwell',
      distance: 'Both floors',
      description: 'Fire escape route via side stairwell'
    }
  ];

  const copyToClipboard = (text: string, itemId: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItems(prev => ({ ...prev, [itemId]: true }));
      setTimeout(() => {
        setCopiedItems(prev => ({ ...prev, [itemId]: false }));
      }, 2000);
      toast.success(`${label} copied to clipboard`);
    });
  };

  const handleCallHost = () => {
    window.location.href = `tel:${propertyInfo.hostPhone}`;
    toast.info('Opening phone dialer...');
  };

  const handleMessageHost = () => {
    // This would navigate to chat or open WhatsApp
    const whatsappUrl = `https://wa.me/${propertyInfo.hostWhatsApp.replace(/[^0-9]/g, '')}`;
    window.open(whatsappUrl, '_blank');
    toast.info('Opening WhatsApp...');
  };

  const handleCallEmergency = (phone: string, name: string) => {
    window.location.href = `tel:${phone}`;
    toast.info(`Calling ${name}...`);
  };

  const handleViewOnMap = () => {
    toast.info('Opening map with essentials...');
    // This would navigate to map tab with essentials filter
  };

  const renderEssentialCard = (item: any, isEmergency = false) => {
    const IconComponent = item.icon;
    const copyId = `copy-${item.id}`;
    const isCopied = copiedItems[copyId];

    return (
      <Card key={item.id} className="shadow-sm hover:shadow-md transition-all duration-200 relative">
        {/* Offline Badge for emergency items (they contain safety rules) */}
        {isEmergency && (
          <div className="absolute top-3 right-3 z-20">
            <OfflineBadge size="sm" variant="subtle" />
          </div>
        )}
        {/* Subtle grid paper texture for essentials cards */}
        <div 
          className="absolute inset-0 opacity-12 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '8px 8px'
          }}
        />
        <CardContent className="relative p-4">
          {/* Offline Info for emergency items */}
          {isEmergency && <OfflineInfo className="mb-3" text="Safety information cached for offline access." />}
          <div className="flex items-start space-x-4">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              isEmergency 
                ? 'bg-red-50 dark:bg-red-900/20' 
                : 'bg-primary/10'
            }`}>
              <IconComponent className={`w-6 h-6 ${
                isEmergency 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-primary'
              }`} aria-hidden="true" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-foreground">{item.title}</h4>
                {item.distance && (
                  <Badge variant="secondary" className="text-xs">
                    {item.distance}
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-foreground mb-1">{item.info}</p>
              
              {item.description && (
                <p className="text-xs text-muted-foreground">{item.description}</p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                {item.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCallEmergency(item.phone, item.title)}
                    className="h-8 px-3"
                    aria-label={`Call ${item.title}`}
                  >
                    <Phone className="w-3 h-3 mr-1" aria-hidden="true" />
                    Call
                  </Button>
                )}
                
                {item.id !== 'utilities' && item.id !== 'exits' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewOnMap}
                    className="h-8 px-3"
                    aria-label={`View ${item.title} on map`}
                  >
                    <MapPin className="w-3 h-3 mr-1" aria-hidden="true" />
                    Map
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ScreenHeader
        title="Essentials"
        subtitle="Property info and local services"
        onBack={onBack}
        onBackToOnboarding={onBackToOnboarding}
      />

      <div className="px-6 py-6 space-y-6 pb-24">
        {/* Property Information Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 relative">
          {/* Offline Badge */}
          <div className="absolute top-4 right-4 z-20">
            <OfflineBadge size="sm" variant="subtle" />
          </div>
          {/* Subtle grid paper texture */}
          <div 
            className="absolute inset-0 opacity-12 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
              `,
              backgroundSize: '8px 8px'
            }}
          />
          <CardHeader className="relative">
            <CardTitle className="flex items-center space-x-2">
              <Home className="w-5 h-5 text-primary" aria-hidden="true" />
              <span>Property Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-4">
            {/* Offline Info */}
            <OfflineInfo />
            {/* Address */}
            <div className="bg-muted/30 rounded-xl p-4 border border-border/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Property Address</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(propertyInfo.address, 'address', 'Address')}
                  className="h-8 px-3"
                  aria-label="Copy property address to clipboard"
                >
                  {copiedItems['copy-address'] ? (
                    <>
                      <Check className="w-4 h-4 mr-1 text-green-600" aria-hidden="true" />
                      <span className="text-green-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" aria-hidden="true" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm font-medium text-foreground">{propertyInfo.address}</p>
            </div>

            {/* Check-in/out Times */}
            <div className="bg-muted/30 rounded-xl p-4 border border-border/20">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">Check-in / Check-out Times</p>
              </div>
              <p className="text-sm font-medium text-foreground">
                Check-in: {propertyInfo.checkIn} | Check-out: {propertyInfo.checkOut}
              </p>
            </div>

            {/* Host Contact */}
            <div className="bg-muted/30 rounded-xl p-4 border border-border/20">
              <div className="flex items-center space-x-2 mb-3">
                <User className="w-4 h-4 text-primary" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">Host Contact</p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{propertyInfo.hostName}</p>
                  <p className="text-xs text-muted-foreground">{propertyInfo.hostPhone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCallHost}
                  className="flex-1 h-10"
                  aria-label={`Call host ${propertyInfo.hostName}`}
                >
                  <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMessageHost}
                  className="flex-1 h-10"
                  aria-label={`Message host ${propertyInfo.hostName}`}
                >
                  <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                  Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nearby Essentials Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-semibold text-foreground">Nearby Essentials</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewOnMap}
              className="text-primary hover:text-primary/80 hover:bg-primary/10 p-2"
              aria-label="View all nearby essentials on map"
            >
              <Map className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {nearbyEssentials.map(item => renderEssentialCard(item))}
          </div>
        </div>

        {/* Local Essentials Map Preview */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 relative">
          {/* Subtle grid paper texture */}
          <div 
            className="absolute inset-0 opacity-12 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
              `,
              backgroundSize: '8px 8px'
            }}
          />
          <CardContent className="relative p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Local Area Map</h3>
              <p className="text-sm text-muted-foreground mb-4">Essential services and attractions nearby</p>
              
              {/* Map Thumbnail Placeholder */}
              <div className="w-full h-32 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-xl mb-4 flex items-center justify-center border border-border/20">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-primary mx-auto mb-2" aria-hidden="true" />
                  <p className="text-sm text-muted-foreground">Interactive map preview</p>
                </div>
              </div>
              
              <Button 
                onClick={handleViewOnMap}
                className="w-full h-12"
                aria-label="Open full map with all essential services marked"
              >
                <Navigation className="w-4 h-4 mr-2" aria-hidden="true" />
                View on Map
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency & Safety Section */}
        <div className="space-y-4">
          <div className="px-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">Emergency & Safety</h3>
            <p className="text-sm text-muted-foreground">Important safety information and emergency contacts</p>
          </div>
          
          <div className="space-y-3">
            {emergencyInfo.map(item => renderEssentialCard(item, true))}
          </div>
        </div>

        {/* Emergency Contact Card */}
        <Card className="shadow-sm border-red-200 dark:border-red-800/30 bg-red-50/50 dark:bg-red-900/10 relative">
          {/* Offline Badge */}
          <div className="absolute top-4 right-4 z-20">
            <OfflineBadge size="sm" variant="subtle" />
          </div>
          {/* Subtle grid paper texture */}
          <div 
            className="absolute inset-0 opacity-8 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
              `,
              backgroundSize: '8px 8px'
            }}
          />
          <CardContent className="relative p-4">
            {/* Offline Info */}
            <OfflineInfo className="mb-3" text="Emergency contacts saved for offline access." />
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-red-600 dark:text-red-400" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-200">Emergency Numbers</h4>
                <p className="text-xs text-red-600 dark:text-red-300">For immediate assistance</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCallEmergency('191', 'Police')}
                className="h-10 border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20"
                aria-label="Call police emergency number 191"
              >
                <Phone className="w-3 h-3 mr-1" aria-hidden="true" />
                Police 191
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCallEmergency('1669', 'Ambulance')}
                className="h-10 border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20"
                aria-label="Call ambulance emergency number 1669"
              >
                <Hospital className="w-3 h-3 mr-1" aria-hidden="true" />
                Ambulance 1669
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EssentialsScreen;