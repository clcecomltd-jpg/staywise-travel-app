// Onboarding Constants and Configuration
export const ONBOARDING_CONFIG = {
  // Animation timings
  ANIMATION_DELAYS: {
    HERO_APPEAR: 0,
    CARD_STAGGER: 120,
    CONFETTI_START: 300,
    AUTO_ADVANCE: 2000,
    ACCORDION_EXPAND: 600,
  },

  // Screen dimensions and spacing
  LAYOUT: {
    MAX_WIDTH: '430px',
    TOP_PADDING: '88px',
    SIDE_PADDING: '20px',
    CARD_GAP: '16px',
    SAFE_AREA_BOTTOM: '24px',
  },

  // Progress indicators
  PROGRESS: {
    BAR_HEIGHT: '8px',
    DOT_SIZE: '8px',
    TRACK_WIDTH: '192px',
  },

  // Color tokens
  COLORS: {
    PRIMARY: '#007AFF',
    SECONDARY: '#5856D6',
    SUCCESS: '#34D399',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    GLASS_BG: 'rgba(255, 255, 255, 0.1)',
    GLASS_BORDER: 'rgba(255, 255, 255, 0.1)',
    SELECTED_BG: 'rgba(59, 130, 246, 0.15)',
    SELECTED_BORDER: 'rgba(59, 130, 246, 0.5)',
  },

  // Typography - Standardized across all screens
  TYPOGRAPHY: {
    HERO_TITLE: '36px',        // Main title on welcome/splash screens
    PAGE_TITLE: '32px',        // Page titles on other screens
    CARD_TITLE: '20px',        // Card titles
    BODY_TEXT: '16px',         // Body text and subtitles
    SMALL_TEXT: '14px',        // Small descriptive text
    CAPTION: '12px',           // Captions and labels
  },

  // Icon and visual elements - Standardized across all screens
  VISUAL: {
    COMPASS_SIZE: '128px',     // Standard compass icon size (w-32 h-32)
    COMPASS_GLOW: 'drop-shadow(0 0 32px rgba(255, 215, 0, 0.45))',
    COMPASS_TRANSFORM: 'perspective(1000px) rotateX(8deg)',
    COMPASS_FILTER: 'brightness(1.1) contrast(1.05)',
  },

  // Background styling - Standardized across all screens
  BACKGROUND: {
    OVERLAY_GRADIENT: 'linear-gradient(180deg, #0A0F1E 0%, #000000 100%)',
    OVERLAY_OPACITY: 0.4,
    GLASS_BG: 'rgba(255, 255, 255, 0.1)',
    GLASS_BORDER: 'rgba(255, 255, 255, 0.1)',
    GLASS_BLUR: 'blur(16px)',
  },

  // Step configuration
  STEPS: {
    GUEST: {
      TOTAL: 4,
      LABELS: {
        1: 'Welcome',
        2: 'Benefits',
        3: 'Trip Purpose',
        4: 'Preferences',
      }
    },
    HOST: {
      TOTAL: 5,
      LABELS: {
        1: 'Welcome',
        2: 'Benefits',
        3: 'Property Setup',
        4: 'Goals',
        5: 'Completion',
      }
    }
  }
};

// Content configurations
export const ONBOARDING_CONTENT = {
  GUEST: {
    BENEFITS: [
      {
        id: 'smart-checkin',
        icon: 'MapPin',
        title: 'Smart Check-In',
        subtitle: 'Complete arrival in under 2 minutes',
        description: 'Skip the front desk with our streamlined digital check-in process.'
      },
      {
        id: 'local-gems',
        icon: 'Heart',
        title: 'Hidden Local Gems',
        subtitle: 'Discover spots 90% of tourists miss',
        description: 'Access curated recommendations from verified local insiders.'
      },
      {
        id: 'offline-maps',
        icon: 'Compass',
        title: 'Offline Navigation',
        subtitle: 'Never get lost, even without internet',
        description: 'Download offline maps with turn-by-turn directions to your destinations.'
      },
      {
        id: 'instant-help',
        icon: 'HelpCircle',
        title: 'Instant Host Support',
        subtitle: 'Get help in under 5 minutes',
        description: 'Direct line to your host with guaranteed response times.'
      },
      {
        id: 'personalized-tips',
        icon: 'User',
        title: 'Personalized Recommendations',
        subtitle: 'Tailored to your travel style',
        description: 'AI-powered suggestions based on your preferences and past trips.'
      }
    ],

    TRIP_PURPOSES: [
      {
        id: 'city-break',
        icon: 'Building2',
        title: 'City Break',
        description: 'Explore urban attractions, museums, and city culture'
      },
      {
        id: 'foodie-adventure',
        icon: 'Utensils',
        title: 'Foodie Adventure',
        description: 'Discover local cuisine, restaurants, and food experiences'
      },
      {
        id: 'relax-escape',
        icon: 'TreePalm',
        title: 'Relax & Escape',
        description: 'Unwind with peaceful activities and tranquil locations'
      },
      {
        id: 'nightlife',
        icon: 'Music4',
        title: 'Nightlife',
        description: 'Experience bars, clubs, and evening entertainment'
      },
      {
        id: 'culture-history',
        icon: 'Landmark',
        title: 'Culture & History',
        description: 'Explore heritage sites, traditions, and historical attractions'
      }
    ],

    PREFERENCES: [
      {
        id: 'budget-friendly',
        icon: 'Wallet',
        title: 'Budget-Friendly',
        description: 'Save money with free activities and affordable options'
      },
      {
        id: 'premium-comfort',
        icon: 'Star',
        title: 'Premium Comfort',
        description: 'Enjoy luxury experiences and high-end amenities'
      },
      {
        id: 'authentic-food',
        icon: 'UtensilsCrossed',
        title: 'Authentic Cuisine',
        description: 'Taste traditional dishes and local specialties'
      },
      {
        id: 'instagram-worthy',
        icon: 'Camera',
        title: 'Photo Opportunities',
        description: 'Find the most photogenic spots and viewpoints'
      },
      {
        id: 'family-friendly',
        icon: 'Users',
        title: 'Family Activities',
        description: 'Kid-friendly attractions and family experiences'
      }
    ]
  },

  HOST: {
    BENEFITS: [
      {
        id: 'guest-analytics',
        icon: 'BarChart3',
        title: 'Guest Satisfaction Analytics',
        subtitle: 'Track and improve guest experience',
        description: 'Real-time insights into guest satisfaction with actionable recommendations.'
      },
      {
        id: 'automated-guides',
        icon: 'Share2',
        title: 'Automated Guide Sharing',
        subtitle: 'Save 3+ hours per guest',
        description: 'Automatically send personalized guides to guests upon booking confirmation.'
      },
      {
        id: 'centralized-control',
        icon: 'Settings',
        title: 'Centralized Property Hub',
        subtitle: 'Manage everything in one place',
        description: 'Control all property information, amenities, and guest communications.'
      },
      {
        id: 'guest-delight',
        icon: 'Smile',
        title: 'Exceed Guest Expectations',
        subtitle: 'Boost ratings by 0.3+ stars',
        description: 'Surprise guests with personalized recommendations and local insights.'
      },
      {
        id: 'revenue-optimization',
        icon: 'TrendingUp',
        title: 'Revenue Optimization',
        subtitle: 'Increase bookings by 15%',
        description: 'Leverage guest data to optimize pricing and improve listing appeal.'
      }
    ],

    PROPERTY_PROVIDERS: [
      {
        id: 'airbnb',
        name: 'Airbnb',
        description: 'Import from your Airbnb listing',
        icon: '🏠'
      },
      {
        id: 'vrbo',
        name: 'VRBO',
        description: 'Import from your VRBO property',
        icon: '🏖️'
      },
      {
        id: 'booking',
        name: 'Booking.com',
        description: 'Import from Booking.com listing',
        icon: '🏨'
      },
      {
        id: 'manual',
        name: 'Manual Entry',
        description: 'Enter property details manually',
        icon: '✏️'
      }
    ],

    GOALS: [
      {
        id: 'improve-ratings',
        icon: 'Star',
        title: 'Improve Guest Ratings',
        description: 'Increase property ratings and positive reviews'
      },
      {
        id: 'save-time',
        icon: 'Clock',
        title: 'Save Communication Time',
        description: 'Reduce time spent answering guest questions'
      },
      {
        id: 'increase-bookings',
        icon: 'TrendingUp',
        title: 'Increase Bookings',
        description: 'Attract more guests with better service'
      },
      {
        id: 'automate-workflows',
        icon: 'Settings',
        title: 'Automate Guest Experience',
        description: 'Streamline check-in and guest communication'
      },
      {
        id: 'local-partnerships',
        icon: 'Building2',
        title: 'Build Local Partnerships',
        description: 'Connect with local businesses for guest benefits'
      }
    ]
  }
};

// Accessibility constants
export const A11Y_CONFIG = {
  FOCUS_RING: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  SCREEN_READER_ONLY: 'sr-only',
  MIN_TOUCH_TARGET: '44px',
  ARIA_LABELS: {
    SKIP_TO_CONTENT: 'Skip to main content',
    PROGRESS_BAR: 'Onboarding progress',
    MODE_SELECTION: 'Select your user type',
    NAVIGATION_MENU: 'Navigation menu',
    BACK_BUTTON: 'Go back to previous step',
    CONTINUE_BUTTON: 'Continue to next step',
    CLOSE_BUTTON: 'Close onboarding',
  }
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection and try again.',
  VALIDATION_ERROR: 'Please complete all required fields before continuing.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  IMPORT_ERROR: 'Unable to import property data. You can enter details manually instead.',
};