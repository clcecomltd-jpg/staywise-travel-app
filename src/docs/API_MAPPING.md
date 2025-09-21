# StayWise API Mapping

## Frontend ↔ Backend Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Guest Pages   │  │   Host Pages    │  │  System Pages   │ │
│  │                 │  │                 │  │                 │ │
│  │ • Home          │  │ • Dashboard     │  │ • Onboarding    │ │
│  │ • Explore       │  │ • Bookings      │  │ • Auth          │ │
│  │ • Map           │  │ • Guests        │  │ • ModePicker    │ │
│  │ • Info          │  │ • Messages      │  │ • Loading       │ │
│  │ • Chat          │  │ • Recommendations│  │ • Error404      │ │
│  │ • CheckIn       │  │ • Earnings      │  │                 │ │
│  │ • Favorites     │  │ • Settings      │  │                 │ │
│  │ • Profile       │  │                 │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                          API Layer                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Guest API      │  │   Host API      │  │  Shared API     │ │
│  │                 │  │                 │  │                 │ │
│  │ • Places        │  │ • Properties    │  │ • Authentication│ │
│  │ • Experiences   │  │ • Bookings      │  │ • User Profile  │ │
│  │ • Services      │  │ • Guests        │  │ • Preferences   │ │
│  │ • Chat          │  │ • Messages      │  │ • Notifications │ │
│  │ • Favorites     │  │ • Analytics     │  │ • Files/Media   │ │
│  │ • Check-in      │  │ • Recommendations│  │ • Location      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Backend (API Server)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │     Routes      │  │    Services     │  │     Models      │ │
│  │                 │  │                 │  │                 │ │
│  │ • /api/auth     │  │ • AuthService   │  │ • User          │ │
│  │ • /api/guests   │  │ • GuestService  │  │ • Property      │ │
│  │ • /api/hosts    │  │ • HostService   │  │ • Booking       │ │
│  │ • /api/places   │  │ • PlaceService  │  │ • Place         │ │
│  │ • /api/bookings │  │ • BookingService│  │ • Experience    │ │
│  │ • /api/messages │  │ • MessageService│  │ • Message       │ │
│  │ • /api/recommendations│ • RecommendationService│ • Recommendation│ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                         Database                                │
├─────────────────────────────────────────────────────────────────┤
│  • Users • Properties • Bookings • Places • Messages • Media   │
└─────────────────────────────────────────────────────────────────┘
```

## API Endpoint Mapping

### Authentication Endpoints
```
Frontend Usage → Backend Endpoint → Description
─────────────────────────────────────────────────────────────
Auth.tsx        → POST /api/auth/login        → User login
Auth.tsx        → POST /api/auth/register     → User registration  
Auth.tsx        → POST /api/auth/logout       → User logout
Auth.tsx        → GET  /api/auth/me           → Get current user
Auth.tsx        → POST /api/auth/refresh      → Refresh auth token
Settings.tsx    → PUT  /api/auth/password     → Change password
```

### Guest Mode Endpoints
```
Frontend Page → Backend Endpoint → Description
─────────────────────────────────────────────────────
Home.tsx      → GET  /api/places/featured    → Featured places
Home.tsx      → GET  /api/experiences/popular → Popular experiences
Explore.tsx   → GET  /api/places?category=X  → Places by category
Explore.tsx   → GET  /api/experiences?type=X → Experiences by type
Map.tsx       → GET  /api/places/nearby      → Nearby places
Map.tsx       → GET  /api/places/:id/details → Place details
Info.tsx      → GET  /api/properties/:id     → Property information
Info.tsx      → GET  /api/services/property/:id → Property services
Chat.tsx      → GET  /api/messages/guest     → Guest messages
Chat.tsx      → POST /api/messages           → Send message
CheckIn.tsx   → POST /api/bookings/:id/checkin → Check-in process
CheckIn.tsx   → GET  /api/properties/:id/access → Access information
Favorites.tsx → GET  /api/guests/favorites   → User favorites
Favorites.tsx → POST /api/guests/favorites   → Add to favorites
Favorites.tsx → DELETE /api/guests/favorites/:id → Remove favorite
Profile.tsx   → GET  /api/guests/profile     → Guest profile
Profile.tsx   → PUT  /api/guests/profile     → Update profile
```

### Host Mode Endpoints
```
Frontend Page → Backend Endpoint → Description
─────────────────────────────────────────────────────
Dashboard.tsx → GET  /api/hosts/dashboard     → Host KPIs & metrics
Dashboard.tsx → GET  /api/bookings/active     → Active bookings
Dashboard.tsx → GET  /api/guests/current      → Current guests
Bookings.tsx  → GET  /api/bookings/calendar   → Calendar view data
Bookings.tsx  → GET  /api/bookings/list       → Booking list
Bookings.tsx  → PUT  /api/bookings/:id        → Update booking
Guests.tsx    → GET  /api/hosts/guests        → Guest list
Guests.tsx    → GET  /api/guests/:id/profile  → Guest profile
Guests.tsx    → PUT  /api/guests/:id/status   → Update guest status
Messages.tsx  → GET  /api/messages/host       → Host messages
Messages.tsx  → POST /api/messages/broadcast  → Broadcast message
Recommendations.tsx → GET /api/hosts/recommendations → Host recommendations
Recommendations.tsx → POST /api/recommendations → Create recommendation
Recommendations.tsx → PUT /api/recommendations/:id → Update recommendation
Earnings.tsx  → GET  /api/hosts/earnings      → Revenue data
Earnings.tsx  → GET  /api/hosts/analytics     → Analytics data
Settings.tsx  → GET  /api/hosts/settings      → Host settings
Settings.tsx  → PUT  /api/hosts/settings      → Update settings
```

### Shared System Endpoints
```
Frontend Component → Backend Endpoint → Description
───────────────────────────────────────────────────────
Onboarding.tsx    → POST /api/users/onboarding → Complete onboarding
ModePicker.tsx    → PUT  /api/users/mode       → Set user mode
All Components    → GET  /api/users/preferences → User preferences
All Components    → PUT  /api/users/preferences → Update preferences
TopBar.tsx        → GET  /api/notifications     → Get notifications
TopBar.tsx        → PUT  /api/notifications/:id/read → Mark as read
File Uploads      → POST /api/media/upload     → Upload media
Location Services → GET  /api/location/nearby  → Nearby services
Error Reporting   → POST /api/system/errors    → Report errors
```

## Data Flow Examples

### Guest Home Page Load
```
1. Frontend: HomePage.tsx renders
2. API Call: GET /api/places/featured
3. API Call: GET /api/experiences/popular  
4. API Call: GET /api/guests/preferences
5. Backend: Combines data from Places, Experiences services
6. Response: Personalized home page data
7. Frontend: Renders HeroCard, QuickGrid, PromoCarousel
```

### Host Dashboard Load
```
1. Frontend: Dashboard.tsx renders
2. API Call: GET /api/hosts/dashboard
3. Backend: HostService aggregates:
   - Active bookings count
   - Revenue metrics
   - Guest satisfaction scores
   - Upcoming check-ins/outs
4. Response: Dashboard summary data
5. Frontend: Renders KPI cards, guest list, quick actions
```

### Real-time Chat Flow
```
1. Frontend: Chat.tsx connects to WebSocket
2. WebSocket: wss://api.staywise.com/chat
3. Backend: MessageService handles:
   - Message routing
   - User authentication
   - Message persistence
   - Push notifications
4. Frontend: Real-time message updates
```

## API Response Formats

### Standard Response Structure
```typescript
interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
```

### Error Response Format
```typescript
interface APIError {
  success: false;
  message: string;
  errors: string[];
  code: string;
  status: number;
}
```

## Authentication Flow

### Token-Based Authentication
```
1. User login → POST /api/auth/login
2. Server returns JWT access token + refresh token
3. Frontend stores tokens securely
4. All API requests include: Authorization: Bearer <token>
5. Auto-refresh tokens before expiration
6. Logout clears tokens and calls POST /api/auth/logout
```

### Guest/Host Mode Switching
```
1. User selects mode → PUT /api/users/mode
2. Server updates user preferences
3. Frontend navigation adapts to new mode
4. API calls switch to mode-specific endpoints
```

## State Management

### Frontend State Structure
```typescript
interface AppState {
  auth: {
    user: User | null;
    isAuthenticated: boolean;
    mode: 'guest' | 'host';
  };
  ui: {
    theme: 'light' | 'dark';
    isOnboarding: boolean;
    activeModal: string | null;
  };
  data: {
    places: Place[];
    bookings: Booking[];
    messages: Message[];
    // ... cached API data
  };
}
```

## Error Handling

### API Error Types
- **Network Errors**: Connection issues, timeouts
- **Authentication Errors**: Invalid tokens, expired sessions
- **Validation Errors**: Invalid input data
- **Authorization Errors**: Insufficient permissions
- **Server Errors**: Internal server issues

### Frontend Error Handling
```typescript
try {
  const response = await api.get('/api/places/featured');
  setPlaces(response.data);
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
    router.push('/auth');
  } else if (error.status >= 500) {
    // Show error page
    setError('Server error occurred');
  } else {
    // Show inline error
    toast.error(error.message);
  }
}
```

## Performance Considerations

### Caching Strategy
- **API Responses**: Cache frequently accessed data
- **Images**: CDN caching for property/place images
- **User Preferences**: Local storage for settings
- **Location Data**: Cache nearby places/services

### Optimization Techniques
- **Pagination**: Limit API response sizes
- **Lazy Loading**: Load data as needed
- **Debouncing**: Prevent excessive API calls
- **Request Batching**: Combine related API calls
- **Offline Support**: Cache critical data locally