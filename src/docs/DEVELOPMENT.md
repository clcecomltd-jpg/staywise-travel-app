# StayWise Development Guide

## Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (or yarn equivalent)
- **Git**: For version control
- **VS Code**: Recommended editor with recommended extensions

### Initial Setup

```bash
# Clone the repository
git clone [repository-url]
cd staywise

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:5173
```

### Development Scripts

```bash
# Development
npm run dev                 # Start dev server with hot reload
npm run dev:host           # Start dev server accessible on network

# Building
npm run build              # Create production build
npm run preview            # Preview production build locally

# Code Quality
npm run type-check         # TypeScript type checking
npm run lint               # ESLint code analysis
npm run lint:fix           # Auto-fix ESLint issues
npm run format             # Prettier code formatting

# Testing
npm run test               # Run test suite
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
```

## Project Architecture

### Technology Stack

- **React 18**: Latest React with concurrent features
- **TypeScript**: Strict type safety throughout
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework with v4 features
- **Lucide React**: Consistent icon library
- **Motion**: Smooth animations and transitions

### Design System Integration

- **Material 3**: Google's latest design system principles
- **Liquid Glass Morphism**: Custom backdrop-blur effects
- **Adaptive Themes**: Seamless light/dark mode switching
- **8px Grid System**: Consistent spatial relationships

## Development Workflow

### Feature Development Process

1. **Branch Creation**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Component Development**
   - Follow established patterns in `/src/components/`
   - Use TypeScript for all new components
   - Apply glass morphism effects consistently
   - Implement proper accessibility features

3. **Testing**
   ```bash
   npm run type-check     # Verify TypeScript
   npm run lint           # Check code quality
   npm run test           # Run test suite
   ```

4. **Code Review**
   - Create pull request with detailed description
   - Ensure design system compliance
   - Verify cross-device compatibility
   - Test theme switching functionality

### Design System Compliance

#### Critical Rules (Non-Negotiable)

1. **Never modify design tokens** without explicit approval
2. **Preserve liquid glass specifications** exactly as defined
3. **Use only existing color tokens** from the design system
4. **Follow typography rules strictly** - no Tailwind font classes unless requested
5. **Maintain 8px spacing grid** throughout all layouts
6. **Use Lucide icons exclusively** with iOS Blue color (#007AFF)
7. **Implement subtle animations only** - no bounce or elastic effects

#### Component Requirements

```typescript
// ✅ Correct: Following design system
<div className="glass-card p-4 space-y-3">
  <h3 className="text-foreground">Title</h3>
  <p className="text-muted-foreground">Description</p>
</div>

// ❌ Incorrect: Custom styling
<div className="bg-blue-500 p-3 text-xl font-bold">
  <h3>Title</h3>
</div>
```

### File Organization Standards

#### Component Structure

```
src/components/FeatureName/
├── index.tsx                    # Main component export
├── ComponentName.tsx            # Individual components
├── SubComponent.tsx             # Related components
└── README.md                    # Component documentation
```

#### File Naming Conventions

- **Components**: PascalCase (`ComponentName.tsx`)
- **Pages**: PascalCase (`PageName.tsx`) 
- **Hooks**: camelCase with `use` prefix (`useCustomHook.ts`)
- **Types**: PascalCase (`TypeDefinition.ts`)
- **Utilities**: camelCase (`utilityFunction.ts`)

### Code Standards

#### TypeScript Guidelines

```typescript
// ✅ Proper interface definition
interface ComponentProps {
  title: string;
  subtitle?: string;
  onAction: (id: string) => void;
  animationDelay?: string;
}

// ✅ Proper component typing
export const ComponentName: React.FC<ComponentProps> = ({
  title,
  subtitle,
  onAction,
  animationDelay = '0s'
}) => {
  // Component implementation
};

// ✅ Proper hook typing
const useCustomHook = (initialValue: string): [string, (value: string) => void] => {
  const [state, setState] = useState(initialValue);
  return [state, setState];
};
```

#### Import Organization

```typescript
// 1. React and React ecosystem
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { motion } from 'motion/react';
import { Search, Heart, MapPin } from 'lucide-react';

// 3. Internal UI components
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

// 4. Internal feature components
import { TipCard } from '../LocalTips/TipCard';
import { CategoryChips } from '../LocalTips/CategoryChips';

// 5. Hooks and utilities
import { useTheme } from '../providers/ThemeController';
import { useLocalStorage } from '../../hooks/useLocalStorage';

// 6. Types and constants
import type { LocalTip } from '../../types/LocalTip';
import { ANIMATION_DELAYS } from '../../constants/animations';
```

#### Glass Morphism Implementation

```typescript
// ✅ Correct glass effect usage
<div className="glass-card rounded-2xl overflow-hidden">
  <div className="relative aspect-[16/9]">
    <img src={image} alt={title} className="w-full h-full object-cover" />
    <div className="absolute top-2 left-2">
      <Badge className="glass-button text-white border-white/20">
        {category}
      </Badge>
    </div>
  </div>
  <div className="p-4 space-y-3">
    {/* Content */}
  </div>
</div>
```

### Theme Development

#### Theme-Aware Components

```typescript
const { theme } = useTheme();
const isDarkMode = theme === 'dark';

// Theme-conscious styling
const textClass = isDarkMode ? 'text-white/95' : 'text-gray-900';
const bgClass = isDarkMode ? 'bg-white/5' : 'bg-black/5';
```

#### Light Mode Considerations

- **No glow effects**: Remove all glow animations in light mode
- **Higher contrast**: Ensure proper text contrast ratios
- **Subtle shadows**: Use minimal box-shadow effects
- **Clean aesthetics**: Focus on clarity over effects

#### Dark Mode Enhancements

- **Subtle glows**: Enhance with gentle glow effects
- **Enhanced blur**: Stronger backdrop-filter effects
- **Rich shadows**: Use deeper shadow effects for depth

### Animation Guidelines

#### Performance Standards

```typescript
// ✅ Hardware-accelerated animations
const motionConfig = {
  initial: { opacity: 0, transform: 'translateY(20px)' },
  animate: { opacity: 1, transform: 'translateY(0)' },
  transition: { duration: 0.24, ease: [0.4, 0, 0.2, 1] }
};

// ✅ Staggered animations
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.24 }}
  >
    <ComponentName data={item} />
  </motion.div>
))}
```

#### Animation Timing

- **Micro-interactions**: 120ms for button states
- **Component entrance**: 240ms for cards and modals
- **Page transitions**: 300ms for screen changes
- **Loading states**: 500ms+ for loading indicators

### Accessibility Implementation

#### Required Practices

```typescript
// ✅ Proper semantic markup
<button
  className="glass-button"
  onClick={handleAction}
  aria-label="Add to favorites"
  aria-pressed={isFavorited}
>
  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
</button>

// ✅ Keyboard navigation
<div
  className="glass-card cursor-pointer"
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
  role="button"
  aria-label={`View details for ${title}`}
>
```

#### Touch Target Requirements

- **Minimum size**: 44px for all interactive elements
- **Adequate spacing**: 8px minimum between touch targets
- **Visual feedback**: Clear pressed states for touch interactions

### Performance Optimization

#### Code Splitting

```typescript
// ✅ Lazy loading for pages
const LocalTipsPage = lazy(() => import('../pages/LocalTips/LocalTipsPage'));
const CheckInPage = lazy(() => import('../pages/CheckIn/CheckInPage'));

// ✅ Dynamic imports for heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

#### Image Optimization

```typescript
// ✅ Using ImageWithFallback
import { ImageWithFallback } from '../figma/ImageWithFallback';

<ImageWithFallback
  src={tip.image}
  alt={tip.title}
  className="w-full h-full object-cover"
  fallbackSrc="/images/placeholder.jpg"
/>
```

#### Memory Management

```typescript
// ✅ Proper cleanup in useEffect
useEffect(() => {
  const controller = new AbortController();
  
  fetchData(controller.signal).then(setData);
  
  return () => {
    controller.abort();
  };
}, []);

// ✅ Memoization for expensive calculations
const expensiveValue = useMemo(() => {
  return performExpensiveCalculation(data);
}, [data]);
```

## Testing Strategy

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { TipCard } from '../TipCard';

describe('TipCard', () => {
  const mockTip = {
    id: 1,
    title: 'Test Restaurant',
    description: 'Great food',
    image: 'test.jpg',
    rating: 4.5,
    // ... other required fields
  };

  test('renders tip information correctly', () => {
    render(<TipCard tip={mockTip} />);
    
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    expect(screen.getByText('Great food')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  test('handles favorite toggle', () => {
    const onToggleFavorite = jest.fn();
    render(
      <TipCard 
        tip={mockTip} 
        onToggleFavorite={onToggleFavorite}
      />
    );
    
    fireEvent.click(screen.getByLabelText(/favorite/i));
    expect(onToggleFavorite).toHaveBeenCalledWith(1, true);
  });
});
```

### Visual Regression Testing

```typescript
// Example with Storybook and Chromatic
export default {
  title: 'Components/TipCard',
  component: TipCard,
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0f0f0f' },
      ],
    },
  },
};

export const Default = {
  args: {
    tip: mockTipData,
  },
};

export const WithHostNote = {
  args: {
    tip: { ...mockTipData, hostNote: "This is my favorite spot!" },
  },
};
```

## Debugging and Troubleshooting

### Common Issues

#### Glass Effects Not Appearing

```css
/* Ensure backdrop-filter support */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  /* Fallback for unsupported browsers */
  background: rgba(255, 255, 255, 0.1);
}
```

#### Animation Performance Issues

```typescript
// ✅ Use transform and opacity for 60fps animations
.animate-card {
  transform: translateY(0);
  opacity: 1;
  transition: transform 0.24s ease, opacity 0.24s ease;
}

// ❌ Avoid animating layout properties
.slow-animation {
  height: 200px; /* Don't animate */
  width: 100%;   /* Don't animate */
}
```

#### Theme Switching Problems

```typescript
// ✅ Ensure theme persistence
const { theme, setTheme } = useTheme();

useEffect(() => {
  localStorage.setItem('theme', theme);
}, [theme]);
```

### Development Tools

#### Browser DevTools Setup

1. **React DevTools**: Install for component inspection
2. **Accessibility Insights**: Check a11y compliance
3. **Lighthouse**: Monitor performance metrics
4. **Chrome DevTools**: Use Performance tab for animation profiling

#### VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## Deployment

### Build Process

```bash
# Production build
npm run build

# Verify build locally
npm run preview

# Check bundle size
npm run build:analyze
```

### Environment Configuration

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['motion/react'],
          icons: ['lucide-react'],
        },
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
```

### Performance Monitoring

```typescript
// Core Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Contributing Guidelines

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-component
   ```

2. **Follow Naming Convention**
   - `feature/component-name` for new features
   - `fix/issue-description` for bug fixes
   - `docs/section-name` for documentation

3. **Commit Message Format**
   ```
   type(scope): description

   feat(tips): add favorite functionality to TipCard
   fix(theme): resolve glass effects in light mode
   docs(readme): update setup instructions
   ```

4. **Pre-PR Checklist**
   - [ ] TypeScript compilation passes
   - [ ] All tests pass
   - [ ] Design system compliance verified
   - [ ] Cross-browser testing completed
   - [ ] Accessibility requirements met
   - [ ] Performance impact assessed

### Code Review Criteria

- **Design System Compliance**: Verify glass effects and spacing
- **TypeScript Coverage**: Ensure proper typing throughout
- **Performance Impact**: Check for optimization opportunities
- **Accessibility**: Verify keyboard navigation and screen reader support
- **Mobile Responsiveness**: Test on various screen sizes
- **Theme Compatibility**: Verify both light and dark modes

This development guide ensures consistent, high-quality contributions to the StayWise project while maintaining the sophisticated design system and user experience standards.