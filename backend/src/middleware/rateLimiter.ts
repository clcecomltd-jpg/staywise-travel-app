import { RateLimiterRedis } from 'rate-limiter-flexible';
import { getRedisClient } from '../config/redis.js';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

// Rate limiter for general API requests
const rateLimiter = new RateLimiterRedis({
  storeClient: getRedisClient(),
  keyPrefix: 'rl_general',
  points: 100, // Number of requests
  duration: 900, // Per 15 minutes
  blockDuration: 60, // Block for 1 minute if limit exceeded
});

// Rate limiter for authentication endpoints
const authRateLimiter = new RateLimiterRedis({
  storeClient: getRedisClient(),
  keyPrefix: 'rl_auth',
  points: 5, // Number of requests
  duration: 900, // Per 15 minutes
  blockDuration: 300, // Block for 5 minutes if limit exceeded
});

// Rate limiter for chat messages
const chatRateLimiter = new RateLimiterRedis({
  storeClient: getRedisClient(),
  keyPrefix: 'rl_chat',
  points: 30, // Number of messages
  duration: 60, // Per minute
  blockDuration: 30, // Block for 30 seconds if limit exceeded
});

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.ip || 'unknown';
    await rateLimiter.consume(key);
    next();
  } catch (rejRes) {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 1
    });
  }
};

export const authRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.ip || 'unknown';
    await authRateLimiter.consume(key);
    next();
  } catch (rejRes) {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many authentication attempts',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 1
    });
  }
};

export const chatRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.ip || 'unknown';
    await chatRateLimiter.consume(key);
    next();
  } catch (rejRes) {
    logger.warn(`Chat rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many chat messages',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 1
    });
  }
};