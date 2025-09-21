# StayWise Design System Guidelines

## Project Overview

StayWise is a guest/host-centric travel guide app that provides personalized recommendations and property information. The app features a sophisticated mobile-first design with Material 3 principles, realistic dark mode colors, and comprehensive liquid glass morphism effects throughout the interface.

## 🏗️ Project Structure

### Recommended Clean Architecture

```
staywise/
├── src/                             # Application source code
│   ├── App.tsx                      # Root application component
│   ├── main.tsx                     # Application entry point
│   │
│   ├── components/                  # Feature-based component organization
│   │   ├── ui/                      # Base UI components (shadcn/ui)
│   │   ├── layout/                  # Navigation and layout components
│   │   ├── features/                # Feature-specific components
│   │   │   ├── onboarding/          # 7-step onboarding system
│   │   │   ├── explore/             # Discovery and search features
│   │   │   ├── local-tips/          # Recommendation system
│   │   │   ├── check-in/            # Property access features
│   │   │   ├── wifi/                # Network sharing utilities
│   │   │   ├── chat/                # Messaging components
│   │   │   ├── favorites/           # Saved items management
│   │   │   ├── host-dashboard/      # Host management tools
│   │   │   └── house-rules/         # Property rules system
│   │   ├── common/                  # Shared utility components
│   │   └── providers/               # Context providers
│   │
│   ├── pages/                       # Screen-level components
│   ├── hooks/                       # Custom React hooks
│   ├── utils/                       # Utility functions
│   ├── types/                       # TypeScript definitions
│   ├── styles/                      # Global styles and tokens
│   └── assets/                      # Source assets
│
├── docs/                            # All documentation centralized
│   ├── README.md                    # Main project documentation
│   ├── GUIDELINES.md                # This file - design system guidelines
│   ├── DEVELOPMENT.md               # Development workflow
│   ├── PROJECT_STRUCTURE.md         # Architecture documentation
│   └── COMPONENT_CATALOG.md         # Component usage guide
│
├── public/                          # Static assets
├── index.html                       # Vite entry point
├── vite.config.ts                   # Vite configuration
└── package.json                     # Dependencies and scripts
```

## Core Design Principles

### Material 3 Foundation
- **Surface Hierarchy**: Clear elevation through surface containers (lowest, low, standard, high, highest)
- **Dynamic Color**: Adaptive color system that responds to theme changes
- **Typography Scale**: Consistent text sizing with semantic meaning (hero 28-32px bold, section 18-20px bold)
- **8px Spacing Grid**: All spacing follows 8px increments for visual consistency

### Liquid Glass Morphism Specifications
All glass effects follow precise specifications and must not be modified:

#### Glass Card (.glass-card)
- **Light Mode**: `background: rgba(0, 0, 0, 0.05)` (black/5)
- **Dark Mode**: `background: rgba(255, 255, 255, 0.05)` (white/5)
- **Blur**: 16px backdrop-filter
- **Border**: 1px solid rgba(255, 255, 255, 0.10)
- **Radius**: 16px
- **Shadow**: Dark mode has stronger shadows for depth

#### Glass Button (.glass-button)
- **Blur**: 12px backdrop-filter (16px on hover)
- **Border**: 1px solid rgba(255, 255, 255, 0.10)
- **Radius**: 16px
- **Hover**: Subtle transform and increased blur

#### Glass Float (.glass-float)
- Enhanced glass effect with floating animation
- Stronger backdrop saturation (150-160%)
- Inset highlights for premium feel

## Color System

### Brand Colors
- **Primary Orange**: Used exclusively for logo and brand text
- **iOS Blue**: `#007AFF` - Used for all interactive icons and accents
- **Host Gold**: Special overlay color for host-specific elements

### Theme Implementation
- **Dark Mode**: True dark backgrounds (`#0f0f0f`) with high contrast white text
- **Light Mode**: Clean backgrounds with proper contrast ratios
- **Gradients**: Dark/light adaptive gradients for backgrounds

### Color Token Usage
- Use existing CSS custom properties in `src/styles/globals.css`
- Never override color tokens without explicit approval
- Maintain WCAG AA contrast ratios minimum

## Typography Guidelines

### Strict Typography Rules
**CRITICAL**: Do not use Tailwind font classes unless explicitly requested:
- **No `text-xl`, `text-2xl`, `text-lg`** - Use default typography
- **No `font-bold`, `font-semibold`** - Use default weights
- **No `leading-tight`, `leading-none`** - Use default line-heights

### Typography Scale
- **Hero Text**: 28-32px bold for major headings
- **Section Headers**: 18-20px bold for content sections
- **Body Text**: 14px base font size (set in CSS custom properties)
- **Captions**: 12px for secondary information

### Implementation
Typography is handled through `src/styles/globals.css` base layer with semantic HTML elements. Component-specific typography should use these defaults unless modification is explicitly requested.

## Spacing System

### 8px Grid System
All spacing must follow 8px increments:
- **Micro**: 4px (0.5 spacing unit)
- **Small**: 8px (1 spacing unit)  
- **Medium**: 16px (2 spacing units)
- **Large**: 24px (3 spacing units)
- **XL**: 32px (4 spacing units)
- **XXL**: 40px+ (5+ spacing units)

### Component Spacing
- **Card padding**: 16px (p-4) standard, 24px (p-6) for detailed content
- **Button padding**: Follow UI component defaults
- **Grid gaps**: 16px between cards, 8px between chips
- **Section spacing**: 24-32px between major sections

## Icon System

### Lucide Icons Only
- **Exclusive use**: Only Lucide React icons are permitted
- **iOS Blue**: All icons use `#007AFF` in light mode
- **Consistent sizing**: 16px (w-4 h-4) for most contexts, 20px for primary actions
- **Exception**: Red color allowed for delete/error states

### Icon Guidelines
- Use semantic icons that clearly represent their function
- Maintain consistent stroke width across all icons
- No custom SVGs unless absolutely necessary

## Animation Standards

### Timing and Easing
- **Duration**: 120-240ms for interactions
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` for standard transitions
- **No bounce or elastic**: Subtle, professional animations only

### Animation Types
- **Hover**: Subtle scale (1.02) and translate (-2px) effects
- **Press**: Scale down (0.98) with shadow changes
- **Enter**: Fade-in with slight upward movement (translateY)
- **Loading**: Gentle pulse or fade animations

### Performance
- Use `will-change` sparingly and remove after animations
- Prefer `transform` and `opacity` for 60fps animations
- Minimize animation during scroll events

## Component Guidelines

### Standardized Cards
Use `StandardizedCard` component for consistent sizing:
- **Aspect ratio**: 16:9 for images
- **Padding**: 16px (p-4) for content
- **Variants**: default, minimal, detailed
- **Texture patterns**: grain, fabric, paper, brushed

### Modal System
- Replace direct navigation with elegant modal details
- Use `CardDetailsModal` for venue/attraction details
- Maintain backdrop blur and glass effects in modals

### Form Elements
- Use shadcn/ui components for consistency
- Apply glass effects to form containers
- Maintain focus states with proper contrast

## File Organization Standards

### Component Structure
```
src/components/FeatureName/
├── index.ts                    # Export barrel
├── ComponentName.tsx           # Main component
├── SubComponent.tsx            # Related components
└── README.md                   # Component documentation
```

### Import Organization
```typescript
// 1. React and React ecosystem
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { motion } from 'motion/react';
import { Search, Heart, MapPin } from 'lucide-react';

// 3. Internal UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// 4. Feature components
import { TipCard } from '@/components/features/local-tips';

// 5. Hooks and utilities
import { useTheme } from '@/components/providers/ThemeProvider';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// 6. Types and constants
import type { LocalTip } from '@/types/LocalTip';
```

### Path Aliases
Use these standardized path aliases:
- `@/` - Source root (`src/`)
- `@/components` - Component directory
- `@/pages` - Page components
- `@/hooks` - Custom hooks
- `@/utils` - Utility functions
- `@/types` - Type definitions
- `@/styles` - Styles and tokens

## Layout Principles

### Mobile-First Design
- **Primary target**: Mobile devices (320px-768px)
- **Responsive**: Scale up gracefully to tablet/desktop
- **Touch targets**: Minimum 44px for interactive elements
- **Safe areas**: Account for device notches and navigation

### Grid Systems
- **Cards**: 2-column grid on mobile (360px+), single column below
- **Chips**: Horizontal scroll with proper snap points
- **Lists**: Vertical with adequate spacing for touch

### Navigation
- **Bottom navigation**: Glass effect with proper backdrop
- **Top navigation**: Consistent header with glass treatment
- **Breadcrumbs**: Clear hierarchy for complex flows

## Host vs Guest Modes

### Mode Differentiation
- **Visual distinction**: Host mode uses gold accents strategically
- **Feature sets**: Host-specific screens for property management
- **Onboarding flows**: Separate 7-step processes for each mode
- **Content adaptation**: Recommendations vs management tools

### Host-Specific Elements
- **Gold highlights**: Used sparingly for host badges and accents
- **Property management**: Specialized cards and workflows
- **Analytics**: Host dashboard with performance metrics
- **Guest communication**: Enhanced messaging capabilities

## Accessibility Requirements

### Contrast and Readability
- **Text contrast**: WCAG AA minimum (4.5:1 for normal text)
- **Glass effects**: Ensure sufficient contrast behind glass overlays
- **Focus indicators**: Clear, visible focus states for keyboard navigation
- **Color dependency**: Never rely solely on color to convey information

### Interaction
- **Touch targets**: 44px minimum for primary actions
- **Gesture support**: Swipe, pinch, and tap gestures where appropriate
- **Screen reader**: Proper semantic markup and ARIA labels
- **Motion**: Respect `prefers-reduced-motion` settings

## Development Standards

### Code Quality
- **TypeScript**: Strict typing for all components and props
- **React patterns**: Functional components with hooks
- **Performance**: Lazy loading and memoization where appropriate
- **Error boundaries**: Graceful error handling throughout

### Asset Management
- **Images**: Use `ImageWithFallback` for all images
- **SVGs**: Import from `imports/` directory when provided
- **Unsplash**: Use `unsplash_tool` for placeholder images
- **Icons**: Lucide React only, no custom icon implementations

## Theme Management

### Theme Switching
- **Provider**: Use `ThemeProvider` for state management
- **Persistence**: Save theme preference to localStorage
- **System detection**: Respect system preference on first load
- **Smooth transitions**: 300ms transitions for theme changes

### Glass Effect Adaptation
- **Light mode**: Reduced opacity, no glow effects
- **Dark mode**: Enhanced blur, subtle glow animations
- **Contrast**: Ensure readability in both themes
- **Testing**: Verify all states in both themes

---

## Implementation Notes

### Critical Rules for Assistants
1. **Never modify design tokens** without explicit user request
2. **Preserve liquid glass specifications** exactly as defined
3. **Use only existing color tokens** - no custom colors
4. **Follow typography rules strictly** - no Tailwind font classes unless requested
5. **Maintain 8px spacing grid** throughout all layouts
6. **Use Lucide icons exclusively** with iOS Blue color
7. **Implement subtle animations only** - no bounce or elastic effects
8. **Follow file organization standards** - use proper paths and structure
9. **Use path aliases consistently** - import from `@/` paths
10. **Maintain component separation** - UI vs feature vs layout components

### Common Patterns
- Glass cards with proper backdrop blur
- Consistent aspect ratios for images (16:9)
- Proper touch targets for mobile interaction
- Theme-aware color adaptations
- Semantic HTML with accessibility support
- Feature-based component organization
- Clean export patterns with index files

This design system ensures consistency, accessibility, and maintainability across the entire StayWise application while preserving the sophisticated liquid glass morphism aesthetic and following modern React development best practices.