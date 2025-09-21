# HomeTopCard

The HomeTopCard is a glass 3D welcome card component that serves as the hero element on the home screen. It displays a personalized welcome message, property information, check-in/out times, and optional weather data.

## Overview

This component follows the approved design specifications for the home welcome card with:
- Glass 3D rectangle with rounded-xl corners (~20px)
- Warm micro-glows on top and bottom edges
- Floating shadow effects
- iOS-first responsive design with safe area padding

## Props

```typescript
interface HomeTopCardProps {
  guestName?: string;           // Name of guest (defaults to "Guest")
  propertyName: string;         // Property name (required)
  checkInTime: string;         // Check-in time display (required)
  checkOutTime: string;        // Check-out time display (required)  
  temperatureC?: number;       // Temperature in Celsius (optional)
  weatherIcon?: "sun"|"cloud"|"rain"|"storm"|"partly"; // Weather icon type
  onPropertyClick?: () => void; // Property button click handler
  className?: string;          // Additional CSS classes
}
```

## Usage

### Basic Usage
```tsx
import HomeTopCard from '../components/home/HomeTopCard';

<HomeTopCard
  guestName="Maria"
  propertyName="Sunset Villa Bangkok"
  checkInTime="15:00"
  checkOutTime="11:00"
/>
```

### With Weather
```tsx
<HomeTopCard
  guestName="John"
  propertyName="Beach House Phuket"
  checkInTime="14:00"
  checkOutTime="12:00"
  temperatureC={32}
  weatherIcon="sun"
  onPropertyClick={() => navigate('/property')}
/>
```

### Fallback Guest Name
```tsx
<HomeTopCard
  propertyName="Modern Loft"
  checkInTime="16:00"
  checkOutTime="10:00"
  // Will display "Welcome Home, Guest"
/>
```

## Design Specifications

### Visual Features
- **Glass Effect**: Semi-transparent background with backdrop blur
- **3D Appearance**: Layered shadows and warm micro-glows
- **Border Radius**: 20px rounded corners
- **Glow Effects**: Warm orange/gold gradient glows on top/bottom edges

### Colors & Styling
- **Background**: Linear gradient with glass effect
- **Border**: Semi-transparent white stroke
- **Shadow**: Multi-layered floating shadows with warm accent
- **Text**: High contrast white/dark text depending on theme

### Typography
- **Heading**: Bold welcome message with guest name
- **Times**: Monospaced font for check-in/out times
- **Property**: Medium weight in button format

## Accessibility

The component includes comprehensive accessibility features:

- **Semantic Structure**: Uses proper heading hierarchy (h1 for welcome)
- **ARIA Labels**: Region landmark with `aria-labelledby`
- **Button Accessibility**: Property button has descriptive `aria-label`
- **Icon Accessibility**: Weather icons marked as decorative with `aria-hidden`
- **Focus Management**: Keyboard navigable elements

### Screen Reader Support
```html
<div role="region" aria-labelledby="welcome-heading">
  <h1 id="welcome-heading">Welcome Home, Maria</h1>
  <button aria-label="View details for Sunset Villa Bangkok">
    <!-- Property button content -->
  </button>
</div>
```

## Responsive Behavior

- **Mobile**: Full-width layout with safe area padding
- **Tablet**: Maintains proportions with appropriate spacing
- **Desktop**: Fixed max-width with centered alignment

The component uses the design system's spacing tokens and follows iOS HIG guidelines for touch targets and visual hierarchy.

## Weather Icons

Supports 5 weather states with emoji representations:
- `sun`: ☀️ (default)
- `cloud`: ☁️
- `rain`: 🌧️
- `storm`: ⛈️  
- `partly`: ⛅

## Design System Integration

Uses the following design tokens:
- `--glass-card` utilities for 3D glass effects
- `--safe-area-*` for device-specific padding
- Typography scale from tokens.css
- Color variables for light/dark mode support

## Testing

The component includes comprehensive Jest/RTL tests covering:
- Prop rendering and fallbacks
- Click event handling
- Accessibility attributes
- Custom className application
- Weather icon display logic

See `__tests__/HomeTopCard.test.tsx` for complete test suite.

## Storybook Stories

Available stories demonstrate:
- Default configuration
- Weather variations
- Guest name fallbacks
- Long property names
- Light/dark mode variants
- Mobile/desktop viewports

See `stories/HomeTopCard.stories.tsx` for interactive examples.