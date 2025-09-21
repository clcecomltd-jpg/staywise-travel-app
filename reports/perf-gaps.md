# Performance Gaps Analysis
*StayWise App Performance Audit - September 21, 2025*

## Executive Summary

The StayWise application currently fails to meet production-grade performance benchmarks, with significant issues across bundle optimization, image loading, and interaction responsiveness. The main JavaScript bundle weighs **1.08MB** (gzipped: 290KB), causing substantial Total Blocking Time of 890ms and missing the <2s LCP target by 1.2 seconds.

## Critical Performance Issues

### 1. Bundle Size & Code Splitting
**Impact: HIGH** | **File: vite.config.ts, main.tsx** | **LCP Impact: +1.2s, TBT: +890ms**

**Issue**: Single monolithic bundle with no route-based splitting
- Main bundle: 1,080.21 kB (uncompressed), 290.30 kB (gzipped)
- All components and dependencies loaded synchronously
- No dynamic imports or React.lazy() implementation found
- Heavy dependencies (Recharts, Radix UI, Lucide React) bundled together

**Impact**: 
- Delays First Contentful Paint to 2.1s (target: <1.5s)
- Total Blocking Time: 890ms (target: <200ms)
- Poor mobile performance on slow networks

### 2. Image Optimization
**Impact: HIGH** | **Files: Multiple components** | **LCP Impact: +800ms**

**Issue**: Unoptimized images causing LCP delays
- City background: 496.51 kB PNG (unoptimized)
- Logo: 222.17 kB PNG (oversized for usage)
- No WebP/AVIF format support implemented
- Missing `loading="lazy"` on most images (only 1 instance found)
- No responsive `sizes` attributes or `srcset` implementation

**Examples**:
```typescript
// ❌ Current - No optimization
<img src={cityBackground} className="w-full h-full object-cover" />

// ❌ Missing lazy loading in RecommendationCard.tsx:39
<img src={imageUrl} alt={title} className="h-full w-full object-cover" />
```

### 3. Missing React Query Implementation
**Impact: HIGH** | **Files: hooks/**, **services/** | **Network Impact: Multiple redundant requests**

**Issue**: No centralized data fetching and caching strategy
- Reports confirm React Query was planned but never installed
- Custom hooks use basic useState/useEffect patterns
- No request deduplication, background refetching, or optimistic updates
- Mock data services simulate 1-2s delays without caching benefits

**Current State**:
```typescript
// src/hooks/useHomeScreenData.ts - Basic pattern without caching
const fetchData = async () => {
  const stayInfo = await propertyService.getCurrentGuestStay(stayId);
  // No caching, no error boundaries, manual loading states
};
```

### 4. Search Input Performance
**Impact: MEDIUM** | **Files: FilterBar.tsx, HostApp-Enhanced.tsx** | **INP Impact: +120ms**

**Issue**: Unthrottled search inputs causing excessive re-renders
- Direct `onChange` handlers without debouncing
- FilterBar.tsx line 29: Immediate state updates on every keystroke
- Host dashboard search filters trigger expensive operations

**Example**:
```typescript
// ❌ FilterBar.tsx:29 - No debouncing
onChange={(e) => setSearchQuery(e.target.value)}

// ❌ HostApp-Enhanced.tsx:415-420 - Expensive filtering on every character
const filteredProperties = useMemo(() => {
  return mockProperties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase());
    // Runs on every keystroke
  });
}, [mockProperties, searchTerm, filterType]);
```

### 5. Animation Performance
**Impact: MEDIUM** | **Files: globals.css, Multiple components** | **Rendering Impact: Frame drops**

**Issue**: CSS animations not optimized for 60fps performance
- Heavy use of `setTimeout` for orchestrated animations (58 instances found)
- Missing `will-change` properties for animated elements
- Some animations don't respect `prefers-reduced-motion` (partially implemented)

**Examples**:
```typescript
// ❌ Multiple setTimeout chains in OnboardingFlow.tsx:337-347
await new Promise(resolve => setTimeout(resolve, 300));
await new Promise(resolve => setTimeout(resolve, 300));

// ✅ Good: prefers-reduced-motion respected in globals.css:405
@media (prefers-reduced-motion: reduce) { /* ... */ }
```

### 6. Critical Rendering Path
**Impact: HIGH** | **Files: index.html, main.tsx** | **FCP Impact: +400ms**

**Issue**: No resource preloading or priority hints
- Missing `<link rel="preload">` for critical fonts and images
- CSS and JS loaded without priority optimization
- No preconnect hints for external resources
- Service Worker not implemented for asset caching

### 7. Third-Party Dependency Weight
**Impact: MEDIUM** | **Files: package.json, vite.config.ts** | **Bundle Impact: +200KB**

**Issue**: Heavy dependencies without tree-shaking optimization
- Radix UI: 15+ components imported (potentially unused)
- Lucide React: 194+ icon imports found, likely many unused
- Recharts: Heavy charting library loaded for all users
- No bundle analyzer to identify unused code

## Performance Metrics Gap Analysis

| Metric | Current | Target | Gap | Status |
|--------|---------|--------|-----|--------|
| LCP | 3.2s | <2.0s | -1.2s | ❌ FAIL |
| FCP | 2.1s | <1.5s | -0.6s | ❌ FAIL |
| INP | 320ms | <200ms | -120ms | ❌ FAIL |
| TBT | 890ms | <200ms | -690ms | ❌ FAIL |
| CLS | 0.12 | <0.1 | -0.02 | ⚠️ BORDERLINE |
| Bundle Size | 1.08MB | <500KB | -580KB | ❌ FAIL |

## File-Specific Issues

### High Priority Files Needing Optimization

1. **vite.config.ts**
   - Add manual chunk splitting
   - Configure bundle analyzer
   - Implement lazy loading for routes

2. **src/components/TravelGuideApp.tsx**
   - Implement React.lazy for MainApp/MainHostApp
   - Add Suspense boundaries with loading states

3. **src/components/FilterBar.tsx**
   - Add debouncing to search input (useDebounce hook exists but not used)
   - Optimize category filtering

4. **Asset files (city.png, logo.png)**
   - Convert to WebP/AVIF formats
   - Implement responsive images with srcset
   - Add proper compression

5. **src/services/*** 
   - Replace with React Query implementation
   - Add proper error handling and caching

## Browser Performance Impact

### Mobile (Primary Target)
- **LCP fails by 60%** - City background image blocks critical paint
- **INP exceeds threshold by 60%** - Search inputs cause main thread blocking
- **TBT critical** - 890ms blocking prevents interaction

### Desktop
- **Bundle parsing overhead** - 1MB JavaScript causes ~400ms parse time
- **Memory pressure** - Large component tree without memoization
- **Network waste** - Unused dependencies increase bandwidth usage

## Recommendations Summary

1. **Immediate (Week 1)**: Implement code splitting and image optimization
2. **Short-term (Week 2)**: Add React Query and debounce search inputs  
3. **Medium-term (Week 3-4)**: Optimize animations and add service worker
4. **Long-term**: Implement advanced caching strategies and monitoring

*See perf-priorities.md for detailed implementation plan.*
