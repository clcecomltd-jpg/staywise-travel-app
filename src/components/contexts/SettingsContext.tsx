import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

interface SettingsContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  currencies: Currency[];
  languages: Language[];
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const CURRENCIES: Currency[] = [
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]); // Default to USD
  const [language, setLanguage] = useState<Language>(LANGUAGES[0]); // Default to English
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Only access localStorage after hydration
    setIsHydrated(true);
    
    // Load saved preferences
    const savedCurrency = localStorage.getItem('currency');
    const savedLanguage = localStorage.getItem('language');

    if (savedCurrency) {
      const foundCurrency = CURRENCIES.find(c => c.code === savedCurrency);
      if (foundCurrency) {
        setCurrency(foundCurrency);
      }
    }

    if (savedLanguage) {
      const foundLanguage = LANGUAGES.find(l => l.code === savedLanguage);
      if (foundLanguage) {
        setLanguage(foundLanguage);
      }
    }
  }, []);

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    if (isHydrated) {
      localStorage.setItem('currency', newCurrency.code);
    }
  };

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    if (isHydrated) {
      localStorage.setItem('language', newLanguage.code);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        language,
        setLanguage: handleSetLanguage,
        currencies: CURRENCIES,
        languages: LANGUAGES,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
