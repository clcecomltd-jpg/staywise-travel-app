// Database types aligned with Supabase schema from integration plan

export type ProviderType = 'airbnb' | 'vrbo' | 'booking' | 'manual';
export type AccountRole = 'owner' | 'manager' | 'support';

export interface Account {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AccountMembership {
  id: string;
  account_id: string;
  user_id: string;
  role: AccountRole;
  created_at: string;
}

export interface Property {
  id: string;
  account_id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  property_type: string;
  provider_type: ProviderType;
  provider_listing_id?: string;
  provider_url?: string;
  check_in_instructions?: string;
  wifi_name?: string;
  wifi_password?: string;
  house_rules?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyImport {
  id: string;
  property_id: string;
  provider_type: ProviderType;
  provider_url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  raw_data?: any;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyAsset {
  id: string;
  property_id: string;
  url: string;
  asset_type: 'photo' | 'document';
  description?: string;
  sort_order: number;
  created_at: string;
}

export interface Stay {
  id: string;
  property_id: string;
  guest_name: string;
  guest_email?: string;
  guest_phone?: string;
  arrival_date: string;
  departure_date: string;
  guest_count: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface GuestAccessToken {
  id: string;
  stay_id: string;
  token_hash: string;
  expires_at: string;
  used_at?: string;
  created_at: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: string;
  created_at: string;
}

export interface PropertyAmenity {
  id: string;
  property_id: string;
  amenity_id: string;
  created_at: string;
}

// Response types for API calls
export interface PropertyImportResponse {
  success: boolean;
  property?: Property;
  import_record?: PropertyImport;
  error?: string;
}

'''export interface GuestLinkResponse {
  success: boolean;
  link?: string;
  expires_at?: string;
  error?: string;
}

export interface Recommendation {
  id: string;
  hostId?: string; // or account_id
  category: 'food' | 'tours' | 'events' | 'experiences' | 'essentials' | string;
  title: string;
  description: string;
  price?: number;
  currency?: string;
  imageUrl: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  isHostOffer?: boolean;
}''