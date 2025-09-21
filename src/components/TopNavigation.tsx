
import React from 'react';
import { Compass, Settings, Globe, User, LogOut } from 'lucide-react';
import { ThemeToggle } from './theme-toggle'; // Assuming this component exists
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const TopNavigation: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full glass-header shadow-md backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Compass className="h-8 w-8 text-primary compass-glow" />
          <span className="text-title-lg font-bold text-gray-900 dark:text-glow-gold">StayWise</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="outline-ring rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                <Settings className="h-6 w-6" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              align="end"
              className="dropdown-slide w-48 rounded-lg border bg-white p-2 shadow-lg dark:bg-gray-800"
            >
              <DropdownMenu.Item className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Globe className="h-4 w-4" />
                <span>EN / TH</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              <DropdownMenu.Item className="flex items-center gap-2 rounded-md px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
