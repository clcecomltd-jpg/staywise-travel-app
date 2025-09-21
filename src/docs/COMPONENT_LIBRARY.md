# StayWise Component Library

## Overview
The StayWise component library follows a hierarchical structure with UI components as building blocks and feature components as composed, domain-specific elements.

## Component Architecture

```
Components
├── ui/                    # Basic building blocks
│   ├── cards/            # Reusable card components
│   ├── forms/            # Form inputs and controls
│   ├── grids/            # Layout and grid components
│   └── base/             # Shadcn/ui foundation components
├── features/             # Domain-specific components
│   ├── navigation/       # App navigation
│   ├── interactive/      # Complex interactions
│   ├── onboarding/       # Onboarding flow
│   ├── recommendations/  # Recommendation system
│   └── location/         # Location-based features
└── providers/            # Context providers
```

## UI Components (`/src/components/ui/`)

### Cards (`/ui/cards/`)

#### PlaceCard
Displays place information with image, title, rating, and description.

```tsx
interface PlaceCardProps {
  place: {
    id: string;
    name: string;
    image: string;
    rating: number;
    category: string;
    description: string;
    distance?: string;
  };
  onTap?: (place: Place) => void;
  variant?: 'default' | 'compact' | 'featured';
}

// Usage
<PlaceCard 
  place={place} 
  onTap={handlePlaceSelect}
  variant="featured"
/>
```

#### EventCard
Shows event information with date, time, and booking status.

```tsx
interface EventCardProps {
  event: {
    id: string;
    title: string;
    image: string;
    date: Date;
    time: string;
    price: number;
    availableSpots: number;
  };
  onBook?: (event: Event) => void;
}
```

#### ServiceCard  
Displays available services with pricing and availability.

```tsx
interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    icon: LucideIcon;
    description: string;
    price: number;
    available: boolean;
  };
  onRequest?: (service: Service) => void;
}
```

#### HeroCard
Large featured card with gradient background and call-to-action.

```tsx
interface HeroCardProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  gradient?: 'orange' | 'blue' | 'purple';
  action?: {
    label: string;
    onTap: () => void;
  };
  children?: React.ReactNode;
}

// Usage
<HeroCard
  title="Welcome to StayWise"
  subtitle="Your personalized travel companion"
  gradient="orange"
  action={{
    label: "Get Started",
    onTap: handleGetStarted
  }}
/>
```

### Forms (`/ui/forms/`)

#### TextInput
Styled text input with validation support.

```tsx
interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  required?: boolean;
  disabled?: boolean;
}
```

#### Button
Primary button component with multiple variants.

```tsx
interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
}

// Usage
<Button 
  variant="glass" 
  size="lg" 
  icon={MapPin}
  onPress={handlePress}
>
  View on Map
</Button>
```

#### Switch
Toggle switch for settings and preferences.

```tsx
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}
```

### Grids (`/ui/grids/`)

#### CategoryTile
Square tile for category selection.

```tsx
interface CategoryTileProps {
  category: {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
    count?: number;
  };
  selected?: boolean;
  onSelect?: (category: Category) => void;
}
```

#### PromoTile
Promotional tile with offer information.

```tsx
interface PromoTileProps {
  offer: {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    discount: string;
    validUntil: Date;
  };
  onTap?: (offer: Offer) => void;
}
```

#### QuickAccessGrid
Grid layout for quick action items.

```tsx
interface QuickAccessGridProps {
  items: QuickAccessItem[];
  columns?: 2 | 3 | 4;
  onItemTap?: (item: QuickAccessItem) => void;
}

interface QuickAccessItem {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  badge?: string | number;
}
```

## Feature Components (`/src/components/features/`)

### Navigation (`/features/navigation/`)

#### TopBar
Main app header with branding and controls.

```tsx
interface TopBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: TopBarAction[];
  transparent?: boolean;
}

interface TopBarAction {
  icon: LucideIcon;
  onPress: () => void;
  badge?: string | number;
}

// Usage
<TopBar
  title="Explore"
  showBack
  onBack={handleBack}
  actions={[
    { icon: Search, onPress: handleSearch },
    { icon: Heart, onPress: handleFavorites, badge: 3 }
  ]}
/>
```

#### BottomNav
Bottom navigation with mode-specific tabs.

```tsx
interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mode: 'guest' | 'host';
  badges?: Record<string, number>;
}

// Usage
<BottomNav
  activeTab="home"
  onTabChange={handleTabChange}
  mode="guest"
  badges={{ messages: 2, bookings: 1 }}
/>
```

### Interactive (`/features/interactive/`)

#### CollapsibleQuestionTile
Expandable question with answer content.

```tsx
interface CollapsibleQuestionTileProps {
  question: string;
  answer: string | React.ReactNode;
  defaultExpanded?: boolean;
  icon?: LucideIcon;
}
```

#### ChatBubble
Message bubble for chat interfaces.

```tsx
interface ChatBubbleProps {
  message: {
    id: string;
    text: string;
    timestamp: Date;
    sender: 'user' | 'host' | 'system';
    status?: 'sending' | 'sent' | 'delivered' | 'read';
  };
  showAvatar?: boolean;
  showTimestamp?: boolean;
}
```

#### ProgressIndicator
Progress bar for multi-step processes.

```tsx
interface ProgressIndicatorProps {
  steps: number;
  currentStep: number;
  stepLabels?: string[];
  variant?: 'linear' | 'circular' | 'steps';
}
```

### Onboarding (`/features/onboarding/`)

#### OnboardingHeroCard
Welcome card for onboarding flow.

```tsx
interface OnboardingHeroCardProps {
  title: string;
  subtitle: string;
  image?: string;
  animation?: 'fade' | 'slide' | 'zoom';
}
```

#### ModePickerCard
Card for selecting guest or host mode.

```tsx
interface ModePickerCardProps {
  mode: 'guest' | 'host';
  selected: boolean;
  onSelect: (mode: 'guest' | 'host') => void;
  features: string[];
}
```

#### QuestionCard
Card for onboarding questions.

```tsx
interface QuestionCardProps {
  question: string;
  options: QuestionOption[];
  selectedOption?: string;
  onOptionSelect: (option: string) => void;
  multiSelect?: boolean;
}

interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
}
```

### Recommendations (`/features/recommendations/`)

#### RecommendationCard
Card displaying host recommendations.

```tsx
interface RecommendationCardProps {
  recommendation: {
    id: string;
    title: string;
    description: string;
    category: string;
    image?: string;
    rating?: number;
    price?: number;
    distance?: string;
    tags: string[];
  };
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  onSave?: () => void;
  onShare?: () => void;
}
```

#### CategoryChips
Horizontal scrolling category chips.

```tsx
interface CategoryChipsProps {
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect: (category: string) => void;
  variant?: 'default' | 'compact';
}
```

#### RecommendationsCarousel
Horizontal scrolling carousel of recommendations.

```tsx
interface RecommendationsCarouselProps {
  recommendations: Recommendation[];
  title?: string;
  onViewAll?: () => void;
  onRecommendationTap?: (recommendation: Recommendation) => void;
}
```

## Component Usage Guidelines

### Props Interface
All components must have well-defined TypeScript interfaces:

```tsx
interface ComponentProps {
  // Required props first
  title: string;
  onPress: () => void;
  
  // Optional props with defaults
  variant?: 'default' | 'compact';
  disabled?: boolean;
  
  // Complex types
  items: Array<{
    id: string;
    label: string;
  }>;
  
  // Event handlers
  onItemSelect?: (item: Item) => void;
  
  // Children/composition
  children?: React.ReactNode;
}
```

### Component Composition
Build complex interfaces by composing simpler components:

```tsx
// Good: Composed from smaller components
<Card className="glass-card">
  <CardHeader>
    <HeroCard title="Welcome" subtitle="Get started" />
  </CardHeader>
  <CardContent>
    <QuickAccessGrid items={quickActions} />
  </CardContent>
  <CardFooter>
    <Button variant="primary">Continue</Button>
  </CardFooter>
</Card>
```

### Styling Approach
- Use Tailwind classes for layout and spacing
- Apply design tokens through CSS custom properties
- Leverage glass effect classes from globals.css
- Never override typography unless explicitly requested

```tsx
// Good: Using design system classes
<div className="glass-card p-4 space-y-3">
  <h2>Section Title</h2>
  <p className="text-white/70">Description text</p>
  <Button className="glass-button">Action</Button>
</div>
```

### Accessibility
- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation
- Support screen readers

```tsx
<button
  className="glass-button"
  aria-label="Add to favorites"
  disabled={disabled}
  onPress={handlePress}
>
  <Heart className="w-5 h-5" />
  <span className="sr-only">Add to favorites</span>
</button>
```

### Performance
- Use React.memo for expensive renders
- Implement proper key props for lists
- Lazy load heavy components
- Optimize image loading

```tsx
const PlaceCard = React.memo<PlaceCardProps>(({ place, onTap }) => {
  return (
    <div className="glass-card" onClick={() => onTap?.(place)}>
      <img 
        src={place.image} 
        alt={place.name}
        loading="lazy"
        className="w-full h-32 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3>{place.name}</h3>
        <p className="text-white/70">{place.description}</p>
      </div>
    </div>
  );
});
```

## Component Testing

### Test Structure
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PlaceCard } from './PlaceCard';

describe('PlaceCard', () => {
  const mockPlace = {
    id: '1',
    name: 'Test Place',
    image: 'test.jpg',
    rating: 4.5,
    category: 'Restaurant',
    description: 'Test description'
  };

  it('renders place information correctly', () => {
    render(<PlaceCard place={mockPlace} />);
    
    expect(screen.getByText('Test Place')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Place');
  });

  it('calls onTap when clicked', () => {
    const handleTap = jest.fn();
    render(<PlaceCard place={mockPlace} onTap={handleTap} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleTap).toHaveBeenCalledWith(mockPlace);
  });
});
```

## Migration Guide

### From Old Structure
```tsx
// Old: Scattered components
import { PlaceCard } from '../components/PlaceCard';
import { Button } from '../components/Button';

// New: Organized structure
import { PlaceCard } from '@/components/ui/cards/PlaceCard';
import { Button } from '@/components/ui/forms/Button';
```

### Updating Imports
Run this script to update all imports:

```bash
# Find and replace import paths
find src -name "*.tsx" -exec sed -i 's|../components/|@/components/ui/base/|g' {} \;
```

## Future Enhancements

### Planned Components
- **VirtualList**: Efficient scrolling for large datasets
- **ImageGallery**: Full-screen image viewing
- **DatePicker**: Custom date selection
- **LocationPicker**: Map-based location selection
- **RatingInput**: Interactive star rating
- **FileUpload**: Drag-and-drop file uploads

### Component Variants
- Add more styling variants to existing components
- Theme-aware component variants
- Animation variants for different interaction patterns
- Responsive variants for different screen sizes