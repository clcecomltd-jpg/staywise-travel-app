import type { Meta, StoryObj } from '@storybook/react';
import { ActivityCard, ActivityCardProps } from '../../src/components/cards/ActivityCard';

const meta = {
  title: 'Cards/ActivityCard',
  component: ActivityCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Arg types for ActivityCard props
  }
} satisfies Meta<typeof ActivityCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs: ActivityCardProps = {
  id: "activity-story-1",
  image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&h=300&fit=crop",
  title: "Jungle Ziplining Adventure",
  duration: "Half-day",
  location: "Rainforest Eco Park",
  difficulty: 'Medium',
  category: "Adventure",
  price: "$120",
  rating: 4.9,
  onBook: () => alert("Booking..."),
  onViewDetails: () => alert("Showing details..."),
  description: "Soar through the canopy and experience the thrill of the jungle from above."
};

export const Default: Story = {
  args: {
    ...defaultArgs
  }
};

export const EasyActivity: Story = {
  args: {
    ...defaultArgs,
    id: "easy-activity",
    title: "Botanical Garden Walk",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1587280501635-3c09ea4d18c9?w=400&h=300&fit=crop",
  }
};

export const HardActivity: Story = {
  args: {
    ...defaultArgs,
    id: "hard-activity",
    title: "Mountain Summit Climb",
    difficulty: "Hard",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
  }
};

export const WithCapacity: Story = {
  args: {
    ...defaultArgs,
    id: "capacity-activity",
    capacity: 12
  }
};

export const NoBooking: Story = {
  args: {
    ...defaultArgs,
    id: "no-booking-activity",
    onBook: undefined
  }
};