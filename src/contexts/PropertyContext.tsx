// Property Context - Provides property data across the app
// Integrates with Supabase and manages property state

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { propertyService, type PropertyDetails, type GuestStayInfo } from '../services/propertyService';

interface PropertyState {
  currentProperty: PropertyDetails | null;
  currentStay: GuestStayInfo | null;
  properties: PropertyDetails[];
  loading: boolean;
  error: string | null;
}

type PropertyAction =
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_CURRENT_PROPERTY'; property: PropertyDetails | null }
  | { type: 'SET_CURRENT_STAY'; stay: GuestStayInfo | null }
  | { type: 'SET_PROPERTIES'; properties: PropertyDetails[] }
  | { type: 'UPDATE_PROPERTY'; propertyId: string; updates: Partial<PropertyDetails> };

const initialState: PropertyState = {
  currentProperty: null,
  currentStay: null,
  properties: [],
  loading: false,
  error: null
};

function propertyReducer(state: PropertyState, action: PropertyAction): PropertyState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    case 'SET_ERROR':
      return { ...state, error: action.error, loading: false };
    case 'SET_CURRENT_PROPERTY':
      return { ...state, currentProperty: action.property, loading: false };
    case 'SET_CURRENT_STAY':
      return { ...state, currentStay: action.stay, loading: false };
    case 'SET_PROPERTIES':
      return { ...state, properties: action.properties, loading: false };
    case 'UPDATE_PROPERTY':
      return {
        ...state,
        currentProperty: state.currentProperty?.id === action.propertyId
          ? { ...state.currentProperty, ...action.updates }
          : state.currentProperty,
        properties: state.properties.map(prop =>
          prop.id === action.propertyId ? { ...prop, ...action.updates } : prop
        )
      };
    default:
      return state;
  }
}

interface PropertyContextType {
  state: PropertyState;
  loadProperty: (propertyId: string) => Promise<void>;
  loadGuestStay: (stayId: string) => Promise<void>;
  loadProperties: (accountId: string) => Promise<void>;
  updateProperty: (propertyId: string, updates: Partial<PropertyDetails>) => Promise<void>;
  clearProperty: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

interface PropertyProviderProps {
  children: React.ReactNode;
  initialPropertyId?: string;
  initialStayId?: string;
}

export function PropertyProvider({ children, initialPropertyId, initialStayId }: PropertyProviderProps) {
  const [state, dispatch] = useReducer(propertyReducer, initialState);

  const loadProperty = async (propertyId: string) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    dispatch({ type: 'SET_ERROR', error: null });

    try {
      const property = await propertyService.getPropertyDetailsForHomeScreen(propertyId);
      dispatch({ type: 'SET_CURRENT_PROPERTY', property });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error instanceof Error ? error.message : 'Failed to load property' });
    }
  };

  const loadGuestStay = async (stayId: string) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    dispatch({ type: 'SET_ERROR', error: null });

    try {
      const stay = await propertyService.getCurrentGuestStay(stayId);
      dispatch({ type: 'SET_CURRENT_STAY', stay });
      if (stay?.property) {
        dispatch({ type: 'SET_CURRENT_PROPERTY', property: stay.property });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error instanceof Error ? error.message : 'Failed to load stay' });
    }
  };

  const loadProperties = async (accountId: string) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    dispatch({ type: 'SET_ERROR', error: null });

    try {
      // TODO: Implement when multiple property support is added
      // For now, just load the default property
      const property = await propertyService.getPropertyDetailsForHomeScreen();
      dispatch({ type: 'SET_PROPERTIES', properties: [property] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error instanceof Error ? error.message : 'Failed to load properties' });
    }
  };

  const updateProperty = async (propertyId: string, updates: Partial<PropertyDetails>) => {
    try {
      const success = await propertyService.updatePropertyDetails(propertyId, updates);
      if (success) {
        dispatch({ type: 'UPDATE_PROPERTY', propertyId, updates });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error instanceof Error ? error.message : 'Failed to update property' });
    }
  };

  const clearProperty = () => {
    dispatch({ type: 'SET_CURRENT_PROPERTY', property: null });
    dispatch({ type: 'SET_CURRENT_STAY', stay: null });
  };

  // Auto-load initial data
  useEffect(() => {
    if (initialPropertyId) {
      loadProperty(initialPropertyId);
    } else if (initialStayId) {
      loadGuestStay(initialStayId);
    }
  }, [initialPropertyId, initialStayId]);

  return (
    <PropertyContext.Provider value={{
      state,
      loadProperty,
      loadGuestStay,
      loadProperties,
      updateProperty,
      clearProperty
    }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
}

// Convenience hooks for specific property data
export function useCurrentProperty() {
  const { state } = useProperty();
  return state.currentProperty;
}

export function useCurrentStay() {
  const { state } = useProperty();
  return state.currentStay;
}

export function usePropertyLoading() {
  const { state } = useProperty();
  return state.loading;
}