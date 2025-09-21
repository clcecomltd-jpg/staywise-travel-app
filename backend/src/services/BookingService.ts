import { supabase, DatabaseHelper } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { Booking, Stay } from '../types/index.js';

export class BookingService {
  private static instance: BookingService;

  static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  // Create booking
  async createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
    // Check property availability
    const isAvailable = await this.checkAvailability(
      bookingData.property_id,
      bookingData.check_in_date,
      bookingData.check_out_date
    );

    if (!isAvailable) {
      throw new Error('Property is not available for the selected dates');
    }

    const booking = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('bookings')
        .insert({
          ...bookingData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select(`
          *,
          properties (id, name, city, country),
          stays (guest_name, guest_email, arrival_date, departure_date, guest_count, special_requests)
        `)
        .single()
    );

    logger.info('Booking created', { bookingId: booking.id, propertyId: booking.property_id });
    return booking;
  }

  // Get booking by ID
  async getBooking(bookingId: string): Promise<Booking> {
    return DatabaseHelper.executeQuery(() =>
      supabase
        .from('bookings')
        .select(`
          *,
          properties (id, name, city, country),
          stays (guest_name, guest_email, arrival_date, departure_date, guest_count, special_requests)
        `)
        .eq('id', bookingId)
        .single()
    );
  }

  // Get bookings by property
  async getBookingsByProperty(propertyId: string, page: number = 1, limit: number = 20): Promise<{ bookings: Booking[]; total: number }> {
    const offset = (page - 1) * limit;

    const { data: bookings, error, count } = await supabase
      .from('bookings')
      .select(`
        *,
        properties (id, name, city, country),
        stays (guest_name, guest_email, arrival_date, departure_date, guest_count, special_requests)
      `, { count: 'exact' })
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }

    return {
      bookings: bookings || [],
      total: count || 0
    };
  }

  // Get bookings by guest
  async getBookingsByGuest(guestId: string, page: number = 1, limit: number = 20): Promise<{ bookings: Booking[]; total: number }> {
    const offset = (page - 1) * limit;

    const { data: bookings, error, count } = await supabase
      .from('bookings')
      .select(`
        *,
        properties (id, name, city, country),
        stays (guest_name, guest_email, arrival_date, departure_date, guest_count, special_requests)
      `, { count: 'exact' })
      .eq('guest_id', guestId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }

    return {
      bookings: bookings || [],
      total: count || 0
    };
  }

  // Update booking status
  async updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
    const booking = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('bookings')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select(`
          *,
          properties (id, name, city, country),
          stays (guest_name, guest_email, arrival_date, departure_date, guest_count, special_requests)
        `)
        .single()
    );

    logger.info('Booking status updated', { bookingId, status });
    return booking;
  }

  // Cancel booking
  async cancelBooking(bookingId: string, reason?: string): Promise<Booking> {
    const booking = await this.updateBookingStatus(bookingId, 'cancelled');
    
    // TODO: Implement refund logic if needed
    // TODO: Send cancellation notification to guest
    
    logger.info('Booking cancelled', { bookingId, reason });
    return booking;
  }

  // Check property availability
  async checkAvailability(propertyId: string, checkInDate: string, checkOutDate: string): Promise<boolean> {
    const { data: conflictingBookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('property_id', propertyId)
      .in('status', ['pending', 'confirmed'])
      .or(`and(check_in_date.lte.${checkOutDate},check_out_date.gte.${checkInDate})`);

    return !conflictingBookings || conflictingBookings.length === 0;
  }

  // Get availability calendar
  async getAvailabilityCalendar(propertyId: string, startDate: string, endDate: string): Promise<any[]> {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('check_in_date, check_out_date, status')
      .eq('property_id', propertyId)
      .in('status', ['pending', 'confirmed'])
      .gte('check_in_date', startDate)
      .lte('check_out_date', endDate);

    // Generate calendar data
    const calendar = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const isBooked = bookings?.some(booking => 
        dateStr >= booking.check_in_date && dateStr < booking.check_out_date
      ) || false;

      calendar.push({
        date: dateStr,
        available: !isBooked,
        bookings: bookings?.filter(booking => 
          dateStr >= booking.check_in_date && dateStr < booking.check_out_date
        ) || []
      });
    }

    return calendar;
  }

  // Get booking analytics
  async getBookingAnalytics(propertyId: string, period: string = '30d'): Promise<any> {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const { data: bookings } = await supabase
      .from('bookings')
      .select('total_amount, currency, created_at, status, check_in_date, check_out_date')
      .eq('property_id', propertyId)
      .gte('created_at', startDate.toISOString());

    // Calculate metrics
    const totalRevenue = bookings?.reduce((sum, booking) => 
      booking.status === 'confirmed' ? sum + booking.total_amount : sum, 0) || 0;
    
    const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
    const totalBookings = bookings?.length || 0;
    const occupancyRate = totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0;

    // Calculate average booking value
    const avgBookingValue = confirmedBookings > 0 ? totalRevenue / confirmedBookings : 0;

    // Get monthly breakdown
    const monthlyData = bookings?.reduce((acc, booking) => {
      const month = booking.created_at.substring(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = { revenue: 0, bookings: 0 };
      }
      if (booking.status === 'confirmed') {
        acc[month].revenue += booking.total_amount;
        acc[month].bookings += 1;
      }
      return acc;
    }, {} as Record<string, { revenue: number; bookings: number }>) || {};

    return {
      period,
      total_revenue: totalRevenue,
      total_bookings: totalBookings,
      confirmed_bookings: confirmedBookings,
      occupancy_rate: Math.round(occupancyRate * 100) / 100,
      average_booking_value: Math.round(avgBookingValue * 100) / 100,
      monthly_breakdown: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        revenue: data.revenue,
        bookings: data.bookings
      }))
    };
  }
}

export const bookingService = BookingService.getInstance();