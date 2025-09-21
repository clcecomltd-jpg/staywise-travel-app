import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { APIResponse } from '../types/index.js';

// Custom error class
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error types
export const ErrorTypes = {
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  MISSING_TOKEN: 'MISSING_TOKEN',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  
  // Database errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  QUERY_FAILED: 'QUERY_FAILED',
  CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION',
  
  // File upload errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  
  // Rate limiting
  RATE_LIMITED: 'RATE_LIMITED',
  
  // External service errors
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  API_QUOTA_EXCEEDED: 'API_QUOTA_EXCEEDED',
  
  // Business logic errors
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  RESOURCE_UNAVAILABLE: 'RESOURCE_UNAVAILABLE',
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
  
  // System errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
};

// Error factory functions
export const createError = {
  unauthorized: (message: string = 'Unauthorized access') => 
    new AppError(message, 401, ErrorTypes.UNAUTHORIZED),
  
  forbidden: (message: string = 'Access forbidden') => 
    new AppError(message, 403, ErrorTypes.FORBIDDEN),
  
  notFound: (message: string = 'Resource not found') => 
    new AppError(message, 404, ErrorTypes.NOT_FOUND),
  
  conflict: (message: string = 'Resource conflict') => 
    new AppError(message, 409, ErrorTypes.CONFLICT),
  
  validation: (message: string = 'Validation failed', errors?: string[]) => {
    const error = new AppError(message, 400, ErrorTypes.VALIDATION_ERROR);
    (error as any).errors = errors;
    return error;
  },
  
  database: (message: string = 'Database operation failed') => 
    new AppError(message, 500, ErrorTypes.DATABASE_ERROR),
  
  external: (message: string = 'External service error') => 
    new AppError(message, 502, ErrorTypes.EXTERNAL_SERVICE_ERROR),
  
  internal: (message: string = 'Internal server error') => 
    new AppError(message, 500, ErrorTypes.INTERNAL_ERROR)
};

// Main error handler middleware
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Internal server error';
  let errors: string[] | undefined;

  // Handle known error types
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;
    errors = (error as any).errors;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    code = ErrorTypes.VALIDATION_ERROR;
    message = 'Validation failed';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    code = ErrorTypes.INVALID_INPUT;
    message = 'Invalid input format';
  } else if (error.name === 'MongoError' || error.name === 'MongooseError') {
    statusCode = 500;
    code = ErrorTypes.DATABASE_ERROR;
    message = 'Database operation failed';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = ErrorTypes.INVALID_TOKEN;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    code = ErrorTypes.TOKEN_EXPIRED;
    message = 'Token expired';
  }

  // Log error
  if (statusCode >= 500) {
    logger.error('Server Error', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: (req as any).user?.id
    });
  } else {
    logger.warn('Client Error', {
      error: error.message,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userId: (req as any).user?.id
    });
  }

  // Prepare response
  const response: APIResponse = {
    success: false,
    message,
    code
  };

  if (errors) {
    response.errors = errors;
  }

  // Add error details in development
  if (process.env.NODE_ENV === 'development') {
    (response as any).stack = error.stack;
    (response as any).details = {
      name: error.name,
      message: error.message
    };
  }

  res.status(statusCode).json(response);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFound = (req: Request, res: Response): void => {
  const response: APIResponse = {
    success: false,
    message: `Route ${req.originalUrl} not found`,
    code: ErrorTypes.NOT_FOUND
  };

  res.status(404).json(response);
};

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack
  });
  
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection', {
    reason: reason?.message || reason,
    stack: reason?.stack
  });
  
  process.exit(1);
});