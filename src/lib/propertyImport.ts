import { getSupabaseClient } from './supabaseClient';

export interface ImportedProperty {
  id?: string;
  provider: string;
  providerUrl?: string;
  name: string;
  headline?: string;
  description?: string;
  location?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  coordinates?: { lat: number; lng: number } | null;
  photos: string[];
  amenities: string[];
  checkIn?: string;
  checkOut?: string;
}

interface ImportListingParams {
  provider: string;
  url?: string;
  manualPayload?: Partial<ImportedProperty>;
}

interface ImportListingResponse {
  property: ImportedProperty;
}

const FALLBACK_PROPERTY: ImportedProperty = {
  provider: 'manual',
  name: 'Modern Riverside Apartment',
  headline: 'City skyline views and curated experiences',
  description:
    'Spacious open-plan living with floor-to-ceiling windows, a private balcony overlooking the river, and smart amenities curated for digital nomads.',
  location: 'Vientiane, Laos',
  city: 'Vientiane',
  country: 'Laos',
  photos: [
    'https://images.unsplash.com/photo-1594873604892-b599f847e859?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1611234688667-76b6d8fadd75?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1603072819161-e864800276cd?w=1200&h=800&fit=crop',
  ],
  amenities: [
    'Fast Wi-Fi',
    'Air conditioning',
    'Full kitchen',
    'Washer & dryer',
    'Self check-in',
    'Coffee maker',
    'Dedicated workspace',
  ],
  checkIn: '3:00 PM - 9:00 PM',
  checkOut: '11:00 AM',
};

export const importPropertyFromSupabase = async (
  params: ImportListingParams,
): Promise<ImportedProperty> => {
  const { provider, url, manualPayload } = params;

  // Manual payload bypasses remote call.
  if (provider === 'manual' && manualPayload) {
    return {
      ...FALLBACK_PROPERTY,
      ...manualPayload,
      provider,
    };
  }

  try {
    const client = getSupabaseClient();

    const { data, error } = await client.functions.invoke<ImportListingResponse>(
      'import-listing',
      {
        body: { provider, url },
      },
    );

    if (error) {
      throw error;
    }

    if (!data?.property) {
      throw new Error('No property data returned from Supabase');
    }

    return data.property;
  } catch (error) {
    console.warn('[propertyImport] Falling back to local sample data:', error);
    return {
      ...FALLBACK_PROPERTY,
      provider,
      providerUrl: url,
    };
  }
};
