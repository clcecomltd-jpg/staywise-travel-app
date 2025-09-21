import express from 'express';
import { query, transaction } from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { chatRateLimiter } from '../middleware/rateLimiter.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get chat messages for a property
router.get('/property/:propertyId', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const { propertyId } = req.params;
  const { limit = 50, offset = 0 } = req.query;
  const userId = req.user!.id;

  // Verify user has access to this property's chat
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
      error: 'Access denied to this property chat'
    });
  }

  const result = await query(`
    SELECT m.*, u.email, u.user_type
    FROM messages m
    JOIN users u ON m.user_id = u.id
    WHERE m.property_id = $1
    ORDER BY m.created_at DESC
    LIMIT $2 OFFSET $3
  `, [propertyId, parseInt(limit as string), parseInt(offset as string)]);

  const messages = result.rows.map(row => ({
    id: row.id,
    propertyId: row.property_id,
    userId: row.user_id,
    userEmail: row.email,
    userType: row.user_type,
    message: row.message,
    messageType: row.message_type,
    metadata: row.metadata,
    isRead: row.is_read,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));

  res.json({
    success: true,
    data: messages.reverse() // Return in chronological order
  });
}));

// Send a message
router.post('/send', authenticateToken, chatRateLimiter, asyncHandler(async (req: AuthRequest, res) => {
  const { propertyId, message, messageType = 'text', metadata = {} } = req.body;
  const userId = req.user!.id;

  if (!propertyId || !message) {
    return res.status(400).json({
      success: false,
      error: 'Property ID and message are required'
    });
  }

  // Verify user has access to this property's chat
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
      error: 'Access denied to this property chat'
    });
  }

  const result = await query(`
    INSERT INTO messages (property_id, user_id, message, message_type, metadata)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [propertyId, userId, message, messageType, JSON.stringify(metadata)]);

  const newMessage = result.rows[0];

  // Get user details for the response
  const userResult = await query(`
    SELECT email, user_type FROM users WHERE id = $1
  `, [userId]);

  const user = userResult.rows[0];

  res.status(201).json({
    success: true,
    data: {
      id: newMessage.id,
      propertyId: newMessage.property_id,
      userId: newMessage.user_id,
      userEmail: user.email,
      userType: user.user_type,
      message: newMessage.message,
      messageType: newMessage.message_type,
      metadata: newMessage.metadata,
      isRead: newMessage.is_read,
      createdAt: newMessage.created_at,
      updatedAt: newMessage.updated_at
    }
  });
}));

// Mark messages as read
router.put('/mark-read', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const { propertyId, messageIds } = req.body;
  const userId = req.user!.id;

  if (!propertyId || !messageIds || !Array.isArray(messageIds)) {
    return res.status(400).json({
      success: false,
      error: 'Property ID and message IDs array are required'
    });
  }

  // Verify user has access to this property's chat
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
      error: 'Access denied to this property chat'
    });
  }

  // Mark messages as read
  const placeholders = messageIds.map((_, index) => `$${index + 2}`).join(',');
  await query(`
    UPDATE messages 
    SET is_read = true, updated_at = NOW()
    WHERE property_id = $1 AND id IN (${placeholders})
  `, [propertyId, ...messageIds]);

  res.json({
    success: true,
    message: 'Messages marked as read'
  });
}));

// Get unread message count for a property
router.get('/property/:propertyId/unread-count', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const { propertyId } = req.params;
  const userId = req.user!.id;

  // Verify user has access to this property's chat
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
      error: 'Access denied to this property chat'
    });
  }

  const result = await query(`
    SELECT COUNT(*) as unread_count
    FROM messages
    WHERE property_id = $1 AND user_id != $2 AND is_read = false
  `, [propertyId, userId]);

  const unreadCount = parseInt(result.rows[0].unread_count);

  res.json({
    success: true,
    data: {
      unreadCount
    }
  });
}));

// Get chat participants for a property (Host only)
router.get('/property/:propertyId/participants', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const { propertyId } = req.params;
  const userId = req.user!.id;

  // Verify user is host of this property
  const hostCheck = await query(`
    SELECT 1 FROM users u
    WHERE u.id = $1 AND u.property_id = $2 AND u.user_type = 'host'
  `, [userId, propertyId]);

  if (hostCheck.rows.length === 0) {
    return res.status(403).json({
      success: false,
      error: 'Only property hosts can view participants'
    });
  }

  const result = await query(`
    SELECT DISTINCT u.id, u.email, u.user_type, u.first_name, u.last_name,
           MAX(m.created_at) as last_message_at,
           COUNT(m.id) as message_count
    FROM users u
    JOIN messages m ON u.id = m.user_id
    WHERE m.property_id = $1
    GROUP BY u.id, u.email, u.user_type, u.first_name, u.last_name
    ORDER BY last_message_at DESC
  `, [propertyId]);

  const participants = result.rows.map(row => ({
    id: row.id,
    email: row.email,
    userType: row.user_type,
    firstName: row.first_name,
    lastName: row.last_name,
    lastMessageAt: row.last_message_at,
    messageCount: parseInt(row.message_count)
  }));

  res.json({
    success: true,
    data: participants
  });
}));

// Delete a message (only by sender or host)
router.delete('/:messageId', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const { messageId } = req.params;
  const userId = req.user!.id;

  // Check if user can delete this message
  const messageCheck = await query(`
    SELECT m.*, u.user_type, u.property_id as user_property_id
    FROM messages m
    JOIN users u ON m.user_id = u.id
    WHERE m.id = $1
  `, [messageId]);

  if (messageCheck.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Message not found'
    });
  }

  const message = messageCheck.rows[0];
  const isOwner = message.user_id === userId;
  const isHost = message.user_type === 'host' && message.user_property_id === message.property_id;

  if (!isOwner && !isHost) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to delete this message'
    });
  }

  await query(`
    DELETE FROM messages WHERE id = $1
  `, [messageId]);

  res.json({
    success: true,
    message: 'Message deleted successfully'
  });
}));

export default router;