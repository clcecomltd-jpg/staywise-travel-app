import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '../utils/logger.js';

// Generic validation middleware factory
export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      
      logger.warn('Validation error', {
        property,
        errors: errorMessages,
        input: req[property]
      });

      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
        code: 'VALIDATION_ERROR'
      });
      return;
    }

    // Replace the original property with the validated and sanitized value
    req[property] = value;
    next();
  };
};

// Common validation schemas
export const commonSchemas = {
  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().optional(),
    order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // UUID validation
  uuid: Joi.string().uuid().required(),

  // Email validation
  email: Joi.string().email().required(),

  // Password validation
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    }),

  // Phone validation
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Phone number must be a valid international format'
    }),

  // Date validation
  date: Joi.date().iso().required(),

  // Coordinates validation
  coordinates: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required()
  }),

  // File validation
  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    mimetype: Joi.string().required(),
    size: Joi.number().max(10 * 1024 * 1024).required() // 10MB max
  })
};

// Authentication schemas
export const authSchemas = {
  login: Joi.object({
    email: commonSchemas.email,
    password: Joi.string().required(),
    user_type: Joi.string().valid('guest', 'host').optional()
  }),

  register: Joi.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    name: Joi.string().min(2).max(100).required(),
    user_type: Joi.string().valid('guest', 'host', 'both').required(),
    phone: commonSchemas.phone
  }),

  refreshToken: Joi.object({
    refresh_token: Joi.string().required()
  }),

  changePassword: Joi.object({
    current_password: Joi.string().required(),
    new_password: commonSchemas.password
  }),

  resetPassword: Joi.object({
    email: commonSchemas.email
  }),

  confirmResetPassword: Joi.object({
    token: Joi.string().required(),
    new_password: commonSchemas.password
  })
};

// Property schemas
export const propertySchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(200).required(),
    description: Joi.string().max(2000).optional(),
    address: Joi.string().min(5).max(500).required(),
    city: Joi.string().min(2).max(100).required(),
    country: Joi.string().min(2).max(100).required(),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    bedrooms: Joi.number().integer().min(0).max(50).required(),
    bathrooms: Joi.number().integer().min(0).max(50).required(),
    max_guests: Joi.number().integer().min(1).max(100).required(),
    property_type: Joi.string().min(2).max(100).required(),
    provider_type: Joi.string().valid('airbnb', 'vrbo', 'booking', 'manual').required(),
    provider_listing_id: Joi.string().optional(),
    provider_url: Joi.string().uri().optional(),
    check_in_instructions: Joi.string().max(1000).optional(),
    wifi_name: Joi.string().max(100).optional(),
    wifi_password: Joi.string().max(100).optional(),
    house_rules: Joi.string().max(2000).optional(),
    amenities: Joi.array().items(Joi.string()).optional()
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(200).optional(),
    description: Joi.string().max(2000).optional(),
    address: Joi.string().min(5).max(500).optional(),
    city: Joi.string().min(2).max(100).optional(),
    country: Joi.string().min(2).max(100).optional(),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    bedrooms: Joi.number().integer().min(0).max(50).optional(),
    bathrooms: Joi.number().integer().min(0).max(50).optional(),
    max_guests: Joi.number().integer().min(1).max(100).optional(),
    property_type: Joi.string().min(2).max(100).optional(),
    check_in_instructions: Joi.string().max(1000).optional(),
    wifi_name: Joi.string().max(100).optional(),
    wifi_password: Joi.string().max(100).optional(),
    house_rules: Joi.string().max(2000).optional(),
    amenities: Joi.array().items(Joi.string()).optional(),
    is_active: Joi.boolean().optional()
  }),

  import: Joi.object({
    provider_type: Joi.string().valid('airbnb', 'vrbo', 'booking', 'manual').required(),
    provider_url: Joi.string().uri().optional(),
    property_data: Joi.object().optional()
  })
};

// Stay schemas
export const staySchemas = {
  create: Joi.object({
    property_id: commonSchemas.uuid,
    guest_name: Joi.string().min(2).max(100).required(),
    guest_email: commonSchemas.email.optional(),
    guest_phone: commonSchemas.phone.optional(),
    arrival_date: commonSchemas.date,
    departure_date: commonSchemas.date,
    guest_count: Joi.number().integer().min(1).max(100).required(),
    special_requests: Joi.string().max(1000).optional()
  }),

  update: Joi.object({
    guest_name: Joi.string().min(2).max(100).optional(),
    guest_email: commonSchemas.email.optional(),
    guest_phone: commonSchemas.phone.optional(),
    arrival_date: commonSchemas.date.optional(),
    departure_date: commonSchemas.date.optional(),
    guest_count: Joi.number().integer().min(1).max(100).optional(),
    special_requests: Joi.string().max(1000).optional(),
    status: Joi.string().valid('upcoming', 'active', 'completed', 'cancelled').optional()
  })
};

// Message schemas
export const messageSchemas = {
  create: Joi.object({
    receiver_id: commonSchemas.uuid.optional(),
    property_id: commonSchemas.uuid.optional(),
    stay_id: commonSchemas.uuid.optional(),
    content: Joi.string().min(1).max(2000).required(),
    message_type: Joi.string().valid('text', 'image', 'file', 'system').default('text')
  })
};

// Recommendation schemas
export const recommendationSchemas = {
  create: Joi.object({
    property_id: commonSchemas.uuid.optional(),
    place_id: commonSchemas.uuid.optional(),
    title: Joi.string().min(2).max(200).required(),
    description: Joi.string().min(10).max(1000).required(),
    category: Joi.string().valid('food', 'tours', 'events', 'experiences', 'essentials', 'shopping', 'nightlife').required(),
    image_url: Joi.string().uri().required(),
    location: commonSchemas.coordinates.optional(),
    price: Joi.number().min(0).optional(),
    currency: Joi.string().length(3).optional(),
    rating: Joi.number().min(0).max(5).optional(),
    is_host_offer: Joi.boolean().default(false),
    is_featured: Joi.boolean().default(false),
    tags: Joi.array().items(Joi.string()).optional()
  }),

  update: Joi.object({
    title: Joi.string().min(2).max(200).optional(),
    description: Joi.string().min(10).max(1000).optional(),
    category: Joi.string().valid('food', 'tours', 'events', 'experiences', 'essentials', 'shopping', 'nightlife').optional(),
    image_url: Joi.string().uri().optional(),
    location: commonSchemas.coordinates.optional(),
    price: Joi.number().min(0).optional(),
    currency: Joi.string().length(3).optional(),
    rating: Joi.number().min(0).max(5).optional(),
    is_host_offer: Joi.boolean().optional(),
    is_featured: Joi.boolean().optional(),
    tags: Joi.array().items(Joi.string()).optional()
  })
};

// User schemas
export const userSchemas = {
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    phone: commonSchemas.phone,
    avatar_url: Joi.string().uri().optional(),
    preferences: Joi.object({
      language: Joi.string().length(2).optional(),
      currency: Joi.string().length(3).optional(),
      timezone: Joi.string().optional(),
      notifications: Joi.object({
        email: Joi.boolean().optional(),
        push: Joi.boolean().optional(),
        sms: Joi.boolean().optional()
      }).optional(),
      privacy: Joi.object({
        profile_visibility: Joi.string().valid('public', 'private', 'friends').optional(),
        location_sharing: Joi.boolean().optional()
      }).optional()
    }).optional()
  })
};

// File upload validation
export const fileUploadValidation = (allowedTypes: string[], maxSize: number = 10 * 1024 * 1024) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'File is required',
        code: 'FILE_REQUIRED'
      });
      return;
    }

    const { mimetype, size } = req.file;

    if (!allowedTypes.includes(mimetype)) {
      res.status(400).json({
        success: false,
        message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
        code: 'INVALID_FILE_TYPE'
      });
      return;
    }

    if (size > maxSize) {
      res.status(400).json({
        success: false,
        message: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`,
        code: 'FILE_TOO_LARGE'
      });
      return;
    }

    next();
  };
};