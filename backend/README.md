# StayWise Backend API

A comprehensive backend API for the StayWise travel application, built with Node.js, Express, TypeScript, and Supabase.

## Features

- **Authentication & Authorization**: JWT-based auth with guest/host modes
- **Property Management**: CRUD operations for properties with image uploads
- **Booking System**: Complete booking lifecycle management
- **Real-time Communication**: WebSocket support for chat and notifications
- **File Upload**: Secure file handling with image processing
- **Database Integration**: Supabase with Row Level Security (RLS)
- **API Documentation**: Comprehensive endpoint documentation
- **Testing**: Full test suite with Vitest
- **Docker Support**: Containerized deployment

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **File Processing**: Sharp
- **Testing**: Vitest
- **Containerization**: Docker

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account and project
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd staywise/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Set up the database**
   ```bash
   # Run the schema.sql file in your Supabase SQL editor
   # or use the Supabase CLI
   supabase db reset
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/password` - Change password
- `POST /api/auth/reset-password` - Request password reset
- `POST /api/auth/reset-password/confirm` - Confirm password reset

### Guest Routes
- `GET /api/guest/profile` - Get guest profile
- `PUT /api/guest/profile` - Update guest profile
- `GET /api/guest/stay/:stayId` - Get stay information
- `GET /api/guest/property/:propertyId` - Get property details
- `GET /api/guest/places/nearby` - Get nearby places
- `GET /api/guest/places/:placeId` - Get place details
- `GET /api/guest/recommendations` - Get personalized recommendations
- `GET /api/guest/messages` - Get messages
- `POST /api/guest/messages` - Send message
- `PUT /api/guest/messages/:messageId/read` - Mark message as read
- `GET /api/guest/notifications` - Get notifications
- `PUT /api/guest/notifications/:notificationId/read` - Mark notification as read
- `GET /api/guest/favorites` - Get favorites
- `POST /api/guest/favorites` - Add to favorites
- `DELETE /api/guest/favorites/:favoriteId` - Remove from favorites

### Host Routes
- `GET /api/host/dashboard` - Get dashboard data
- `GET /api/host/properties` - Get properties
- `POST /api/host/properties` - Create property
- `GET /api/host/properties/:propertyId` - Get property details
- `PUT /api/host/properties/:propertyId` - Update property
- `DELETE /api/host/properties/:propertyId` - Delete property
- `POST /api/host/properties/import` - Import property
- `GET /api/host/bookings` - Get bookings
- `PUT /api/host/bookings/:bookingId` - Update booking status
- `GET /api/host/stays` - Get stays
- `POST /api/host/stays` - Create stay
- `PUT /api/host/stays/:stayId` - Update stay
- `GET /api/host/recommendations` - Get recommendations
- `POST /api/host/recommendations` - Create recommendation
- `PUT /api/host/recommendations/:recommendationId` - Update recommendation
- `DELETE /api/host/recommendations/:recommendationId` - Delete recommendation
- `GET /api/host/messages` - Get messages
- `GET /api/host/analytics` - Get analytics data

### Shared Routes
- `GET /api/shared/places/featured` - Get featured places
- `GET /api/shared/experiences/popular` - Get popular experiences
- `GET /api/shared/places` - Search places
- `GET /api/shared/places/:placeId` - Get place details
- `GET /api/shared/experiences` - Search experiences
- `GET /api/shared/preferences` - Get user preferences
- `PUT /api/shared/preferences` - Update preferences
- `PUT /api/shared/mode` - Set user mode
- `GET /api/shared/notifications` - Get notifications
- `PUT /api/shared/notifications/:notificationId/read` - Mark notification as read
- `PUT /api/shared/notifications/read-all` - Mark all notifications as read
- `GET /api/shared/location/nearby` - Get nearby services
- `POST /api/shared/system/errors` - Report error
- `GET /api/shared/status` - Get system status

### Media Routes
- `POST /api/media/upload` - Upload single file
- `POST /api/media/upload/multiple` - Upload multiple files
- `GET /api/media/files` - Get user files
- `GET /api/media/files/:fileId` - Get file details
- `DELETE /api/media/files/:fileId` - Delete file
- `GET /api/media/uploads/:filename` - Serve uploaded files
- `GET /api/media/thumbnail/:fileId` - Generate thumbnail

## Database Schema

The database uses PostgreSQL with the following main tables:

- **users** - User accounts and profiles
- **accounts** - Host organizations
- **properties** - Property listings
- **stays** - Guest stays
- **bookings** - Booking records
- **places** - Points of interest
- **recommendations** - Host recommendations
- **messages** - Chat messages
- **notifications** - User notifications
- **uploaded_files** - File metadata

See `database/schema.sql` for the complete schema.

## WebSocket Events

The API supports real-time communication via WebSocket:

### Client Events
- `join:property` - Join property room
- `leave:property` - Leave property room
- `join:stay` - Join stay room
- `leave:stay` - Leave stay room
- `message:send` - Send message
- `message:read` - Mark message as read
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator
- `booking:update` - Update booking
- `stay:update` - Update stay

### Server Events
- `message:new` - New message received
- `message:read` - Message marked as read
- `notification:new` - New notification
- `booking:update` - Booking updated
- `stay:update` - Stay updated

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Docker Deployment

### Using Docker Compose

1. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Update .env with your production values
   ```

2. **Start services**
   ```bash
   docker-compose up -d
   ```

### Using Docker

1. **Build the image**
   ```bash
   docker build -t staywise-backend .
   ```

2. **Run the container**
   ```bash
   docker run -p 3001:3001 --env-file .env staywise-backend
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `SUPABASE_URL` | Supabase project URL | Required |
| `SUPABASE_ANON_KEY` | Supabase anon key | Required |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_REFRESH_SECRET` | JWT refresh secret | Required |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:5173` |
| `MAX_FILE_SIZE` | Max file upload size | `10485760` (10MB) |
| `UPLOAD_PATH` | File upload directory | `./uploads` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `LOG_LEVEL` | Logging level | `info` |

## API Response Format

All API responses follow this format:

```typescript
interface APIResponse<T> {
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
```

## Error Handling

The API uses standard HTTP status codes and includes detailed error information:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource not found)
- `409` - Conflict (resource already exists)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 3-5 attempts per 15 minutes
- **General endpoints**: 100 requests per 15 minutes
- **File uploads**: 10MB per file, 5 files per request

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Row Level Security (RLS) in database
- CORS protection
- Rate limiting
- Input validation
- File type validation
- SQL injection prevention
- XSS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.