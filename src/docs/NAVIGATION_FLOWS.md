# StayWise Navigation Flows

## Application Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      StayWise App Entry                         │
│                        (App.tsx)                                │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Theme & Context Setup                          │
│              (ThemeProvider, SettingsProvider)                  │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Onboarding Check                                │
│           (localStorage: onboarding-completed)                  │
└─────────────────────┬───────────────────────────────────────────┘
                      │
              ┌───────┴───────┐
              │               │
         ✗ Not Complete  ✓ Complete
              │               │
              ▼               ▼
┌─────────────────────┐ ┌─────────────────────┐
│  Onboarding Flow    │ │    Main App         │
│   (system/pages)    │ │ (Guest/Host Mode)   │
└─────────────────────┘ └─────────────────────┘
```

## Onboarding Flow

### System Pages (`/src/pages/system/`)

```
Welcome Screen (OnboardingHeroCard)
│
▼
Mode Selection (ModePicker.tsx)
├── Guest Mode Card
└── Host Mode Card
│
▼
Benefits Display (5 BenefitCards)
├── Personalized recommendations
├── Local insider tips  
├── Real-time communication
├── Easy check-in process
└── Curated experiences
│
▼
User Questions (3 QuestionCards)
├── Travel frequency
├── Experience preferences  
└── Communication style
│
▼
Completion Screen (CompletionHeroCard)
├── Celebration animation
├── Mode-specific welcome
└── "Start Exploring" CTA
│
▼
Main Application
```

### Onboarding Components (`/src/components/features/onboarding/`)
- **OnboardingHeroCard**: Welcome compass with StayWise branding
- **ModePickerCard**: Guest/Host selection with gradient themes
- **BenefitCard**: Fixed-size benefit display with icons
- **QuestionOptionCard**: 2x2 grid options with selection states
- **CompletionHeroCard**: Celebration with mode-specific styling

## Guest Mode Navigation

### Primary Navigation Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                        Top Bar                                  │
│              (Glass header with logo)                           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Page Content                                │
│                   (Screen-specific)                             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Bottom Navigation                            │
│            Home | Explore | Favorites | Profile                │
└─────────────────────────────────────────────────────────────────┘
```

### Guest Pages (`/src/pages/guest/`)

#### Home.tsx
```
HeroWelcomeCard
├── 3D Welcome Text with gold gradient
├── Property Button (blue gradient)
└── Check-in/out dates with icons
│
▼
QuickAccessGrid (3×2)
├── Wi-Fi & Passwords
├── Check-in Guide
├── House Rules
├── Local Tips
├── Chat with Host
└── View All (grid icon)
│
▼
Featured Recommendations Carousel
├── Shows 2 cards at a time
├── Horizontal scroll with snap
└── "View All" navigation
```

#### Explore.tsx
```
ExploreHeroCarousel
├── Auto-cycling slides (6s intervals)
├── Manual controls with dots
└── Fade/slide transitions
│
▼
FilterBar
├── Category chips (horizontal scroll)
├── Active state with blue accent
└── Sort menu (glass button)
│
▼
Section Headers + Carousels
├── "Popular Places" → PlaceCard carousel
├── "Local Events" → EventCard carousel
└── "Essential Services" → ServiceCard carousel
│
▼
"View All" Navigation
├── Scoped list views
├── Secondary top bar
└── Filtered content display
```

#### Map.tsx
```
Interactive Map Interface
├── Property markers with info popups
├── POI (Points of Interest) overlay
├── Current location indicator
└── Directions integration
│
▼
Bottom Drawer Card
├── Selected location details
├── Distance and directions
├── Quick actions (navigate, save)
└── Related recommendations
```

#### Info.tsx (Property Details)
```
Property Information Hub
├── Property overview and photos
├── House rules and policies
├── Wi-Fi network and passwords
├── Available services
├── Emergency contacts
└── Check-in/out procedures
│
▼
Service Request Interface
├── Housekeeping requests
├── Maintenance issues
├── Concierge services
└── Host communication
```

#### Chat.tsx
```
Messaging Interface
├── Chat history with host
├── Real-time message status
├── Quick reply suggestions
├── Photo/media sharing
└── Service request shortcuts
│
▼
Message Composition
├── Text input with formatting
├── Media attachment
├── Voice messages
└── Automated responses
```

#### CheckIn.tsx
```
Check-in Process Guide
├── Step-by-step instructions
├── Lockbox codes and access
├── Property tour checklist
├── Wi-Fi setup assistance
└── Emergency procedures
│
▼
Confirmation Actions
├── Arrival confirmation
├── Property condition report
├── Key collection verification
└── Host notification
```

#### Favorites.tsx
```
Saved Items Management
├── Unified grid display (TipCards)
├── Category filtering
├── Selection mode with checkboxes
└── Empty state with explore CTA
│
▼
Bulk Actions
├── Remove selected items
├── Share favorite lists
├── Export recommendations
└── Organize by category
```

#### Profile.tsx
```
User Settings & Preferences
├── Account information
├── Notification preferences
├── Privacy settings
├── Theme selection
├── Language options
└── Help & support
│
▼
Account Management
├── Profile photo and details
├── Travel preferences
├── Communication settings
└── Data export/deletion
```

## Host Mode Navigation

### Host Pages (`/src/pages/host/`)

#### Dashboard.tsx
```
Analytics Overview
├── HostAnalyticsCard (revenue, bookings, rating)
├── Period selector (week/month/year)
├── Performance insights
└── Trend indicators
│
▼
Guest Management
├── GuestManagementCard (current/upcoming tabs)
├── Guest status indicators
├── Unread message counts
└── Quick contact actions
│
▼
Recommendation Insights
├── RecommendationInsightsCard
├── Performance tracking (views, saves, bookings)
├── Trending analysis
└── Category filtering
│
▼
Quick Actions Grid
├── 12 essential host tools
├── Badge notifications
├── Color-coded categories
└── Direct screen navigation
```

#### Bookings.tsx
```
Booking Management
├── Calendar view with booking timeline
├── Booking list with guest details
├── Check-in/out scheduling
├── Rate and availability management
└── Guest communication history
│
▼
Booking Actions
├── Modify booking details
├── Process refunds/changes
├── Send booking confirmations
├── Update property availability
└── Generate booking reports
```

#### Guests.tsx
```
Guest Profile Management
├── Current guest list with photos
├── Guest preference tracking
├── Communication history
├── Stay timeline and status
└── Feedback and ratings
│
▼
Guest Communication
├── Direct messaging interface
├── Broadcast announcements
├── Check-in/out notifications
├── Service request handling
└── Emergency contact protocols
```

#### Messages.tsx
```
Host Messaging Center
├── Conversation list with unread counts
├── Guest communication threads
├── Automated response templates
├── Service request tracking
└── Broadcast message composer
│                              
▼
Message Management
├── Priority message filtering
├── Response time tracking
├── Template management
├── Media sharing capabilities
└── Translation assistance
```

#### Recommendations.tsx
```
Recommendation Management
├── Create new recommendations
├── Edit existing content
├── Performance analytics
├── Category organization
└── Guest feedback integration
│
▼
Content Creation Tools
├── Photo upload and editing
├── Description templates
├── Pricing and availability
├── Location and directions
└── Booking integration links
```

#### Earnings.tsx
```
Financial Dashboard
├── Revenue tracking and trends
├── Payout management
├── Tax reporting tools
├── Expense tracking
└── Profit margin analysis
│
▼
Financial Tools
├── Invoice generation
├── Payment method management
├── Currency conversion
├── Financial goal setting
└── Performance benchmarking
```

#### Settings.tsx
```
Host Account Settings
├── Property management
├── Pricing and availability
├── House rules configuration
├── Automated messaging setup
└── Integration management
│
▼
Account Management
├── Host profile optimization
├── Verification status
├── Insurance and protection
├── Tax information
└── Account security
```

## Modal & Overlay System

### Card Detail Modals
Instead of direct navigation, the app uses elegant modal overlays:

```
Card Tap → Modal Overlay
├── Detailed information display
├── Action buttons (save, share, book)
├── Related recommendations
├── Close with backdrop tap or X button
└── Swipe down to dismiss (mobile)
```

### Modal Components (`/src/components/features/interactive/`)
- **Modal**: Base modal with backdrop and animations
- **CardDetailsModal**: Detailed view for places/events/services
- **TipModal**: Full-screen tip viewing with actions
- **ImageGallery**: Photo viewing with navigation
- **ContactModal**: Host communication interface

## Theme & Context Flow

### Theme Management
```
User Selection/System Preference
│
▼
ThemeProvider Context Update
│
▼
Global CSS Variable Changes
├── Background gradients
├── Glass effect opacity
├── Text color contrast
├── Icon color updates
└── Shadow adjustments
│
▼
Component Re-renders
├── All UI elements update simultaneously
├── 300ms smooth transitions
├── No layout shift or flicker
└── Persistent user preference
```

### Settings Context
```
User Preferences
├── Theme (light/dark/auto)
├── User mode (guest/host)
├── Onboarding status
├── Notification settings
└── Language preferences
│
▼
localStorage Persistence
├── Cross-session consistency
├── Fast app initialization
├── Offline capability
└── Sync across devices
```

## Error Handling Flow

### Error Boundary System
```
Component Error
│
▼
Error Boundary Catch
├── Log error details
├── Show fallback UI
├── Provide recovery actions
└── Maintain app stability
│
▼
User Actions
├── Retry operation
├── Report issue
├── Return to safe state
└── Continue using app
```

### Loading & Suspense
```
Route/Component Load
│
▼
Suspense Boundary
├── Show loading spinner
├── Maintain responsive UI
├── Handle network delays
└── Progressive enhancement
│
▼
Content Rendering
├── Smooth transition in
├── Staggered animations
├── Error-free display
└── Interactive elements ready
```

## Development & Debug Flow

### DevPanel Integration
```
Development Mode Detection
│
▼
DevPanel Component
├── Performance monitoring
├── State inspection
├── Theme/mode switching
├── Error tracking
└── Export functionality
│
▼
Debug Actions
├── Reset app state
├── Toggle testing mode
├── Performance metrics
├── Component tree inspection
└── Error simulation
```

## Performance Optimization Flow

### Code Splitting Strategy
```
Route-Level Splitting
├── Lazy load page components
├── Suspense boundaries
├── Progressive loading
└── Bundle optimization
│
▼
Component Splitting
├── Heavy components lazy loaded
├── Modal components on-demand
├── Chart libraries as needed
└── Image optimization
```

### Rendering Optimization
```
Component Updates
├── React.memo for pure components
├── useCallback for event handlers
├── useMemo for expensive calculations
└── Proper dependency arrays
│
▼
Performance Monitoring
├── Re-render tracking
├── Memory usage monitoring
├── Animation frame rates
└── Network request optimization
```

---

## Navigation Summary

The StayWise app follows a clear hierarchical navigation structure:

1. **Entry Point**: App.tsx → Theme Setup → Onboarding Check
2. **Onboarding**: Linear flow with progress indication
3. **Main App**: Mode-specific tabbed navigation
4. **Modal System**: Overlay details instead of page navigation
5. **Context Management**: Global state for theme, settings, user mode
6. **Error Handling**: Graceful degradation with recovery options
7. **Performance**: Lazy loading, code splitting, and optimization

This structure ensures a smooth, intuitive user experience while maintaining code organization and performance optimization.