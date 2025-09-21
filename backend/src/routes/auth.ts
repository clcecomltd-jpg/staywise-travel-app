import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, transaction } from '../config/database.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Register new user
router.post('/register', authRateLimiter, asyncHandler(async (req, res) => {
  const { email, password, userType, firstName, lastName, propertyId } = req.body;

  if (!email || !password || !userType || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: email, password, userType, firstName, lastName'
    });
  }

  if (!['guest', 'host'].includes(userType)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid user type. Must be "guest" or "host"'
    });
  }

  // Check if user already exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (existingUser.rows.length > 0) {
    return res.status(409).json({
      success: false,
      error: 'User with this email already exists'
    });
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const result = await transaction(async (client) => {
    const userResult = await client.query(`
      INSERT INTO users (email, password_hash, user_type, first_name, last_name, property_id, active)
      VALUES ($1, $2, $3, $4, $5, $6, true)
      RETURNING id, email, user_type, first_name, last_name, property_id, created_at
    `, [email.toLowerCase(), hashedPassword, userType, firstName, lastName, propertyId || null]);

    const user = userResult.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        userType: user.user_type 
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return { user, token };
  });

  logger.info(`New user registered: ${email} (${userType})`);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: result.user.id,
        email: result.user.email,
        userType: result.user.user_type,
        firstName: result.user.first_name,
        lastName: result.user.last_name,
        propertyId: result.user.property_id,
        createdAt: result.user.created_at
      },
      token: result.token
    }
  });
}));

// Login user
router.post('/login', authRateLimiter, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required'
    });
  }

  // Find user
  const result = await query(`
    SELECT id, email, password_hash, user_type, first_name, last_name, property_id, active
    FROM users 
    WHERE email = $1
  `, [email.toLowerCase()]);

  if (result.rows.length === 0) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  const user = result.rows[0];

  // Check if user is active
  if (!user.active) {
    return res.status(401).json({
      success: false,
      error: 'Account is deactivated'
    });
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      userType: user.user_type 
    },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  // Update last login
  await query(
    'UPDATE users SET last_login = NOW() WHERE id = $1',
    [user.id]
  );

  logger.info(`User logged in: ${email}`);

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        userType: user.user_type,
        firstName: user.first_name,
        lastName: user.last_name,
        propertyId: user.property_id
      },
      token
    }
  });
}));

// Get current user profile
router.get('/me', asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const result = await query(`
      SELECT id, email, user_type, first_name, last_name, property_id, created_at, last_login
      FROM users 
      WHERE id = $1 AND active = true
    `, [decoded.userId]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'User not found or inactive'
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
        lastLogin: user.last_login
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }
    throw error;
  }
}));

// Refresh token
router.post('/refresh', authRateLimiter, asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      error: 'Refresh token is required'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;
    
    // Verify user still exists and is active
    const result = await query(`
      SELECT id, email, user_type, first_name, last_name, property_id
      FROM users 
      WHERE id = $1 AND active = true
    `, [decoded.userId]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'User not found or inactive'
      });
    }

    const user = result.rows[0];

    // Generate new access token
    const newToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        userType: user.user_type 
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: {
        token: newToken
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid refresh token'
    });
  }
}));

// Logout (client-side token removal)
router.post('/logout', asyncHandler(async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // This endpoint can be used for logging purposes
  logger.info('User logged out');
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

// Change password
router.put('/change-password', authRateLimiter, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Current password and new password are required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Get current user
    const result = await query(`
      SELECT password_hash FROM users WHERE id = $1 AND active = true
    `, [decoded.userId]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    const user = result.rows[0];

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, decoded.userId]
    );

    logger.info(`Password changed for user: ${decoded.userId}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    throw error;
  }
}));

export default router;