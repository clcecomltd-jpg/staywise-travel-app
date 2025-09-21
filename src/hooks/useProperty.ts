// React hooks for property data management
// Provides a clean interface for components to access property data

import { useState, useEffect } from 'react';
import { db } from '../services/database';
import type { Property, PropertyImportResponse, ProviderType } from '../types/database';

export interface UsePropertyResult {
  property: Property | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProperty(propertyId: string | null): UsePropertyResult {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = async () => {
    if (!propertyId) {
      setProperty(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await db.getProperty(propertyId);
      setProperty(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch property');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  return {
    property,
    loading,
    error,
    refetch: fetchProperty
  };
}

export interface UsePropertiesResult {
  properties: Property[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProperties(accountId: string | null): UsePropertiesResult {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    if (!accountId) {
      setProperties([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await db.getPropertiesByAccount(accountId);
      setProperties(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [accountId]);

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties
  };
}

export interface UsePropertyImportResult {
  importProperty: (providerType: ProviderType, url: string) => Promise<PropertyImportResponse>;
  loading: boolean;
  error: string | null;
}

export function usePropertyImport(): UsePropertyImportResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const importProperty = async (providerType: ProviderType, url: string): Promise<PropertyImportResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await db.importProperty(providerType, url);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import property';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    importProperty,
    loading,
    error
  };
}