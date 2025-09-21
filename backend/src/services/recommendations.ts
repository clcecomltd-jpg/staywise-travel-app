import { query, transaction } from '../config/database.js';
import { GooglePlacesService, PlaceDetails } from './googlePlaces.js';
import { logger } from '../utils/logger.js';
import { cache } from '../config/redis.js';

export interface Recommendation {
  id: string;
  propertyId: string;
  placeId: string;
  title: string;
  description: string;
  category: 'food' | 'tours' | 'events' | 'shopping' | 'nightlife' | 'culture' | 'nature' | 'entertainment';
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  placeDetails?: PlaceDetails;
  engagementStats?: {
    views: number;
    favorites: number;
    clicks: number;
    shares: number;
  };
}

export interface RecommendationFilters {
  category?: string;
  priority?: string;
  isActive?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface PersonalizedRecommendation extends Recommendation {
  personalizedScore: number;
  reasons: string[];
}

export class RecommendationService {
  private static instance: RecommendationService;
  private googlePlaces: GooglePlacesService;

  constructor() {
    this.googlePlaces = GooglePlacesService.getInstance();
  }

  static getInstance(): RecommendationService {
    if (!RecommendationService.instance) {
      RecommendationService.instance = new RecommendationService();
    }
    return RecommendationService.instance;
  }

  async createRecommendation(
    propertyId: string,
    placeId: string,
    title: string,
    description: string,
    category: string,
    priority: string,
    createdBy: string
  ): Promise<Recommendation> {
    try {
      const result = await query(`
        INSERT INTO recommendations (property_id, place_id, title, description, category, priority, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [propertyId, placeId, title, description, category, priority, createdBy]);

      const recommendation = result.rows[0];
      
      // Invalidate cache
      await cache.del(`recommendations_${propertyId}`);
      
      logger.info(`Created recommendation ${recommendation.id} for property ${propertyId}`);
      return recommendation;
    } catch (error) {
      logger.error('Error creating recommendation:', error);
      throw error;
    }
  }

  async getRecommendations(
    propertyId: string,
    filters: RecommendationFilters = {}
  ): Promise<Recommendation[]> {
    try {
      const { category, priority, isActive, search, limit = 50, offset = 0 } = filters;
      
      let whereClause = 'WHERE property_id = $1';
      const params: any[] = [propertyId];
      let paramIndex = 2;

      if (category) {
        whereClause += ` AND category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }

      if (priority) {
        whereClause += ` AND priority = $${paramIndex}`;
        params.push(priority);
        paramIndex++;
      }

      if (isActive !== undefined) {
        whereClause += ` AND is_active = $${paramIndex}`;
        params.push(isActive);
        paramIndex++;
      }

      if (search) {
        whereClause += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      const result = await query(`
        SELECT r.*, 
               COALESCE(es.views, 0) as views,
               COALESCE(es.favorites, 0) as favorites,
               COALESCE(es.clicks, 0) as clicks,
               COALESCE(es.shares, 0) as shares
        FROM recommendations r
        LEFT JOIN recommendation_engagement_stats es ON r.id = es.recommendation_id
        ${whereClause}
        ORDER BY r.priority DESC, r.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `, [...params, limit, offset]);

      const recommendations = result.rows.map(row => ({
        ...row,
        engagementStats: {
          views: parseInt(row.views) || 0,
          favorites: parseInt(row.favorites) || 0,
          clicks: parseInt(row.clicks) || 0,
          shares: parseInt(row.shares) || 0
        }
      }));

      return recommendations;
    } catch (error) {
      logger.error('Error getting recommendations:', error);
      throw error;
    }
  }

  async getRecommendationById(id: string): Promise<Recommendation | null> {
    try {
      const result = await query(`
        SELECT r.*, 
               COALESCE(es.views, 0) as views,
               COALESCE(es.favorites, 0) as favorites,
               COALESCE(es.clicks, 0) as clicks,
               COALESCE(es.shares, 0) as shares
        FROM recommendations r
        LEFT JOIN recommendation_engagement_stats es ON r.id = es.recommendation_id
        WHERE r.id = $1
      `, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        ...row,
        engagementStats: {
          views: parseInt(row.views) || 0,
          favorites: parseInt(row.favorites) || 0,
          clicks: parseInt(row.clicks) || 0,
          shares: parseInt(row.shares) || 0
        }
      };
    } catch (error) {
      logger.error('Error getting recommendation by ID:', error);
      throw error;
    }
  }

  async updateRecommendation(
    id: string,
    updates: Partial<{
      title: string;
      description: string;
      category: string;
      priority: string;
      isActive: boolean;
    }>
  ): Promise<Recommendation | null> {
    try {
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');

      const result = await query(`
        UPDATE recommendations 
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `, [id, ...Object.values(updates)]);

      if (result.rows.length === 0) {
        return null;
      }

      const recommendation = result.rows[0];
      
      // Invalidate cache
      await cache.del(`recommendations_${recommendation.property_id}`);
      
      logger.info(`Updated recommendation ${id}`);
      return recommendation;
    } catch (error) {
      logger.error('Error updating recommendation:', error);
      throw error;
    }
  }

  async deleteRecommendation(id: string): Promise<boolean> {
    try {
      const result = await query(`
        DELETE FROM recommendations WHERE id = $1
      `, [id]);

      if (result.rowCount === 0) {
        return false;
      }

      // Invalidate cache
      await cache.del(`recommendations_${id}`);
      
      logger.info(`Deleted recommendation ${id}`);
      return true;
    } catch (error) {
      logger.error('Error deleting recommendation:', error);
      throw error;
    }
  }

  async getPersonalizedRecommendations(
    propertyId: string,
    userId: string,
    userPreferences: {
      tripPurpose?: string[];
      interests?: string[];
      budget?: 'budget' | 'mid' | 'premium';
      groupSize?: 'solo' | 'couple' | 'group' | 'any';
      timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
    },
    limit: number = 10
  ): Promise<PersonalizedRecommendation[]> {
    try {
      // Get all active recommendations for the property
      const recommendations = await this.getRecommendations(propertyId, { isActive: true });
      
      // Get user's interaction history for scoring
      const interactionHistory = await this.getUserInteractionHistory(userId, propertyId);
      
      // Calculate personalized scores
      const personalizedRecommendations: PersonalizedRecommendation[] = [];
      
      for (const rec of recommendations) {
        const personalizedScore = this.calculatePersonalizedScore(rec, userPreferences, interactionHistory);
        const reasons = this.getPersonalizationReasons(rec, userPreferences, interactionHistory);
        
        personalizedRecommendations.push({
          ...rec,
          personalizedScore,
          reasons
        });
      }

      // Sort by personalized score and return top results
      return personalizedRecommendations
        .sort((a, b) => b.personalizedScore - a.personalizedScore)
        .slice(0, limit);
    } catch (error) {
      logger.error('Error getting personalized recommendations:', error);
      throw error;
    }
  }

  async getNearbyRecommendations(
    propertyId: string,
    location: { lat: number; lng: number },
    radius: number = 5000,
    category?: string
  ): Promise<Recommendation[]> {
    try {
      // Search for nearby places using Google Places API
      const nearbyPlaces = await this.googlePlaces.searchNearby(
        location,
        radius,
        category
      );

      // Convert to recommendations format
      const recommendations: Recommendation[] = nearbyPlaces.map(place => ({
        id: `nearby_${place.placeId}`,
        propertyId,
        placeId: place.placeId,
        title: place.name,
        description: `Located at ${place.formattedAddress}`,
        category: this.mapPlaceTypeToCategory(place.types),
        priority: 'medium',
        isActive: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        engagementStats: {
          views: 0,
          favorites: 0,
          clicks: 0,
          shares: 0
        }
      }));

      return recommendations;
    } catch (error) {
      logger.error('Error getting nearby recommendations:', error);
      throw error;
    }
  }

  async trackEngagement(
    recommendationId: string,
    userId: string,
    action: 'view' | 'favorite' | 'click' | 'share'
  ): Promise<void> {
    try {
      await query(`
        INSERT INTO recommendation_engagement_stats (recommendation_id, user_id, action, created_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (recommendation_id, user_id, action) 
        DO UPDATE SET count = recommendation_engagement_stats.count + 1, updated_at = NOW()
      `, [recommendationId, userId, action]);

      // Update aggregated stats
      await query(`
        INSERT INTO recommendation_engagement_stats (recommendation_id, action, count, created_at)
        VALUES ($1, $2, 1, NOW())
        ON CONFLICT (recommendation_id, action) 
        DO UPDATE SET count = recommendation_engagement_stats.count + 1, updated_at = NOW()
      `, [recommendationId, action]);

      logger.info(`Tracked ${action} engagement for recommendation ${recommendationId}`);
    } catch (error) {
      logger.error('Error tracking engagement:', error);
      throw error;
    }
  }

  private async getUserInteractionHistory(
    userId: string,
    propertyId: string
  ): Promise<Record<string, any>> {
    try {
      const result = await query(`
        SELECT action, COUNT(*) as count
        FROM recommendation_engagement_stats
        WHERE user_id = $1 AND recommendation_id IN (
          SELECT id FROM recommendations WHERE property_id = $2
        )
        GROUP BY action
      `, [userId, propertyId]);

      const history: Record<string, number> = {};
      result.rows.forEach(row => {
        history[row.action] = parseInt(row.count);
      });

      return history;
    } catch (error) {
      logger.error('Error getting user interaction history:', error);
      return {};
    }
  }

  private calculatePersonalizedScore(
    recommendation: Recommendation,
    userPreferences: any,
    interactionHistory: Record<string, any>
  ): number {
    let score = 0;

    // Base score from recommendation priority
    const priorityScores = { low: 1, medium: 2, high: 3 };
    score += priorityScores[recommendation.priority as keyof typeof priorityScores] * 10;

    // Category preference matching
    if (userPreferences.interests?.includes(recommendation.category)) {
      score += 20;
    }

    // Trip purpose matching
    if (userPreferences.tripPurpose?.some((purpose: string) => 
      this.matchesTripPurpose(recommendation.category, purpose)
    )) {
      score += 15;
    }

    // User interaction history
    const viewCount = interactionHistory.view || 0;
    const favoriteCount = interactionHistory.favorite || 0;
    const clickCount = interactionHistory.click || 0;

    score += viewCount * 0.1;
    score += favoriteCount * 2;
    score += clickCount * 1;

    // Engagement stats boost
    if (recommendation.engagementStats) {
      score += recommendation.engagementStats.favorites * 0.5;
      score += recommendation.engagementStats.clicks * 0.2;
    }

    return Math.max(0, score);
  }

  private getPersonalizationReasons(
    recommendation: Recommendation,
    userPreferences: any,
    interactionHistory: Record<string, any>
  ): string[] {
    const reasons: string[] = [];

    if (userPreferences.interests?.includes(recommendation.category)) {
      reasons.push(`Matches your interest in ${recommendation.category}`);
    }

    if (userPreferences.tripPurpose?.some((purpose: string) => 
      this.matchesTripPurpose(recommendation.category, purpose)
    )) {
      reasons.push('Perfect for your trip purpose');
    }

    if (interactionHistory.favorite > 0) {
      reasons.push('You\'ve favorited similar places');
    }

    if (recommendation.engagementStats?.favorites > 10) {
      reasons.push('Popular with other guests');
    }

    if (recommendation.priority === 'high') {
      reasons.push('Host recommended');
    }

    return reasons;
  }

  private matchesTripPurpose(category: string, purpose: string): boolean {
    const purposeMappings: Record<string, string[]> = {
      'relaxation': ['nature', 'culture'],
      'adventure': ['tours', 'nature', 'entertainment'],
      'food': ['food'],
      'nightlife': ['nightlife', 'entertainment'],
      'shopping': ['shopping'],
      'culture': ['culture', 'tours', 'events']
    };

    return purposeMappings[purpose]?.includes(category) || false;
  }

  private mapPlaceTypeToCategory(types: string[]): string {
    const typeMappings: Record<string, string> = {
      'restaurant': 'food',
      'food': 'food',
      'meal_takeaway': 'food',
      'meal_delivery': 'food',
      'tourist_attraction': 'tours',
      'museum': 'culture',
      'art_gallery': 'culture',
      'shopping_mall': 'shopping',
      'store': 'shopping',
      'bar': 'nightlife',
      'night_club': 'nightlife',
      'park': 'nature',
      'zoo': 'nature',
      'amusement_park': 'entertainment',
      'movie_theater': 'entertainment',
      'event': 'events'
    };

    for (const type of types) {
      if (typeMappings[type]) {
        return typeMappings[type];
      }
    }

    return 'culture'; // Default category
  }
}