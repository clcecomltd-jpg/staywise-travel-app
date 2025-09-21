import React, { createContext, useContext, useMemo, useState } from 'react';
import type { ImportedProperty } from '../../lib/propertyImport';

interface PropertyState {
  property: ImportedProperty | null;
  setProperty: (property: ImportedProperty | null) => void;
}

const PropertyContext = createContext<PropertyState | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [property, setProperty] = useState<ImportedProperty | null>(null);

  const value = useMemo(() => ({ property, setProperty }), [property]);

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
};

export const useProperty = (): PropertyState => {
  const context = useContext(PropertyContext);

  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }

  return context;
};