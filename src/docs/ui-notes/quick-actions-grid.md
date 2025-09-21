# QuickActionsGrid

The QuickActionsGrid is a responsive 3D grid component that displays interactive tiles for quick navigation actions. Each tile features pressable 3D styling, hover effects, and smart deep-linking capabilities.

## Overview

This component implements the upgraded 3×2 grid specification with:
- 3D pressable cards with subtle depth effects
- Hover/press states with scale transforms
- Smart navigation via useDeepLinks hook
- Mobile-first responsive layout (2×3 on mobile, 3×2 on larger screens)
- Haptic feedback on mobile devices
- Accessibility-first design

## Props

```typescript
interface QuickActionsGridProps {
  className?: string;  // Additional CSS classes (optional)
}
```

## Usage

### Basic Usage
```tsx
import QuickActionsGrid from '../components/home/QuickActionsGrid';

<QuickActionsGrid />
```

### With Custom Styling
```tsx
<QuickActionsGrid className="my-8 px-4" />
```

## Grid Items Configuration

The grid uses the `GRID_LINKS` configuration from `data/grid.links.ts`:

```typescript
const GRID_LINKS = [
  {
    key: "EXPLORE",
    path: "/explore", 
    queryParams: { tab: "activities" },
    label: "Explore",
    description: "Discover local activities",
    icon: "compass"
  },
  // ... 5 more items
];
```

## Navigation Integration

### Deep Links
Each tile navigates using the `useDeepLinks` hook:
- **Explore** → `/explore?tab=activities`
- **Favourites** → `/favorites?tab=saved`
- **Messages** → `/chat`
- **Day Trips** → `/explore?tab=daytrips`
- **eSIM** → `/essentials?section=esim`
- **Restaurants** → `/explore?tab=restaurants`

### Haptic Feedback
On mobile devices with vibration support, tapping tiles provides 50ms haptic feedback:
```javascript
if ('vibrate' in navigator) {
  navigator.vibrate(50);
}
```

## Design Specifications

### 3D Visual Effects
Each tile features layered depth styling:
- **Glass Background**: Semi-transparent with backdrop blur
- **Inner Highlight**: Subtle gradient overlay for depth
- **Border**: Semi-transparent white stroke
- **Shadow**: Multi-layered floating shadows
- **Icon Container**: 3D gradient background with inset shadows

### Interactive States
- **Hover**: Scale effect and glow enhancement
- **Press**: Scale-down feedback (0.98x then 0.95x)
- **Focus**: Keyboard navigation support
- **Motion-Safe**: Respects `prefers-reduced-motion`

### Colors & Styling
```css
/* Base 3D styling */
background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
backdrop-filter: blur(16px);
border: 1px solid rgba(255,255,255,0.15);
box-shadow: 
  0 8px 16px rgba(0,0,0,0.1),
  0 4px 8px rgba(0,0,0,0.05),
  inset 0 1px 0 rgba(255,255,255,0.1),
  inset 0 -1px 0 rgba(0,0,0,0.1);
```

## Icon System

Supports 6 icon types with Lucide React icons:
- `compass` → Compass (Explore)
- `heart` → Heart (Favourites) 
- `message-circle` → MessageCircle (Messages)
- `map-pin` → MapPin (Day Trips)
- `wifi` → Wifi (eSIM)
- `utensils` → Utensils (Restaurants)

Fallback: Unknown icons default to `Compass`

## Responsive Behavior

### Grid Layout
- **Mobile** (`< 640px`): 2 columns × 3 rows
- **Tablet+** (`≥ 640px`): 3 columns × 2 rows

### Animation Timing
Tiles animate in with staggered delays:
```javascript
// Row-based delay calculation
const delay = Math.floor(index / 3) * 0.4 + (index % 3) * 0.1;
// Results: [0s, 0.1s, 0.2s, 0.4s, 0.5s, 0.6s]
```

## Accessibility

### ARIA Support
- **Button Role**: Each tile is a focusable button
- **Descriptive Labels**: `aria-label="{label}: {description}"`
- **Icon Hiding**: Icons marked with `aria-hidden="true"`
- **Semantic Heading**: Grid title uses proper heading hierarchy

### Keyboard Navigation
- Standard button focus handling
- Tab order follows visual layout
- Enter/Space activation support

### Screen Reader
```html
<button aria-label="Explore: Discover local activities">
  <div aria-hidden="true">🧭</div>
  <h3>Explore</h3>
  <p>Discover local activities</p>
</button>
```

## Performance

### Optimizations
- **Transform GPU**: Uses `transform-gpu` for hardware acceleration
- **Reduced Motion**: Respects accessibility preferences
- **Event Handling**: Efficient click handling with single navigate call
- **Icon Mapping**: Static object for O(1) icon lookup

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  .motion-reduce\:transform-none {
    transform: none !important;
  }
  .motion-reduce\:hover\:scale-100:hover {
    transform: scale(1) !important;
  }
}
```

## Testing

### Interaction Testing
- Click navigation calls with correct deep-link keys
- Haptic feedback when vibrate API available
- Mouse interaction states (hover, press, release)
- Keyboard accessibility

### Visual Testing
- Animation delays are properly staggered
- Grid layout responsive behavior
- 3D styling and depth effects
- Icon fallback handling

### Accessibility Testing
- Screen reader compatibility
- Keyboard navigation flow
- ARIA label accuracy
- Focus management

See `__tests__/QuickActionsGrid.test.tsx` for comprehensive test suite.

## Design System Integration

### Tokens Used
- `--duration-normal` (300ms) for transitions
- `--ease-in-out` for smooth animations
- `--space-*` for consistent spacing
- `--radius-xl` (20px) for rounded corners

### CSS Classes
- `.glass-card` utilities for 3D effects
- `.line-clamp-2` for description overflow
- Responsive grid utilities
- Motion-safe prefixes

## Storybook Stories

Available stories demonstrate:
- Default grid layout
- Mobile/tablet/desktop viewports
- Dark mode compatibility
- Interaction states
- Accessibility features
- Reduced motion support
- Deep link navigation

See `stories/QuickActionsGrid.stories.tsx` for interactive examples.

## Future Enhancements

Potential improvements:
- Long-press context menus
- Customizable tile order
- Dynamic icon loading
- Tile favoriting/reordering
- Quick actions shortcuts
- Voice navigation support