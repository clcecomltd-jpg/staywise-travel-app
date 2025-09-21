// API service for StayWise backend integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    userType: 'guest' | 'host';
    firstName: string;
    lastName: string;
    propertyId?: string;
  }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.setToken(null);
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Recommendations
  async getRecommendations(propertyId: string, filters?: {
    category?: string;
    priority?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = `/recommendations/property/${propertyId}${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getPersonalizedRecommendations(
    propertyId: string,
    userPreferences: {
      tripPurpose?: string[];
      interests?: string[];
      budget?: string;
      groupSize?: string;
      timeOfDay?: string;
    },
    limit: number = 10
  ) {
    return this.request(`/recommendations/property/${propertyId}/personalized?limit=${limit}`, {
      method: 'POST',
      body: JSON.stringify(userPreferences),
    });
  }

  async getNearbyRecommendations(
    propertyId: string,
    location: { lat: number; lng: number },
    radius: number = 5000,
    category?: string
  ) {
    const params = new URLSearchParams({
      lat: location.lat.toString(),
      lng: location.lng.toString(),
      radius: radius.toString(),
    });
    
    if (category) {
      params.append('category', category);
    }
    
    return this.request(`/recommendations/property/${propertyId}/nearby?${params.toString()}`);
  }

  async getRecommendationById(id: string) {
    return this.request(`/recommendations/${id}`);
  }

  async trackEngagement(recommendationId: string, action: 'view' | 'favorite' | 'click' | 'share') {
    return this.request(`/recommendations/${recommendationId}/engage`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  }

  // Places
  async searchPlaces(query: string, location?: { lat: number; lng: number }, radius?: number, type?: string) {
    const params = new URLSearchParams({ q: query });
    
    if (location) {
      params.append('lat', location.lat.toString());
      params.append('lng', location.lng.toString());
    }
    
    if (radius) {
      params.append('radius', radius.toString());
    }
    
    if (type) {
      params.append('type', type);
    }
    
    return this.request(`/places/search?${params.toString()}`);
  }

  async getNearbyPlaces(
    location: { lat: number; lng: number },
    radius: number = 5000,
    type?: string,
    keyword?: string
  ) {
    const params = new URLSearchParams({
      lat: location.lat.toString(),
      lng: location.lng.toString(),
      radius: radius.toString(),
    });
    
    if (type) {
      params.append('type', type);
    }
    
    if (keyword) {
      params.append('keyword', keyword);
    }
    
    return this.request(`/places/nearby?${params.toString()}`);
  }

  async getPlaceDetails(placeId: string) {
    return this.request(`/places/${placeId}`);
  }

  async getPlacePhoto(placeId: string, photoReference: string, maxWidth: number = 400, maxHeight: number = 400) {
    return this.request(`/places/${placeId}/photo/${photoReference}?maxWidth=${maxWidth}&maxHeight=${maxHeight}`);
  }

  async getDirections(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'driving'
  ) {
    const params = new URLSearchParams({
      originLat: origin.lat.toString(),
      originLng: origin.lng.toString(),
      destLat: destination.lat.toString(),
      destLng: destination.lng.toString(),
      mode,
    });
    
    return this.request(`/places/directions?${params.toString()}`);
  }

  async getPlaceTypes() {
    return this.request('/places/types/list');
  }

  // Chat
  async getChatMessages(propertyId: string, limit: number = 50, offset: number = 0) {
    return this.request(`/chat/property/${propertyId}?limit=${limit}&offset=${offset}`);
  }

  async sendMessage(propertyId: string, message: string, messageType: string = 'text', metadata: any = {}) {
    return this.request('/chat/send', {
      method: 'POST',
      body: JSON.stringify({
        propertyId,
        message,
        messageType,
        metadata,
      }),
    });
  }

  async markMessagesAsRead(propertyId: string, messageIds: string[]) {
    return this.request('/chat/mark-read', {
      method: 'PUT',
      body: JSON.stringify({
        propertyId,
        messageIds,
      }),
    });
  }

  async getUnreadMessageCount(propertyId: string) {
    return this.request(`/chat/property/${propertyId}/unread-count`);
  }

  // User
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getUserPreferences() {
    return this.request('/users/preferences');
  }

  async updateUserPreferences(preferences: any) {
    return this.request('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences }),
    });
  }

  async getFavorites(limit: number = 50, offset: number = 0) {
    return this.request(`/users/favorites?limit=${limit}&offset=${offset}`);
  }

  async addToFavorites(recommendationId: string) {
    return this.request('/users/favorites', {
      method: 'POST',
      body: JSON.stringify({ recommendationId }),
    });
  }

  async removeFromFavorites(recommendationId: string) {
    return this.request(`/users/favorites/${recommendationId}`, {
      method: 'DELETE',
    });
  }

  async getUserActivity(days: number = 30) {
    return this.request(`/users/activity?days=${days}`);
  }

  // Properties
  async getProperty(propertyId: string) {
    return this.request(`/properties/${propertyId}`);
  }

  async updateProperty(propertyId: string, updates: any) {
    return this.request(`/properties/${propertyId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getPropertyAnalytics(propertyId: string, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    return this.request(`/properties/${propertyId}/analytics${queryString ? `?${queryString}` : ''}`);
  }

  async getPropertyGuests(propertyId: string) {
    return this.request(`/properties/${propertyId}/guests`);
  }
}

export const apiService = new ApiService(API_BASE_URL);
export default apiService;