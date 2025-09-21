# Performance Optimization Priorities
*StayWise Production Performance Roadmap*

## Top 5 Critical Bottlenecks

### 🚨 Priority 1: Bundle Splitting & Code Splitting
**Target: Reduce initial bundle from 1.08MB to <500KB**
**Timeline: 3-5 days**
**LCP Impact: -800ms, TBT: -400ms**

#### Implementation Steps:

1. **Configure Vite Manual Chunks** (Day 1)
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            // ... other Radix UI components
          ],
          charts: ['recharts'],
          icons: ['lucide-react'],
          utils: ['clsx', 'class-variance-authority', 'tailwind-merge']
        }
      }
    }
  }
});
```

2. **Implement Route-Based Lazy Loading** (Day 2-3)
```typescript
// src/components/TravelGuideApp.tsx
const MainApp = lazy(() => import('./MainApp'));
const MainHostApp = lazy(() => import('./MainHostApp'));
const StreamlinedOnboardingFlow = lazy(() => import('./StreamlinedOnboardingFlow'));

// Add Suspense boundaries
<Suspense fallback={<LoadingSpinner size="lg" text="Loading app..." />}>
  {userMode === 'host' ? (
    <MainHostApp onboardingData={onboardingData} onBack={handleBackToOnboarding} />
  ) : (
    <MainApp onboardingData={onboardingData} onBackToOnboarding={handleBackToOnboarding} />
  )}
</Suspense>
```

3. **Page-Level Code Splitting** (Day 4-5)
```typescript
// src/components/MainApp.tsx
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const ExploreScreen = lazy(() => import('./screens/ExploreScreen'));
const FavoritesScreen = lazy(() => import('./screens/FavoritesScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));

// Implement preloading on route hover
const preloadComponent = (componentImport: () => Promise<any>) => {
  componentImport();
};
```

**Expected Results:**
- Initial bundle: ~400KB (60% reduction)
- Vendor chunk: ~180KB (cached across sessions)
- Route chunks: ~50-80KB each
- LCP improvement: 800ms
- TBT improvement: 400ms

---

### 🚨 Priority 2: Image Optimization & Critical Resource Loading
**Target: Reduce LCP-blocking image from 496KB to <100KB**
**Timeline: 2-3 days**
**LCP Impact: -600ms**

#### Implementation Steps:

1. **Convert Static Images** (Day 1)
```bash
# Use sharp or imagemin to optimize
npx @squoosh/cli --webp --resize 1920x1080 src/assets/onboarding-city-bg.png
npx @squoosh/cli --webp --resize 512x512 src/assets/staywise-compass-icon.png
```

2. **Implement Responsive Images** (Day 2)
```typescript
// Create ImageWithFallback component
interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ 
  src, alt, sizes, className, priority = false 
}) => {
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/, '.webp');
  const avifSrc = src.replace(/\.(png|jpg|jpeg)$/, '.avif');
  
  return (
    <picture>
      <source srcSet={avifSrc} type="image/avif" />
      <source srcSet={webpSrc} type="image/webp" />
      <img 
        src={src}
        alt={alt}
        sizes={sizes}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </picture>
  );
};
```

3. **Add Resource Preloading** (Day 3)
```html
<!-- src/index.html -->
<head>
  <link rel="preload" href="/assets/staywise-compass-icon.webp" as="image" type="image/webp">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://api.supabase.co">
</head>
```

**Expected Results:**
- City background: 496KB → 85KB (83% reduction)
- Logo: 222KB → 45KB (80% reduction)  
- LCP improvement: 600ms
- Bandwidth savings: 60%

---

### 🚨 Priority 3: React Query Integration & Data Fetching
**Target: Eliminate redundant requests and improve UX**
**Timeline: 4-6 days**
**Network Impact: -50% requests, +cache hits**

#### Implementation Steps:

1. **Install and Configure React Query** (Day 1)
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});
```

2. **Replace Custom Hooks** (Day 2-4)
```typescript
// src/hooks/useHomeScreenData.ts - AFTER
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useHomeScreenData({ mode, stayId, propertyId }: UseHomeScreenDataOptions) {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['homeScreen', mode, stayId, propertyId],
    queryFn: async () => {
      if (mode === 'guest' && stayId) {
        return propertyService.getCurrentGuestStay(stayId);
      } else if (mode === 'host' && propertyId) {
        return propertyService.getPropertyDetailsForHomeScreen(propertyId);
      }
      return propertyService.getPropertyDetailsForHomeScreen();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for dynamic content
    enabled: !!(mode && (stayId || propertyId || mode === 'guest')),
  });
}
```

3. **Implement Prefetching Strategy** (Day 5-6)
```typescript
// src/components/BottomNavigation.tsx
const queryClient = useQueryClient();

const prefetchExploreData = () => {
  queryClient.prefetchQuery({
    queryKey: ['recommendations', 'explore'],
    queryFn: () => recommendationService.getAllRecommendations(),
    staleTime: 5 * 60 * 1000,
  });
};

// Prefetch on tab hover
onMouseEnter={() => activeTab !== 'explore' && prefetchExploreData()}
```

**Expected Results:**
- 50% reduction in network requests
- Instant navigation between cached routes
- Optimistic updates for better UX
- Automatic background refetching

---

### 🚨 Priority 4: Search Input Debouncing & Event Optimization
**Target: Reduce INP from 320ms to <200ms**
**Timeline: 1-2 days**
**INP Impact: -120ms**

#### Implementation Steps:

1. **Implement useDebounce Hook Usage** (Day 1)
```typescript
// src/components/FilterBar.tsx - AFTER
import { useDebounce } from '@/hooks/useDebounce';

const FilterBar: React.FC<FilterBarProps> = ({ activeCategory, setActiveCategory, searchQuery, setSearchQuery }) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);
  
  useEffect(() => {
    setSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setSearchQuery]);

  return (
    <input
      type="text"
      placeholder="Search experiences..."
      value={localSearchQuery}
      onChange={(e) => setLocalSearchQuery(e.target.value)}
      className="glass-card w-full rounded-full py-3 pl-12 pr-4"
    />
  );
};
```

2. **Optimize Expensive Filters** (Day 2)
```typescript
// src/components/HostApp-Enhanced.tsx - AFTER
const debouncedSearchTerm = useDebounce(searchTerm, 300);

const filteredProperties = useMemo(() => {
  if (!debouncedSearchTerm && filterType === 'all') {
    return mockProperties; // Return early for empty state
  }
  
  return mockProperties.filter(property => {
    const searchLower = debouncedSearchTerm.toLowerCase();
    const matchesSearch = !searchLower || 
      property.name.toLowerCase().includes(searchLower) ||
      property.location.toLowerCase().includes(searchLower);
    const matchesFilter = filterType === 'all' || property.status === filterType;
    return matchesSearch && matchesFilter;
  });
}, [mockProperties, debouncedSearchTerm, filterType]);
```

**Expected Results:**
- INP improvement: 120ms
- Reduced main thread blocking during search
- Smoother typing experience
- 70% fewer filter operations

---

### 🚨 Priority 5: Animation Performance & Main Thread Optimization
**Target: Achieve consistent 60fps animations**
**Timeline: 2-3 days**
**Rendering Impact: Eliminate frame drops**

#### Implementation Steps:

1. **Replace setTimeout with CSS/WAAPI** (Day 1)
```typescript
// Replace setTimeout chains with CSS transitions
// src/components/OnboardingFlow.tsx - BEFORE
await new Promise(resolve => setTimeout(resolve, 300));
await new Promise(resolve => setTimeout(resolve, 300));

// AFTER - Use CSS custom properties and transitions
const [animationStep, setAnimationStep] = useState(0);

useEffect(() => {
  const timer = setTimeout(() => setAnimationStep(prev => prev + 1), 300);
  return () => clearTimeout(timer);
}, [animationStep]);

// CSS handles the actual animation
.onboarding-step {
  transform: translateY(var(--step-offset));
  transition: transform 300ms ease-out;
}
```

2. **Add will-change Properties** (Day 2)
```css
/* src/styles/globals.css */
.glass-card {
  will-change: transform, opacity;
}

.recommendation-card:hover {
  will-change: transform;
  transform: translateZ(0); /* Force layer creation */
}

.carousel-item {
  will-change: transform;
  contain: layout style paint;
}
```

3. **Optimize React Rendering** (Day 3)
```typescript
// Add React.memo and useCallback for expensive components
const RecommendationCard = React.memo<RecommendationCardProps>(({ 
  title, imageUrl, onFavorite, onShare 
}) => {
  const handleFavorite = useCallback(() => {
    onFavorite(title);
  }, [title, onFavorite]);
  
  return (
    <div className="recommendation-card">
      {/* component content */}
    </div>
  );
});
```

**Expected Results:**
- Consistent 60fps animations
- 40% reduction in main thread blocking
- Smoother scroll performance
- Reduced battery drain on mobile

## Implementation Timeline

```
Week 1: Foundation
├── Day 1-2: Bundle splitting setup
├── Day 3-4: Image optimization 
└── Day 5: Route-based lazy loading

Week 2: Data & Interactions  
├── Day 1-3: React Query integration
├── Day 4: Search debouncing
└── Day 5: Performance testing

Week 3: Polish & Optimization
├── Day 1-2: Animation optimization
├── Day 3-4: Service worker setup
└── Day 5: Final performance validation
```

## Success Metrics

| Phase | Metric | Before | Target | Validation |
|-------|---------|---------|---------|------------|
| Phase 1 | Bundle Size | 1.08MB | <500KB | Bundle analyzer |
| Phase 1 | LCP | 3.2s | <2.5s | Lighthouse CI |
| Phase 2 | TBT | 890ms | <400ms | WebPageTest |
| Phase 2 | INP | 320ms | <200ms | Real User Monitoring |
| Phase 3 | Overall Score | 58/100 | >85/100 | Lighthouse CI |

## Monitoring & Validation

1. **Lighthouse CI Pipeline**
   - Run on every PR
   - Fail builds if performance budget exceeded
   - Track metrics over time

2. **Real User Monitoring**
   - Implement Core Web Vitals tracking
   - Monitor 95th percentile metrics
   - Alert on regression

3. **Bundle Analysis**
   - Automated bundle size tracking
   - Dependency impact analysis
   - Dead code elimination reports

This optimization plan will transform StayWise from a performance liability to a fast, responsive application that meets all production requirements and provides an excellent user experience across all devices and network conditions.
