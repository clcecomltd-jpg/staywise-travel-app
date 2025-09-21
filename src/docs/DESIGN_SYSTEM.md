# StayWise Design System

## Overview
The StayWise design system follows Material 3 principles with iOS design guidelines, featuring liquid glass morphism effects, consistent typography, and a comprehensive color system optimized for both light and dark modes.

## Color Palette

### Brand Colors
- **Primary Blue**: `#007AFF` (iOS Blue) - Used for all interactive elements and icons
- **Brand Orange**: `#FF9900` to `#FFB347` - Logo and accent elements
- **Host Gold**: `rgba(255, 215, 0, 0.08)` (dark) / `rgba(255, 215, 0, 0.04)` (light)

### Semantic Colors
- **Success**: `#10b981` (Green family)
- **Error**: `#ef4444` (Red family) 
- **Warning**: `#f59e0b` (Yellow family)
- **Info**: `#3b82f6` (Blue family)

### Surface Colors (Material 3)
- **Background**: `oklch(0.988 0.002 264.53)` (light) / `#0f0f0f` (dark)
- **Card**: `oklch(0.978 0.003 264.53)` (light) / `#1a1a1a` (dark)
- **Popover**: `oklch(0.968 0.004 264.53)` (light) / `#262626` (dark)

## Typography Scale

### Font Sizes
- **Hero**: `2rem` (32px) - Hero titles, major headings
- **Section**: `1.25rem` (20px) - Section headers
- **Label**: `1rem` (16px) - Labels and buttons
- **Body**: `0.875rem` (14px) - Body text
- **Secondary**: `0.75rem` (12px) - Secondary/meta text

### Font Weights
- **Bold**: `700` - Major emphasis
- **Semibold**: `600` - Medium emphasis  
- **Medium**: `500` - Labels, buttons
- **Regular**: `400` - Body text

### Typography Rules
- Never override font-size, font-weight, or line-height with Tailwind classes unless explicitly requested
- Use semantic HTML elements (h1, h2, p, etc.) for proper typography hierarchy
- Line height is consistently `1.5` across all text elements

## Spacing System (8px Grid)

- **Space 1**: `4px` - Micro spacing
- **Space 2**: `8px` - Base unit
- **Space 3**: `12px` - Small spacing
- **Space 4**: `16px` - Medium spacing
- **Space 5**: `20px` - Large spacing
- **Space 6**: `24px` - XL spacing
- **Space 8**: `32px` - XXL spacing
- **Space 10**: `40px` - Section spacing
- **Space 12**: `48px` - Page spacing

## Liquid Glass Effects

### Specifications
- **Blur**: `16px` for all glass effects
- **Border Radius**: `16px` standard
- **Stroke**: `1px solid rgba(255, 255, 255, 0.10)`
- **Fill Dark**: `rgba(255, 255, 255, 0.05)`
- **Fill Light**: `rgba(0, 0, 0, 0.05)`

### Glass Classes
- `.glass-card` - Standard glass card
- `.glass-button` - Interactive glass buttons
- `.glass-float` - Floating glass elements
- `.glass-header` - Navigation headers
- `.glass-nav` - Bottom navigation

## Border Radius Scale

- **Small**: `8px` - Minor elements
- **Medium**: `12px` - Standard elements
- **Large**: `16px` - Cards, major elements
- **XL**: `20px` - Hero elements
- **Full**: `9999px` - Pills, badges

## Shadow System

- **Small**: `0 1px 2px rgba(0, 0, 0, 0.05)` - Subtle elevation
- **Medium**: `0 4px 6px rgba(0, 0, 0, 0.07)` - Standard cards
- **Large**: `0 10px 15px rgba(0, 0, 0, 0.1)` - Elevated cards
- **XL**: `0 20px 25px rgba(0, 0, 0, 0.1)` - Modals, major elevation

## Animation Guidelines

### Durations
- **Fast**: `150ms` - Micro interactions
- **Normal**: `300ms` - Standard transitions
- **Slow**: `500ms` - Complex animations

### Easings
- **Ease In Out**: `cubic-bezier(0.4, 0, 0.2, 1)` - Standard
- **Ease Out**: `cubic-bezier(0, 0, 0.2, 1)` - Entrances
- **Ease In**: `cubic-bezier(0.4, 0, 1, 1)` - Exits

### Animation Rules
- Subtle animations only (120-240ms)
- No bounce or elastic effects
- Hardware acceleration for smooth performance
- Reduced motion support

## Breakpoints

- **Mobile**: `430px` - iPhone 14 Pro Max baseline
- **Tablet**: `768px` - iPad support
- **Desktop**: `1024px` - Desktop layouts

## Safe Areas

- **Top**: `24px` - Status bar clearance
- **Bottom**: `24px` - Home indicator clearance  
- **Horizontal**: `20px` - Screen edge padding

## Z-Index Scale

- **Dropdown**: `50` - Dropdown menus
- **Modal**: `100` - Modal dialogs
- **Toast**: `200` - Toast notifications

## Component Specifications

### Cards
- Standard padding: `16px` (space-4)
- Border radius: `16px` (radius-lg)
- Glass effects with proper blur and opacity
- Hover states with subtle transforms

### Buttons
- Minimum height: `44px` (touch target)
- Horizontal padding: `16px`
- Border radius: `16px`
- Glass button styling with hover states

### Navigation
- Bottom nav height: `80px` + safe area
- Top bar height: `60px` + safe area
- Glass morphism effects throughout

## Theme Implementation

### Dark Mode (Default)
- True dark backgrounds (`#0f0f0f`)
- White text for maximum contrast
- Vibrant accent colors
- Prominent glass effects with white overlays

### Light Mode  
- Clean light backgrounds
- Dark text for proper contrast
- iOS Blue for all icons
- Subtle glass effects with black overlays
- No glow effects or drop shadows

## Accessibility

- Minimum 4.5:1 contrast ratio for text
- 44px minimum touch targets
- Focus indicators for keyboard navigation
- Screen reader support with semantic HTML
- Reduced motion support

## File Organization

```
/src/styles/
  tokens.css          # Design token definitions
  globals.css         # Global styles and theme implementation

/docs/
  DESIGN_SYSTEM.md    # This documentation
```

## Usage Examples

```css
/* Using design tokens */
.hero-title {
  font-size: var(--text-hero);
  font-weight: var(--weight-bold);
  margin-bottom: var(--space-4);
}

.glass-card {
  background: var(--glass-fill-dark);
  backdrop-filter: blur(var(--glass-blur-dark));
  border: 1px solid var(--glass-stroke-dark);
  border-radius: var(--glass-radius);
}
```

```tsx
// Component example
<Card className="glass-card p-4 rounded-lg">
  <h2>Section Title</h2>
  <p>Body content using semantic typography</p>
</Card>
```