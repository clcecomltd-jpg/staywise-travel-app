import { supabase, DatabaseHelper } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { Property, PropertyImportResponse, PropertyImportRequest } from '../types/index.js';

export class PropertyService {
  private static instance: PropertyService;

  static getInstance(): PropertyService {
    if (!PropertyService.instance) {
      PropertyService.instance = new PropertyService();
    }
    return PropertyService.instance;
  }

  // Get property by ID
  async getProperty(propertyId: string): Promise<Property> {
    return DatabaseHelper.executeQuery(() =>
      supabase
        .from('properties')
        .select(`
          *,
          property_images (id, url, alt_text, sort_order, is_primary),
          property_amenities (
            id,
            amenities (id, name, icon, category)
          )
        `)
        .eq('id', propertyId)
        .eq('is_active', true)
        .single()
    );
  }

  // Get properties by account
  async getPropertiesByAccount(accountId: string, page: number = 1, limit: number = 20): Promise<{ properties: Property[]; total: number }> {
    const offset = (page - 1) * limit;

    const { data: properties, error, count } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (id, url, alt_text, sort_order, is_primary)
      `, { count: 'exact' })
      .eq('account_id', accountId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch properties: ${error.message}`);
    }

    return {
      properties: properties || [],
      total: count || 0
    };
  }

  // Create new property
  async createProperty(propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    const property = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('properties')
        .insert({
          ...propertyData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*')
        .single()
    );

    logger.info('Property created', { propertyId: property.id, accountId: property.account_id });
    return property;
  }

  // Update property
  async updateProperty(propertyId: string, updates: Partial<Property>): Promise<Property> {
    const property = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('properties')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId)
        .select('*')
        .single()
    );

    logger.info('Property updated', { propertyId, updates });
    return property;
  }

  // Delete property
  async deleteProperty(propertyId: string): Promise<void> {
    // Check for active bookings
    const { data: activeBookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('property_id', propertyId)
      .in('status', ['pending', 'confirmed']);

    if (activeBookings && activeBookings.length > 0) {
      throw new Error('Cannot delete property with active bookings');
    }

    await DatabaseHelper.executeQuery(() =>
      supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)
        .select('*')
        .single()
    );

    logger.info('Property deleted', { propertyId });
  }

  // Import property from external platform
  async importProperty(importData: PropertyImportRequest): Promise<PropertyImportResponse> {
    const { provider_type, provider_url, property_data } = importData;

    // Create import record
    const importRecord = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('property_imports')
        .insert({
          provider_type,
          provider_url,
          status: 'processing',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*')
        .single()
    );

    try {
      // TODO: Implement actual property import logic
      // This would involve calling external APIs or scraping services
      
      // For now, simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update import record status
      await supabase
        .from('property_imports')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', importRecord.id);

      // Create property from imported data
      const property = await this.createProperty({
        account_id: property_data?.account_id || '',
        name: property_data?.name || `Imported ${provider_type} Property`,
        description: property_data?.description,
        address: property_data?.address || '',
        city: property_data?.city || '',
        country: property_data?.country || '',
        latitude: property_data?.latitude,
        longitude: property_data?.longitude,
        bedrooms: property_data?.bedrooms || 1,
        bathrooms: property_data?.bathrooms || 1,
        max_guests: property_data?.max_guests || 1,
        property_type: property_data?.property_type || 'Apartment',
        provider_type,
        provider_listing_id: property_data?.provider_listing_id,
        provider_url,
        check_in_instructions: property_data?.check_in_instructions,
        wifi_name: property_data?.wifi_name,
        wifi_password: property_data?.wifi_password,
        house_rules: property_data?.house_rules,
        amenities: property_data?.amenities || [],
        is_active: true
      });

      logger.info('Property imported successfully', { 
        importId: importRecord.id, 
        propertyId: property.id, 
        provider_type 
      });

      return {
        success: true,
        property,
        import_record: {
          id: importRecord.id,
          status: 'completed'
        }
      };
    } catch (error) {
      // Update import record with error
      await supabase
        .from('property_imports')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          updated_at: new Date().toISOString()
        })
        .eq('id', importRecord.id);

      logger.error('Property import failed', { 
        importId: importRecord.id, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Import failed',
        import_record: {
          id: importRecord.id,
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  // Get property analytics
  async getPropertyAnalytics(propertyId: string, period: string = '30d'): Promise<any> {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get bookings data
    const { data: bookings } = await supabase
      .from('bookings')
      .select('total_amount, currency, created_at, status')
      .eq('property_id', propertyId)
      .gte('created_at', startDate.toISOString());

    // Get stays data
    const { data: stays } = await supabase
      .from('stays')
      .select('status, arrival_date, departure_date')
      .eq('property_id', propertyId)
      .gte('arrival_date', startDate.toISOString());

    // Calculate metrics
    const totalRevenue = bookings?.reduce((sum, booking) => 
      booking.status === 'confirmed' ? sum + booking.total_amount : sum, 0) || 0;
    
    const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
    const totalBookings = bookings?.length || 0;
    const occupancyRate = totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0;

    // Get upcoming stays
    const today = new Date().toISOString().split('T')[0];
    const upcomingStays = stays?.filter(s => 
      s.status === 'upcoming' && s.arrival_date >= today
    ).length || 0;

    return {
      period,
      total_revenue: totalRevenue,
      total_bookings: totalBookings,
      confirmed_bookings: confirmedBookings,
      occupancy_rate: Math.round(occupancyRate * 100) / 100,
      upcoming_stays: upcomingStays,
      bookings_over_time: bookings?.map(b => ({
        date: b.created_at.split('T')[0],
        amount: b.total_amount,
        status: b.status
      })) || []
    };
  }

  // Search properties
  async searchProperties(query: {
    city?: string;
    country?: string;
    property_type?: string;
    min_guests?: number;
    max_price?: number;
    amenities?: string[];
    page?: number;
    limit?: number;
  }): Promise<{ properties: Property[]; total: number }> {
    const { page = 1, limit = 20, ...filters } = query;
    const offset = (page - 1) * limit;

    let dbQuery = supabase
      .from('properties')
      .select(`
        *,
        property_images (id, url, alt_text, sort_order, is_primary)
      `, { count: 'exact' })
      .eq('is_active', true);

    // Apply filters
    if (filters.city) {
      dbQuery = dbQuery.ilike('city', `%${filters.city}%`);
    }
    if (filters.country) {
      dbQuery = dbQuery.ilike('country', `%${filters.country}%`);
    }
    if (filters.property_type) {
      dbQuery = dbQuery.eq('property_type', filters.property_type);
    }
    if (filters.min_guests) {
      dbQuery = dbQuery.gte('max_guests', filters.min_guests);
    }

    const { data: properties, error, count } = await dbQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to search properties: ${error.message}`);
    }

    return {
      properties: properties || [],
      total: count || 0
    };
  }
}

export const propertyService = PropertyService.getInstance();