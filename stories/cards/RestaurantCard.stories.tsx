import type { Meta, StoryObj } from '@storybook/react';
import { RestaurantCard, RestaurantCardProps } from '../../src/components/cards/RestaurantCard';

const meta = {
  title: 'Cards/RestaurantCard',
  component: RestaurantCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Arg types for RestaurantCard props
  }
} satisfies Meta<typeof RestaurantCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs: RestaurantCardProps = {
  id: "restaurant-story-1",
  image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
  title: "Bistro La Belle",
  cuisine: "French",
  priceTier: "$$$",
  rating: 4.8,
  location: "Old Town",
  openHours: "18:00 - 23:00",
  distance: "10 min walk",
  onReserve: () => alert("Reserving table..."),
  onViewDetails: () => alert("Viewing menu..."),
  description: "Authentic French cuisine in a classic, cozy setting."
};

export const Default: Story = {
  args: {
    ...defaultArgs
  }
};

export const Affordable: Story = {
  args: {
    ...defaultArgs,
    id: "affordable-restaurant",
    title: "Taco Fiesta",
    cuisine: "Mexican",
    priceTier: "$",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
  }
};

export const WithSubtitle: Story = {
  args: {
    ...defaultArgs,
    id: "subtitle-restaurant",
    subtitle: "Michelin Star",
  }
};

export const NoReservation: Story = {
  args: {
    ...defaultArgs,
    id: "no-res-restaurant",
    onReserve: undefined
  }
};