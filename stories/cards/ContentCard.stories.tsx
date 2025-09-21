import type { Meta, StoryObj } from '@storybook/react';
import { ContentCard, ContentCardProps } from '../../src/components/cards/ContentCard';

const meta = {
  title: 'Cards/ContentCard',
  component: ContentCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Arg types inferred from component props
  }
} satisfies Meta<typeof ContentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs: ContentCardProps = {
  id: "story-card-1",
  image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
  title: "A Culinary Journey",
  subtitle: "Explore the tastes of the world",
  description: "A detailed description of the culinary experience, highlighting the key features and what makes it unique.",
  rating: 4.8,
  price: "$99",
  priceFrom: true,
  meta: {
    location: "Downtown",
    duration: "3 hours",
    category: "Food & Drink"
  },
  actions: {
    primary: { label: "Book Now", onClick: () => alert("Booked!") },
    secondary: { label: "Details", onClick: () => alert("Viewing details...") }
  },
  onFavorite: (id) => alert(`Toggled favorite for ${id}`),
  isFavorite: false
};

export const Default: Story = {
  args: {
    ...defaultArgs
  }
};

export const Minimal: Story = {
  args: {
    id: "minimal-card",
    image: "https://images.unsplash.com/photo-1540206395-68808572332f?w=400&h=300&fit=crop",
    title: "Mountain View"
  }
};

export const WithFavorite: Story = {
  args: {
    ...defaultArgs,
    isFavorite: true
  }
};

export const NoActions: Story = {
  args: {
    ...defaultArgs,
    actions: undefined
  }
};

export const EasyDifficulty: Story = {
  args: {
    ...defaultArgs,
    id: "easy-card",
    title: "Easy Hiking Trail",
    meta: {
      ...defaultArgs.meta,
      difficulty: 'Easy'
    }
  }
};

export const MediumDifficulty: Story = {
  args: {
    ...defaultArgs,
    id: "medium-card",
    title: "Moderate Kayaking",
    meta: {
      ...defaultArgs.meta,
      difficulty: 'Medium'
    }
  }
};

export const HardDifficulty: Story = {
  args: {
    ...defaultArgs,
    id: "hard-card",
    title: "Expert Rock Climbing",
    meta: {
      ...defaultArgs.meta,
      difficulty: 'Hard'
    }
  }
};

export const LightMode: Story = {
  args: {
    ...defaultArgs,
    isDarkMode: false,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};