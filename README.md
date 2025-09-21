# StayWise - AI-Powered Travel Companion

A modern travel application that provides personalized recommendations and seamless property management for both guests and hosts.

## 🚀 Recent Major Updates

### Enhanced Onboarding Experience (2024)

We've completely reimagined the onboarding flow with a focus on accessibility, performance, and user experience:

#### ✨ Key Improvements

- **🔧 Accessibility First**: WCAG 2.1 AA compliant with screen reader support, keyboard navigation, and focus management
- **⚡ Performance Optimized**: Lazy loading, image optimization, and reduced bundle size
- **🎯 Personalized Content**: Mode-specific messaging and recommendations
- **📊 Analytics Integration**: Comprehensive tracking for data-driven improvements
- **🎨 Consistent Design**: Unified visual language across all screens

#### 🛠️ Technical Enhancements

- **New Accessibility Components**: `AccessibleButton`, `AccessibleOptionCard`, `AccessibleProgress`
- **Enhanced Loading States**: `LoadingButton`, `OnboardingLoader`, with proper state management
- **Performance Components**: `OptimizedImage` with fallbacks and lazy loading
- **Analytics Utilities**: Comprehensive tracking for user experience optimization
- **Constants & Configuration**: Centralized design tokens and configuration

## 🏗️ Architecture

### Component Structure

```
src/
├── components/
│   ├── ui/                          # Foundational UI components
│   │   ├── accessibility-helpers.tsx # Accessibility-first components
│   │   ├── loading-states.tsx       # Loading and state management
│   │   ├── optimized-image.tsx      # Performance-optimized images
│   │   └── ...
│   ├── OnboardingFlow.tsx           # Main onboarding orchestrator
│   ├── OnboardingCompletion.tsx     # Completion screen
│   └── ...
├── constants/
│   └── onboarding.ts                # Configuration and content
├── utils/
│   └── onboarding-analytics.ts      # Analytics tracking
└── styles/
    └── globals.css                  # Enhanced accessibility styles
```

## 🎯 Onboarding Flow Features

### For Guests
- **Smart Check-In**: Complete arrival in under 2 minutes
- **Hidden Local Gems**: Discover spots 90% of tourists miss
- **Offline Navigation**: Never get lost, even without internet
- **Instant Host Support**: Get help in under 5 minutes
- **Personalized Recommendations**: AI-powered suggestions based on preferences

### For Hosts
- **Guest Satisfaction Analytics**: Track and improve guest experience
- **Automated Guide Sharing**: Save 3+ hours per guest
- **Centralized Property Hub**: Manage everything in one place
- **Exceed Guest Expectations**: Boost ratings by 0.3+ stars
- **Revenue Optimization**: Increase bookings by 15%

## 🛡️ Accessibility Features

### WCAG 2.1 AA Compliance
- **Screen Reader Support**: Comprehensive ARIA labels and descriptions
- **Keyboard Navigation**: Full keyboard accessibility with visual focus indicators
- **Color Contrast**: Meeting or exceeding 4.5:1 contrast ratios
- **Motion Preferences**: Respects `prefers-reduced-motion` settings
- **Touch Targets**: Minimum 44px touch targets for mobile accessibility

### Semantic HTML
- Proper heading hierarchy
- Fieldsets and legends for form groups
- Live regions for dynamic content
- Skip links for keyboard users

## ⚡ Performance Optimizations

### Image Optimization
- **Lazy Loading**: Images load only when needed
- **Responsive Images**: Multiple sizes for different devices
- **Fallback Systems**: Graceful degradation with color backgrounds
- **Preloading**: Critical images preloaded for smooth experience

### Bundle Optimization
- **Code Splitting**: Components loaded only when needed
- **Tree Shaking**: Unused code eliminated
- **Centralized Constants**: Reduced duplication and bundle size

## 📊 Analytics & Tracking

### Comprehensive User Journey Tracking
- **Step Progression**: Track completion rates and abandonment points
- **Error Monitoring**: Identify and fix user experience issues
- **Performance Metrics**: Monitor loading times and user interactions
- **A/B Testing Ready**: Infrastructure for optimization experiments

### Privacy-First Approach
- Local storage for debugging
- Opt-in analytics collection
- No personal data tracking without consent

## 🎨 Design System

### Glass Morphism Components
Modern glass effect UI with backdrop blur and subtle transparency:

```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

### Color System
- **Primary**: #007AFF (iOS Blue)
- **Secondary**: #5856D6 (Purple)
- **Success**: #34D399 (Green)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)

### Typography Scale
- **Hero Title**: 32px
- **Page Title**: 28px
- **Card Title**: 20px
- **Body Text**: 16px
- **Small Text**: 14px
- **Caption**: 12px

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern browser with ES6+ support

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run test         # Run tests
```

## 🧪 Testing

### Accessibility Testing
```bash
# Install accessibility tools
npm install -g @axe-core/cli

# Run accessibility tests
axe http://localhost:3000 --tags wcag2a,wcag2aa
```

### Performance Testing
```bash
# Run Lighthouse CI
npm run lighthouse

# Check bundle size
npm run analyze
```

## 📱 Browser Support

- **Chrome**: 88+
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+
- **Mobile Safari**: 14+
- **Mobile Chrome**: 88+

## 🔧 Configuration

### Environment Variables
```env
NODE_ENV=development
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NEXT_PUBLIC_API_URL=your-api-url
```

### Customization
Key configuration files:
- `src/constants/onboarding.ts` - Onboarding content and settings
- `src/styles/globals.css` - Global styles and design tokens
- `tailwind.config.js` - Tailwind CSS configuration

## 📈 Monitoring & Analytics

### Performance Monitoring
- Core Web Vitals tracking
- Bundle size monitoring
- Error rate tracking
- User experience metrics

### User Analytics
- Onboarding completion rates
- Feature usage patterns
- User journey analysis
- A/B testing results

## 🤝 Contributing

### Development Guidelines
1. **Accessibility First**: All components must meet WCAG 2.1 AA standards
2. **Performance**: Consider loading times and bundle size
3. **Mobile First**: Design for mobile devices first
4. **Type Safety**: Use TypeScript for all new code
5. **Testing**: Write tests for all new features

### Code Standards
- ESLint configuration for code quality
- Prettier for code formatting
- Conventional commits for git messages
- Component documentation required

## 📚 Documentation

- [Component Catalog](./src/COMPONENT_CATALOG.md) - Complete component reference
- [Design System](./src/docs/DESIGN_SYSTEM.md) - Design guidelines and tokens
- [Navigation Flows](./src/docs/NAVIGATION_FLOWS.md) - User journey documentation
- [API Documentation](./src/docs/API_MAPPING.md) - Backend integration guide

## 🆘 Support

### Common Issues
- **Images not loading**: Check image paths and ensure fallback URLs are set
- **Accessibility warnings**: Ensure all interactive elements have proper ARIA labels
- **Performance issues**: Use React DevTools to identify re-rendering issues

### Getting Help
- Check the [Component Catalog](./src/COMPONENT_CATALOG.md) for usage examples
- Review the [Implementation Plan](./ONBOARDING_IMPROVEMENTS_PLAN.md) for recent changes
- Create an issue with detailed reproduction steps

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspiration from Apple's Human Interface Guidelines
- Accessibility guidelines from WCAG 2.1
- Performance best practices from web.dev
- Component patterns from modern React applications