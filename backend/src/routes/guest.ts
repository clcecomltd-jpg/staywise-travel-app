import { Router } from 'express';
import { supabase, DatabaseHelper } from '../config/database.js';
import { authenticateToken, requireGuest } from '../middleware/auth.js';
import { validate, commonSchemas, staySchemas, messageSchemas } from '../middleware/validation.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { APIResponse, PaginationParams, Stay, Message, Place, Recommendation } from '../types/index.js';

const router = Router();

// Apply authentication to all guest routes
router.use(authenticateToken);
router.use(requireGuest);

// Get guest profile
router.get('/profile',
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;

    const user = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('users')
        .select('id, email, name, phone, avatar_url, user_type, preferences, created_at, updated_at')
        .eq('id', userId)
        .single()
    );

    const response: APIResponse = {
      success: true,
      data: user
    };

    res.json(response);
  })
);

// Update guest profile
router.put('/profile',
  validate({
    name: commonSchemas.name.optional(),
    phone: commonSchemas.phone,
    avatar_url: commonSchemas.uri.optional(),
    preferences: commonSchemas.preferences.optional()
  }),
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const updates = req.body;

    const user = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('id, email, name, phone, avatar_url, user_type, preferences, created_at, updated_at')
        .single()
    );

    logger.info('Guest profile updated', { userId, updates });

    const response: APIResponse = {
      success: true,
      message: 'Profile updated successfully',
      data: user
    };

    res.json(response);
  })
);

// Get current stay information
router.get('/stay/:stayId',
  validate({ stayId: commonSchemas.uuid }, 'params'),
  asyncHandler(async (req, res) => {
    const { stayId } = req.params;
    const userId = req.user!.id;

    // Verify user has access to this stay
    const stay = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('stays')
        .select(`
          *,
          properties (
            id, name, description, address, city, country, latitude, longitude,
            bedrooms, bathrooms, max_guests, property_type, check_in_instructions,
            wifi_name, wifi_password, house_rules, amenities
          )
        `)
        .eq('id', stayId)
        .single()
    );

    // Additional security check - in a real app, you'd verify the guest has access
    // For now, we'll assume the stayId is provided via a secure link

    const response: APIResponse = {
      success: true,
      data: stay
    };

    res.json(response);
  })
);

// Get property details for guest
router.get('/property/:propertyId',
  validate({ propertyId: commonSchemas.uuid }, 'params'),
  asyncHandler(async (req, res) => {
    const { propertyId } = req.params;

    const property = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('properties')
        .select(`
          id, name, description, address, city, country, latitude, longitude,
          bedrooms, bathrooms, max_guests, property_type, check_in_instructions,
          wifi_name, wifi_password, house_rules, amenities,
          property_images (id, url, alt_text, sort_order, is_primary)
        `)
        .eq('id', propertyId)
        .eq('is_active', true)
        .single()
    );

    const response: APIResponse = {
      success: true,
      data: property
    };

    res.json(response);
  })
);

// Get nearby places
router.get('/places/nearby',
  validate({
    latitude: commonSchemas.coordinates.latitude.required(),
    longitude: commonSchemas.coordinates.longitude.required(),
    radius: commonSchemas.number.min(0).max(50000).default(5000), // 5km default
    category: commonSchemas.string.optional(),
    limit: commonSchemas.number.min(1).max(100).default(20)
  }, 'query'),
  asyncHandler(async (req, res) => {
    const { latitude, longitude, radius, category, limit } = req.query;

    let query = supabase
      .from('places')
      .select('*')
      .eq('is_active', true)
      .limit(limit);

    if (category) {
      query = query.eq('category', category);
    }

    const places = await DatabaseHelper.executeQueryArray(() => query);

    // Filter by radius (simplified - in production, use PostGIS or similar)
    const nearbyPlaces = places.filter(place => {
      if (!place.latitude || !place.longitude) return false;
      
      const distance = calculateDistance(
        latitude as number,
        longitude as number,
        place.latitude,
        place.longitude
      );
      
      return distance <= (radius as number);
    });

    // Sort by distance
    nearbyPlaces.sort((a, b) => {
      const distanceA = calculateDistance(
        latitude as number,
        longitude as number,
        a.latitude!,
        a.longitude!
      );
      const distanceB = calculateDistance(
        latitude as number,
        longitude as number,
        b.latitude!,
        b.longitude!
      );
      return distanceA - distanceB;
    });

    const response: APIResponse = {
      success: true,
      data: nearbyPlaces,
      meta: {
        total: nearbyPlaces.length,
        limit: limit as number
      }
    };

    res.json(response);
  })
);

// Get place details
router.get('/places/:placeId',
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

// Get personalized recommendations
router.get('/recommendations',
  validate({
    category: commonSchemas.string.optional(),
    limit: commonSchemas.number.min(1).max(50).default(20)
  }, 'query'),
  asyncHandler(async (req, res) => {
    const { category, limit } = req.query;
    const userId = req.user!.id;

    let query = supabase
      .from('recommendations')
      .select('*')
      .eq('is_active', true)
      .limit(limit as number);

    if (category) {
      query = query.eq('category', category);
    }

    const recommendations = await DatabaseHelper.executeQueryArray(() => query);

    // TODO: Add personalization logic based on user preferences and history
    // For now, return all recommendations

    const response: APIResponse = {
      success: true,
      data: recommendations,
      meta: {
        total: recommendations.length,
        limit: limit as number
      }
    };

    res.json(response);
  })
);

// Get guest messages
router.get('/messages',
  validate(commonSchemas.pagination, 'query'),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query as PaginationParams;
    const userId = req.user!.id;
    const offset = (page - 1) * limit;

    const { data: messages, error, count } = await supabase
      .from('messages')
      .select('*', { count: 'exact' })
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

// Send message
router.post('/messages',
  validate(messageSchemas.create),
  asyncHandler(async (req, res) => {
    const { receiver_id, property_id, stay_id, content, message_type = 'text' } = req.body;
    const senderId = req.user!.id;

    const message = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('messages')
        .insert({
          sender_id: senderId,
          receiver_id,
          property_id,
          stay_id,
          content,
          message_type,
          is_read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*')
        .single()
    );

    logger.info('Message sent', { 
      messageId: message.id, 
      senderId, 
      receiverId: receiver_id 
    });

    const response: APIResponse = {
      success: true,
      message: 'Message sent successfully',
      data: message
    };

    res.json(response);
  })
);

// Mark message as read
router.put('/messages/:messageId/read',
  validate({ messageId: commonSchemas.uuid }, 'params'),
  asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user!.id;

    // Verify user has access to this message
    const { data: message } = await supabase
      .from('messages')
      .select('id, receiver_id')
      .eq('id', messageId)
      .eq('receiver_id', userId)
      .single();

    if (!message) {
      throw createError.notFound('Message not found or access denied');
    }

    await DatabaseHelper.executeQuery(() =>
      supabase
        .from('messages')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .select('*')
        .single()
    );

    const response: APIResponse = {
      success: true,
      message: 'Message marked as read'
    };

    res.json(response);
  })
);

// Get guest notifications
router.get('/notifications',
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

// Mark notification as read
router.put('/notifications/:notificationId/read',
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

// Get guest favorites
router.get('/favorites',
  validate(commonSchemas.pagination, 'query'),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query as PaginationParams;
    const userId = req.user!.id;
    const offset = (page - 1) * limit;

    const { data: favorites, error, count } = await supabase
      .from('guest_favorites')
      .select(`
        *,
        places (*),
        recommendations (*)
      `, { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw createError.database('Failed to fetch favorites');
    }

    const response: APIResponse = {
      success: true,
      data: favorites || [],
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

// Add to favorites
router.post('/favorites',
  validate({
    item_type: commonSchemas.string.valid('place', 'recommendation').required(),
    item_id: commonSchemas.uuid.required()
  }),
  asyncHandler(async (req, res) => {
    const { item_type, item_id } = req.body;
    const userId = req.user!.id;

    // Check if already favorited
    const { data: existing } = await supabase
      .from('guest_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('item_type', item_type)
      .eq('item_id', item_id)
      .single();

    if (existing) {
      throw createError.conflict('Item already in favorites');
    }

    const favorite = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('guest_favorites')
        .insert({
          user_id: userId,
          item_type,
          item_id,
          created_at: new Date().toISOString()
        })
        .select('*')
        .single()
    );

    const response: APIResponse = {
      success: true,
      message: 'Added to favorites',
      data: favorite
    };

    res.json(response);
  })
);

// Remove from favorites
router.delete('/favorites/:favoriteId',
  validate({ favoriteId: commonSchemas.uuid }, 'params'),
  asyncHandler(async (req, res) => {
    const { favoriteId } = req.params;
    const userId = req.user!.id;

    await DatabaseHelper.executeQuery(() =>
      supabase
        .from('guest_favorites')
        .delete()
        .eq('id', favoriteId)
        .eq('user_id', userId)
        .select('*')
        .single()
    );

    const response: APIResponse = {
      success: true,
      message: 'Removed from favorites'
    };

    res.json(response);
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