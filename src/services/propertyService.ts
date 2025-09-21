// Property service - abstraction layer for property data management
// Integrates with HomeScreen and prepares for Supabase backend

import { db } from './database';
import type { Property, Stay } from '../types/database';

export interface PropertyDetails {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  checkInDate?: string;
  checkOutDate?: string;
  hostName?: string;
  hostEmail?: string;
  wifiCredentials?: {
    name: string;
    password: string;
  };
  checkInInstructions?: string;
  houseRules?: string;
  emergencyContact?: string;
}

export interface GuestStayInfo {
  stayId: string;
  guestName: string;
  guestCount: number;
  arrivalDate: string;
  departureDate: string;
  specialRequests?: string;
  property: PropertyDetails;
}

export class PropertyService {
  private static instance: PropertyService;

  static getInstance(): PropertyService {
    if (!PropertyService.instance) {
      PropertyService.instance = new PropertyService();
    }
    return PropertyService.instance;
  }

  // Get property details for the HomeScreen
  async getPropertyDetailsForHomeScreen(propertyId?: string): Promise<PropertyDetails> {
    // For now, return mock data that matches what HomeScreen expects
    // This will be replaced with actual Supabase queries
    const mockProperty: PropertyDetails = {
      id: propertyId || 'prop_1',
      name: 'Sunset Villa Bangkok',
      address: '123 Silom Road, Bangrak, Bangkok 10500, Thailand',
      city: 'Bangkok',
      country: 'Thailand',
      checkInDate: 'Dec 25',
      checkOutDate: 'Dec 28',
      hostName: 'Maria Santos',
      hostEmail: 'maria@example.com',
      wifiCredentials: {
        name: 'SunsetVilla_WiFi',
        password: 'Bangkok2024!'
      },
      checkInInstructions: 'Use the smart lock with code 1234. Key box is by the front door.',
      houseRules: 'No smoking, no parties, quiet hours 10pm-8am',
      emergencyContact: '+66 2 123 4567'
    };

    // TODO: Replace with Supabase query when backend is ready
    // const property = await db.getProperty(propertyId);
    // return this.transformToPropertyDetails(property);

    return mockProperty;
  }

  // Get current guest stay information
  async getCurrentGuestStay(stayId?: string): Promise<GuestStayInfo | null> {
    // Mock data for guest access
    if (!stayId) return null;

    const mockStayInfo: GuestStayInfo = {
      stayId: stayId,
      guestName: 'John Smith',
      guestCount: 2,
      arrivalDate: '2024-12-25',
      departureDate: '2024-12-28',
      specialRequests: 'Late check-in around 8pm',
      property: await this.getPropertyDetailsForHomeScreen('prop_1')
    };

    // TODO: Replace with Supabase query when backend is ready
    // const stay = await db.getCurrentStay(stayId);
    // const property = await db.getProperty(stay.property_id);
    // return this.transformToGuestStayInfo(stay, property);

    return mockStayInfo;
  }

  // Transform Supabase Property to PropertyDetails (for future use)
  private transformToPropertyDetails(property: Property, stay?: Stay): PropertyDetails {
    return {
      id: property.id,
      name: property.name,
      address: property.address,
      city: property.city,
      country: property.country,
      checkInDate: stay ? this.formatDate(stay.arrival_date) : undefined,
      checkOutDate: stay ? this.formatDate(stay.departure_date) : undefined,
      hostName: 'Host', // Will come from account relationship
      hostEmail: 'host@example.com', // Will come from account relationship
      wifiCredentials: property.wifi_name && property.wifi_password ? {
        name: property.wifi_name,
        password: property.wifi_password
      } : undefined,
      checkInInstructions: property.check_in_instructions || undefined,
      houseRules: property.house_rules || undefined,
      emergencyContact: undefined // Will come from account/property settings
    };
  }

  // Format date for display (Dec 25 format)
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  // Get property essentials for quick access
  async getPropertyEssentials(propertyId: string) {
    const property = await this.getPropertyDetailsForHomeScreen(propertyId);

    return {
      wifi: property.wifiCredentials,
      checkIn: {
        instructions: property.checkInInstructions,
        emergencyContact: property.emergencyContact
      },
      location: {
        address: property.address,
        city: property.city,
        country: property.country
      },
      rules: property.houseRules
    };
  }

  // Update property data (for host interface)
  async updatePropertyDetails(propertyId: string, updates: Partial<PropertyDetails>): Promise<boolean> {
    try {
      // TODO: Implement Supabase update when backend is ready
      // await db.updateProperty(propertyId, updates);

      console.log('Property update simulated:', { propertyId, updates });
      return true;
    } catch (error) {
      console.error('Failed to update property:', error);
      return false;
    }
  }
}

// Export singleton instance
export const propertyService = PropertyService.getInstance();