import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user!.id;

  const result = await query(`
    SELECT id, email, user_type, first_name, last_name, property_id, 
           created_at, last_login, active
    FROM users 
    WHERE id = $1
  `, [userId]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  const user = result.rows[0];

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      userType: user.user_type,
      firstName: user.first_name,
      lastName: user.last_name,
      propertyId: user.property_id,
      createdAt: user.created_at,
      lastLogin: user.last_login,
      active: user.active
    }
  });
}));

// Update user profile
router.put('/profile', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { firstName, lastName, email } = req.body;

  const updates: any = {};
  if (firstName !== undefined) updates.first_name = firstName;
  if (lastName !== undefined) updates.last_name = lastName;
  if (email !== undefined) updates.email = email;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No fields to update'
    });
  }

  // Check if email is already taken by another user
  if (email) {
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email.toLowerCase(), userId]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Email already taken by another user'
      });
    }
  }

  const setClause = Object.keys(updates)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(', ');

  const result = await query(`
    UPDATE users 
    SET ${setClause}, updated_at = NOW()
    WHERE id = $1
    RETURNING id, email, user_type, first_name, last_name, property_id, updated_at
  `, [userId, ...Object.values(updates)]);

  const user = result.rows[0];

  logger.info(`User profile updated: ${userId}`);

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      userType: user.user_type,
      firstName: user.first_name,
      lastName: user.last_name,
      propertyId: user.property_id,
      updatedAt: user.updated_at
    }
  });
}));

// Get user preferences
router.get('/preferences', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user!.id;

  const result = await query(`
    SELECT preferences FROM users WHERE id = $1
  `, [userId]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  const preferences = result.rows[0].preferences || {};

  res.json({
    success: true,
    data: preferences
  });
}));

// Update user preferences
router.put('/preferences', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { preferences } = req.body;

  if (!preferences || typeof preferences !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Preferences object is required'
    });
  }

  await query(`
    UPDATE users 
    SET preferences = $1, updated_at = NOW()
    WHERE id = $2
  `, [JSON.stringify(preferences), userId]);

  logger.info(`User preferences updated: ${userId}`);

  res.json({
    success: true,
    data: preferences
  });
}));

// Get user's favorite recommendations
router.get('/favorites', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { limit = 50, offset = 0 } = req.query;

  const result = await query(`
    SELECT r.*, f.created_at as favorited_at
    FROM user_favorites f
    JOIN recommendations r ON f.recommendation_id = r.id
    WHERE f.user_id = $1
    ORDER BY f.created_at DESC
    LIMIT $2 OFFSET $3
  `, [userId, parseInt(limit as string), parseInt(offset as string)]);

  const favorites = result.rows;

  res.json({
    success: true,
    data: favorites,
    pagination: {
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
      total: favorites.length
    }
  });
}));

// Add recommendation to favorites
router.post('/favorites', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { recommendationId } = req.body;

  if (!recommendationId) {
    return res.status(400).json({
      success: false,
      error: 'Recommendation ID is required'
    });
  }

  // Check if recommendation exists
  const recCheck = await query(
    'SELECT id FROM recommendations WHERE id = $1',
    [recommendationId]
  );

  if (recCheck.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Recommendation not found'
    });
  }

  // Add to favorites (ignore if already exists)
  await query(`
    INSERT INTO user_favorites (user_id, recommendation_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, recommendation_id) DO NOTHING
  `, [userId, recommendationId]);

  logger.info(`Added to favorites: user ${userId}, recommendation ${recommendationId}`);

  res.status(201).json({
    success: true,
    message: 'Added to favorites'
  });
}));

// Remove recommendation from favorites
router.delete('/favorites/:recommendationId', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { recommendationId } = req.params;

  const result = await query(`
    DELETE FROM user_favorites 
    WHERE user_id = $1 AND recommendation_id = $2
  `, [userId, recommendationId]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      success: false,
      error: 'Favorite not found'
    });
  }

  logger.info(`Removed from favorites: user ${userId}, recommendation ${recommendationId}`);

  res.json({
    success: true,
    message: 'Removed from favorites'
  });
}));

// Get user activity/engagement stats
router.get('/activity', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { days = 30 } = req.query;

  const result = await query(`
    SELECT 
      COUNT(DISTINCT m.id) as messages_sent,
      COUNT(DISTINCT f.id) as favorites_added,
      COUNT(DISTINCT e.id) as engagements,
      MAX(m.created_at) as last_message_at,
      MAX(f.created_at) as last_favorite_at
    FROM users u
    LEFT JOIN messages m ON u.id = m.user_id AND m.created_at >= NOW() - INTERVAL '${parseInt(days as string)} days'
    LEFT JOIN user_favorites f ON u.id = f.user_id AND f.created_at >= NOW() - INTERVAL '${parseInt(days as string)} days'
    LEFT JOIN recommendation_engagement_stats e ON u.id = e.user_id AND e.created_at >= NOW() - INTERVAL '${parseInt(days as string)} days'
    WHERE u.id = $1
    GROUP BY u.id
  `, [userId]);

  const activity = result.rows[0] || {
    messages_sent: 0,
    favorites_added: 0,
    engagements: 0,
    last_message_at: null,
    last_favorite_at: null
  };

  res.json({
    success: true,
    data: {
      messagesSent: parseInt(activity.messages_sent) || 0,
      favoritesAdded: parseInt(activity.favorites_added) || 0,
      engagements: parseInt(activity.engagements) || 0,
      lastMessageAt: activity.last_message_at,
      lastFavoriteAt: activity.last_favorite_at,
      period: `${days} days`
    }
  });
}));

export default router;