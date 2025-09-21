import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken, requireHost, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get property details
router.get('/:propertyId', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const { propertyId } = req.params;
  const userId = req.user!.id;

  // Check if user has access to this property
  const accessCheck = await query(`
    SELECT 1 FROM users u
    WHERE u.id = $1 AND (
      u.property_id = $2 OR 
      EXISTS (
        SELECT 1 FROM bookings b 
        WHERE b.property_id = $2 AND b.guest_id = $1 AND b.status IN ('confirmed', 'checked_in')
      )
    )
  `, [userId, propertyId]);

  if (accessCheck.rows.length === 0) {
    return res.status(403).json({
      success: false,
      error: 'Access denied to this property'
    });
  }

  const result = await query(`
    SELECT p.*, u.email as host_email, u.first_name as host_first_name, u.last_name as host_last_name
    FROM properties p
    JOIN users u ON p.host_id = u.id
    WHERE p.id = $1
  `, [propertyId]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Property not found'
    });
  }

  const property = result.rows[0];

  res.json({
    success: true,
    data: {
      id: property.id,
      name: property.name,
      description: property.description,
      address: property.address,
      city: property.city,
      country: property.country,
      latitude: property.latitude,
      longitude: property.longitude,
      amenities: property.amenities,
      checkInTime: property.check_in_time,
      checkOutTime: property.check_out_time,
      wifiPassword: property.wifi_password,
      houseRules: property.house_rules,
      emergencyContact: property.emergency_contact,
      host: {
        email: property.host_email,
        firstName: property.host_first_name,
        lastName: property.host_last_name
      },
      createdAt: property.created_at,
      updatedAt: property.updated_at
    }
  });
}));

// Update property details (Host only)
router.put('/:propertyId', authenticateToken, requireHost, asyncHandler(async (req: AuthRequest, res) => {
  const { propertyId } = req.params;
  const userId = req.user!.id;
  const updates = req.body;

  // Verify user owns this property
  const ownershipCheck = await query(`
    SELECT 1 FROM properties WHERE id = $1 AND host_id = $2
  `, [propertyId, userId]);

  if (ownershipCheck.rows.length === 0) {
    return res.status(403).json({
      success: false,
      error: 'You do not own this property'
    });
  }

  const allowedFields = [
    'name', 'description', 'address', 'city', 'country', 
    'latitude', 'longitude', 'amenities', 'check_in_time', 
    'check_out_time', 'wifi_password', 'house_rules', 'emergency_contact'
  ];

  const filteredUpdates: any = {};
  Object.keys(updates).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredUpdates[key] = updates[key];
    }
  });

  if (Object.keys(filteredUpdates).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No valid fields to update'
    });
  }

  const setClause = Object.keys(filteredUpdates)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(', ');

  const result = await query(`
    UPDATE properties 
    SET ${setClause}, updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `, [propertyId, ...Object.values(filteredUpdates)]);

  const property = result.rows[0];

  logger.info(`Property updated: ${propertyId} by user ${userId}`);

  res.json({
    success: true,
    data: {
      id: property.id,
      name: property.name,
      description: property.description,
      address: property.address,
      city: property.city,
      country: property.country,
      latitude: property.latitude,
      longitude: property.longitude,
      amenities: property.amenities,
      checkInTime: property.check_in_time,
      checkOutTime: property.check_out_time,
      wifiPassword: property.wifi_password,
      houseRules: property.house_rules,
      emergencyContact: property.emergency_contact,
      updatedAt: property.updated_at
    }
  });
}));

// Get property analytics (Host only)
router.get('/:propertyId/analytics', authenticateToken, requireHost, asyncHandler(async (req: AuthRequest, res) => {
  const { propertyId } = req.params;
  const userId = req.user!.id;
  const { startDate, endDate } = req.query;

  // Verify user owns this property
  const ownershipCheck = await query(`
    SELECT 1 FROM properties WHERE id = $1 AND host_id = $2
  `, [propertyId, userId]);

  if (ownershipCheck.rows.length === 0) {
    return res.status(403).json({
      success: false,
      error: 'You do not own this property'
    });
  }

  // Get analytics data
  const analytics = await query(`
    SELECT 
      COUNT(DISTINCT r.id) as total_recommendations,
      COUNT(DISTINCT m.id) as total_messages,
      COUNT(DISTINCT b.id) as total_bookings,
      AVG(r.rating) as avg_rating,
      COUNT(DISTINCT CASE WHEN m.created_at >= NOW() - INTERVAL '7 days' THEN m.id END) as messages_last_7_days,
      COUNT(DISTINCT CASE WHEN r.created_at >= NOW() - INTERVAL '7 days' THEN r.id END) as recommendations_last_7_days
    FROM properties p
    LEFT JOIN recommendations r ON p.id = r.property_id
    LEFT JOIN messages m ON p.id = m.property_id
    LEFT JOIN bookings b ON p.id = b.property_id
    WHERE p.id = $1
  `, [propertyId]);

  const stats = analytics.rows[0];

  res.json({
    success: true,
    data: {
      totalRecommendations: parseInt(stats.total_recommendations) || 0,
      totalMessages: parseInt(stats.total_messages) || 0,
      totalBookings: parseInt(stats.total_bookings) || 0,
      averageRating: parseFloat(stats.avg_rating) || 0,
      messagesLast7Days: parseInt(stats.messages_last_7_days) || 0,
      recommendationsLast7Days: parseInt(stats.recommendations_last_7_days) || 0,
      period: {
        start: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: endDate || new Date().toISOString()
      }
    }
  });
}));

// Get property guests (Host only)
router.get('/:propertyId/guests', authenticateToken, requireHost, asyncHandler(async (req: AuthRequest, res) => {
  const { propertyId } = req.params;
  const userId = req.user!.id;

  // Verify user owns this property
  const ownershipCheck = await query(`
    SELECT 1 FROM properties WHERE id = $1 AND host_id = $2
  `, [propertyId, userId]);

  if (ownershipCheck.rows.length === 0) {
    return res.status(403).json({
      success: false,
      error: 'You do not own this property'
    });
  }

  const result = await query(`
    SELECT DISTINCT u.id, u.email, u.first_name, u.last_name, u.created_at as joined_at,
           MAX(m.created_at) as last_message_at,
           COUNT(m.id) as message_count,
           b.check_in_date, b.check_out_date, b.status as booking_status
    FROM users u
    JOIN messages m ON u.id = m.user_id
    LEFT JOIN bookings b ON u.id = b.guest_id AND b.property_id = $1
    WHERE m.property_id = $1 AND u.user_type = 'guest'
    GROUP BY u.id, u.email, u.first_name, u.last_name, u.created_at, b.check_in_date, b.check_out_date, b.status
    ORDER BY last_message_at DESC
  `, [propertyId]);

  const guests = result.rows.map(row => ({
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    joinedAt: row.joined_at,
    lastMessageAt: row.last_message_at,
    messageCount: parseInt(row.message_count),
    booking: {
      checkInDate: row.check_in_date,
      checkOutDate: row.check_out_date,
      status: row.booking_status
    }
  }));

  res.json({
    success: true,
    data: guests
  });
}));

export default router;