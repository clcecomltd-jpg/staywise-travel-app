# ContentCard

The `ContentCard` is a versatile and standardized base component for displaying various types of content, such as activities, restaurants, events, and essentials. It provides a consistent layout and styling for images, titles, metadata, and actions.

## Overview

The `ContentCard` is designed to be extended by more specific card components like `ActivityCard` and `RestaurantCard`. It ensures a uniform user experience across different content types.

- **Standardized Layout**: Consistent structure for image, text, and actions.
- **Glassmorphism Effect**: Uses `glass-card` styling for a modern, layered look.
- **Responsive Design**: Adapts to different screen sizes.
- **Accessibility**: Built with ARIA attributes and keyboard navigation in mind.

## Props

The `ContentCard` accepts a wide range of props to accommodate different content types:

```typescript
export interface ContentCardProps {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  rating?: number;
  price?: string;
  priceFrom?: boolean;
  meta?: {
    location?: string;
    duration?: string;
    capacity?: number;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    category?: string;
  };
  actions?: {
    primary?: {
      label: string;
      onClick: () => void;
    };
    secondary?: {
      label: string;
      onClick: () => void;
    };
  };
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
  className?: string;
  isDarkMode?: boolean;
}
```

## Specializations

The `ContentCard` is extended by the following specialized components:

### ActivityCard

Used for displaying activities like tours, hikes, and classes.

- **Props**: `duration`, `location`, `capacity`, `difficulty`, `category`.
- **Actions**: `onBook`, `onViewDetails`.

### RestaurantCard

Used for displaying restaurants and dining venues.

- **Props**: `cuisine`, `priceTier`, `rating`, `location`, `openHours`, `distance`.
- **Actions**: `onReserve`, `onViewDetails`.

## Usage

### Basic `ContentCard`

```tsx
<ContentCard
  id="1"
  image="/path/to/image.jpg"
  title="Generic Content"
  description="This is a description of the content."
/>
```

### `ActivityCard`

```tsx
<ActivityCard
  id="activity-1"
  image="/path/to/activity.jpg"
  title="Go Hiking"
  duration="3 hours"
  location="National Park"
  difficulty="Medium"
  category="Outdoor"
  price="$25"
  rating={4.5}
  onBook={() => {}}
  onViewDetails={() => {}}
/>
```

### `RestaurantCard`

```tsx
<RestaurantCard
  id="restaurant-1"
  image="/path/to/restaurant.jpg"
  title="The Food Hub"
  cuisine="Italian"
  priceTier="$$"
  rating={4.8}
  location="Downtown"
  onReserve={() => {}}
  onViewDetails={() => {}}
/>
```

## Design and Styling

- **Glass Effect**: The cards use the `.glass-card` and `.glass-card-hover` classes for their background and hover states.
- **Typography**: Adheres to the typography scale defined in the design system.
- **Spacing**: Uses spacing tokens for consistent padding and margins.
- **Badges**: Includes a `DifficultyBadge` component for visually indicating the difficulty of an activity.
- **Price Indicator**: `RestaurantCard` has a `PriceTierIndicator` to show cost.

## Accessibility

- **Semantic HTML**: The card is an `<article>` element.
- **ARIA Attributes**: `aria-labelledby` connects the card to its title.
- **Favorite Button**: The favorite button has `aria-label` to indicate its state (Add/Remove from favorites).
- **Image Alt Text**: Images have descriptive `alt` text.

## Testing

Each card component has its own set of tests covering:
- Correct rendering of all props.
- Interaction with action buttons.
- Proper state changes (e.g., favorite button).
- Graceful handling of optional props.

See `src/components/cards/__tests__/` for the full test suites.

## Storybook

Storybook is used to visually test the cards in different states and with different props.

- **`ContentCard.stories.tsx`**: Shows the base card with various configurations.
- **`ActivityCard.stories.tsx`**: Demonstrates the `ActivityCard` with different activity types.
- **`RestaurantCard.stories.tsx`**: Displays the `RestaurantCard` for various restaurant examples.