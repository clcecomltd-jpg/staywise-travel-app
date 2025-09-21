import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { createError } from './errorHandler.js';
import { logger } from '../utils/logger.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    userType: 'guest' | 'host';
    propertyId?: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw createError('Access token required', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Verify user still exists in database
    const result = await query(
      'SELECT id, email, user_type, property_id FROM users WHERE id = $1 AND active = true',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      throw createError('User not found or inactive', 401);
    }

    const user = result.rows[0];
    req.user = {
      id: user.id,
      email: user.email,
      userType: user.user_type,
      propertyId: user.property_id
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(createError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(createError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

export const requireHost = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.userType !== 'host') {
    return next(createError('Host access required', 403));
  }
  next();
};

export const requireGuest = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.userType !== 'guest') {
    return next(createError('Guest access required', 403));
  }
  next();
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const result = await query(
      'SELECT id, email, user_type, property_id FROM users WHERE id = $1 AND active = true',
      [decoded.userId]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      req.user = {
        id: user.id,
        email: user.email,
        userType: user.user_type,
        propertyId: user.property_id
      };
    }

    next();
  } catch (error) {
    // For optional auth, we don't fail on token errors
    next();
  }
};