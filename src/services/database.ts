// Database service layer - abstraction for Supabase integration
// This provides a clean interface that can work with mock data now and Supabase later

import type {
  Property,
  PropertyImport,
  Stay,
  Account,
  PropertyImportResponse,
  GuestLinkResponse,
  ProviderType
} from '../types/database';

// Mock data for development - will be replaced with Supabase queries
const MOCK_PROPERTY: Property = {
  id: 'prop_1',
  account_id: 'acc_1',
  name: 'Sunset Villa Bangkok',
  description: 'A beautiful villa in the heart of Bangkok with stunning city views',
  address: '123 Silom Road, Bangrak, Bangkok 10500, Thailand',
  city: 'Bangkok',
  country: 'Thailand',
  latitude: 13.7563,
  longitude: 100.5018,
  bedrooms: 3,
  bathrooms: 2,
  max_guests: 6,
  property_type: 'Villa',
  provider_type: 'airbnb',
  provider_listing_id: 'airbnb_12345',
  provider_url: 'https://airbnb.com/rooms/12345',
  check_in_instructions: 'Use the smart lock with code 1234. Key box is by the front door.',
  wifi_name: 'SunsetVilla_WiFi',
  wifi_password: 'Bangkok2024!',
  house_rules: 'No smoking, no parties, quiet hours 10pm-8am',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

const MOCK_STAY: Stay = {
  id: 'stay_1',
  property_id: 'prop_1',
  guest_name: 'John Smith',
  guest_email: 'john@example.com',
  guest_phone: '+1234567890',
  arrival_date: '2024-12-25',
  departure_date: '2024-12-28',
  guest_count: 2,
  status: 'active',
  special_requests: 'Late check-in around 8pm',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

export class DatabaseService {
  private static instance: DatabaseService;
  private isSupabaseEnabled = false; // Will be true when Supabase is integrated

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Property management
  async getProperty(propertyId: string): Promise<Property | null> {
    if (this.isSupabaseEnabled) {
      // TODO: Replace with Supabase query
      // return supabase.from('properties').select('*').eq('id', propertyId).single()
      throw new Error('Supabase integration not yet implemented');
    }

    // Mock implementation
    if (propertyId === 'prop_1') {
      return MOCK_PROPERTY;
    }
    return null;
  }

  async getPropertiesByAccount(accountId: string): Promise<Property[]> {
    if (this.isSupabaseEnabled) {
      // TODO: Replace with Supabase query with RLS
      // return supabase.from('properties').select('*').eq('account_id', accountId)
      throw new Error('Supabase integration not yet implemented');
    }

    // Mock implementation
    return [MOCK_PROPERTY];
  }

  async importProperty(providerType: ProviderType, providerUrl: string): Promise<PropertyImportResponse> {
    if (this.isSupabaseEnabled) {
      // TODO: Call Supabase Edge Function 'import-listing'
      // const { data, error } = await supabase.functions.invoke('import-listing', {
      //   body: { provider: providerType, url: providerUrl }
      // })
      throw new Error('Supabase integration not yet implemented');
    }

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

    return {
      success: true,
      property: {
        ...MOCK_PROPERTY,
        id: `prop_${Date.now()}`,
        provider_type: providerType,
        provider_url: providerUrl,
        name: `Imported ${providerType} Property`
      }
    };
  }

  // Guest access management
  async getCurrentStay(stayId: string): Promise<Stay | null> {
    if (this.isSupabaseEnabled) {
      // TODO: Replace with Supabase query with RLS for guest access
      // return supabase.from('stays').select('*').eq('id', stayId).single()
      throw new Error('Supabase integration not yet implemented');
    }

    // Mock implementation
    if (stayId === 'stay_1') {
      return MOCK_STAY;
    }
    return null;
  }

  async createGuestLink(stayId: string): Promise<GuestLinkResponse> {
    if (this.isSupabaseEnabled) {
      // TODO: Call Supabase Edge Function 'issue-guest-link'
      // const { data, error } = await supabase.functions.invoke('issue-guest-link', {
      //   body: { stay_id: stayId }
      // })
      throw new Error('Supabase integration not yet implemented');
    }

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

    return {
      success: true,
      link: `https://staywise.app/guest/${stayId}?token=mock_token_${Date.now()}`,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
  }

  // Account management
  async getCurrentAccount(): Promise<Account | null> {
    if (this.isSupabaseEnabled) {
      // TODO: Get from Supabase auth user
      // const { data: { user } } = await supabase.auth.getUser()
      // return supabase.from('accounts').select('*').eq('id', user.id).single()
      throw new Error('Supabase integration not yet implemented');
    }

    // Mock implementation
    return {
      id: 'acc_1',
      name: 'Maria Santos',
      email: 'maria@example.com',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };
  }

  // Utility methods for future Supabase integration
  enableSupabase() {
    this.isSupabaseEnabled = true;
  }

  isUsingSupabase(): boolean {
    return this.isSupabaseEnabled;
  }
}

// Export singleton instance
export const db = DatabaseService.getInstance();