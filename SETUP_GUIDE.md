# StayWise Complete Setup Guide

This guide will help you set up the complete StayWise travel guide application with Google Places/Maps integration, real-time chat, and intelligent recommendations.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- Redis 6+
- Google Cloud Platform account with Maps API enabled

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Required: DATABASE_URL, GOOGLE_MAPS_API_KEY, JWT_SECRET, REDIS_URL

# Set up database
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Required: VITE_GOOGLE_MAPS_API_KEY, VITE_API_BASE_URL

# Start development server
npm run dev
```

## 🔧 Detailed Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/staywise
DB_HOST=localhost
DB_PORT=5432
DB_NAME=staywise
DB_USER=username
DB_PASSWORD=password

# Google APIs
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Redis Configuration
REDIS_URL=redis://localhost:6379

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables

Create `.env`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# App Configuration
VITE_APP_NAME=StayWise
VITE_ENABLE_PERSONALIZATION=true
VITE_ENABLE_GOOGLE_MAPS=true
VITE_ENABLE_REAL_TIME_CHAT=true
```

## 🗄️ Database Setup

### PostgreSQL Installation

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
createdb staywise
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb staywise
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### Redis Installation

**macOS (using Homebrew):**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt install redis-server
sudo systemctl start redis-server
```

**Windows:**
Download from [redis.io](https://redis.io/download) or use WSL

## 🗺️ Google Maps API Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable billing for the project

### 2. Enable Required APIs

Enable these APIs in the Google Cloud Console:
- Maps JavaScript API
- Places API
- Directions API
- Geocoding API

### 3. Create API Keys

1. Go to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. Restrict the API key to your domains
4. Copy the API key to your environment variables

### 4. Set Up API Restrictions

For security, restrict your API keys:
- **Maps API Key**: Restrict to Maps JavaScript API
- **Places API Key**: Restrict to Places API, Directions API, Geocoding API

## 🏗️ Project Structure

```
staywise/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database, Redis config
│   │   ├── middleware/     # Auth, rate limiting, error handling
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Google Places, recommendations
│   │   ├── database/       # Schema, migrations, seeds
│   │   └── utils/          # Logging, utilities
│   ├── package.json
│   └── README.md
├── src/                    # React frontend
│   ├── components/         # UI components
│   │   ├── GoogleMap.tsx
│   │   ├── EnhancedRecommendations.tsx
│   │   ├── EnhancedChat.tsx
│   │   └── RecommendationModal.tsx
│   ├── services/           # API service
│   └── ...
├── package.json
└── SETUP_GUIDE.md
```

## 🚀 Running the Application

### Development Mode

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on http://localhost:3001

2. **Start Frontend:**
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:5173

### Production Mode

1. **Build Backend:**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Build Frontend:**
   ```bash
   npm run build
   npm run preview
   ```

## 🧪 Testing the Integration

### 1. Test Google Maps

- Navigate to the Map tab in the recommendations
- Verify map loads with your API key
- Test marker interactions and directions

### 2. Test Recommendations

- Create a test property
- Add some recommendations
- Test personalized recommendations
- Verify nearby search works

### 3. Test Chat System

- Register as both guest and host
- Send messages between users
- Verify real-time updates work

### 4. Test API Endpoints

Use the provided API documentation or test with curl:

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test recommendations
curl http://localhost:3001/api/recommendations/property/{property-id}

# Test places search
curl "http://localhost:3001/api/places/search?q=restaurants&lat=25.7617&lng=-80.1918"
```

## 🔧 Troubleshooting

### Common Issues

**1. Google Maps not loading:**
- Check API key is correct
- Verify APIs are enabled
- Check browser console for errors
- Ensure domain restrictions allow localhost

**2. Database connection failed:**
- Verify PostgreSQL is running
- Check connection string in .env
- Ensure database exists
- Check user permissions

**3. Redis connection failed:**
- Verify Redis is running
- Check REDIS_URL in .env
- Test with `redis-cli ping`

**4. WebSocket connection failed:**
- Check VITE_WS_URL in frontend .env
- Verify backend is running
- Check firewall settings

**5. CORS errors:**
- Update CORS_ORIGIN in backend .env
- Ensure frontend URL matches

### Debug Mode

Enable debug logging:

```env
# Backend
LOG_LEVEL=debug

# Frontend
VITE_DEBUG_MODE=true
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Recommendations Endpoints

- `GET /api/recommendations/property/:id` - Get recommendations
- `GET /api/recommendations/property/:id/personalized` - Get personalized
- `GET /api/recommendations/property/:id/nearby` - Get nearby

### Places Endpoints

- `GET /api/places/search` - Search places
- `GET /api/places/nearby` - Get nearby places
- `GET /api/places/:id` - Get place details

### Chat Endpoints

- `GET /api/chat/property/:id` - Get messages
- `POST /api/chat/send` - Send message
- `PUT /api/chat/mark-read` - Mark as read

## 🚀 Deployment

### Backend Deployment

1. **Build the application:**
   ```bash
   cd backend
   npm run build
   ```

2. **Set production environment variables**

3. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

### Frontend Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder to your hosting service**

### Environment Variables for Production

Update your production environment variables:
- Use production database URLs
- Use production Redis URLs
- Set secure JWT secrets
- Update CORS origins
- Use production Google Maps API keys

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs in `backend/logs/`
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly
5. Ensure all services (PostgreSQL, Redis) are running

## 🎉 You're Ready!

Once everything is set up, you'll have:

- ✅ Google Maps integration with interactive maps
- ✅ Google Places API for location search and details
- ✅ Intelligent recommendations with personalization
- ✅ Real-time chat between guests and hosts
- ✅ Comprehensive API with authentication
- ✅ Modern React frontend with TypeScript
- ✅ PostgreSQL database with proper schema
- ✅ Redis caching for performance
- ✅ Rate limiting and security features

Happy coding! 🚀