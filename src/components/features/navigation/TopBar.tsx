import React from 'react';
import { Moon, Settings, Sun } from 'lucide-react';
import CompassIcon3D from './CompassIcon3D';
import SettingsDropdown from '../../SettingsDropdown';
import { Button } from '../../ui/button';
import { useTheme } from '../../contexts/ThemeContext';

const TopBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleBrandClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDark = theme === 'dark';

  return (
    <header className="top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-5 lg:max-w-[840px] lg:px-6">
        <button
          type="button"
          onClick={handleBrandClick}
          className="flex items-center gap-3 rounded-xl px-1 py-1 text-left transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="StayWise home"
        >
          <CompassIcon3D />
          <span className="text-base font-semibold text-foreground tracking-tight">
            Stay<span className="text-primary">Wise</span>
          </span>
        </button>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            onClick={toggleTheme}
            className="rounded-full"
            data-testid="topbar-theme-toggle"
          >
            {isDark ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
          <SettingsDropdown>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Open settings menu"
              className="rounded-full"
              data-testid="topbar-settings-trigger"
            >
              <Settings className="h-5 w-5" aria-hidden="true" />
            </Button>
          </SettingsDropdown>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
