-- StayWise Database Schema
-- This file contains the complete database schema for the StayWise application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_type AS ENUM ('guest', 'host', 'both');
CREATE TYPE account_role AS ENUM ('owner', 'manager', 'support');
CREATE TYPE provider_type AS ENUM ('airbnb', 'vrbo', 'booking', 'manual');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE stay_status AS ENUM ('upcoming', 'active', 'completed', 'cancelled');
CREATE TYPE place_category AS ENUM ('restaurant', 'attraction', 'shopping', 'entertainment', 'service');
CREATE TYPE recommendation_category AS ENUM ('food', 'tours', 'events', 'experiences', 'essentials', 'shopping', 'nightlife');
CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'system');
CREATE TYPE notification_type AS ENUM ('booking', 'message', 'system', 'reminder');
CREATE TYPE file_type AS ENUM ('photo', 'document');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    user_type user_type NOT NULL DEFAULT 'guest',
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accounts table (for host organizations)
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    is_verified BOOLEAN DEFAULT false,
    subscription_tier VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Account memberships
CREATE TABLE account_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role account_role NOT NULL DEFAULT 'owner',
    permissions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(account_id, user_id)
);

-- Properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    bedrooms INTEGER NOT NULL DEFAULT 0,
    bathrooms INTEGER NOT NULL DEFAULT 0,
    max_guests INTEGER NOT NULL DEFAULT 1,
    property_type VARCHAR(100) NOT NULL,
    provider_type provider_type NOT NULL DEFAULT 'manual',
    provider_listing_id VARCHAR(255),
    provider_url TEXT,
    check_in_instructions TEXT,
    wifi_name VARCHAR(100),
    wifi_password VARCHAR(100),
    house_rules TEXT,
    amenities TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property images
CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property amenities reference
CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property amenities junction
CREATE TABLE property_amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, amenity_id)
);

-- Stays table
CREATE TABLE stays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255),
    guest_phone VARCHAR(20),
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    guest_count INTEGER NOT NULL DEFAULT 1,
    status stay_status NOT NULL DEFAULT 'upcoming',
    special_requests TEXT,
    check_in_code VARCHAR(20),
    check_out_code VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES users(id) ON DELETE SET NULL,
    stay_id UUID NOT NULL REFERENCES stays(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guest_count INTEGER NOT NULL DEFAULT 1,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status booking_status NOT NULL DEFAULT 'pending',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Places table
CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category place_category NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    phone VARCHAR(20),
    website TEXT,
    rating DECIMAL(3, 2),
    price_level INTEGER CHECK (price_level >= 1 AND price_level <= 4),
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    opening_hours JSONB,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendations table
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    place_id UUID REFERENCES places(id) ON DELETE CASCADE,
    host_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category recommendation_category NOT NULL,
    image_url TEXT NOT NULL,
    location JSONB,
    price DECIMAL(10, 2),
    currency VARCHAR(3),
    rating DECIMAL(3, 2),
    is_host_offer BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    stay_id UUID REFERENCES stays(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type message_type NOT NULL DEFAULT 'text',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guest favorites
CREATE TABLE guest_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('place', 'recommendation')),
    item_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- Refresh tokens
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guest access tokens
CREATE TABLE guest_access_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stay_id UUID NOT NULL REFERENCES stays(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property imports
CREATE TABLE property_imports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    provider_type provider_type NOT NULL,
    provider_url TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    raw_data JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Uploaded files
CREATE TABLE uploaded_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Error reports
CREATE TABLE error_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    error_message TEXT NOT NULL,
    error_stack TEXT,
    url TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_is_active ON users(is_active);

CREATE INDEX idx_properties_account_id ON properties(account_id);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_country ON properties(country);
CREATE INDEX idx_properties_is_active ON properties(is_active);
CREATE INDEX idx_properties_location ON properties(latitude, longitude);

CREATE INDEX idx_stays_property_id ON stays(property_id);
CREATE INDEX idx_stays_status ON stays(status);
CREATE INDEX idx_stays_dates ON stays(arrival_date, departure_date);

CREATE INDEX idx_bookings_property_id ON bookings(property_id);
CREATE INDEX idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);

CREATE INDEX idx_places_category ON places(category);
CREATE INDEX idx_places_city ON places(city);
CREATE INDEX idx_places_location ON places(latitude, longitude);
CREATE INDEX idx_places_is_active ON places(is_active);
CREATE INDEX idx_places_is_featured ON places(is_featured);

CREATE INDEX idx_recommendations_property_id ON recommendations(property_id);
CREATE INDEX idx_recommendations_place_id ON recommendations(place_id);
CREATE INDEX idx_recommendations_host_id ON recommendations(host_id);
CREATE INDEX idx_recommendations_category ON recommendations(category);
CREATE INDEX idx_recommendations_is_active ON recommendations(is_active);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_property_id ON messages(property_id);
CREATE INDEX idx_messages_stay_id ON messages(stay_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_guest_favorites_user_id ON guest_favorites(user_id);
CREATE INDEX idx_guest_favorites_item ON guest_favorites(item_type, item_id);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

CREATE INDEX idx_uploaded_files_user_id ON uploaded_files(user_id);
CREATE INDEX idx_uploaded_files_created_at ON uploaded_files(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_account_memberships_updated_at BEFORE UPDATE ON account_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stays_updated_at BEFORE UPDATE ON stays FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_places_updated_at BEFORE UPDATE ON places FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recommendations_updated_at BEFORE UPDATE ON recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_property_imports_updated_at BEFORE UPDATE ON property_imports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE stays ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Account memberships
CREATE POLICY "Users can view own memberships" ON account_memberships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Account owners can view all memberships" ON account_memberships FOR SELECT USING (
    EXISTS (SELECT 1 FROM account_memberships am WHERE am.account_id = account_memberships.account_id AND am.user_id = auth.uid() AND am.role = 'owner')
);

-- Properties - hosts can see their properties
CREATE POLICY "Hosts can view own properties" ON properties FOR SELECT USING (
    EXISTS (SELECT 1 FROM account_memberships am WHERE am.account_id = properties.account_id AND am.user_id = auth.uid())
);

-- Stays - guests can see their stays, hosts can see stays for their properties
CREATE POLICY "Guests can view own stays" ON stays FOR SELECT USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.user_type IN ('guest', 'both'))
);

CREATE POLICY "Hosts can view stays for their properties" ON stays FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM properties p 
        JOIN account_memberships am ON am.account_id = p.account_id 
        WHERE p.id = stays.property_id AND am.user_id = auth.uid()
    )
);

-- Messages - users can see messages they sent or received
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
);

-- Notifications - users can see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

-- Guest favorites - users can see their own favorites
CREATE POLICY "Users can view own favorites" ON guest_favorites FOR SELECT USING (auth.uid() = user_id);

-- Uploaded files - users can see their own files
CREATE POLICY "Users can view own files" ON uploaded_files FOR SELECT USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO amenities (name, icon, category) VALUES
('WiFi', 'wifi', 'internet'),
('Air Conditioning', 'snowflake', 'climate'),
('Heating', 'thermometer', 'climate'),
('Kitchen', 'chef-hat', 'kitchen'),
('Parking', 'car', 'parking'),
('Pool', 'waves', 'recreation'),
('Gym', 'dumbbell', 'fitness'),
('Pet Friendly', 'dog', 'pets'),
('Balcony', 'home', 'outdoor'),
('Garden', 'trees', 'outdoor'),
('TV', 'tv', 'entertainment'),
('Washing Machine', 'washing-machine', 'laundry'),
('Dryer', 'wind', 'laundry'),
('Iron', 'iron', 'laundry'),
('Hair Dryer', 'scissors', 'bathroom'),
('Hot Tub', 'waves', 'recreation'),
('Fireplace', 'flame', 'heating'),
('Workspace', 'laptop', 'work'),
('Elevator', 'arrow-up', 'accessibility'),
('Wheelchair Accessible', 'wheelchair', 'accessibility');

-- Insert sample places
INSERT INTO places (name, description, category, address, city, country, latitude, longitude, phone, rating, price_level, is_featured, is_active) VALUES
('Thip Samai Pad Thai', 'Famous for its authentic pad thai and long queues', 'restaurant', '313-315 Maha Chai Rd, Khwaeng Samran Rat, Khet Phra Nakhon, Bangkok 10200, Thailand', 'Bangkok', 'Thailand', 13.7563, 100.5018, '+66 2 221 6280', 4.5, 1, true, true),
('Wat Pho Temple', 'Temple of the Reclining Buddha', 'attraction', '2 Sanam Chai Rd, Khwaeng Phra Borom Maha Ratchawang, Khet Phra Nakhon, Bangkok 10200, Thailand', 'Bangkok', 'Thailand', 13.7464, 100.4947, '+66 2 226 0335', 4.6, 2, true, true),
('Chatuchak Weekend Market', 'One of the world''s largest weekend markets', 'shopping', '587/10 Kamphaeng Phet 2 Rd, Khwaeng Chatuchak, Khet Chatuchak, Bangkok 10900, Thailand', 'Bangkok', 'Thailand', 13.7998, 100.5491, '+66 2 272 4440', 4.3, 1, true, true),
('Sky Bar at Lebua', 'Rooftop bar with stunning city views', 'entertainment', '1055/42 Silom Rd, Khwaeng Silom, Khet Bang Rak, Bangkok 10500, Thailand', 'Bangkok', 'Thailand', 13.7200, 100.5200, '+66 2 624 9999', 4.7, 4, true, true),
('Damnoen Saduak Floating Market', 'Traditional floating market experience', 'attraction', 'Damnoen Saduak District, Ratchaburi 70130, Thailand', 'Ratchaburi', 'Thailand', 13.5200, 99.9500, '+66 32 221 282', 4.2, 2, true, true);

-- Create a function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM refresh_tokens WHERE expires_at < NOW();
    DELETE FROM password_reset_tokens WHERE expires_at < NOW();
    DELETE FROM guest_access_tokens WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a function to get nearby places
CREATE OR REPLACE FUNCTION get_nearby_places(
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    radius_km INTEGER DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    description TEXT,
    category place_category,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    website TEXT,
    rating DECIMAL(3, 2),
    price_level INTEGER,
    images TEXT[],
    amenities TEXT[],
    distance_km DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.description,
        p.category,
        p.address,
        p.city,
        p.country,
        p.latitude,
        p.longitude,
        p.phone,
        p.website,
        p.rating,
        p.price_level,
        p.images,
        p.amenities,
        ROUND(
            6371 * acos(
                cos(radians(lat)) * 
                cos(radians(p.latitude)) * 
                cos(radians(p.longitude) - radians(lng)) + 
                sin(radians(lat)) * 
                sin(radians(p.latitude))
            )::DECIMAL, 2
        ) AS distance_km
    FROM places p
    WHERE p.is_active = true
    AND (
        6371 * acos(
            cos(radians(lat)) * 
            cos(radians(p.latitude)) * 
            cos(radians(p.longitude) - radians(lng)) + 
            sin(radians(lat)) * 
            sin(radians(p.latitude))
        )
    ) <= radius_km
    ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;