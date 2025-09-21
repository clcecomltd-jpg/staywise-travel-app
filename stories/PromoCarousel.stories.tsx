import type { Meta, StoryObj } from '@storybook/react';
import PromoCarousel, { PromoData } from '../src/components/home/PromoCarousel';

const meta = {
  title: 'Home/PromoCarousel',
  component: PromoCarousel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Horizontal scrolling carousel for promotional offers and deals. Features auto-play, navigation controls, accessibility support, and smooth snapping scroll behavior.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    promos: {
      control: 'object',
      description: 'Array of promotional offers to display'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    },
    autoPlay: {
      control: 'boolean',
      description: 'Enable automatic slideshow progression'
    },
    autoPlayInterval: {
      control: 'number',
      description: 'Interval in milliseconds between auto-advancing slides'
    }
  }
} satisfies Meta<typeof PromoCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample promo data for stories
const samplePromos: PromoData[] = [
  {
    id: "1",
    title: "Sunset Rooftop Dinner",
    tag: "Exclusive",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop",
    ctaLabel: "Reserve Spot",
    href: "/book/sunset-dinner",
    description: "Enjoy a romantic dinner with panoramic city views",
    price: "From $89",
    rating: 4.9,
    duration: "2 hours",
    location: "Sky Bar Bangkok"
  },
  {
    id: "2",
    title: "Temple Tour Experience",
    tag: "Cultural",
    image: "https://images.unsplash.com/photo-1563492065426-d6d4d8b6d9e4?w=400&h=300&fit=crop",
    ctaLabel: "Book Tour",
    href: "/book/temple-tour",
    description: "Guided tour of Bangkok's most sacred temples",
    price: "From $45",
    rating: 4.8,
    duration: "4 hours",
    location: "Wat Pho & Grand Palace"
  },
  {
    id: "3",
    title: "Floating Market Adventure",
    tag: "Local",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    ctaLabel: "Join Tour",
    href: "/book/floating-market",
    description: "Explore authentic floating markets and local life",
    price: "From $35",
    rating: 4.7,
    duration: "6 hours",
    location: "Damnoen Saduak"
  },
  {
    id: "4",
    title: "Cooking Class & Market",
    tag: "Food",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    ctaLabel: "Learn to Cook",
    href: "/book/cooking-class",
    description: "Master authentic Thai cooking techniques",
    price: "From $65",
    rating: 4.9,
    duration: "3 hours",
    location: "Local Kitchen Studio"
  },
  {
    id: "5",
    title: "Night Market Food Tour",
    tag: "Food",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    ctaLabel: "Taste Local",
    href: "/book/food-tour",
    description: "Discover the best street food in Bangkok",
    price: "From $25",
    rating: 4.6,
    duration: "3 hours",
    location: "Chatuchak Market"
  }
];

const minimalPromos: PromoData[] = [
  {
    id: "min1",
    title: "Quick Experience",
    tag: "Simple",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    ctaLabel: "Go",
    href: "/minimal"
  },
  {
    id: "min2",
    title: "Another Option",
    tag: "Basic",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    ctaLabel: "Try It",
    href: "/basic"
  }
];

export const Default: Story = {
  args: {
    promos: samplePromos
  }
};

export const AutoPlayDisabled: Story = {
  args: {
    promos: samplePromos,
    autoPlay: false
  }
};

export const FastAutoPlay: Story = {
  args: {
    promos: samplePromos,
    autoPlay: true,
    autoPlayInterval: 2000
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel with fast auto-play interval (2 seconds)'
      }
    }
  }
};

export const MinimalPromos: Story = {
  args: {
    promos: minimalPromos
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel with minimal promo data (only required fields)'
      }
    }
  }
};

export const SinglePromo: Story = {
  args: {
    promos: [samplePromos[0]]
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel with only one promotional offer'
      }
    }
  }
};

export const EmptyState: Story = {
  args: {
    promos: []
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel with no promotional offers (uses default fallback)'
      }
    }
  }
};

export const CustomClassName: Story = {
  args: {
    promos: samplePromos.slice(0, 3),
    className: 'bg-blue-50 p-6 rounded-xl'
  }
};

// Mobile viewport
export const Mobile: Story = {
  args: {
    promos: samplePromos
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

// Tablet viewport
export const Tablet: Story = {
  args: {
    promos: samplePromos
  },
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
  args: {
    promos: samplePromos
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

// Dark mode
export const DarkMode: Story = {
  args: {
    promos: samplePromos
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

// Accessibility focused
export const Accessibility: Story = {
  args: {
    promos: samplePromos
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel with full accessibility support including ARIA labels, keyboard navigation, screen reader announcements, and proper focus management.'
      }
    }
  }
};

// Performance test
export const PerformanceOptimized: Story = {
  args: {
    promos: Array.from({ length: 12 }, (_, i) => ({
      ...samplePromos[i % samplePromos.length],
      id: `perf-${i}`,
      title: `${samplePromos[i % samplePromos.length].title} ${i + 1}`
    }))
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel with many items to test performance and virtualization. Images use lazy loading.'
      }
    }
  }
};

// Interaction states
export const InteractionDemo: Story = {
  args: {
    promos: samplePromos
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover over carousel to pause auto-play. Use navigation arrows or slide indicators to navigate manually.'
      }
    }
  }
};

// Without ratings
export const WithoutRatings: Story = {
  args: {
    promos: samplePromos.map(promo => ({ ...promo, rating: undefined }))
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel with promos that do not include rating information'
      }
    }
  }
};

// Long descriptions
export const LongDescriptions: Story = {
  args: {
    promos: samplePromos.map(promo => ({
      ...promo,
      description: `${promo.description} This is additional text to demonstrate how the carousel handles longer descriptions with proper text truncation and line clamping.`
    }))
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel with long descriptions to test text truncation'
      }
    }
  }
};