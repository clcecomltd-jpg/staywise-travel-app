import React from 'react';
import { DollarSign, Globe, Check, LogIn, LogOut, Settings2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuGroup,
} from './ui/dropdown-menu';
import { useSettings } from './contexts/SettingsContext';
import { useAuth } from './contexts/AuthContext';

interface SettingsDropdownProps {
  children: React.ReactNode;
  onProfileClick?: () => void;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({ children, onProfileClick }) => {
  const { currency, setCurrency, language, setLanguage, currencies, languages } = useSettings();
  const { isAuthenticated, login, logout } = useAuth();

  // Ensure Profile Click Handler is always available
  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      // Fallback: try to trigger profile navigation
      console.log('Navigate to profile');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="uppercase tracking-wide text-[11px] text-muted-foreground">
          StayWise Preferences
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent/50 focus:bg-accent/50">
              <Globe className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Language</span>
              <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                <span>{language.flag}</span>
                <span className="font-medium uppercase">{language.code}</span>
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48">
              <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                Choose Language
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onSelect={() => {
                    setLanguage(lang);
                  }}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                  {language.code === lang.code && (
                    <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent/50 focus:bg-accent/50">
              <DollarSign className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Currency</span>
              <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                <span className="font-medium">{currency.code}</span>
                <span>{currency.symbol}</span>
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48">
              <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                Choose Currency
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {currencies.map((curr) => (
                <DropdownMenuItem
                  key={curr.code}
                  onSelect={() => {
                    setCurrency(curr);
                  }}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <span>{curr.symbol}</span>
                    <span className="font-medium">{curr.code}</span>
                  </span>
                  {currency.code === curr.code && (
                    <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="uppercase tracking-wide text-[11px] text-muted-foreground">
          Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {isAuthenticated ? (
            <>
              <DropdownMenuItem onSelect={handleProfileClick}>
                <Settings2 className="h-4 w-4 mr-2" aria-hidden="true" />
                Manage account
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={logout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                Log out
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onSelect={login}>
              <LogIn className="h-4 w-4 mr-2" aria-hidden="true" />
              Log in / Sign up
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsDropdown;
