import { Client } from '@googlemaps/google-maps-services-js';
import { logger } from '../utils/logger.js';
import { cache } from '../config/redis.js';

const client = new Client({});

export interface PlaceDetails {
  placeId: string;
  name: string;
  formattedAddress: string;
  location: {
    lat: number;
    lng: number;
  };
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  types: string[];
  photos?: Array<{
    photoReference: string;
    height: number;
    width: number;
  }>;
  openingHours?: {
    openNow: boolean;
    periods: Array<{
      open: { day: number; time: string };
      close?: { day: number; time: string };
    }>;
    weekdayText: string[];
  };
  website?: string;
  phoneNumber?: string;
  internationalPhoneNumber?: string;
  reviews?: Array<{
    authorName: string;
    rating: number;
    text: string;
    time: number;
  }>;
  utcOffset?: number;
  vicinity?: string;
}

export interface NearbySearchResult {
  placeId: string;
  name: string;
  formattedAddress: string;
  location: {
    lat: number;
    lng: number;
  };
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  types: string[];
  photos?: Array<{
    photoReference: string;
    height: number;
    width: number;
  }>;
  businessStatus?: string;
  permanentlyClosed?: boolean;
}

export interface TextSearchResult {
  placeId: string;
  name: string;
  formattedAddress: string;
  location: {
    lat: number;
    lng: number;
  };
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  types: string[];
  photos?: Array<{
    photoReference: string;
    height: number;
    width: number;
  }>;
}

export class GooglePlacesService {
  private static instance: GooglePlacesService;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('Google Places API key not configured');
    }
  }

  static getInstance(): GooglePlacesService {
    if (!GooglePlacesService.instance) {
      GooglePlacesService.instance = new GooglePlacesService();
    }
    return GooglePlacesService.instance;
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    const cacheKey = `place_details_${placeId}`;
    
    try {
      // Check cache first
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const response = await client.placeDetails({
        params: {
          place_id: placeId,
          key: this.apiKey,
          fields: [
            'place_id',
            'name',
            'formatted_address',
            'geometry/location',
            'rating',
            'user_ratings_total',
            'price_level',
            'types',
            'photos',
            'opening_hours',
            'website',
            'formatted_phone_number',
            'international_phone_number',
            'reviews',
            'utc_offset',
            'vicinity'
          ]
        }
      });

      const place = response.data.result;
      if (!place) {
        return null;
      }

      const placeDetails: PlaceDetails = {
        placeId: place.place_id!,
        name: place.name!,
        formattedAddress: place.formatted_address!,
        location: {
          lat: place.geometry!.location!.lat,
          lng: place.geometry!.location!.lng
        },
        rating: place.rating,
        userRatingsTotal: place.user_ratings_total,
        priceLevel: place.price_level,
        types: place.types || [],
        photos: place.photos?.map(photo => ({
          photoReference: photo.photo_reference!,
          height: photo.height!,
          width: photo.width!
        })),
        openingHours: place.opening_hours ? {
          openNow: place.opening_hours.open_now!,
          periods: place.opening_hours.periods?.map(period => ({
            open: {
              day: period.open!.day!,
              time: period.open!.time!
            },
            close: period.close ? {
              day: period.close.day!,
              time: period.close.time!
            } : undefined
          })) || [],
          weekdayText: place.opening_hours.weekday_text || []
        } : undefined,
        website: place.website,
        phoneNumber: place.formatted_phone_number,
        internationalPhoneNumber: place.international_phone_number,
        reviews: place.reviews?.map(review => ({
          authorName: review.author_name!,
          rating: review.rating!,
          text: review.text!,
          time: review.time!
        })),
        utcOffset: place.utc_offset,
        vicinity: place.vicinity
      };

      // Cache for 24 hours
      await cache.set(cacheKey, JSON.stringify(placeDetails), 86400);
      
      return placeDetails;
    } catch (error) {
      logger.error('Error fetching place details:', error);
      throw error;
    }
  }

  async searchNearby(
    location: { lat: number; lng: number },
    radius: number = 5000,
    type?: string,
    keyword?: string
  ): Promise<NearbySearchResult[]> {
    const cacheKey = `nearby_${location.lat}_${location.lng}_${radius}_${type}_${keyword}`;
    
    try {
      // Check cache first
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const response = await client.placesNearby({
        params: {
          location: location,
          radius: radius,
          type: type as any,
          keyword: keyword,
          key: this.apiKey
        }
      });

      const results: NearbySearchResult[] = response.data.results.map(place => ({
        placeId: place.place_id!,
        name: place.name!,
        formattedAddress: place.vicinity || place.formatted_address || '',
        location: {
          lat: place.geometry!.location!.lat,
          lng: place.geometry!.location!.lng
        },
        rating: place.rating,
        userRatingsTotal: place.user_ratings_total,
        priceLevel: place.price_level,
        types: place.types || [],
        photos: place.photos?.map(photo => ({
          photoReference: photo.photo_reference!,
          height: photo.height!,
          width: photo.width!
        })),
        businessStatus: place.business_status,
        permanentlyClosed: place.permanently_closed
      }));

      // Cache for 1 hour
      await cache.set(cacheKey, JSON.stringify(results), 3600);
      
      return results;
    } catch (error) {
      logger.error('Error searching nearby places:', error);
      throw error;
    }
  }

  async textSearch(
    query: string,
    location?: { lat: number; lng: number },
    radius?: number,
    type?: string
  ): Promise<TextSearchResult[]> {
    const cacheKey = `text_search_${query}_${location?.lat}_${location?.lng}_${radius}_${type}`;
    
    try {
      // Check cache first
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const response = await client.textSearch({
        params: {
          query: query,
          location: location,
          radius: radius,
          type: type as any,
          key: this.apiKey
        }
      });

      const results: TextSearchResult[] = response.data.results.map(place => ({
        placeId: place.place_id!,
        name: place.name!,
        formattedAddress: place.formatted_address!,
        location: {
          lat: place.geometry!.location!.lat,
          lng: place.geometry!.location!.lng
        },
        rating: place.rating,
        userRatingsTotal: place.user_ratings_total,
        priceLevel: place.price_level,
        types: place.types || [],
        photos: place.photos?.map(photo => ({
          photoReference: photo.photo_reference!,
          height: photo.height!,
          width: photo.width!
        }))
      }));

      // Cache for 1 hour
      await cache.set(cacheKey, JSON.stringify(results), 3600);
      
      return results;
    } catch (error) {
      logger.error('Error performing text search:', error);
      throw error;
    }
  }

  async getPlacePhoto(
    photoReference: string,
    maxWidth: number = 400,
    maxHeight: number = 400
  ): Promise<string> {
    const cacheKey = `photo_${photoReference}_${maxWidth}_${maxHeight}`;
    
    try {
      // Check cache first
      const cached = await cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&maxheight=${maxHeight}&photo_reference=${photoReference}&key=${this.apiKey}`;
      
      // Cache photo URL for 24 hours
      await cache.set(cacheKey, photoUrl, 86400);
      
      return photoUrl;
    } catch (error) {
      logger.error('Error getting place photo:', error);
      throw error;
    }
  }

  async getDirections(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'driving'
  ): Promise<any> {
    const cacheKey = `directions_${origin.lat}_${origin.lng}_${destination.lat}_${destination.lng}_${mode}`;
    
    try {
      // Check cache first
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const response = await client.directions({
        params: {
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          mode: mode,
          key: this.apiKey
        }
      });

      const directions = response.data;

      // Cache for 1 hour
      await cache.set(cacheKey, JSON.stringify(directions), 3600);
      
      return directions;
    } catch (error) {
      logger.error('Error getting directions:', error);
      throw error;
    }
  }
}