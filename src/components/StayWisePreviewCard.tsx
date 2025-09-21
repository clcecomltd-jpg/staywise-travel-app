import React from 'react';
import { ExternalLink, Smartphone, Star, MapPin } from 'lucide-react';
import { StayWiseLogo } from './ui/staywise-logo';

interface StayWisePreviewCardProps {
  onLaunch: () => void;
  className?: string;
}

const StayWisePreviewCard: React.FC<StayWisePreviewCardProps> = ({ 
  onLaunch, 
  className = '' 
}) => {
  return (
    <div className={`h-full w-full overflow-hidden ${className}`}>
      {/* Hero Section with Gradient Background */}
      <div className="relative h-full glass-card-hover cursor-pointer" onClick={onLaunch}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-orange-500/10" />
        
        {/* Floating Geometric Shapes */}
        <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-xl animate-float" />
        <div className="absolute bottom-12 left-12 w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400/20 to-red-400/20 blur-lg animate-float" style={{ animationDelay: '1s' }} />
        
        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <StayWiseLogo className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white/95 font-medium text-lg">StayWise</h1>
                <p className="text-white/70 text-sm">Travel Guide App</p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-white/60" />
          </div>

          {/* Features Grid */}
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-white/95 text-xl font-medium">Your Smart Travel Companion</h2>
              <p className="text-white/70 text-sm leading-relaxed max-w-md mx-auto">
                Discover personalized recommendations, connect with hosts, and explore destinations with confidence.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-float p-4 rounded-2xl text-center">
                <MapPin className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-white/80 text-xs font-medium">Local Guides</p>
              </div>
              <div className="glass-float p-4 rounded-2xl text-center">
                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-white/80 text-xs font-medium">Host Insights</p>
              </div>
              <div className="glass-float p-4 rounded-2xl text-center">
                <Smartphone className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-white/80 text-xs font-medium">Mobile First</p>
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <div className="text-center space-y-4">
            <div className="glass-button px-6 py-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg hover:bg-white/15 transition-all duration-200">
              <span className="text-white/95 font-medium">Launch StayWise App</span>
            </div>
            <p className="text-white/50 text-xs">Click anywhere to open</p>
          </div>
        </div>

        {/* Shimmer Effect */}
        <div className="glass-shimmer absolute inset-0 rounded-2xl" />
      </div>
    </div>
  );
};

export default StayWisePreviewCard;