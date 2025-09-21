import React from 'react';
import { Moon, Sun, Globe, DollarSign, Bell, Shield, MessageCircle, LifeBuoy, ExternalLink, ChevronRight } from 'lucide-react';
import ScreenHeader from '../ScreenHeader';
import { GlassCard } from '../ui/glass-card';
import { Switch } from '../ui/switch';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface SettingsScreenProps {
  onBack: () => void;
  onBackToOnboarding?: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onBackToOnboarding }) => {
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency, currencies, language, setLanguage, languages } = useSettings();
  const isDarkMode = theme === 'dark';

  const appearanceIcon = isDarkMode ? <Sun className="h-5 w-5 text-yellow-300" /> : <Moon className="h-5 w-5 text-sky-400" />;

  const handleCurrencyChange = (value: string) => {
    const nextCurrency = currencies.find((item) => item.code === value);
    if (nextCurrency) {
      setCurrency(nextCurrency);
    }
  };

  const handleLanguageChange = (value: string) => {
    const nextLanguage = languages.find((item) => item.code === value);
    if (nextLanguage) {
      setLanguage(nextLanguage);
    }
  };

  const supportActions = [
    {
      id: 'notifications',
      title: 'Notification Preferences',
      description: 'Choose how we keep you updated',
      icon: <Bell className="h-4 w-4 text-sky-400" />,
      action: () => window.alert('Notification preferences will arrive in the next update.'),
    },
    {
      id: 'safety',
      title: 'Safety Centre',
      description: 'Guides and emergency contacts',
      icon: <Shield className="h-4 w-4 text-emerald-400" />,
      action: () => window.open('https://staywise.example.com/safety', '_blank'),
    },
    {
      id: 'support',
      title: 'Message Support',
      description: 'Chat with the StayWise team',
      icon: <MessageCircle className="h-4 w-4 text-indigo-400" />,
      action: () => window.open('mailto:support@staywise.app', '_blank'),
    },
    {
      id: 'faq',
      title: 'Help Centre',
      description: 'Browse quick answers and guides',
      icon: <LifeBuoy className="h-4 w-4 text-purple-400" />,
      action: () => window.open('https://staywise.example.com/help', '_blank'),
    },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <ScreenHeader
        title="Settings"
        subtitle="Tailor your StayWise experience"
        onBack={onBack}
        onBackToOnboarding={onBackToOnboarding}
      />

      <div className="px-6 py-6 pb-24 space-y-6">
        {/* Appearance */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Appearance</p>
              <h2 className="text-lg font-semibold text-foreground">Theme preference</h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                Toggle dark mode for softer night-time viewing. We’ll remember your choice across sessions.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                {appearanceIcon}
              </div>
              <Switch checked={isDarkMode} onCheckedChange={toggleTheme} aria-label="Toggle dark mode" />
            </div>
          </div>
        </GlassCard>

        {/* Localization */}
        <GlassCard className="p-6 space-y-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Travel essentials</p>
            <h2 className="text-lg font-semibold text-foreground">Language & currency</h2>
            <p className="text-sm text-muted-foreground">
              Personalise how StayWise speaks to you and displays prices.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Currency</span>
              <Select value={currency.code} onValueChange={handleCurrencyChange}>
                <SelectTrigger className="h-12 rounded-xl border border-border/40 bg-background/70 text-left">
                  <SelectValue>
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="rounded-full px-3 py-1">
                        {currency.symbol}
                      </Badge>
                      <div className="text-sm">
                        <p className="font-medium text-foreground">{currency.code}</p>
                        <p className="text-xs text-muted-foreground">{currency.name}</p>
                      </div>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectGroup>
                    {currencies.map((item) => (
                      <SelectItem key={item.code} value={item.code} className="py-2">
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                              {item.symbol}
                            </Badge>
                            <div className="text-sm text-foreground">
                              <p className="font-medium">{item.code}</p>
                              <p className="text-xs text-muted-foreground">{item.name}</p>
                            </div>
                          </div>
                          {item.code === currency.code && <ChevronRight className="h-4 w-4 text-primary" />}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Language</span>
              <Select value={language.code} onValueChange={handleLanguageChange}>
                <SelectTrigger className="h-12 rounded-xl border border-border/40 bg-background/70 text-left">
                  <SelectValue>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg" role="img" aria-hidden>
                        {language.flag}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{language.name}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">{language.code}</p>
                      </div>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectGroup>
                    {languages.map((item) => (
                      <SelectItem key={item.code} value={item.code} className="py-2">
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg" role="img" aria-label={item.name}>
                              {item.flag}
                            </span>
                            <span className="text-sm text-foreground">{item.name}</span>
                          </div>
                          {item.code === language.code && <ChevronRight className="h-4 w-4 text-primary" />}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassCard>

        {/* Support and help */}
        <GlassCard className="p-6 space-y-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Support</p>
            <h2 className="text-lg font-semibold text-foreground">Need a hand?</h2>
            <p className="text-sm text-muted-foreground">
              Reach out anytime — Maria and the StayWise crew are a tap away.
            </p>
          </div>

          <div className="space-y-2">
            {supportActions.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-between rounded-2xl border border-border/30 bg-background/60 px-4 py-4 text-left hover:bg-primary/5"
                onClick={item.action}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </GlassCard>

        <div className="flex flex-col items-center justify-center space-y-2 pt-4 text-center text-xs text-muted-foreground">
          <p>StayWise Guest • Build 2.1.9</p>
          <button
            onClick={onBackToOnboarding}
            className="inline-flex items-center space-x-1 text-primary hover:underline"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Reset onboarding</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
