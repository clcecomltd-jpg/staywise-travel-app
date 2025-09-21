# StayWise Backend API

A comprehensive backend API for the StayWise travel guide application, featuring Google Places/Maps integration, real-time chat, and intelligent recommendations.

## Features

- **Google Places API Integration**: Search places, get details, photos, and directions
- **Intelligent Recommendations**: Personalized recommendations based on user preferences
- **Real-time Chat**: WebSocket-based messaging between guests and hosts
- **User Management**: Authentication, profiles, and preferences
- **Property Management**: Host dashboard and property analytics
- **Caching**: Redis-based caching for improved performance
- **Rate Limiting**: API protection and abuse prevention

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Real-time**: Socket.IO
- **Maps**: Google Maps Platform APIs
- **Authentication**: JWT
- **Validation**: Joi
- **Logging**: Winston

## Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- Redis 6+
- Google Maps API key

## Installation

1. **Clone and install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/staywise
   
   # Google APIs
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   GOOGLE_PLACES_API_KEY=your_google_places_api_key
   
   # JWT
   JWT_SECRET=your_jwt_secret
   
   # Redis
   REDIS_URL=redis://localhost:6379
   ```

3. **Database Setup**:
   ```bash
   # Run migrations
   npm run db:migrate
   
   # Seed sample data
   npm run db:seed
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/change-password` - Change password

### Recommendations
- `GET /api/recommendations/property/:id` - Get property recommendations
- `GET /api/recommendations/property/:id/personalized` - Get personalized recommendations
- `GET /api/recommendations/property/:id/nearby` - Get nearby recommendations
- `GET /api/recommendations/:id` - Get recommendation details
- `POST /api/recommendations` - Create recommendation (Host only)
- `PUT /api/recommendations/:id` - Update recommendation (Host only)
- `DELETE /api/recommendations/:id` - Delete recommendation (Host only)
- `POST /api/recommendations/:id/engage` - Track engagement

### Places
- `GET /api/places/search` - Search places by text
- `GET /api/places/nearby` - Get nearby places
- `GET /api/places/:placeId` - Get place details
- `GET /api/places/:placeId/photo/:photoReference` - Get place photo
- `GET /api/places/directions` - Get directions
- `GET /api/places/types/list` - Get place types

### Chat
- `GET /api/chat/property/:id` - Get chat messages
- `POST /api/chat/send` - Send message
- `PUT /api/chat/mark-read` - Mark messages as read
- `GET /api/chat/property/:id/unread-count` - Get unread count

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/preferences` - Get user preferences
- `PUT /api/users/preferences` - Update user preferences
- `GET /api/users/favorites` - Get user favorites
- `POST /api/users/favorites` - Add to favorites
- `DELETE /api/users/favorites/:id` - Remove from favorites

### Properties
- `GET /api/properties/:id` - Get property details
- `PUT /api/properties/:id` - Update property (Host only)
- `GET /api/properties/:id/analytics` - Get property analytics (Host only)
- `GET /api/properties/:id/guests` - Get property guests (Host only)

## WebSocket Events

### Client to Server
- `join-chat` - Join property chat room
- `send-message` - Send chat message
- `typing` - Send typing indicator

### Server to Client
- `new-message` - New message received
- `user-typing` - User typing indicator
- `error` - Error message

## Database Schema

The database includes the following main tables:
- `users` - User accounts and profiles
- `properties` - Property information
- `recommendations` - Place recommendations
- `messages` - Chat messages
- `user_favorites` - User favorite recommendations
- `recommendation_engagement_stats` - Engagement tracking
- `places_cache` - Cached Google Places data

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed sample data
- `npm run lint` - Run ESLint

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3001) |
| `NODE_ENV` | Environment | No (default: development) |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes |
| `GOOGLE_PLACES_API_KEY` | Google Places API key | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `CORS_ORIGIN` | CORS allowed origin | No |

## Production Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Run database migrations**:
   ```bash
   npm run db:migrate
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

## Monitoring and Logging

The application uses Winston for logging with the following levels:
- `error` - Error logs
- `warn` - Warning logs  
- `info` - Information logs
- `debug` - Debug logs

Logs are written to:
- Console (development)
- `logs/error.log` (error logs)
- `logs/combined.log` (all logs)
- `logs/exceptions.log` (uncaught exceptions)

## Rate Limiting

The API implements rate limiting to prevent abuse:
- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes  
- Chat messages: 30 messages per minute

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Helmet security headers
- Input validation with Joi
- SQL injection prevention
- Rate limiting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details