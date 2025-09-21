import type { Meta, StoryObj } from '@storybook/react';
import QuickActionsGrid from '../src/components/home/QuickActionsGrid';

const meta = {
  title: 'Home/QuickActionsGrid',
  component: QuickActionsGrid,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Interactive 3D grid of quick action tiles with smart deep-linking. Features pressable cards with depth, hover states, and navigation integration.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  }
} satisfies Meta<typeof QuickActionsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};

export const CustomClassName: Story = {
  args: {
    className: 'bg-blue-50 p-4 rounded-lg'
  }
};

// Mobile viewport
export const Mobile: Story = {
  args: {},
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

// Tablet viewport - shows 3 columns
export const Tablet: Story = {
  args: {},
  parameters: {
    viewport: {
      name: 'tablet',
      styles: {
        width: '768px',
        height: '1024px'
      }
    }
  }
};

// Desktop viewport
export const Desktop: Story = {
  args: {},
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

// Dark mode
export const DarkMode: Story = {
  args: {},
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

// Interaction test
export const InteractionStates: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates hover and press states of the grid tiles. Hover to see glow effects, click to see press feedback.'
      }
    }
  }
};

// Accessibility focused
export const Accessibility: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'All tiles have proper ARIA labels, keyboard navigation support, and screen reader compatibility. Icons are marked as decorative.'
      }
    }
  }
};

// Performance test with reduced motion
export const ReducedMotion: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Respects prefers-reduced-motion user preference by disabling transforms and animations.'
      }
    }
  },
  decorators: [
    (Story) => (
      <div style={{ ['--duration-normal' as any]: '0ms' }}>
        <Story />
      </div>
    )
  ]
};

// Long-press simulation (mobile)
export const HapticFeedback: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'On mobile devices, tapping tiles provides haptic feedback via navigator.vibrate() when available.'
      }
    }
  }
};

// Deep links showcase
export const DeepLinkMapping: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Each tile navigates to its corresponding route with proper query parameters: Explore → /explore?tab=activities, Restaurants → /explore?tab=restaurants, etc.'
      }
    }
  }
};