import express from 'express';
import { RecommendationService } from '../services/recommendations.js';
import { GooglePlacesService } from '../services/googlePlaces.js';
import { authenticateToken, requireHost, optionalAuth, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = express.Router();
const recommendationService = RecommendationService.getInstance();
const googlePlacesService = GooglePlacesService.getInstance();

// Get recommendations for a property
router.get('/property/:propertyId', optionalAuth, asyncHandler(async (req: AuthRequest, res) => {
  const { propertyId } = req.params;
  const { category, priority, search, limit, offset } = req.query;

  const filters = {
    category: category as string,
    priority: priority as string,
    isActive: true,
    search: search as string,
    limit: limit ? parseInt(limit as string) : 50,
    offset: offset ? parseInt(offset as string) : 0
  };

  const recommendations = await recommendationService.getRecommendations(propertyId, filters);
  
  res.json({
    success: true,
    data: recommendations,
    pagination: {
      limit: filters.limit,
      offset: filters.offset,
      total: recommendations.length
    }
  });
}));

// Get personalized recommendations
router.get('/property/:propertyId/personalized', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const { propertyId } = req.params;
  const { limit = 10 } = req.query;
  const userId = req.user!.id;

  // Get user preferences from request body or user profile
  const userPreferences = {
    tripPurpose: req.body.tripPurpose || [],
    interests: req.body.interests || [],
    budget: req.body.budget || 'mid',
    groupSize: req.body.groupSize || 'any',
    timeOfDay: req.body.timeOfDay || 'any'
  };

  const recommendations = await recommendationService.getPersonalizedRecommendations(
    propertyId,
    userId,
    userPreferences,
    parseInt(limit as string)
  );

  res.json({
    success: true,
    data: recommendations
  });
}));

// Get nearby recommendations
router.get('/property/:propertyId/nearby', optionalAuth, asyncHandler(async (req: AuthRequest, res) => {
  const { propertyId } = req.params;
  const { lat, lng, radius = 5000, category } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      error: 'Latitude and longitude are required'
    });
  }

  const location = {
    lat: parseFloat(lat as string),
    lng: parseFloat(lng as string)
  };

  const recommendations = await recommendationService.getNearbyRecommendations(
    propertyId,
    location,
    parseInt(radius as string),
    category as string
  );

  res.json({
    success: true,
    data: recommendations
  });
}));

// Get single recommendation
router.get('/:id', optionalAuth, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  
  const recommendation = await recommendationService.getRecommendationById(id);
  
  if (!recommendation) {
    return res.status(404).json({
      success: false,
      error: 'Recommendation not found'
    });
  }

  // Get place details if placeId exists
  if (recommendation.placeId) {
    try {
      const placeDetails = await googlePlacesService.getPlaceDetails(recommendation.placeId);
      recommendation.placeDetails = placeDetails;
    } catch (error) {
      logger.warn(`Failed to fetch place details for ${recommendation.placeId}:`, error);
    }
  }

  res.json({
    success: true,
    data: recommendation
  });
}));

// Create recommendation (Host only)
router.post('/', authenticateToken, requireHost, asyncHandler(async (req: AuthRequest, res) => {
  const {
    propertyId,
    placeId,
    title,
    description,
    category,
    priority = 'medium'
  } = req.body;

  if (!propertyId || !placeId || !title || !description || !category) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: propertyId, placeId, title, description, category'
    });
  }

  const recommendation = await recommendationService.createRecommendation(
    propertyId,
    placeId,
    title,
    description,
    category,
    priority,
    req.user!.id
  );

  res.status(201).json({
    success: true,
    data: recommendation
  });
}));

// Update recommendation (Host only)
router.put('/:id', authenticateToken, requireHost, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const updates = req.body;

  const recommendation = await recommendationService.updateRecommendation(id, updates);
  
  if (!recommendation) {
    return res.status(404).json({
      success: false,
      error: 'Recommendation not found'
    });
  }

  res.json({
    success: true,
    data: recommendation
  });
}));

// Delete recommendation (Host only)
router.delete('/:id', authenticateToken, requireHost, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  
  const deleted = await recommendationService.deleteRecommendation(id);
  
  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Recommendation not found'
    });
  }

  res.json({
    success: true,
    message: 'Recommendation deleted successfully'
  });
}));

// Track engagement
router.post('/:id/engage', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!['view', 'favorite', 'click', 'share'].includes(action)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid action. Must be one of: view, favorite, click, share'
    });
  }

  await recommendationService.trackEngagement(id, req.user!.id, action);

  res.json({
    success: true,
    message: 'Engagement tracked successfully'
  });
}));

// Get recommendation analytics (Host only)
router.get('/property/:propertyId/analytics', authenticateToken, requireHost, asyncHandler(async (req: AuthRequest, res) => {
  const { propertyId } = req.params;
  const { startDate, endDate } = req.query;

  // This would typically query analytics data
  // For now, return mock data
  const analytics = {
    totalRecommendations: 0,
    totalViews: 0,
    totalFavorites: 0,
    totalClicks: 0,
    topCategories: [],
    engagementRate: 0,
    period: {
      start: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end: endDate || new Date().toISOString()
    }
  };

  res.json({
    success: true,
    data: analytics
  });
}));

export default router;