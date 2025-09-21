import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  CheckCircle, 
  Eye, 
  BarChart3, 
  Home, 
  Wifi, 
  Clock, 
  Shield, 
  Star, 
  Camera, 
  Gift,
  Sparkles
} from 'lucide-react';

interface HostSetupCompleteProps {
  onPreviewGuest: () => void;
  onGoToDashboard: () => void;
}

const HostSetupComplete: React.FC<HostSetupCompleteProps> = ({ 
  onPreviewGuest, 
  onGoToDashboard 
}) => {
  const completedFeatures = [
    { icon: Home, label: 'Property Basics', color: 'text-blue-600' },
    { icon: Wifi, label: 'Wi-Fi & Utilities', color: 'text-green-600' },
    { icon: Clock, label: 'Check-In Rules', color: 'text-purple-600' },
    { icon: Shield, label: 'Emergency Info', color: 'text-red-600' },
    { icon: Star, label: 'Recommendations', color: 'text-yellow-600' },
    { icon: Camera, label: 'Property Gallery', color: 'text-pink-600' },
    { icon: Gift, label: 'Offers & Monetization', color: 'text-indigo-600' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              <CardTitle className="text-3xl">Your Guest Guide is Ready!</CardTitle>
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground">
              Congratulations! You've successfully set up all the essential information 
              your guests need for an amazing stay experience.
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Completion Summary */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200 dark:border-green-800/30">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Setup Complete
                </h3>
                <div className="flex items-center justify-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    7/7 Steps Completed
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {completedFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                        <IconComponent className={`w-5 h-5 ${feature.color}`} />
                      </div>
                      <p className="text-xs font-medium text-green-800 dark:text-green-200">
                        {feature.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <div>
            <h3 className="font-semibold mb-4 text-center">What would you like to do next?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:bg-accent/50">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                    <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Preview Guest App</h4>
                    <p className="text-sm text-muted-foreground">
                      See exactly how your content appears to guests
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={onPreviewGuest}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Experience
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:bg-accent/50">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                    <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Go to Dashboard</h4>
                    <p className="text-sm text-muted-foreground">
                      Manage bookings, properties, and performance
                    </p>
                  </div>
                  <Button 
                    className="w-full bg-primary text-primary-foreground"
                    onClick={onGoToDashboard}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Open Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Tips */}
          <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                💡 Pro Tips for Success
              </h4>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Update your property information regularly to keep guests informed</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Add seasonal recommendations to enhance the guest experience</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Monitor your dashboard to track booking performance and guest satisfaction</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default HostSetupComplete;