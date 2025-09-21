// Custom hook for HomeScreen data management
// Consolidates all data needs for the HomeScreen component

import { useState, useEffect } from 'react';
import { propertyService, type PropertyDetails, type GuestStayInfo } from '../services/propertyService';

export interface HomeScreenData {
  property: PropertyDetails | null;
  guestStay: GuestStayInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseHomeScreenDataOptions {
  mode: 'guest' | 'host';
  stayId?: string;
  propertyId?: string;
}

export function useHomeScreenData({ mode, stayId, propertyId }: UseHomeScreenDataOptions): HomeScreenData {
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [guestStay, setGuestStay] = useState<GuestStayInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (mode === 'guest' && stayId) {
        // Guest mode: fetch stay info (includes property details)
        const stayInfo = await propertyService.getCurrentGuestStay(stayId);
        setGuestStay(stayInfo);
        setProperty(stayInfo?.property || null);
      } else if (mode === 'host' && propertyId) {
        // Host mode: fetch property details
        const propertyDetails = await propertyService.getPropertyDetailsForHomeScreen(propertyId);
        setProperty(propertyDetails);
        setGuestStay(null);
      } else {
        // Default/demo mode: use mock data
        const propertyDetails = await propertyService.getPropertyDetailsForHomeScreen();
        setProperty(propertyDetails);
        setGuestStay(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mode, stayId, propertyId]);

  return {
    property,
    guestStay,
    loading,
    error,
    refetch: fetchData
  };
}

// Hook for property essentials (WiFi, Check-in, etc.)
export interface PropertyEssentials {
  wifi?: {
    name: string;
    password: string;
  };
  checkIn?: {
    instructions?: string;
    emergencyContact?: string;
  };
  location?: {
    address: string;
    city: string;
    country: string;
  };
  rules?: string;
}

export function usePropertyEssentials(propertyId?: string) {
  const [essentials, setEssentials] = useState<PropertyEssentials | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEssentials = async () => {
    if (!propertyId) {
      setEssentials(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const essentialsData = await propertyService.getPropertyEssentials(propertyId);
      setEssentials(essentialsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load essentials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEssentials();
  }, [propertyId]);

  return {
    essentials,
    loading,
    error,
    refetch: fetchEssentials
  };
}