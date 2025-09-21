// Recommendation service - intelligent filtering based on user preferences
// Processes onboarding data to personalize recommendations

export interface Recommendation {
  id: number;
  category: 'Food' | 'Tours' | 'Events' | 'Shopping' | 'Nightlife' | 'Culture';
  title: string;
  description: string;
  image: string;
  tags: string[];
  priceLevel: 'budget' | 'mid' | 'premium';
  groupSize: 'solo' | 'couple' | 'group' | 'any';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
  culturalLevel: 'tourist' | 'local' | 'authentic';
  energyLevel: 'relaxed' | 'moderate' | 'active';
  score: number; // Base recommendation score
}

export interface OnboardingData {
  tripPurpose?: string[];
  preferences?: string[];
}

export class RecommendationService {
  private static instance: RecommendationService;

  // All available recommendations with detailed metadata
  private allRecommendations: Recommendation[] = [
    {
      id: 1,
      category: 'Food',
      title: 'Best Local Pad Thai',
      description: 'Authentic street food experience at Thip Samai',
      image: 'https://images.unsplash.com/photo-1702392158359-015e7dc60356?w=200&h=200&fit=crop&crop=center',
      tags: ['street-food', 'authentic', 'local', 'spicy', 'budget'],
      priceLevel: 'budget',
      groupSize: 'any',
      timeOfDay: 'any',
      culturalLevel: 'authentic',
      energyLevel: 'moderate',
      score: 8.5
    },
    {
      id: 2,
      category: 'Tours',
      title: 'Temple Tour Guide',
      description: 'Private guided tour of Wat Pho and Wat Arun',
      image: 'https://images.unsplash.com/photo-1712229754797-2d0cb1e9a04d?w=200&h=200&fit=crop&crop=center',
      tags: ['temples', 'culture', 'guided', 'history', 'spiritual'],
      priceLevel: 'mid',
      groupSize: 'any',
      timeOfDay: 'morning',
      culturalLevel: 'authentic',
      energyLevel: 'moderate',
      score: 9.2
    },
    {
      id: 3,
      category: 'Events',
      title: 'Weekend Night Market',
      description: 'Chatuchak market with 15,000 stalls and vendors',
      image: 'https://images.unsplash.com/photo-1605818725699-7fa07b4fc391?w=200&h=200&fit=crop&crop=center',
      tags: ['market', 'shopping', 'local', 'food', 'crowds'],
      priceLevel: 'budget',
      groupSize: 'group',
      timeOfDay: 'evening',
      culturalLevel: 'local',
      energyLevel: 'active',
      score: 8.8
    },
    {
      id: 4,
      category: 'Food',
      title: 'Rooftop Dining',
      description: 'Sky Bar at Lebua with stunning city views',
      image: 'https://images.unsplash.com/photo-1641639825150-9adef5b4281c?w=200&h=200&fit=crop&crop=center',
      tags: ['fine-dining', 'views', 'romantic', 'cocktails', 'instagram'],
      priceLevel: 'premium',
      groupSize: 'couple',
      timeOfDay: 'night',
      culturalLevel: 'tourist',
      energyLevel: 'relaxed',
      score: 9.5
    },
    {
      id: 5,
      category: 'Tours',
      title: 'Floating Market',
      description: 'Early morning trip to Damnoen Saduak market',
      image: 'https://images.unsplash.com/photo-1664799420158-8f7b79ee3e6f?w=200&h=200&fit=crop&crop=center',
      tags: ['market', 'boat', 'traditional', 'early', 'authentic'],
      priceLevel: 'mid',
      groupSize: 'any',
      timeOfDay: 'morning',
      culturalLevel: 'authentic',
      energyLevel: 'moderate',
      score: 8.7
    },
    {
      id: 6,
      category: 'Events',
      title: 'Thai Cooking Class',
      description: 'Learn authentic recipes with local chef Maria',
      image: 'https://images.unsplash.com/photo-1578366941741-9e517759c620?w=200&h=200&fit=crop&crop=center',
      tags: ['cooking', 'hands-on', 'authentic', 'learning', 'food'],
      priceLevel: 'mid',
      groupSize: 'any',
      timeOfDay: 'afternoon',
      culturalLevel: 'authentic',
      energyLevel: 'moderate',
      score: 9.0
    },
    {
      id: 7,
      category: 'Nightlife',
      title: 'Jazz Club District',
      description: 'Live music venues in the historic quarter',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&crop=center',
      tags: ['music', 'live', 'intimate', 'drinks', 'culture'],
      priceLevel: 'mid',
      groupSize: 'any',
      timeOfDay: 'night',
      culturalLevel: 'local',
      energyLevel: 'relaxed',
      score: 8.3
    },
    {
      id: 8,
      category: 'Culture',
      title: 'Art Gallery Walk',
      description: 'Contemporary Thai art in Silom galleries',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center',
      tags: ['art', 'contemporary', 'culture', 'walking', 'quiet'],
      priceLevel: 'budget',
      groupSize: 'solo',
      timeOfDay: 'afternoon',
      culturalLevel: 'local',
      energyLevel: 'relaxed',
      score: 7.8
    },
    {
      id: 9,
      category: 'Food',
      title: 'Local Coffee Houses',
      description: 'Hidden specialty coffee gems loved by locals',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=200&h=200&fit=crop&crop=center',
      tags: ['coffee', 'local', 'quiet', 'work-friendly', 'hidden'],
      priceLevel: 'budget',
      groupSize: 'solo',
      timeOfDay: 'morning',
      culturalLevel: 'local',
      energyLevel: 'relaxed',
      score: 8.1
    },
    {
      id: 10,
      category: 'Nightlife',
      title: 'Underground Dance Scene',
      description: 'Electronic music venues in warehouse district',
      image: 'https://images.unsplash.com/photo-1571266028243-ac2371d6b440?w=200&h=200&fit=crop&crop=center',
      tags: ['electronic', 'dancing', 'underground', 'late-night', 'energy'],
      priceLevel: 'mid',
      groupSize: 'group',
      timeOfDay: 'night',
      culturalLevel: 'local',
      energyLevel: 'active',
      score: 8.9
    }
  ];

  static getInstance(): RecommendationService {
    if (!RecommendationService.instance) {
      RecommendationService.instance = new RecommendationService();
    }
    return RecommendationService.instance;
  }

  // Get personalized recommendations based on onboarding data
  getPersonalizedRecommendations(onboardingData?: OnboardingData, category?: string): Recommendation[] {
    let recommendations = [...this.allRecommendations];

    // Filter by category if specified
    if (category) {
      recommendations = recommendations.filter(rec => rec.category === category);
    }

    if (!onboardingData?.tripPurpose?.length && !onboardingData?.preferences?.length) {
      // No personalization data - return top recommendations
      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
    }

    // Calculate personalization scores
    recommendations = recommendations.map(rec => ({
      ...rec,
      personalizedScore: this.calculatePersonalizedScore(rec, onboardingData)
    }));

    // Sort by personalized score and return top results
    return recommendations
      .sort((a, b) => (b as any).personalizedScore - (a as any).personalizedScore)
      .slice(0, 6);
  }

  // Calculate personalized score based on onboarding data
  private calculatePersonalizedScore(recommendation: Recommendation, onboardingData: OnboardingData): number {
    let score = recommendation.score; // Base score
    let bonus = 0;

    // Trip purpose bonuses
    if (onboardingData.tripPurpose) {
      onboardingData.tripPurpose.forEach(purpose => {
        switch (purpose) {
          case 'foodie':
            if (recommendation.category === 'Food' || recommendation.tags.includes('food')) {
              bonus += 2.0;
            }
            if (recommendation.tags.includes('authentic') || recommendation.tags.includes('local')) {
              bonus += 1.5;
            }
            break;

          case 'culture':
            if (recommendation.category === 'Culture' || recommendation.category === 'Tours') {
              bonus += 2.0;
            }
            if (recommendation.culturalLevel === 'authentic' || recommendation.tags.includes('culture')) {
              bonus += 1.5;
            }
            break;

          case 'relax':
            if (recommendation.energyLevel === 'relaxed') {
              bonus += 2.0;
            }
            if (recommendation.tags.includes('quiet') || recommendation.tags.includes('spa')) {
              bonus += 1.5;
            }
            break;

          case 'nightlife':
            if (recommendation.category === 'Nightlife') {
              bonus += 2.5;
            }
            if (recommendation.timeOfDay === 'night') {
              bonus += 1.0;
            }
            break;

          case 'city-break':
            if (recommendation.category === 'Tours' || recommendation.category === 'Events') {
              bonus += 1.5;
            }
            if (recommendation.tags.includes('views') || recommendation.culturalLevel === 'tourist') {
              bonus += 1.0;
            }
            break;

          case 'group':
            if (recommendation.groupSize === 'group' || recommendation.groupSize === 'any') {
              bonus += 1.5;
            }
            if (recommendation.category === 'Events') {
              bonus += 1.0;
            }
            break;
        }
      });
    }

    // Preference bonuses
    if (onboardingData.preferences) {
      onboardingData.preferences.forEach(preference => {
        switch (preference) {
          case 'save-money':
            if (recommendation.priceLevel === 'budget') {
              bonus += 2.0;
            }
            break;

          case 'premium':
            if (recommendation.priceLevel === 'premium') {
              bonus += 2.0;
            }
            break;

          case 'authentic-food':
            if (recommendation.category === 'Food' && recommendation.culturalLevel === 'authentic') {
              bonus += 2.5;
            }
            break;

          case 'instagram':
            if (recommendation.tags.includes('instagram') || recommendation.tags.includes('views')) {
              bonus += 2.0;
            }
            break;

          case 'family':
            if (recommendation.groupSize === 'any' && recommendation.energyLevel !== 'active') {
              bonus += 1.5;
            }
            break;

          case 'local-culture':
            if (recommendation.culturalLevel === 'local' || recommendation.culturalLevel === 'authentic') {
              bonus += 2.0;
            }
            break;
        }
      });
    }

    return score + bonus;
  }

  // Get recommendations by category with personalization
  getRecommendationsByCategory(category: string, onboardingData?: OnboardingData): Recommendation[] {
    return this.getPersonalizedRecommendations(onboardingData, category);
  }

  // Get available categories
  getCategories(): string[] {
    return ['Events', 'Food', 'Tours', 'Culture', 'Nightlife', 'Shopping'];
  }
}

// Export singleton instance
export const recommendationService = RecommendationService.getInstance();