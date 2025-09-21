import React from 'react';
import { ArrowLeft, Home, MapPin } from 'lucide-react';
import { Button } from './ui/button';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onBackToOnboarding?: () => void;
  showTravelGuideLink?: boolean;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onBackToOnboarding,
  showTravelGuideLink = true
}) => {
  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 hover:bg-muted rounded-full"
            aria-label="Go back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Home Icon */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 hover:bg-accent/50 transition-all duration-200 active:scale-95 active:bg-primary/10"
            title="Return to Home"
            aria-label="Return to Home screen"
          >
            <Home className="w-5 h-5 text-foreground transition-colors duration-200 active:text-primary" />
          </Button>

          {/* TravelGuide Reset Link */}
          {showTravelGuideLink && onBackToOnboarding && (
            <button
              onClick={onBackToOnboarding}
              className="flex items-center space-x-1 hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded-lg p-1"
              title="Return to onboarding"
              aria-label="Return to onboarding flow"
            >
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-sm transition-transform duration-200 hover:scale-105">
                <MapPin className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">TravelGuide</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenHeader;