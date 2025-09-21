import { Router } from 'express';
import { supabase, DatabaseHelper } from '../config/database.js';
import { authenticateToken, requireHost } from '../middleware/auth.js';
import { validate, commonSchemas, propertySchemas, staySchemas, recommendationSchemas } from '../middleware/validation.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { APIResponse, PaginationParams, Property, Stay, Booking, Recommendation } from '../types/index.js';

const router = Router();

// Apply authentication to all host routes
router.use(authenticateToken);
router.use(requireHost);

// Get host dashboard data
router.get('/dashboard',
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;

    // Get host's properties
    const properties = await DatabaseHelper.executeQueryArray(() =>
      supabase
        .from('properties')
        .select('id, name, city, country, is_active')
        .eq('account_id', userId) // Assuming user_id maps to account_id for now
    );

    // Get active bookings count
    const { count: activeBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .in('property_id', properties.map(p => p.id))
      .eq('status', 'confirmed');

    // Get current guests count
    const { count: currentGuests } = await supabase
      .from('stays')
      .select('*', { count: 'exact', head: true })
      .in('property_id', properties.map(p => p.id))
      .eq('status', 'active');

    // Get recent bookings
    const recentBookings = await DatabaseHelper.executeQueryArray(() =>
      supabase
        .from('bookings')
        .select(`
          *,
          properties (name, city),
          stays (guest_name, guest_email, arrival_date, departure_date)
        `)
        .in('property_id', properties.map(p => p.id))
        .order('created_at', { ascending: false })
        .limit(5)
    );

    // Get upcoming check-ins/outs
    const today = new Date().toISOString().split('T')[0];
    const upcomingStays = await DatabaseHelper.executeQueryArray(() =>
      supabase
        .from('stays')
        .select(`
          *,
          properties (name, city)
        `)
        .in('property_id', properties.map(p => p.id))
        .in('status', ['upcoming', 'active'])
        .gte('arrival_date', today)
        .order('arrival_date', { ascending: true })
        .limit(10)
    );

    // Calculate revenue (simplified)
    const { data: revenueData } = await supabase
      .from('bookings')
      .select('total_amount, currency')
      .in('property_id', properties.map(p => p.id))
      .eq('status', 'confirmed')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

    const monthlyRevenue = revenueData?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;

    const dashboardData = {
      summary: {
        totalProperties: properties.length,
        activeProperties: properties.filter(p => p.is_active).length,
        activeBookings: activeBookings || 0,
        currentGuests: currentGuests || 0,
        monthlyRevenue: monthlyRevenue
      },
      recentBookings,
      upcomingStays,
      properties
    };

    const response: APIResponse = {
      success: true,
      data: dashboardData
    };

    res.json(response);
  })
);

// Get host properties
router.get('/properties',
  validate(commonSchemas.pagination, 'query'),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query as PaginationParams;
    const userId = req.user!.id;
    const offset = (page - 1) * limit;

    const { data: properties, error, count } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (id, url, alt_text, sort_order, is_primary)
      `, { count: 'exact' })
      .eq('account_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw createError.database('Failed to fetch properties');
    }

    const response: APIResponse = {
      success: true,
      data: properties || [],
      meta: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };

    res.json(response);
  })
);

// Create new property
router.post('/properties',
  validate(propertySchemas.create),
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const propertyData = {
      ...req.body,
      account_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const property = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('properties')
        .insert(propertyData)
        .select('*')
        .single()
    );

    logger.info('Property created', { propertyId: property.id, userId });

    const response: APIResponse = {
      success: true,
      message: 'Property created successfully',
      data: property
    };

    res.status(201).json(response);
  })
);

// Get property details
router.get('/properties/:propertyId',
  validate({ propertyId: commonSchemas.uuid }, 'params'),
  asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const userId = req.user!.id;

    const property = await DatabaseHelper.executeQuery(() =>
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
        .eq('account_id', userId)
        .single()
    );

    const response: APIResponse = {
      success: true,
      data: property
    };

    res.json(response);
  })
);

// Update property
router.put('/properties/:propertyId',
  validate({ propertyId: commonSchemas.uuid }, 'params'),
  validate(propertySchemas.update),
  asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const userId = req.user!.id;
    const updates = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    const property = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('properties')
        .update(updates)
        .eq('id', propertyId)
        .eq('account_id', userId)
        .select('*')
        .single()
    );

    logger.info('Property updated', { propertyId, userId, updates });

    const response: APIResponse = {
      success: true,
      message: 'Property updated successfully',
      data: property
    };

    res.json(response);
  })
);

// Delete property
router.delete('/properties/:propertyId',
  validate({ propertyId: commonSchemas.uuid }, 'params'),
  asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const userId = req.user!.id;

    // Check if property has active bookings
    const { data: activeBookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('property_id', propertyId)
      .in('status', ['pending', 'confirmed']);

    if (activeBookings && activeBookings.length > 0) {
      throw createError.conflict('Cannot delete property with active bookings');
    }

    await DatabaseHelper.executeQuery(() =>
      supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)
        .eq('account_id', userId)
        .select('*')
        .single()
    );

    logger.info('Property deleted', { propertyId, userId });

    const response: APIResponse = {
      success: true,
      message: 'Property deleted successfully'
    };

    res.json(response);
  })
);

// Import property from external platform
router.post('/properties/import',
  validate(propertySchemas.import),
  asyncHandler(async (req, res) => {
    const { provider_type, provider_url, property_data } = req.body;
    const userId = req.user!.id;

    // TODO: Implement actual property import logic
    // For now, return a mock response
    const importRecord = {
      id: `import_${Date.now()}`,
      property_id: `prop_${Date.now()}`,
      provider_type,
      provider_url,
      status: 'processing',
      created_at: new Date().toISOString()
    };

    logger.info('Property import initiated', { 
      importId: importRecord.id, 
      provider_type, 
      userId 
    });

    const response: APIResponse = {
      success: true,
      message: 'Property import initiated',
      data: {
        import_record: importRecord,
        status: 'processing'
      }
    };

    res.status(202).json(response);
  })
);

// Get bookings
router.get('/bookings',
  validate(commonSchemas.pagination, 'query'),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status } = req.query as PaginationParams & { status?: string };
    const userId = req.user!.id;
    const offset = (page - 1) * limit;

    // Get host's properties
    const { data: properties } = await supabase
      .from('properties')
      .select('id')
      .eq('account_id', userId);

    if (!properties || properties.length === 0) {
      const response: APIResponse = {
        success: true,
        data: [],
        meta: { page, limit, total: 0, totalPages: 0 }
      };
      res.json(response);
      return;
    }

    let query = supabase
      .from('bookings')
      .select(`
        *,
        properties (name, city, country),
        stays (guest_name, guest_email, guest_phone, arrival_date, departure_date, guest_count, special_requests)
      `, { count: 'exact' })
      .in('property_id', properties.map(p => p.id))
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: bookings, error, count } = await query;

    if (error) {
      throw createError.database('Failed to fetch bookings');
    }

    const response: APIResponse = {
      success: true,
      data: bookings || [],
      meta: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };

    res.json(response);
  })
);

// Update booking status
router.put('/bookings/:bookingId',
  validate({ bookingId: commonSchemas.uuid }, 'params'),
  validate({
    status: commonSchemas.string.valid('pending', 'confirmed', 'cancelled', 'completed').required()
  }),
  asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.user!.id;

    // Verify host owns this booking
    const { data: booking } = await supabase
      .from('bookings')
      .select(`
        id,
        properties!inner(account_id)
      `)
      .eq('id', bookingId)
      .eq('properties.account_id', userId)
      .single();

    if (!booking) {
      throw createError.notFound('Booking not found or access denied');
    }

    const updatedBooking = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('bookings')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select(`
          *,
          properties (name, city),
          stays (guest_name, guest_email, arrival_date, departure_date)
        `)
        .single()
    );

    logger.info('Booking status updated', { bookingId, status, userId });

    const response: APIResponse = {
      success: true,
      message: 'Booking status updated successfully',
      data: updatedBooking
    };

    res.json(response);
  })
);

// Get stays
router.get('/stays',
  validate(commonSchemas.pagination, 'query'),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status } = req.query as PaginationParams & { status?: string };
    const userId = req.user!.id;
    const offset = (page - 1) * limit;

    // Get host's properties
    const { data: properties } = await supabase
      .from('properties')
      .select('id')
      .eq('account_id', userId);

    if (!properties || properties.length === 0) {
      const response: APIResponse = {
        success: true,
        data: [],
        meta: { page, limit, total: 0, totalPages: 0 }
      };
      res.json(response);
      return;
    }

    let query = supabase
      .from('stays')
      .select(`
        *,
        properties (name, city, country)
      `, { count: 'exact' })
      .in('property_id', properties.map(p => p.id))
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: stays, error, count } = await query;

    if (error) {
      throw createError.database('Failed to fetch stays');
    }

    const response: APIResponse = {
      success: true,
      data: stays || [],
      meta: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };

    res.json(response);
  })
);

// Create stay
router.post('/stays',
  validate(staySchemas.create),
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const stayData = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Verify host owns the property
    const { data: property } = await supabase
      .from('properties')
      .select('id, account_id')
      .eq('id', stayData.property_id)
      .eq('account_id', userId)
      .single();

    if (!property) {
      throw createError.notFound('Property not found or access denied');
    }

    const stay = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('stays')
        .insert(stayData)
        .select(`
          *,
          properties (name, city, country)
        `)
        .single()
    );

    logger.info('Stay created', { stayId: stay.id, propertyId: stayData.property_id, userId });

    const response: APIResponse = {
      success: true,
      message: 'Stay created successfully',
      data: stay
    };

    res.status(201).json(response);
  })
);

// Update stay
router.put('/stays/:stayId',
  validate({ stayId: commonSchemas.uuid }, 'params'),
  validate(staySchemas.update),
  asyncHandler(async (req, res) => {
    const { stayId } = req.params;
    const userId = req.user!.id;
    const updates = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    // Verify host owns this stay
    const { data: stay } = await supabase
      .from('stays')
      .select(`
        id,
        properties!inner(account_id)
      `)
      .eq('id', stayId)
      .eq('properties.account_id', userId)
      .single();

    if (!stay) {
      throw createError.notFound('Stay not found or access denied');
    }

    const updatedStay = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('stays')
        .update(updates)
        .eq('id', stayId)
        .select(`
          *,
          properties (name, city, country)
        `)
        .single()
    );

    logger.info('Stay updated', { stayId, userId, updates });

    const response: APIResponse = {
      success: true,
      message: 'Stay updated successfully',
      data: updatedStay
    };

    res.json(response);
  })
);

// Get host recommendations
router.get('/recommendations',
  validate(commonSchemas.pagination, 'query'),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query as PaginationParams;
    const userId = req.user!.id;
    const offset = (page - 1) * limit;

    const { data: recommendations, error, count } = await supabase
      .from('recommendations')
      .select('*', { count: 'exact' })
      .eq('host_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw createError.database('Failed to fetch recommendations');
    }

    const response: APIResponse = {
      success: true,
      data: recommendations || [],
      meta: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };

    res.json(response);
  })
);

// Create recommendation
router.post('/recommendations',
  validate(recommendationSchemas.create),
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const recommendationData = {
      ...req.body,
      host_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const recommendation = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('recommendations')
        .insert(recommendationData)
        .select('*')
        .single()
    );

    logger.info('Recommendation created', { recommendationId: recommendation.id, userId });

    const response: APIResponse = {
      success: true,
      message: 'Recommendation created successfully',
      data: recommendation
    };

    res.status(201).json(response);
  })
);

// Update recommendation
router.put('/recommendations/:recommendationId',
  validate({ recommendationId: commonSchemas.uuid }, 'params'),
  validate(recommendationSchemas.update),
  asyncHandler(async (req, res) => {
    const { recommendationId } = req.params;
    const userId = req.user!.id;
    const updates = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    const recommendation = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('recommendations')
        .update(updates)
        .eq('id', recommendationId)
        .eq('host_id', userId)
        .select('*')
        .single()
    );

    logger.info('Recommendation updated', { recommendationId, userId });

    const response: APIResponse = {
      success: true,
      message: 'Recommendation updated successfully',
      data: recommendation
    };

    res.json(response);
  })
);

// Delete recommendation
router.delete('/recommendations/:recommendationId',
  validate({ recommendationId: commonSchemas.uuid }, 'params'),
  asyncHandler(async (req, res) => {
    const { recommendationId } = req.params;
    const userId = req.user!.id;

    await DatabaseHelper.executeQuery(() =>
      supabase
        .from('recommendations')
        .delete()
        .eq('id', recommendationId)
        .eq('host_id', userId)
        .select('*')
        .single()
    );

    logger.info('Recommendation deleted', { recommendationId, userId });

    const response: APIResponse = {
      success: true,
      message: 'Recommendation deleted successfully'
    };

    res.json(response);
  })
);

// Get host messages
router.get('/messages',
  validate(commonSchemas.pagination, 'query'),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query as PaginationParams;
    const userId = req.user!.id;
    const offset = (page - 1) * limit;

    const { data: messages, error, count } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, name, avatar_url),
        receiver:users!messages_receiver_id_fkey(id, name, avatar_url),
        properties (id, name),
        stays (id, guest_name)
      `, { count: 'exact' })
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw createError.database('Failed to fetch messages');
    }

    const response: APIResponse = {
      success: true,
      data: messages || [],
      meta: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };

    res.json(response);
  })
);

// Get analytics data
router.get('/analytics',
  validate({
    period: commonSchemas.string.valid('7d', '30d', '90d', '1y').default('30d'),
    property_id: commonSchemas.uuid.optional()
  }, 'query'),
  asyncHandler(async (req, res) => {
    const { period, property_id } = req.query;
    const userId = req.user!.id;

    // Calculate date range
    const now = new Date();
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Get host's properties
    let propertiesQuery = supabase
      .from('properties')
      .select('id')
      .eq('account_id', userId);

    if (property_id) {
      propertiesQuery = propertiesQuery.eq('id', property_id);
    }

    const { data: properties } = await propertiesQuery;

    if (!properties || properties.length === 0) {
      const response: APIResponse = {
        success: true,
        data: {
          bookings: [],
          revenue: 0,
          occupancy_rate: 0,
          average_rating: 0
        }
      };
      res.json(response);
      return;
    }

    // Get bookings data
    const { data: bookings } = await supabase
      .from('bookings')
      .select('total_amount, currency, created_at, status')
      .in('property_id', properties.map(p => p.id))
      .gte('created_at', startDate.toISOString());

    // Calculate metrics
    const totalRevenue = bookings?.reduce((sum, booking) => 
      booking.status === 'confirmed' ? sum + booking.total_amount : sum, 0) || 0;
    
    const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
    const totalBookings = bookings?.length || 0;
    const occupancyRate = totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0;

    // Get reviews/ratings (if implemented)
    const averageRating = 4.5; // Mock data

    const analyticsData = {
      period,
      total_revenue: totalRevenue,
      total_bookings: totalBookings,
      confirmed_bookings: confirmedBookings,
      occupancy_rate: Math.round(occupancyRate * 100) / 100,
      average_rating: averageRating,
      bookings_over_time: bookings?.map(b => ({
        date: b.created_at.split('T')[0],
        amount: b.total_amount,
        status: b.status
      })) || []
    };

    const response: APIResponse = {
      success: true,
      data: analyticsData
    };

    res.json(response);
  })
);

export default router;