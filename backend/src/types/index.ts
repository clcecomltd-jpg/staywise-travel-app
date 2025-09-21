// Core types for the StayWise backend API

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
  user_type: 'guest' | 'host' | 'both';
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language: string;
  currency: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profile_visibility: 'public' | 'private' | 'friends';
    location_sharing: boolean;
  };
}

export interface Account {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  subscription_tier: 'free' | 'premium' | 'enterprise';
}

export interface AccountMembership {
  id: string;
  account_id: string;
  user_id: string;
  role: 'owner' | 'manager' | 'support';
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  account_id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  property_type: string;
  provider_type: 'airbnb' | 'vrbo' | 'booking' | 'manual';
  provider_listing_id?: string;
  provider_url?: string;
  check_in_instructions?: string;
  wifi_name?: string;
  wifi_password?: string;
  house_rules?: string;
  amenities: string[];
  images: PropertyImage[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Stay {
  id: string;
  property_id: string;
  guest_name: string;
  guest_email?: string;
  guest_phone?: string;
  arrival_date: string;
  departure_date: string;
  guest_count: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  special_requests?: string;
  check_in_code?: string;
  check_out_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  property_id: string;
  guest_id: string;
  stay_id: string;
  check_in_date: string;
  check_out_date: string;
  guest_count: number;
  total_amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded';
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  category: 'restaurant' | 'attraction' | 'shopping' | 'entertainment' | 'service';
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  rating?: number;
  price_level?: 1 | 2 | 3 | 4;
  images: string[];
  amenities: string[];
  opening_hours?: OpeningHours;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OpeningHours {
  monday?: { open: string; close: string; closed?: boolean };
  tuesday?: { open: string; close: string; closed?: boolean };
  wednesday?: { open: string; close: string; closed?: boolean };
  thursday?: { open: string; close: string; closed?: boolean };
  friday?: { open: string; close: string; closed?: boolean };
  saturday?: { open: string; close: string; closed?: boolean };
  sunday?: { open: string; close: string; closed?: boolean };
}

export interface Recommendation {
  id: string;
  property_id?: string;
  place_id?: string;
  title: string;
  description: string;
  category: 'food' | 'tours' | 'events' | 'experiences' | 'essentials' | 'shopping' | 'nightlife';
  image_url: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  price?: number;
  currency?: string;
  rating?: number;
  is_host_offer: boolean;
  is_featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  property_id?: string;
  stay_id?: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  is_read: boolean;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'booking' | 'message' | 'system' | 'reminder';
  data?: Record<string, any>;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface GuestAccessToken {
  id: string;
  stay_id: string;
  token_hash: string;
  expires_at: string;
  used_at?: string;
  created_at: string;
}

// API Request/Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
}

export interface LoginRequest {
  email: string;
  password: string;
  user_type?: 'guest' | 'host';
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  user_type: 'guest' | 'host';
  phone?: string;
}

export interface PropertyImportRequest {
  provider_type: 'airbnb' | 'vrbo' | 'booking' | 'manual';
  provider_url?: string;
  property_data?: Partial<Property>;
}

export interface PropertyImportResponse {
  success: boolean;
  property?: Property;
  import_record?: {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    error_message?: string;
  };
  error?: string;
}

export interface GuestLinkRequest {
  stay_id: string;
  expires_in_days?: number;
}

export interface GuestLinkResponse {
  success: boolean;
  link?: string;
  expires_at?: string;
  error?: string;
}

// JWT Payload
export interface JWTPayload {
  user_id: string;
  email: string;
  user_type: 'guest' | 'host' | 'both';
  account_id?: string;
  iat: number;
  exp: number;
}

// Socket.IO event types
export interface SocketEvents {
  'message:new': (message: Message) => void;
  'message:read': (messageId: string, readAt: string) => void;
  'notification:new': (notification: Notification) => void;
  'booking:update': (booking: Booking) => void;
  'stay:update': (stay: Stay) => void;
}

// File upload types
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface UploadedFile {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  size: number;
  mime_type: string;
  created_at: string;
}