import { Router } from 'express';
import { supabase, DatabaseHelper } from '../config/database.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validate, commonSchemas } from '../middleware/validation.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { APIResponse, PaginationParams, Place, Recommendation, User } from '../types/index.js';

const router = Router();

// Get featured places (public endpoint)
router.get('/places/featured',
  optionalAuth,
  validate({
    limit: commonSchemas.number.min(1).max(50).default(20)
  }, 'query'),
  asyncHandler(async (req, res) => {
    const { limit } = req.query;

    const places = await DatabaseHelper.executeQueryArray(() =>
      supabase
        .from('places')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .limit(limit as number)
    );

    const response: APIResponse = {
      success: true,
      data: places,
      meta: {
        total: places.length,
        limit: limit as number
      }
    };

    res.json(response);
  })
);

// Get popular experiences (public endpoint)
router.get('/experiences/popular',
  optionalAuth,
  validate({
    limit: commonSchemas.number.min(1).max(50).default(20)
  }, 'query'),
  asyncHandler(async (req, res) => {
    const { limit } = req.query;

    const experiences = await DatabaseHelper.executeQueryArray(() =>
      supabase
        .from('recommendations')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .limit(limit as number)
    );

    const response: APIResponse = {
      success: true,
      data: experiences,
      meta: {
        total: experiences.length,
        limit: limit as number
      }
    };

    res.json(response);
  })
);

// Get places by category (public endpoint)
router.get('/places',
  optionalAuth,
  validate({
    category: commonSchemas.string.optional(),
    city: commonSchemas.string.optional(),
    limit: commonSchemas.number.min(1).max(100).default(20),
    page: commonSchemas.number.min(1).default(1)
  }, 'query'),
  asyncHandler(async (req, res) => {
    const { category, city, limit, page } = req.query as any;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('places')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    const { data: places, error, count } = await query;

    if (error) {
      throw createError.database('Failed to fetch places');
    }

    const response: APIResponse = {
      success: true,
      data: places || [],
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

// Get place details (public endpoint)
router.get('/places/:placeId',
  optionalAuth,
  validate({ placeId: commonSchemas.uuid }, 'params'),
  asyncHandler(async (req, res) => {
    const { placeId } = req.params;

    const place = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('places')
        .select('*')
        .eq('id', placeId)
        .eq('is_active', true)
        .single()
    );

    const response: APIResponse = {
      success: true,
      data: place
    };

    res.json(response);
  })
);

// Get experiences by type (public endpoint)
router.get('/experiences',
  optionalAuth,
  validate({
    type: commonSchemas.string.optional(),
    city: commonSchemas.string.optional(),
    limit: commonSchemas.number.min(1).max(100).default(20),
    page: commonSchemas.number.min(1).default(1)
  }, 'query'),
  asyncHandler(async (req, res) => {
    const { type, city, limit, page } = req.query as any;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('recommendations')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) {
      query = query.eq('category', type);
    }

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    const { data: experiences, error, count } = await query;

    if (error) {
      throw createError.database('Failed to fetch experiences');
    }

    const response: APIResponse = {
      success: true,
      data: experiences || [],
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

// Get user preferences (authenticated)
router.get('/preferences',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;

    const user = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('users')
        .select('preferences')
        .eq('id', userId)
        .single()
    );

    const response: APIResponse = {
      success: true,
      data: user.preferences || {}
    };

    res.json(response);
  })
);

// Update user preferences (authenticated)
router.put('/preferences',
  authenticateToken,
  validate({
    language: commonSchemas.string.length(2).optional(),
    currency: commonSchemas.string.length(3).optional(),
    timezone: commonSchemas.string.optional(),
    notifications: commonSchemas.object({
      email: commonSchemas.boolean.optional(),
      push: commonSchemas.boolean.optional(),
      sms: commonSchemas.boolean.optional()
    }).optional(),
    privacy: commonSchemas.object({
      profile_visibility: commonSchemas.string.valid('public', 'private', 'friends').optional(),
      location_sharing: commonSchemas.boolean.optional()
    }).optional()
  }),
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const preferences = req.body;

    const user = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('users')
        .update({
          preferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('preferences')
        .single()
    );

    logger.info('User preferences updated', { userId, preferences });

    const response: APIResponse = {
      success: true,
      message: 'Preferences updated successfully',
      data: user.preferences
    };

    res.json(response);
  })
);

// Set user mode (authenticated)
router.put('/mode',
  authenticateToken,
  validate({
    mode: commonSchemas.string.valid('guest', 'host').required()
  }),
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const { mode } = req.body;

    // Check if user can switch to this mode
    const user = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('users')
        .select('user_type')
        .eq('id', userId)
        .single()
    );

    if (user.user_type !== mode && user.user_type !== 'both') {
      throw createError.forbidden(`Access denied. This account is not authorized for ${mode} mode.`);
    }

    // Update user mode in session/preferences
    // For now, we'll just return success
    // In a real app, you might store this in a session or user preferences

    logger.info('User mode switched', { userId, mode });

    const response: APIResponse = {
      success: true,
      message: `Switched to ${mode} mode`,
      data: { mode }
    };

    res.json(response);
  })
);

// Get notifications (authenticated)
router.get('/notifications',
  authenticateToken,
  validate(commonSchemas.pagination, 'query'),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query as PaginationParams;
    const userId = req.user!.id;
    const offset = (page - 1) * limit;

    const { data: notifications, error, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw createError.database('Failed to fetch notifications');
    }

    const response: APIResponse = {
      success: true,
      data: notifications || [],
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

// Mark notification as read (authenticated)
router.put('/notifications/:notificationId/read',
  authenticateToken,
  validate({ notificationId: commonSchemas.uuid }, 'params'),
  asyncHandler(async (req, res) => {
    const { notificationId } = req.params;
    const userId = req.user!.id;

    await DatabaseHelper.executeQuery(() =>
      supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .eq('user_id', userId)
        .select('*')
        .single()
    );

    const response: APIResponse = {
      success: true,
      message: 'Notification marked as read'
    };

    res.json(response);
  })
);

// Mark all notifications as read (authenticated)
router.put('/notifications/read-all',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;

    await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('is_read', false);

    const response: APIResponse = {
      success: true,
      message: 'All notifications marked as read'
    };

    res.json(response);
  })
);

// Get nearby services (public endpoint)
router.get('/location/nearby',
  optionalAuth,
  validate({
    latitude: commonSchemas.number.min(-90).max(90).required(),
    longitude: commonSchemas.number.min(-180).max(180).required(),
    radius: commonSchemas.number.min(0).max(50000).default(5000),
    service_type: commonSchemas.string.optional(),
    limit: commonSchemas.number.min(1).max(100).default(20)
  }, 'query'),
  asyncHandler(async (req, res) => {
    const { latitude, longitude, radius, service_type, limit } = req.query as any;

    let query = supabase
      .from('places')
      .select('*')
      .eq('is_active', true)
      .limit(limit);

    if (service_type) {
      query = query.eq('category', service_type);
    }

    const places = await DatabaseHelper.executeQueryArray(() => query);

    // Filter by radius (simplified - in production, use PostGIS or similar)
    const nearbyPlaces = places.filter(place => {
      if (!place.latitude || !place.longitude) return false;
      
      const distance = calculateDistance(
        latitude,
        longitude,
        place.latitude,
        place.longitude
      );
      
      return distance <= radius;
    });

    // Sort by distance
    nearbyPlaces.sort((a, b) => {
      const distanceA = calculateDistance(latitude, longitude, a.latitude!, a.longitude!);
      const distanceB = calculateDistance(latitude, longitude, b.latitude!, b.longitude!);
      return distanceA - distanceB;
    });

    const response: APIResponse = {
      success: true,
      data: nearbyPlaces,
      meta: {
        total: nearbyPlaces.length,
        limit
      }
    };

    res.json(response);
  })
);

// Report error (public endpoint)
router.post('/system/errors',
  validate({
    error: commonSchemas.object({
      message: commonSchemas.string.required(),
      stack: commonSchemas.string.optional(),
      url: commonSchemas.string.optional(),
      userAgent: commonSchemas.string.optional(),
      timestamp: commonSchemas.string.optional()
    }).required(),
    user_id: commonSchemas.uuid.optional()
  }),
  asyncHandler(async (req, res) => {
    const { error, user_id } = req.body;

    // Log error
    logger.error('Client Error Report', {
      error: error.message,
      stack: error.stack,
      url: error.url,
      userAgent: error.userAgent,
      userId: user_id,
      timestamp: error.timestamp
    });

    // Store error in database (optional)
    if (user_id) {
      await supabase
        .from('error_reports')
        .insert({
          user_id,
          error_message: error.message,
          error_stack: error.stack,
          url: error.url,
          user_agent: error.userAgent,
          created_at: new Date().toISOString()
        });
    }

    const response: APIResponse = {
      success: true,
      message: 'Error report submitted successfully'
    };

    res.json(response);
  })
);

// Get system status (public endpoint)
router.get('/status',
  asyncHandler(async (req, res) => {
    // Check database connection
    const { data: dbStatus } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    const isHealthy = !!dbStatus;

    const status = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: isHealthy ? 'connected' : 'disconnected',
        api: 'running'
      },
      version: process.env.npm_package_version || '1.0.0'
    };

    const response: APIResponse = {
      success: true,
      data: status
    };

    res.status(isHealthy ? 200 : 503).json(response);
  })
);

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // Return distance in meters
}

export default router;