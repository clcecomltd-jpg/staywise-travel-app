import express from 'express';
import { GooglePlacesService } from '../services/googlePlaces.js';
import { optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = express.Router();
const googlePlacesService = GooglePlacesService.getInstance();

// Search places by text
router.get('/search', optionalAuth, asyncHandler(async (req, res) => {
  const { q, lat, lng, radius, type } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Query parameter "q" is required'
    });
  }

  const location = lat && lng ? {
    lat: parseFloat(lat as string),
    lng: parseFloat(lng as string)
  } : undefined;

  const results = await googlePlacesService.textSearch(
    q as string,
    location,
    radius ? parseInt(radius as string) : undefined,
    type as string
  );

  res.json({
    success: true,
    data: results
  });
}));

// Get nearby places
router.get('/nearby', optionalAuth, asyncHandler(async (req, res) => {
  const { lat, lng, radius = 5000, type, keyword } = req.query;

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

  const results = await googlePlacesService.searchNearby(
    location,
    parseInt(radius as string),
    type as string,
    keyword as string
  );

  res.json({
    success: true,
    data: results
  });
}));

// Get place details
router.get('/:placeId', optionalAuth, asyncHandler(async (req, res) => {
  const { placeId } = req.params;

  const placeDetails = await googlePlacesService.getPlaceDetails(placeId);

  if (!placeDetails) {
    return res.status(404).json({
      success: false,
      error: 'Place not found'
    });
  }

  res.json({
    success: true,
    data: placeDetails
  });
}));

// Get place photo
router.get('/:placeId/photo/:photoReference', optionalAuth, asyncHandler(async (req, res) => {
  const { placeId, photoReference } = req.params;
  const { maxWidth = 400, maxHeight = 400 } = req.query;

  const photoUrl = await googlePlacesService.getPlacePhoto(
    photoReference,
    parseInt(maxWidth as string),
    parseInt(maxHeight as string)
  );

  res.json({
    success: true,
    data: {
      photoUrl,
      placeId,
      photoReference,
      maxWidth: parseInt(maxWidth as string),
      maxHeight: parseInt(maxHeight as string)
    }
  });
}));

// Get directions between two points
router.get('/directions', optionalAuth, asyncHandler(async (req, res) => {
  const { 
    originLat, 
    originLng, 
    destLat, 
    destLng, 
    mode = 'driving' 
  } = req.query;

  if (!originLat || !originLng || !destLat || !destLng) {
    return res.status(400).json({
      success: false,
      error: 'Origin and destination coordinates are required'
    });
  }

  const origin = {
    lat: parseFloat(originLat as string),
    lng: parseFloat(originLng as string)
  };

  const destination = {
    lat: parseFloat(destLat as string),
    lng: parseFloat(destLng as string)
  };

  const directions = await googlePlacesService.getDirections(
    origin,
    destination,
    mode as 'driving' | 'walking' | 'bicycling' | 'transit'
  );

  res.json({
    success: true,
    data: directions
  });
}));

// Get popular places by category
router.get('/category/:category', optionalAuth, asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { lat, lng, radius = 10000 } = req.query;

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

  const results = await googlePlacesService.searchNearby(
    location,
    parseInt(radius as string),
    category
  );

  // Sort by rating and user ratings total
  const sortedResults = results
    .filter(place => place.rating && place.userRatingsTotal)
    .sort((a, b) => {
      const scoreA = (a.rating || 0) * Math.log(a.userRatingsTotal || 1);
      const scoreB = (b.rating || 0) * Math.log(b.userRatingsTotal || 1);
      return scoreB - scoreA;
    })
    .slice(0, 20); // Top 20 results

  res.json({
    success: true,
    data: sortedResults
  });
}));

// Get place types/categories
router.get('/types/list', asyncHandler(async (req, res) => {
  const placeTypes = [
    { id: 'restaurant', name: 'Restaurants', category: 'food' },
    { id: 'tourist_attraction', name: 'Tourist Attractions', category: 'tours' },
    { id: 'museum', name: 'Museums', category: 'culture' },
    { id: 'art_gallery', name: 'Art Galleries', category: 'culture' },
    { id: 'shopping_mall', name: 'Shopping Malls', category: 'shopping' },
    { id: 'store', name: 'Stores', category: 'shopping' },
    { id: 'bar', name: 'Bars', category: 'nightlife' },
    { id: 'night_club', name: 'Night Clubs', category: 'nightlife' },
    { id: 'park', name: 'Parks', category: 'nature' },
    { id: 'zoo', name: 'Zoos', category: 'nature' },
    { id: 'amusement_park', name: 'Amusement Parks', category: 'entertainment' },
    { id: 'movie_theater', name: 'Movie Theaters', category: 'entertainment' },
    { id: 'gym', name: 'Gyms', category: 'entertainment' },
    { id: 'spa', name: 'Spas', category: 'entertainment' },
    { id: 'hospital', name: 'Hospitals', category: 'services' },
    { id: 'pharmacy', name: 'Pharmacies', category: 'services' },
    { id: 'gas_station', name: 'Gas Stations', category: 'services' },
    { id: 'atm', name: 'ATMs', category: 'services' },
    { id: 'bank', name: 'Banks', category: 'services' },
    { id: 'post_office', name: 'Post Offices', category: 'services' }
  ];

  res.json({
    success: true,
    data: placeTypes
  });
}));

export default router;