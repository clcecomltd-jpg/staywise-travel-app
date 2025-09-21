import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { StayWiseLogo } from './staywise-logo';

interface GlassTopBarProps {
  sectionName?: string;
  onLogoClick?: () => void;
  darkMode?: boolean;
  onDarkModeToggle?: () => void;
  className?: string;
}

export const GlassTopBar: React.FC<GlassTopBarProps> = ({
  sectionName = 'Home',
  onLogoClick,
  darkMode = false,
  onDarkModeToggle,
  className = ''
}) => {
  return (
    <div className={`glass-header sticky top-0 z-50 px-5 py-3 safe-area-inset-top ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left: StayWise Logo with Full Text */}
        <button
          onClick={onLogoClick}
          className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
        >
          <StayWiseLogo variant="full" size="sm" />
        </button>

        {/* Center: Empty - no section name per TurboPrompt specs */}
        <div></div>

        {/* Right: Dark Mode Toggle */}
        <button
          onClick={onDarkModeToggle}
          className="w-10 h-10 rounded-full glass-button flex items-center justify-center hover:scale-105 transition-all duration-200"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-blue-300" />
          )}
        </button>
      </div>
    </div>
  );
};

export default GlassTopBar;