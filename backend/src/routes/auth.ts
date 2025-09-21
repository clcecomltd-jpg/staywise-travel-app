import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { supabase, DatabaseHelper } from '../config/database.js';
import { authenticateToken, generateTokens, verifyRefreshToken, authRateLimit } from '../middleware/auth.js';
import { validate, authSchemas } from '../middleware/validation.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { APIResponse, AuthTokens, User } from '../types/index.js';

const router = Router();

// Register new user
router.post('/register', 
  authRateLimit(3, 15 * 60 * 1000), // 3 attempts per 15 minutes
  validate(authSchemas.register),
  asyncHandler(async (req, res) => {
    const { email, password, name, user_type, phone } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw createError.conflict('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = uuidv4();
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email,
        password_hash: hashedPassword,
        name,
        user_type,
        phone,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, email, name, user_type, phone, created_at, is_active')
      .single();

    if (error) {
      logger.error('User creation failed', { error, email });
      throw createError.database('Failed to create user account');
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user as User);

    // Store refresh token
    await supabase
      .from('refresh_tokens')
      .insert({
        user_id: userId,
        token_hash: await bcrypt.hash(refreshToken, saltRounds),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        created_at: new Date().toISOString()
      });

    logger.info('User registered successfully', { userId, email, user_type });

    const response: APIResponse<{ user: User; tokens: AuthTokens }> = {
      success: true,
      message: 'User registered successfully',
      data: {
        user: user as User,
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: 24 * 60 * 60, // 24 hours in seconds
          token_type: 'Bearer'
        }
      }
    };

    res.status(201).json(response);
  })
);

// Login user
router.post('/login',
  authRateLimit(5, 15 * 60 * 1000), // 5 attempts per 15 minutes
  validate(authSchemas.login),
  asyncHandler(async (req, res) => {
    const { email, password, user_type } = req.body;

    // Get user with password hash
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !user) {
      throw createError.unauthorized('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw createError.unauthorized('Invalid email or password');
    }

    // Check user type if specified
    if (user_type && user.user_type !== user_type && user.user_type !== 'both') {
      throw createError.forbidden(`Access denied. This account is not authorized for ${user_type} mode.`);
    }

    // Update last login
    await supabase
      .from('users')
      .update({ 
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user as User);

    // Store refresh token
    const saltRounds = 12;
    await supabase
      .from('refresh_tokens')
      .insert({
        user_id: user.id,
        token_hash: await bcrypt.hash(refreshToken, saltRounds),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      });

    logger.info('User logged in successfully', { userId: user.id, email, user_type: user.user_type });

    const response: APIResponse<{ user: User; tokens: AuthTokens }> = {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          user_type: user.user_type,
          phone: user.phone,
          avatar_url: user.avatar_url,
          created_at: user.created_at,
          updated_at: user.updated_at,
          last_login: user.last_login,
          is_active: user.is_active
        } as User,
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: 24 * 60 * 60,
          token_type: 'Bearer'
        }
      }
    };

    res.json(response);
  })
);

// Refresh access token
router.post('/refresh',
  validate(authSchemas.refreshToken),
  asyncHandler(async (req, res) => {
    const { refresh_token } = req.body;

    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refresh_token);
      
      // Check if refresh token exists in database
      const { data: tokenRecord } = await supabase
        .from('refresh_tokens')
        .select('*')
        .eq('user_id', decoded.user_id)
        .eq('expires_at', '>', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!tokenRecord) {
        throw createError.unauthorized('Invalid or expired refresh token');
      }

      // Verify token hash
      const isValidToken = await bcrypt.compare(refresh_token, tokenRecord.token_hash);
      if (!isValidToken) {
        throw createError.unauthorized('Invalid refresh token');
      }

      // Get user
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.user_id)
        .eq('is_active', true)
        .single();

      if (!user) {
        throw createError.unauthorized('User not found or inactive');
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user as User);

      // Update refresh token in database
      const saltRounds = 12;
      await supabase
        .from('refresh_tokens')
        .update({
          token_hash: await bcrypt.hash(newRefreshToken, saltRounds),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', tokenRecord.id);

      logger.info('Token refreshed successfully', { userId: user.id });

      const response: APIResponse<AuthTokens> = {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          access_token: accessToken,
          refresh_token: newRefreshToken,
          expires_in: 24 * 60 * 60,
          token_type: 'Bearer'
        }
      };

      res.json(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'JsonWebTokenError') {
        throw createError.unauthorized('Invalid refresh token');
      }
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw createError.unauthorized('Refresh token expired');
      }
      throw error;
    }
  })
);

// Get current user
router.get('/me',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const response: APIResponse<User> = {
      success: true,
      data: req.user!
    };

    res.json(response);
  })
);

// Logout user
router.post('/logout',
  authenticateToken,
  asyncHandler(async (req, res) => {
    // Invalidate all refresh tokens for this user
    await supabase
      .from('refresh_tokens')
      .delete()
      .eq('user_id', req.user!.id);

    logger.info('User logged out successfully', { userId: req.user!.id });

    const response: APIResponse = {
      success: true,
      message: 'Logged out successfully'
    };

    res.json(response);
  })
);

// Change password
router.put('/password',
  authenticateToken,
  validate(authSchemas.changePassword),
  asyncHandler(async (req, res) => {
    const { current_password, new_password } = req.body;
    const userId = req.user!.id;

    // Get user with password hash
    const { data: user } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (!user) {
      throw createError.notFound('User not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(current_password, user.password_hash);
    if (!isValidPassword) {
      throw createError.unauthorized('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(new_password, saltRounds);

    // Update password
    await supabase
      .from('users')
      .update({
        password_hash: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    // Invalidate all refresh tokens
    await supabase
      .from('refresh_tokens')
      .delete()
      .eq('user_id', userId);

    logger.info('Password changed successfully', { userId });

    const response: APIResponse = {
      success: true,
      message: 'Password changed successfully. Please log in again.'
    };

    res.json(response);
  })
);

// Request password reset
router.post('/reset-password',
  authRateLimit(3, 60 * 60 * 1000), // 3 attempts per hour
  validate(authSchemas.resetPassword),
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Check if user exists
    const { data: user } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (!user) {
      // Don't reveal if user exists or not
      const response: APIResponse = {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      };
      res.json(response);
      return;
    }

    // Generate reset token
    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token
    await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: user.id,
        token_hash: await bcrypt.hash(resetToken, 12),
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      });

    // TODO: Send email with reset link
    // For now, just log the token (in production, this would be sent via email)
    logger.info('Password reset token generated', { 
      userId: user.id, 
      email,
      resetToken: resetToken // Remove this in production
    });

    const response: APIResponse = {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    };

    res.json(response);
  })
);

// Confirm password reset
router.post('/reset-password/confirm',
  authRateLimit(5, 60 * 60 * 1000), // 5 attempts per hour
  validate(authSchemas.confirmResetPassword),
  asyncHandler(async (req, res) => {
    const { token, new_password } = req.body;

    // Find valid reset token
    const { data: tokenRecord } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('expires_at', '>', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (!tokenRecord) {
      throw createError.unauthorized('Invalid or expired reset token');
    }

    // Verify token
    const isValidToken = await bcrypt.compare(token, tokenRecord.token_hash);
    if (!isValidToken) {
      throw createError.unauthorized('Invalid reset token');
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(new_password, saltRounds);

    // Update password
    await supabase
      .from('users')
      .update({
        password_hash: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', tokenRecord.user_id);

    // Delete used reset token
    await supabase
      .from('password_reset_tokens')
      .delete()
      .eq('id', tokenRecord.id);

    // Invalidate all refresh tokens
    await supabase
      .from('refresh_tokens')
      .delete()
      .eq('user_id', tokenRecord.user_id);

    logger.info('Password reset completed', { userId: tokenRecord.user_id });

    const response: APIResponse = {
      success: true,
      message: 'Password reset successfully. Please log in with your new password.'
    };

    res.json(response);
  })
);

export default router;