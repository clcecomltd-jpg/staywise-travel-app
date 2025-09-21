// React hooks for guest stay management
// Provides interface for guest access to their stay data

import { useState, useEffect } from 'react';
import { db } from '../services/database';
import type { Stay, Property, GuestLinkResponse } from '../types/database';

export interface UseStayResult {
  stay: Stay | null;
  property: Property | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useStay(stayId: string | null): UseStayResult {
  const [stay, setStay] = useState<Stay | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStayData = async () => {
    if (!stayId) {
      setStay(null);
      setProperty(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch stay data
      const stayResult = await db.getCurrentStay(stayId);
      setStay(stayResult);

      // Fetch associated property data
      if (stayResult?.property_id) {
        const propertyResult = await db.getProperty(stayResult.property_id);
        setProperty(propertyResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stay data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStayData();
  }, [stayId]);

  return {
    stay,
    property,
    loading,
    error,
    refetch: fetchStayData
  };
}

export interface UseGuestLinkResult {
  createGuestLink: (stayId: string) => Promise<GuestLinkResponse>;
  loading: boolean;
  error: string | null;
}

export function useGuestLink(): UseGuestLinkResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGuestLink = async (stayId: string): Promise<GuestLinkResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await db.createGuestLink(stayId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create guest link';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createGuestLink,
    loading,
    error
  };
}