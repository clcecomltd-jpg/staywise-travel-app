# StayWise Project Structure

## Overview

StayWise is organized as a modern React application with TypeScript, following a feature-based component architecture. The project emphasizes maintainability, reusability, and strict adherence to the Material 3 design system with liquid glass morphism effects.

## Root Directory Structure

```
staywise/
├── src/                    # Main application source code
├── public/                 # Static assets served by Vite
├── stories/                # Storybook stories for components
├── reports/                # Build and analysis reports
├── [config files]         # Vite, TypeScript, package configs
└── [other]                # README, package files, etc.
```

## Source Code Architecture (`/src/`)

### Core Application Files

```
src/
├── main.tsx               # Application entry point
├── components/            # All React components organized by feature
├── contexts/              # React context providers for global state
├── hooks/                 # Reusable React hooks
├── services/              # API and data services
├── lib/                   # Utility libraries and helpers
├── types/                 # TypeScript type definitions
├── styles/                # CSS tokens and theme definitions
├── assets/                # Imported assets (Figma, etc.)
├── docs/                  # Project documentation
├── guidelines/            # Design system guidelines
└── [other]               # Config files, constants, etc.
```

## Component Organization (`/src/components/`)

The component architecture follows a feature-based approach with organized subdirectories:

### Core Component Categories

```
components/
├── ui/                    # Reusable UI components (buttons, cards, etc.)
├── screens/               # Screen-level components for app navigation
├── cards/                 # Card components for content display
├── contexts/              # React context providers
├── features/              # Feature-specific components
├── home/                  # Home page components
├── hero/                  # Hero section components
├── layout/                # Layout and container components
├── modals/                # Modal and overlay components
├── figma/                 # Figma-imported components
├── hooks/                 # Component-specific hooks
└── [other]               # Additional component categories
```

### Key Component Groups

- **UI Components** (`ui/`): Foundational components like buttons, inputs, cards following shadcn/ui patterns
- **Screen Components** (`screens/`): Full-screen pages for the mobile app experience
- **Card Components** (`cards/`): Content display cards with consistent styling
- **Context Providers** (`contexts/`): State management for themes, properties, etc.
- **Feature Components** (`features/`): Specialized functionality like navigation, onboarding


## Hooks Directory (`/src/hooks/`)

Reusable React hooks for common functionality:

```
hooks/
├── index.ts                   # Export barrel for all hooks
├── useDebounce.ts             # Input debouncing utility
├── useIntersectionObserver.ts # Visibility detection
└── useLocalStorage.ts         # Persistent storage management
```

### Hook Usage Patterns

```typescript
// Debounced search input
const debouncedQuery = useDebounce(searchQuery, 300);

// Local storage state management
const [theme, setTheme] = useLocalStorage('theme', 'system');

// Intersection observer for animations
const [ref, isVisible] = useIntersectionObserver();
```

## Type Definitions (`/src/types/`)

TypeScript interfaces and type definitions:

```
types/
└── LocalTip.ts                # Recommendation data structure
```

### Type Structure Example

```typescript
export interface LocalTip {
  id: number;
  category: 'dining' | 'coffee' | 'nightlife' | 'shopping' | 'nature' | 'attractions';
  title: string;
  description: string;
  image: string;
  rating: number;
  priceRange: '$' | '$$' | '$$$';
  openHours: string;
  distance: string;
  tags: string[];
  hostNote?: string;
}
```

## Asset Management

### Static Assets (`/public/`)

Public assets served directly by Vite:

```
public/
├── city.png                   # Background images
├── logo.png                   # App logos
├── golden-compass.png         # App icons
└── [other assets]             # Static files
```

### Imported Assets (`/src/assets/`)

Assets imported by components (processed by Vite):

```
assets/
├── [figma-assets].png         # Figma-exported images
└── [other imports]            # Processed assets
```

## Style Architecture

### Global Styles (`/styles/globals.css`)

The main stylesheet containing:

- **CSS Custom Properties**: Design tokens for colors, spacing, typography
- **Material 3 Color System**: Light and dark theme definitions
- **Liquid Glass Effects**: Precise backdrop-filter specifications
- **Animation Definitions**: Keyframes and transition utilities
- **Responsive Utilities**: Mobile-first media queries

### Design Tokens (`/src/styles/tokens.css`)

Granular design tokens imported by globals.css:

```css
:root {
  /* Typography */
  --font-size: 14px;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  
  /* Spacing */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  
  /* Colors */
  --primary: #007AFF;   /* iOS Blue */
  --brand: #FF6B00;     /* StayWise Orange */
  --host-gold: #FFD700; /* Host accent */
}
```

## Figma Imports (`/src/imports/`)

Assets and components imported from Figma designs:

```
imports/
├── svg-b2oo5upre1.ts         # SVG path definitions
├── IPhone16Plus1.tsx         # Device frame components
└── [generated files]         # Auto-generated from Figma
```

## State Management

### Context Providers

```typescript
// Theme management
const { theme, setTheme } = useTheme();

// Settings persistence
const { settings, updateSettings } = useSettings();

// Modal state
const { isModalOpen, selectedCard, openModal, closeModal } = useCardModal();
```

### Local Storage Integration

Persistent storage for:
- Theme preferences (light/dark/system)
- User onboarding completion status
- Favorited recommendations
- Language and accessibility preferences

## Navigation Architecture

### Navigation Patterns

1. **Bottom Navigation**: Primary app navigation with glass effects
2. **Modal System**: Rich overlays for detailed content
3. **Back Navigation**: Consistent back button behavior
4. **Deep Linking**: Support for direct screen access

### Navigation State

```typescript
interface NavigationState {
  currentScreen: string;
  previousScreen?: string;
  modalStack: Modal[];
  canGoBack: boolean;
}
```

## Performance Optimizations

### Code Splitting

- **Page-level**: Each page loads independently
- **Component-level**: Heavy components lazy-loaded
- **Route-based**: Dynamic imports for navigation targets

### Bundle Optimization

- **Tree Shaking**: Unused code elimination
- **Chunk Splitting**: Optimal bundle sizes
- **Preloading**: Critical resources prioritized

### Runtime Performance

- **Memoization**: Expensive calculations cached
- **Virtual Scrolling**: Large lists optimized
- **Image Lazy Loading**: Progressive image loading
- **Animation Optimization**: Hardware-accelerated transforms

## Development Workflow

### File Naming Conventions

- **Components**: PascalCase (`ComponentName.tsx`)
- **Pages**: PascalCase (`PageName.tsx`)
- **Hooks**: camelCase with `use` prefix (`useHookName.ts`)
- **Types**: PascalCase (`TypeName.ts`)
- **Utilities**: camelCase (`utilityName.ts`)

### Import Patterns

```typescript
// React and hooks
import React, { useState, useEffect } from 'react';

// Third-party libraries
import { motion } from 'motion/react';
import { Search, Heart } from 'lucide-react';

// Internal components
import { Button } from '../ui/button';
import { Card } from '../ui/card';

// Types and utilities
import type { LocalTip } from '../../types/LocalTip';
import { cn } from '../../lib/utils';
```

### Component Structure Template

```typescript
interface ComponentProps {
  // Props with proper TypeScript typing
}

export const ComponentName: React.FC<ComponentProps> = ({
  // Destructured props
}) => {
  // State and hooks
  
  // Event handlers
  
  // Effects
  
  // Render helpers
  
  return (
    // JSX with proper accessibility and styling
  );
};
```

## Testing Strategy

### Test Organization

```
__tests__/
├── components/              # Component unit tests
├── pages/                   # Page integration tests
├── hooks/                   # Hook behavior tests
└── utils/                   # Utility function tests
```

### Testing Patterns

- **Component Testing**: React Testing Library
- **Hook Testing**: Custom hook testing utilities
- **Visual Testing**: Screenshot comparison
- **Accessibility Testing**: axe-core integration

## Build and Deployment

### Build Process

1. **Type Checking**: TypeScript compilation
2. **Linting**: ESLint code quality checks
3. **Testing**: Automated test suite
4. **Building**: Vite production build
5. **Optimization**: Asset optimization and compression

### Environment Configuration

```typescript
// Environment-specific settings
const config = {
  development: {
    apiUrl: 'http://localhost:3000',
    enableDevTools: true,
  },
  production: {
    apiUrl: 'https://api.staywise.app',
    enableDevTools: false,
  },
};
```

This structure ensures maintainability, scalability, and consistency throughout the StayWise application while supporting the sophisticated design system and user experience requirements.
