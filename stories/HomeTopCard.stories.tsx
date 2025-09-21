import type { Meta, StoryObj } from '@storybook/react';
import HomeTopCard from '../src/components/home/HomeTopCard';

const meta = {
  title: 'Home/HomeTopCard',
  component: HomeTopCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Glass 3D home welcome card with property info, check-in/out times, and weather display. Features warm micro-glows and floating shadow for iOS-first experience.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    guestName: {
      control: 'text',
      description: 'Name of the guest'
    },
    propertyName: {
      control: 'text',
      description: 'Name of the property'
    },
    checkInTime: {
      control: 'text',
      description: 'Check-in time display'
    },
    checkOutTime: {
      control: 'text',
      description: 'Check-out time display'
    },
    temperatureC: {
      control: 'number',
      description: 'Temperature in Celsius (optional)'
    },
    weatherIcon: {
      control: 'select',
      options: ['sun', 'cloud', 'rain', 'storm', 'partly'],
      description: 'Weather icon type'
    },
    onPropertyClick: { action: 'property clicked' }
  }
} satisfies Meta<typeof HomeTopCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    guestName: 'Maria',
    propertyName: 'Sunset Villa Bangkok',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    temperatureC: 32,
    weatherIcon: 'sun'
  }
};

export const WithoutTemperature: Story = {
  args: {
    guestName: 'John',
    propertyName: 'Modern Loft Chiang Mai',
    checkInTime: '14:00',
    checkOutTime: '12:00'
  }
};

export const RainyWeather: Story = {
  args: {
    guestName: 'Sarah',
    propertyName: 'Beach House Phuket',
    checkInTime: '16:00',
    checkOutTime: '10:00',
    temperatureC: 28,
    weatherIcon: 'rain'
  }
};

export const GuestDefault: Story = {
  args: {
    propertyName: 'City Center Apartment',
    checkInTime: '15:30',
    checkOutTime: '11:30',
    temperatureC: 25,
    weatherIcon: 'partly'
  }
};

export const LongPropertyName: Story = {
  args: {
    guestName: 'Alexander',
    propertyName: 'Luxury Beachfront Villa with Infinity Pool',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    temperatureC: 30,
    weatherIcon: 'cloud'
  }
};

// Dark mode story
export const DarkMode: Story = {
  args: {
    guestName: 'Emma',
    propertyName: 'Mountain Retreat',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    temperatureC: 18,
    weatherIcon: 'storm'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

// Mobile viewport
export const Mobile: Story = {
  args: {
    guestName: 'Carlos',
    propertyName: 'Downtown Studio',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    temperatureC: 26,
    weatherIcon: 'sun'
  },
  parameters: {
    viewport: {
      name: 'iphonex',
      styles: {
        width: '375px',
        height: '812px'
      }
    }
  }
};

// Desktop viewport
export const Desktop: Story = {
  args: {
    guestName: 'Isabella',
    propertyName: 'Penthouse Suite',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    temperatureC: 24,
    weatherIcon: 'partly'
  },
  parameters: {
    viewport: {
      name: 'desktop',
      styles: {
        width: '1024px',
        height: '768px'
      }
    }
  }
};