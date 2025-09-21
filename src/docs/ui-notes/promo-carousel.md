# PromoCarousel

The PromoCarousel is an accessible, performant horizontal scrolling component for displaying promotional offers and deals. It features automatic slideshow progression, manual navigation controls, keyboard accessibility, and mobile-optimized touch interactions.

## Overview

This component implements the promo/offer carousel specification with:
- Horizontal snapping carousel with smooth scrolling
- Auto-play functionality with pause on hover
- Navigation arrows and slide indicators
- Accessibility compliance (ARIA roles, keyboard navigation)
- Lazy loading images for performance
- Mobile-first responsive design
- Glass card styling for promotional content

## Props

```typescript
interface PromoCarouselProps {
  promos?: PromoData[];          // Array of promotional offers (optional, uses defaults)
  className?: string;            // Additional CSS classes (optional)
  autoPlay?: boolean;           // Enable auto-play slideshow (default: true)
  autoPlayInterval?: number;    // Auto-play interval in ms (default: 5000)
}

interface PromoData {
  id: string;                   // Unique identifier (required)
  title: string;               // Offer title (required)
  tag: string;                 // Category tag (required)
  image: string;               // Image URL (required)
  ctaLabel: string;            // Call-to-action button text (required)
  href: string;                // Navigation URL (required)
  description?: string;        // Offer description (optional)
  price?: string;              // Price display (optional)
  rating?: number;             // Star rating (optional)
  duration?: string;           // Duration info (optional)
  location?: string;           // Location info (optional)
}
```

## Usage

### Basic Usage
```tsx
import PromoCarousel from '../components/home/PromoCarousel';

<PromoCarousel />
```

### With Custom Promos
```tsx
const customPromos = [
  {
    id: "1",
    title: "Sunset Dinner",
    tag: "Exclusive",
    image: "/images/sunset-dinner.jpg",
    ctaLabel: "Reserve Spot",
    href: "/book/sunset-dinner",
    description: "Romantic dinner with city views",
    price: "From $89",
    rating: 4.9,
    duration: "2 hours",
    location: "Sky Bar"
  }
];

<PromoCarousel 
  promos={customPromos}
  autoPlay={true}
  autoPlayInterval={3000}
/>
```

### Disable Auto-Play
```tsx
<PromoCarousel autoPlay={false} />
```

## Features

### Auto-Play Slideshow
- Automatically advances slides every 5 seconds by default
- Pauses when user hovers over carousel
- Resumes when mouse leaves carousel area
- Can be disabled via `autoPlay={false}`
- Customizable interval via `autoPlayInterval` prop

### Navigation Controls
- **Arrow Buttons**: Previous/next navigation with hover states
- **Slide Indicators**: Dots showing current position with click navigation
- **Keyboard Support**: Arrow keys for navigation
- **Touch/Swipe**: Native scroll behavior on mobile devices

### Promo Cards
Each promotional card displays:
- **Hero Image**: Lazy-loaded with hover scale effect
- **Category Tag**: Colored badge in top-left corner
- **Rating Badge**: Star rating in top-right corner (if provided)
- **Content**: Title, description, meta information
- **Meta Info**: Duration and location with icons
- **Action**: Price display and CTA button

## Design Specifications

### Carousel Container
- **Header**: Title with navigation arrow controls
- **Scroll Area**: Horizontal overflow with snap scroll
- **Indicators**: Dot navigation below carousel

### Card Styling
```css
/* Glass card with 3D effects */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

/* Card dimensions */
width: 288px; /* w-72 */
height: auto;
flex-shrink: 0;
```

### Scroll Behavior
- **Snap Type**: `scroll-snap-type: x mandatory`
- **Snap Align**: `scroll-snap-align: start`
- **Smooth Scrolling**: `scroll-behavior: smooth`
- **Hidden Scrollbar**: Custom scrollbar styling

## Accessibility

### ARIA Support
The component includes comprehensive accessibility features:

```html
<div role="region" aria-labelledby="promo-carousel-title" aria-roledescription="carousel">
  <h2 id="promo-carousel-title">Special Offers</h2>
  
  <button aria-label="Previous offer">←</button>
  <button aria-label="Next offer">→</button>
  
  <div><!-- Scrollable content --></div>
  
  <button aria-label="Go to slide 1">•</button>
</div>
```

### Keyboard Navigation
- **Tab Order**: Logical focus progression through controls
- **Arrow Keys**: Navigate between slides
- **Enter/Space**: Activate buttons and CTAs
- **Focus Indicators**: Visible focus rings

### Screen Reader Support
- Region landmark with descriptive labels
- Carousel role description for context
- Slide position announcements
- Button purpose descriptions

## Performance Optimizations

### Image Handling
- **Lazy Loading**: `loading="lazy"` on all images
- **Proper Sizing**: Consistent aspect ratios
- **Placeholder Support**: Graceful loading states

### Scroll Performance
- **Hardware Acceleration**: GPU-accelerated transforms
- **Smooth Scrolling**: Native browser smooth scroll
- **Efficient Updates**: Minimal re-renders during navigation

### Memory Management
- **Auto-play Cleanup**: Proper interval clearance
- **Event Listener Cleanup**: useEffect cleanup functions
- **Ref Management**: Stable references for scroll control

## Responsive Behavior

### Mobile (< 768px)
- Touch-friendly navigation
- Swipe gesture support
- Larger touch targets
- Safe area consideration

### Tablet (768px - 1024px)
- Balanced card sizing
- Hover state support
- Touch and mouse interaction

### Desktop (> 1024px)
- Full hover effects
- Keyboard navigation
- Mouse wheel support
- Cursor indicators

## Sample Data

The component includes default sample data for demonstration:

```typescript
const DEFAULT_PROMOS = [
  {
    id: "1",
    title: "Sunset Rooftop Dinner",
    tag: "Exclusive",
    image: "/api/placeholder/300/200",
    ctaLabel: "Reserve Spot",
    href: "/book/sunset-dinner",
    description: "Enjoy a romantic dinner with panoramic city views",
    price: "From $89",
    rating: 4.9,
    duration: "2 hours",
    location: "Sky Bar Bangkok"
  }
  // ... more samples
];
```

## Testing

### Component Testing
The component includes comprehensive Jest/RTL tests covering:
- **Rendering**: Default and custom props
- **Navigation**: Arrow buttons and indicators
- **Auto-play**: Timing and hover pause
- **Accessibility**: ARIA attributes and keyboard nav
- **User Interactions**: Click handlers and scroll behavior

### Visual Testing
- **Image Loading**: Lazy loading and error states
- **Card Layout**: Content overflow and truncation
- **Responsive**: Different viewport sizes
- **Theme**: Light and dark mode compatibility

See `__tests__/PromoCarousel.test.tsx` for complete test suite.

## API Integration

### Loading External Data
```typescript
// Example with API data
const [promos, setPromos] = useState<PromoData[]>([]);

useEffect(() => {
  fetch('/api/promos')
    .then(res => res.json())
    .then(setPromos);
}, []);

return <PromoCarousel promos={promos} />;
```

### Navigation Handling
```typescript
// Custom navigation handler
const handlePromoClick = (href: string) => {
  // Use your router/navigation system
  router.push(href);
};

// Component would need modification to accept onNavigate prop
<PromoCarousel promos={promos} onNavigate={handlePromoClick} />
```

## Storybook Stories

Available stories demonstrate:
- Default configuration with sample data
- Auto-play enabled/disabled variants
- Different data scenarios (minimal, empty, single)
- Responsive viewport testing
- Accessibility features
- Performance with many items
- Custom styling options

See `stories/PromoCarousel.stories.tsx` for interactive examples.

## Design System Integration

### Tokens Used
- `--duration-normal` for transition timing
- `--ease-in-out` for smooth animations  
- `--space-*` for consistent spacing
- `--radius-*` for border radius
- Glass card utilities for 3D effects

### CSS Classes
- `.glass-card` and `.glass-card-hover`
- `.line-clamp-2` for text truncation
- `.carousel-snap` for scroll behavior
- `.scrollbar-hide` for clean appearance

## Future Enhancements

Potential improvements:
- Infinite loop scrolling
- Gesture velocity recognition
- Video content support
- Bookmark/favorite functionality
- Social sharing integration
- Analytics event tracking
- A/B testing variants
- Personalization features