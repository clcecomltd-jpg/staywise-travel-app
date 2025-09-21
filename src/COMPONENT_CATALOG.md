# StayWise Component Catalog

## Overview

This catalog documents all components in the StayWise application, their props, usage patterns, and design system compliance. Components are organized by feature area and include both foundational UI elements and complex feature components.

## Recent Updates (2024)

### Enhanced Onboarding Components
- **Added accessibility-first components** with WCAG 2.1 AA compliance
- **Improved performance** with optimized images and lazy loading
- **Enhanced analytics tracking** for user experience optimization
- **Mode-specific content** for better personalization
- **Consistent visual design** across all onboarding screens

## New Accessibility Components (`/components/ui/accessibility-helpers.tsx`)

### AccessibleButton
Enhanced button component with proper ARIA attributes and focus management.

**Props**:
```typescript
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  ariaLabel?: string;
  ariaDescription?: string;
  isSelected?: boolean;
  className?: string;
}
```

**Features**:
- Automatic focus ring with 2px blue outline
- Screen reader announcements for selection state
- Minimum touch target size (44px)
- Keyboard navigation support

### AccessibleOptionCard
Accessible card component for selection interfaces.

**Props**:
```typescript
interface AccessibleOptionCardProps {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}
```

**Features**:
- Proper radio/checkbox role implementation
- Linked labels and descriptions
- Visual selection indicators
- Screen reader friendly

### AccessibleProgress
Progress indicator with comprehensive accessibility support.

**Props**:
```typescript
interface AccessibleProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
  className?: string;
}
```

**Features**:
- Proper progressbar role with min/max values
- Descriptive labels for screen readers
- Visual step indicators
- Dynamic progress announcements

## Enhanced Loading Components (`/components/ui/loading-states.tsx`)

### LoadingButton
Button component with integrated loading states and accessibility.

**Props**:
```typescript
interface LoadingButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  loadingText?: string;
  'aria-label'?: string;
}
```

**Features**:
- Smooth loading state transitions
- Accessible loading announcements
- Maintains button dimensions during loading
- Focus management during state changes

### OnboardingLoader
Specialized loader for onboarding screens with compass animation.

**Features**:
- Themed compass spinning animation
- Customizable loading messages
- Respects reduced motion preferences
- Live region announcements

## Performance Components (`/components/ui/optimized-image.tsx`)

### OptimizedImage
High-performance image component with lazy loading and fallbacks.

**Props**:
```typescript
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  fallbackColor?: string;
  showLoader?: boolean;
  className?: string;
  onLoadComplete?: () => void;
  onError?: (error: string) => void;
}
```

**Features**:
- Automatic lazy loading
- Progressive image loading with fallbacks
- Error state handling with color backgrounds
- Loading state management
- Responsive image support with srcset

## Design System Foundation

### Glass Morphism Components

#### GlassCard
**Location**: Implemented via CSS classes in `globals.css`

**CSS Classes**:
- `.glass-card` - Primary glass effect
- `.glass-button` - Interactive glass elements
- `.glass-float` - Enhanced floating effects
- `.glass-header` - Navigation headers
- `.glass-nav` - Bottom navigation

**Usage**:
```tsx
<div className="glass-card p-6 rounded-2xl">
  <h3>Glass Card Content</h3>
</div>
```

**Specifications**:
- **Light Mode**: `rgba(0, 0, 0, 0.05)` background
- **Dark Mode**: `rgba(255, 255, 255, 0.05)` background
- **Blur**: 16px backdrop-filter
- **Border**: 1px solid rgba(255, 255, 255, 0.10)
- **Radius**: 16px

## Foundational UI Components (`/components/ui/`)

### StandardizedCard

**Location**: `/components/ui/standardized-card.tsx`

**Props**:
```typescript
interface StandardizedCardProps {
  data: StandardizedCardData;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'minimal' | 'detailed';
  texturePattern?: 'none' | 'grain' | 'fabric' | 'paper' | 'brushed';
  showCTA?: boolean;
}

interface StandardizedCardData {
  id: string | number;
  title: string;
  subtitle?: string;
  category?: string;
  distance?: string;
  rating?: number;
  image: string;
  emoji?: string;
  tag?: string;
  ctaText?: string;
  type?: 'venue' | 'offer' | 'event' | 'recommendation' | 'essential';
}
```

**Variants**:
- **default**: Grid-style with 16:9 aspect ratio
- **minimal**: List-style with 80px height
- **detailed**: Enhanced with CTA button

**Usage**:
```tsx
<StandardizedCard
  data={{
    id: 1,
    title: "Café Vanille",
    subtitle: "Artisan coffee & pastries",
    image: "https://example.com/image.jpg",
    rating: 4.7,
    distance: "300m"
  }}
  variant="default"
  texturePattern="grain"
  onClick={() => openModal(item)}
/>
```

### Button

**Location**: `/components/ui/button.tsx`

**Variants**:
- `default` - Primary blue button
- `secondary` - Muted background
- `outline` - Border only
- `ghost` - No background
- `destructive` - Red for dangerous actions

**Sizes**:
- `sm` - Small (32px height)
- `default` - Standard (40px height)
- `lg` - Large (48px height)

**Usage**:
```tsx
<Button 
  variant="default" 
  size="lg"
  className="glass-button"
  onClick={handleAction}
>
  Get Directions
</Button>
```

### Card

**Location**: `/components/ui/card.tsx`

**Components**:
- `Card` - Container with elevation
- `CardHeader` - Title and description area
- `CardContent` - Main content area
- `CardFooter` - Action area

**Usage**:
```tsx
<Card className="glass-card">
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

### Badge

**Location**: `/components/ui/badge.tsx`

**Variants**:
- `default` - Primary blue
- `secondary` - Muted gray
- `destructive` - Red for errors
- `outline` - Border only

**Usage**:
```tsx
<Badge variant="secondary" className="text-xs">
  Restaurant 🍴
</Badge>
```

## Guest Mode Screens

### Wi-Fi Screen (`components/screens/WifiScreen.tsx`)
- Three glass cards walk guests through network credentials, travel data add-ons, and troubleshooting support.
- Copy/QR actions share the `sonner` toast feedback pattern and launch a fullscreen modal for easy scanning.
- Reuses `ScreenHeader`, `GlassCard`, and `OfflineBadge` to keep styling aligned with the home experience.

### Check-In Screen (`components/screens/CheckInScreen.tsx`)
- Modular glass cards highlight the arrival timeline, directions, lockbox instructions, Wi-Fi recap, and host contact options.
- `Accordion` blocks replace legacy collapsibles for Parking, House Rules, and Emergency guidance while keeping content concise.
- Quick actions (copy code/password, map launch, contact host) sit at eye level for a frictionless arrival flow.

### Settings Screen (`components/screens/SettingsScreen.tsx`)
- Central hub for appearance, currency, language, and support CTAs hooked into `ThemeContext` and `SettingsContext`.
- Uses polished `Select` components with contextual badges, plus glass buttons for marketplace/help links.
- Includes onboarding reset affordance to jump back into the guided experience.

### Host Recommendations Screen (`components/screens/HostRecommendationsScreen.tsx`)
- Category chips filter Maria’s curated picks; each recommendation renders in a glass tile with imagery, rating, travel time, and cost.
- Favourite toggles mirror the home carousel interaction and sync with a local `Set` for instant visual feedback.
- Map deep links and “save for later” CTAs keep actions lightweight for guests browsing on mobile.

## Onboarding Flow Components (`/src/components/OnboardingFlow/`)

### OnboardingHeroCard

**Purpose**: Welcome screen with StayWise branding and mode selection

**Props**:
```typescript
interface OnboardingHeroCardProps {
  onGetStarted: () => void;
  animationDelay?: string;
}
```

**Features**:
- Animated StayWise logo
- 3D perspective text effects
- Glass morphism background
- Compass icon with subtle glow

**Usage**:
```tsx
<OnboardingHeroCard 
  onGetStarted={() => setCurrentStep(1)}
  animationDelay="0.2s"
/>
```

### ModePickerCard

**Purpose**: Guest vs Host mode selection interface

**Props**:
```typescript
interface ModePickerCardProps {
  selectedMode: 'guest' | 'host' | null;
  onModeSelect: (mode: 'guest' | 'host') => void;
  onNext: () => void;
  animationDelay?: string;
}
```

**Features**:
- Interactive mode cards with hover effects
- Progress indication
- Smooth selection animations
- Visual mode differentiation

**Usage**:
```tsx
<ModePickerCard
  selectedMode={selectedMode}
  onModeSelect={setSelectedMode}
  onNext={() => setCurrentStep(2)}
  animationDelay="0.3s"
/>
```

### QuestionOptionCard

**Purpose**: Interactive question selection during onboarding

**Props**:
```typescript
interface QuestionOptionCardProps {
  option: {
    id: string;
    text: string;
    icon: React.ComponentType;
    description?: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  animationDelay?: string;
}
```

**Features**:
- Lucide icon integration
- Selection state animations
- Glass morphism styling
- Smooth hover transitions

### CompletionHeroCard

**Purpose**: Onboarding completion celebration

**Props**:
```typescript
interface CompletionHeroCardProps {
  mode: 'guest' | 'host';
  userName?: string;
  onEnterApp: () => void;
  animationDelay?: string;
}
```

**Features**:
- Mode-specific messaging
- 3D zoom animation effects
- Celebration visual elements
- Call-to-action button

## Local Tips Components (`/src/components/LocalTips/`)

### TipCard

**Purpose**: Individual recommendation display with rich information

**Props**:
```typescript
interface TipCardProps {
  tip: LocalTip;
  animationDelay?: string;
  onNavigate?: (screen: string) => void;
  onShowDetails?: (tip: LocalTip) => void;
  isFavorited?: boolean;
  onToggleFavorite?: (tipId: number, isFavorited: boolean) => void;
}
```

**Features**:
- **Standardized Sizing**: 16:9 aspect ratio images, compact p-4 padding
- **Interactive Elements**: Favorite heart, rating display, action buttons
- **Host Notes**: Special section for host recommendations
- **Category Badges**: Visual category identification
- **Action Buttons**: Directions and More Info (streamlined from 3 to 2)

**Recent Updates**:
- Changed from fixed `h-48` to `aspect-[16/9]` for image consistency
- Reduced padding from `p-6` to `p-4` to match StandardizedCard
- Limited tags display to 2 items for space efficiency
- Moved rating to image overlay for better space utilization

**Usage**:
```tsx
<TipCard
  tip={tipData}
  onShowDetails={handleTipDetails}
  onToggleFavorite={handleFavorite}
  isFavorited={favoriteState}
  animationDelay="0.1s"
/>
```

### CategoryChips

**Purpose**: Horizontal scrolling category filter

**Props**:
```typescript
interface CategoryChipsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}
```

**Features**:
- Horizontal scroll with snap points
- Active state indication
- Glass morphism styling
- Touch-optimized sizing

### LocalTipsHeroCard

**Purpose**: Page header with search and discovery messaging

**Props**:
```typescript
interface LocalTipsHeroCardProps {
  onNavigate?: (screen: string) => void;
  animationDelay?: string;
}
```

**Features**:
- Engaging hero copy
- Location-based messaging
- Glass card styling
- Smooth entrance animations

## Check-In Components (`/src/components/CheckIn/`)

### CheckInHeroCard

**Purpose**: Welcome message and property overview

**Props**:
```typescript
interface CheckInHeroCardProps {
  propertyName: string;
  hostName: string;
  checkInTime: string;
  onNavigate?: (screen: string) => void;
  animationDelay?: string;
}
```

**Features**:
- Personalized welcome message
- Property information display
- Host contact integration
- Time-sensitive information

### CheckInStepCard

**Purpose**: Step-by-step check-in instructions

**Props**:
```typescript
interface CheckInStepCardProps {
  step: {
    id: number;
    title: string;
    description: string;
    icon: React.ComponentType;
    status: 'pending' | 'active' | 'completed';
  };
  onStepComplete?: (stepId: number) => void;
  animationDelay?: string;
}
```

**Features**:
- Progressive disclosure
- Step completion tracking
- Visual progress indicators
- Interactive step completion

### LockboxCard

**Purpose**: Access code display and instructions

**Props**:
```typescript
interface LockboxCardProps {
  accessCode: string;
  lockboxLocation: string;
  instructions: string[];
  onCodeReveal?: () => void;
  animationDelay?: string;
}
```

**Features**:
- Secure code revelation
- Location instructions
- Copy-to-clipboard functionality
- Visual security indicators

## WiFi Components (`/src/components/WiFi/`)

### WiFiNetworkCard

**Purpose**: Network information display

**Props**:
```typescript
interface WiFiNetworkCardProps {
  networkName: string;
  isConnected: boolean;
  signalStrength: 'weak' | 'medium' | 'strong';
  animationDelay?: string;
}
```

**Features**:
- Connection status indication
- Signal strength visualization
- Network identification
- Real-time status updates

### WiFiPasswordCard

**Purpose**: Password reveal and sharing

**Props**:
```typescript
interface WiFiPasswordCardProps {
  password: string;
  isRevealed: boolean;
  onReveal: () => void;
  onCopy: () => void;
  animationDelay?: string;
}
```

**Features**:
- Secure password hiding/revealing
- One-tap copy functionality
- Visual feedback for copy action
- Security-conscious design

### WiFiQrCard

**Purpose**: QR code generation for easy sharing

**Props**:
```typescript
interface WiFiQrCardProps {
  networkName: string;
  password: string;
  onShare?: () => void;
  animationDelay?: string;
}
```

**Features**:
- Dynamic QR code generation
- Mobile-optimized scanning
- Share functionality
- Visual QR code display

## Navigation Components

### BottomNavigation

**Location**: `/components/BottomNavigation.tsx`

**Props**:
```typescript
interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mode: 'guest' | 'host';
}
```

**Features**:
- Glass morphism background
- Mode-specific tab sets
- Active state indication
- Touch-optimized sizing

**Guest Tabs**: Home, Explore, Essentials, Chat, Profile
**Host Tabs**: Dashboard, Property, Bookings, Messages, Earnings

### TopBar

**Location**: `/src/components/TopBar/TopBar.tsx`

**Props**:
```typescript
interface TopBarProps {
  title: string;
  onBack?: () => void;
  onBackToOnboarding?: () => void;
  showBackButton?: boolean;
  actions?: React.ReactNode;
}
```

**Features**:
- Consistent header styling
- Back navigation handling
- Action button integration
- Glass morphism styling

## Modal System

### CardDetailsModal

**Location**: `/components/CardDetailsModal.tsx`

**Props**:
```typescript
interface CardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}
```

**Features**:
- Rich content display
- Backdrop blur effects
- Smooth animations
- Mobile-optimized sizing

**Modal Types**:
- `venue` - Restaurant/attraction details
- `event` - Event information
- `recommendation` - Host tips
- `offer` - Special promotions

## Utility Components

### ImageWithFallback

**Location**: `/components/figma/ImageWithFallback.tsx`

**Purpose**: Robust image loading with fallback handling

**Props**:
```typescript
interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}
```

**Features**:
- Automatic fallback on load error
- Loading state handling
- Accessibility compliance
- Performance optimization

### GridPageTemplate

**Location**: `/src/components/GridPageTemplate/GridPageTemplate.tsx`

**Purpose**: Consistent page layout wrapper

**Props**:
```typescript
interface GridPageTemplateProps {
  title: string;
  children: React.ReactNode;
  onBack: () => void;
  onBackToOnboarding?: () => void;
  onNavigate?: (screen: string) => void;
  activeTab: string;
}
```

**Features**:
- Consistent page structure
- Navigation integration
- Glass morphism styling
- Responsive layout

## Animation Components

### LoadingSpinner

**Location**: `/src/components/Loading/LoadingSpinner.tsx`

**Features**:
- Smooth rotation animation
- Theme-aware styling
- Consistent sizing
- Performance optimized

### SkeletonCard

**Location**: `/src/components/Loading/SkeletonCard.tsx`

**Features**:
- Content shape mimicking
- Subtle pulse animation
- Glass morphism styling
- Responsive sizing

## Form Components

### Input

**Location**: `/components/ui/input.tsx`

**Features**:
- Glass morphism styling
- Focus state handling
- Error state indication
- Accessibility compliance

### Button (Enhanced)

**Interactive States**:
- `.button-press:active` - Press animation
- `.glass-button:hover` - Glass hover effect
- Focus indicators for accessibility

**Light Mode Adaptations**:
- Reduced effects
- Higher contrast
- Clean, minimal styling

## Component Usage Patterns

### Standard Component Structure

```typescript
interface ComponentProps {
  // Required props
  data: ComponentData;
  
  // Optional interaction handlers
  onClick?: () => void;
  onNavigate?: (screen: string) => void;
  
  // Styling and behavior
  className?: string;
  animationDelay?: string;
  variant?: 'default' | 'alternative';
}

export const ComponentName: React.FC<ComponentProps> = ({
  data,
  onClick,
  onNavigate,
  className = '',
  animationDelay = '0s',
  variant = 'default'
}) => {
  // Component logic
  
  return (
    <div 
      className={`glass-card ${className}`}
      style={{ animationDelay }}
      onClick={onClick}
    >
      {/* Component content */}
    </div>
  );
};
```

### Animation Integration

```typescript
// Standard animation delays for staggered effects
const animationDelays = {
  hero: '0.1s',
  primary: '0.2s',
  secondary: '0.3s',
  tertiary: '0.4s'
};

// Usage in component lists
{items.map((item, index) => (
  <ComponentName
    key={item.id}
    data={item}
    animationDelay={`${index * 0.1}s`}
  />
))}
```

### Theme Adaptation

```typescript
// Theme-aware styling
const { theme } = useTheme();
const isDarkMode = theme === 'dark';

// Conditional styling
className={`
  glass-card
  ${isDarkMode ? 'dark:bg-white/5' : 'light:bg-black/5'}
  ${isDarkMode ? 'dark:text-white' : 'light:text-gray-900'}
`}
```

## Design System Compliance

### Required Elements

1. **Glass Effects**: All cards must use `.glass-card` or equivalent
2. **Spacing**: Follow 8px grid system (p-4, p-6, gap-4, etc.)
3. **Typography**: Use default HTML elements, no custom font sizing
4. **Icons**: Lucide React only, iOS Blue color
5. **Animations**: 120-240ms duration, subtle effects only

### Accessibility Standards

1. **Touch Targets**: Minimum 44px for interactive elements
2. **Contrast**: WCAG AA compliance for all text
3. **Focus States**: Visible focus indicators
4. **Screen Readers**: Proper ARIA labels and semantic markup

### Performance Guidelines

1. **Lazy Loading**: Non-critical components and images
2. **Memoization**: Expensive renders and calculations
3. **Bundle Optimization**: Dynamic imports for large components
4. **Animation Optimization**: Hardware-accelerated properties only

This component catalog ensures consistent implementation across the StayWise application while maintaining the sophisticated liquid glass morphism design system.
