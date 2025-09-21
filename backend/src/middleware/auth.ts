import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { JWTPayload, User } from '../types/index.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
      token?: string;
    }
  }
}

export interface AuthRequest extends Request {
  user: User;
  token: string;
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT secrets are not configured');
}

// Verify JWT token
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required',
        code: 'MISSING_TOKEN'
      });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.user_id)
      .eq('is_active', true)
      .single();

    if (error || !user) {
      logger.warn('Token verification failed - user not found', {
        userId: decoded.user_id,
        error: error?.message
      });
      
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      });
      return;
    }

    // Add user to request object
    req.user = user as User;
    req.token = token;
    
    next();
  } catch (error) {
    logger.error('Token verification error', { error });
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Authentication error',
        code: 'AUTH_ERROR'
      });
    }
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      next();
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.user_id)
      .eq('is_active', true)
      .single();

    if (user) {
      req.user = user as User;
      req.token = token;
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Check if user has specific role
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    if (!roles.includes(req.user.user_type)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
      return;
    }

    next();
  };
};

// Check if user is host
export const requireHost = requireRole(['host', 'both']);

// Check if user is guest
export const requireGuest = requireRole(['guest', 'both']);

// Check if user owns the resource
export const requireOwnership = (resourceField: string = 'user_id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    const resourceId = req.params.id || req.body[resourceField];
    
    if (resourceId && resourceId !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'Access denied - resource ownership required',
        code: 'ACCESS_DENIED'
      });
      return;
    }

    next();
  };
};

// Generate JWT tokens
export const generateTokens = (user: User): { accessToken: string; refreshToken: string } => {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    user_id: user.id,
    email: user.email,
    user_type: user.user_type,
    account_id: user.id // This will be updated when account system is implemented
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });

  return { accessToken, refreshToken };
};

// Verify refresh token
export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
};

// Rate limiting for auth endpoints
export const authRateLimit = (maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip + ':' + (req.body.email || '');
    const now = Date.now();
    const userAttempts = attempts.get(key);

    if (userAttempts) {
      if (now < userAttempts.resetTime) {
        if (userAttempts.count >= maxAttempts) {
          res.status(429).json({
            success: false,
            message: 'Too many authentication attempts',
            code: 'RATE_LIMITED',
            retryAfter: Math.ceil((userAttempts.resetTime - now) / 1000)
          });
          return;
        }
        userAttempts.count++;
      } else {
        attempts.set(key, { count: 1, resetTime: now + windowMs });
      }
    } else {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
    }

    next();
  };
};