# StayWise AI Context Guide

Essential context for AI agents working on the StayWise travel app.

## Product Overview

**StayWise** is a web-based travel guide PWA for **guests** (travelers) and **hosts** (property owners). Guests access via link/QR code to get Wi-Fi, check-in info, local recommendations, and chat with hosts. Hosts import properties from Airbnb/Vrbo/Booking.com, manage recommendations, and view analytics. The app works offline and uses a "liquid glass" design aesthetic.

## Core Architecture

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS v4, Radix UI/shadcn components
- **Backend**: Node.js/Express with REST APIs, WebSocket chat, third-party integrations
- **Database**: PostgreSQL with entities for properties, guides, recommendations, users, messages
- **Design**: Glass morphism cards (16px radius, 16px blur), blue accent (guests), gold accent (hosts)

## Key Flows

### Streamlined Onboarding (4 Steps)
**Current Implementation**: `StreamlinedOnboardingFlow.tsx`
1. **Splash Screen**: Auto-advancing logo display with city background
2. **Mode Selection**: Guest vs Host picker with StayWise branding
3. **Quick Setup**:
   - Guests: Trip purpose multi-select (2x3 grid)
   - Hosts: Property import from platforms
4. **Personalization**:
   - Guests: Preferences multi-select (2x3 grid)
   - Hosts: Goals selection

### Guest Journey
Home dashboard → Essentials (Wi-Fi, Check-in, Rules, etc.) → Recommendations (filtered by preferences) → Map & Favorites → Chat

### Host Journey
Dashboard → Property management → Recommendation CRUD → Analytics → Unified inbox

## Current Implementation Status

### ✅ Completed
- **Streamlined onboarding flow** (reduced from 8 to 4 steps)
- **Visual integration** with official logo and city background
- **Enhanced progress bar** with animations and percentage tracking
- **Unified state management** with useReducer
- **Responsive grid layouts** for mobile-first experience

### 🎨 Design System
- **Glass cards**: `rgba(255,255,255,0.1)` + `blur(16px)`
- **Gradients**: Dark city background with overlays
- **Typography**: Brand gradient "Stay**Wise**" with blue accent
- **Animations**: Fade-in, rise-in, logo glow, progress shimmer
- **Icons**: Lucide React, 20px for cards, fully opaque

### 📁 File Structure
```
src/
├── components/
│   ├── StreamlinedOnboardingFlow.tsx  # Main onboarding (600 lines)
│   ├── TravelGuideApp.tsx            # App orchestration
│   └── OnboardingComparisonDemo.tsx  # A/B testing component
├── styles/
│   └── onboarding-animations.css     # Custom animations
└── public/
    ├── city.png                      # Background image
    └── logo.png                      # StayWise compass logo
```

## Development Guidelines

### Code Style
- **Components**: PascalCase, functional with hooks
- **State**: useReducer for complex state (onboarding), useState for simple
- **Styling**: Tailwind classes + inline styles for dynamic values
- **Icons**: Lucide React, consistent sizing (20px for cards, 24px for nav)

### Design Patterns
- **Grid layouts**: 2-column for mobile, responsive gaps
- **Glass morphism**: Consistent blur/opacity across components
- **Progress feedback**: Animated bars with percentage and step indicators
- **Responsive spacing**: Mobile-first with consistent padding/margins

### Performance
- **Code splitting**: Components lazy-loaded where appropriate
- **Asset optimization**: Images with fallback URLs
- **Animations**: CSS-based, hardware accelerated
- **State efficiency**: Minimal re-renders with useReducer

## Key Components Reference

### StreamlinedOnboardingFlow
- **State**: useReducer with OnboardingState interface
- **Animations**: fade-in, rise-in, logo-glow, progress-shimmer
- **Layout**: Mobile-first grid system (2x3 for questions)
- **Progress**: Enhanced bar with dots, percentage, and animations

### TopNavigation
- **Height**: 60px with streamlined controls
- **Buttons**: 36px uniform sizing, hover effects
- **Testing mode**: Compact "Test" button with active states

## Integration Points

### TravelGuideApp
- Uses `StreamlinedOnboardingFlow` instead of legacy components
- Persists onboarding data to localStorage as JSON
- Passes data to MainApp/MainHostApp for personalization

### Styling System
- **CSS file**: `onboarding-animations.css` for custom animations
- **Glass effects**: Predefined classes for consistency
- **Progress bars**: Enhanced styling with multiple shadow layers

## Essential Requirements

### Personalization
- Onboarding answers drive recommendation sorting
- Trip purpose + preferences stored and used throughout app
- Multi-select enables faster completion

### Offline-First
- Service workers cache critical data and assets
- IndexedDB for persistent storage
- Graceful degradation when network unavailable

### Mobile-First Design
- 430px max-width for mobile optimization
- Touch-friendly 44px+ tap targets
- Grid layouts adapt to screen size

### Performance Targets
- Time to Interactive (TTI) < 2 seconds
- 60fps animations with hardware acceleration
- Lazy loading and code splitting

This context provides AI agents with current implementation details and architectural decisions for effective StayWise development.