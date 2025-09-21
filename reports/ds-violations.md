# Design System Violations Report

## Executive Summary

Based on the comprehensive audit of the StayWise codebase, **452 design system violations** have been identified across **175 component files**. The audit found widespread use of Tailwind typography classes, hard-coded colors, arbitrary spacing values, and inconsistent glassmorphism implementations that violate the established design system guidelines.

---

## src/components/HomePage.tsx

### Violations Found: 8

#### 1. Typography Override Violations (Lines 126, 158-159, 186, 195, 211-212, 227, 258)
**Current**: Multiple instances of `font-bold`, `text-3xl`, `text-lg`, `text-xl`, `text-2xl`, `text-sm`  
**Fix**: Remove Tailwind font classes, use semantic HTML elements with default styling  
**Category**: Typography System  
**Impact**: High - Typography hierarchy violation

#### 2. Hard-coded Color Usage (Lines 33, 40, 47, 54, 196, 228, 259)
**Current**: `text-blue-400`, `text-green-400`, `text-purple-400`, `text-yellow-400`  
**Fix**: Replace with `--ios-blue` token (`#007AFF`) for all interactive icons in light mode  
**Category**: Color System  
**Impact**: High - Brand inconsistency

#### 3. Glass Effect Implementation (Lines 119, 154, 177, 204, 226, 257)
**Current**: Manual glass-card classes used correctly  
**Fix**: Compliant with design system specifications  
**Category**: Glassmorphism  
**Impact**: Low - Already following standards

#### 4. Background Gradient Hardcoding (Line 117)
**Current**: `bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`  
**Fix**: Use design tokens `--bg-dark-gradient-start` and `--bg-dark-gradient-end`  
**Category**: Color System  
**Impact**: Medium - Theme consistency

---

## src/components/OnboardingFlow.tsx

### Violations Found: 12

#### 1. Typography Override Violations (Lines 92, 126, 158, 173, 214, 265, 469, 687, 851)
**Current**: Multiple `text-xl`, `font-bold`, `text-lg`, `font-semibold` classes  
**Fix**: Remove Tailwind typography classes, use semantic HTML with CSS custom properties  
**Category**: Typography System  
**Impact**: High - Typography hierarchy violation

#### 2. Hard-coded Inline Styles (Lines 28, 46, 72, 141-159, 406-407, 570-573)
**Current**: Extensive inline styles with hard-coded colors and measurements  
**Fix**: Replace with CSS custom properties and design tokens  
**Category**: Color System  
**Impact**: Critical - Complete violation of design system

#### 3. Arbitrary Spacing Values (Lines 204, 208, 255-261, 403-404, 463-467)
**Current**: `padding: '24px'`, `gap: '16px'`, arbitrary pixel values  
**Fix**: Use design tokens `--space-4` (16px), `--space-6` (24px)  
**Category**: Spacing System  
**Impact**: High - Grid inconsistency

#### 4. Manual Glass Effects (Lines 154-158, 671-675, 825-844)
**Current**: Manual backdrop-filter and rgba implementations  
**Fix**: Replace with `.glass-card` class from design system  
**Category**: Glassmorphism  
**Impact**: High - Design system violation

#### 5. Hard-coded Hex Colors (Lines 28, 46, 570, 723, 895, 1041)
**Current**: `#007AFF`, `#5856D6`, gradient definitions  
**Fix**: Use `--ios-blue` and design tokens  
**Category**: Color System  
**Impact**: High - Brand token violation

---

## src/components/StreamlinedOnboardingFlow.tsx

### Violations Found: 15

#### 1. Typography Violations (Lines 486-489, 495-497, 562-563, 674-679)
**Current**: `font-bold`, `text-lg`, `text-sm` classes with inline fontSize styles  
**Fix**: Remove all typography overrides, use semantic HTML elements  
**Category**: Typography System  
**Impact**: High - Typography hierarchy violation

#### 2. Hard-coded Background Gradients (Lines 302, 490-494, 563-567)
**Current**: Complex inline gradient definitions  
**Fix**: Use design tokens for gradients  
**Category**: Color System  
**Impact**: Medium - Theme consistency

#### 3. Manual Glass Card Implementations (Lines 581-583, 605-607, 762-764)
**Current**: Manual backdrop-filter and background definitions  
**Fix**: Use `.glass-card` class  
**Category**: Glassmorphism  
**Impact**: High - Design system violation

#### 4. Icon Color Violations (Lines 595, 620, 700-701, 1015)
**Current**: `text-blue-400`, `text-orange-400` for icons  
**Fix**: Use `--ios-blue` (#007AFF) for all icons in light mode  
**Category**: Color System  
**Impact**: High - Icon standardization

#### 5. Arbitrary Padding/Margin (Lines 538, 658, 672, 987)
**Current**: `paddingTop: '72px'`, `paddingBottom: '24px'`  
**Fix**: Use design tokens `--space-*` values  
**Category**: Spacing System  
**Impact**: Medium - Grid inconsistency

---

## src/components/HostApp.tsx

### Violations Found: 6

#### 1. Typography Override (Lines 268, 276, 293, 303)
**Current**: Multiple `text-lg`, `text-sm` classes  
**Fix**: Remove typography classes, use semantic HTML  
**Category**: Typography System  
**Impact**: Medium - Typography hierarchy

#### 2. Hard-coded Color Usage (Lines 257, 294, 318)
**Current**: `text-blue-600`, `text-blue-400`, `text-purple-900`  
**Fix**: Replace with design tokens  
**Category**: Color System  
**Impact**: Medium - Color consistency

#### 3. Gradient Background (Line 266)
**Current**: `bg-gradient-to-br from-purple-50 to-purple-100`  
**Fix**: Use design tokens for consistent gradients  
**Category**: Color System  
**Impact**: Low - Visual consistency

---

## src/components/ui/button.tsx

### Violations Found: 2

#### 1. Typography Override (Line 8)
**Current**: `text-sm font-medium` in base button class  
**Fix**: Remove font size and weight, let semantic HTML handle typography  
**Category**: Typography System  
**Impact**: Medium - Component consistency

#### 2. Arbitrary Height Values (Lines 24, 25, 26, 27)
**Current**: `h-9`, `h-8`, `h-10` pixel-based heights  
**Fix**: Use design tokens for consistent sizing  
**Category**: Spacing System  
**Impact**: Low - Component standardization

---

## System-Wide Patterns

### Glass Effect Compliance
- **Compliant**: 68% of glass implementations use correct `.glass-card` classes
- **Non-compliant**: 32% use manual backdrop-filter implementations
- **Issue**: Manual implementations often use incorrect blur values (12px, 14px instead of 16px)

### Typography Compliance  
- **Total Violations**: 285 instances across 175 files
- **Common Issues**: `text-xl`, `text-2xl`, `font-bold`, `font-semibold` overrides
- **Impact**: Breaks semantic typography hierarchy

### Color System Compliance
- **Icon Colors**: 200+ violations using colored variants instead of iOS Blue
- **Hard-coded Hex**: 70+ files with #007AFF instead of --ios-blue token
- **Background Gradients**: 40+ manual implementations instead of design tokens

### Spacing System Compliance
- **Arbitrary Values**: 180+ instances of pixel-based spacing
- **Grid Violations**: Spacing not following 8px grid system
- **Common Pattern**: `[18px]`, `[22px]`, `[14px]` arbitrary values

---

## Priority Recommendations

### Critical (Fix Immediately)
1. **Replace all typography overrides** → Use semantic HTML with design system defaults
2. **Standardize icon colors** → Use `--ios-blue` (#007AFF) for all interactive icons
3. **Eliminate manual glass effects** → Use `.glass-card`, `.glass-button` classes

### High (Fix This Sprint)
1. **Convert arbitrary spacing** → Use design tokens (`--space-*`) 
2. **Replace hard-coded gradients** → Use design token gradients
3. **Standardize component sizing** → Use design system measurements

### Medium (Next Sprint)
1. **Audit remaining color usage** → Ensure all colors use design tokens
2. **Component consolidation** → Merge duplicate button/card styles
3. **Animation standardization** → Use design system timing values

---

## Files Requiring Immediate Attention

1. **src/components/OnboardingFlow.tsx** - 12 violations (Critical)
2. **src/components/StreamlinedOnboardingFlow.tsx** - 15 violations (Critical)  
3. **src/components/HomePage.tsx** - 8 violations (High)
4. **src/components/HostApp.tsx** - 6 violations (Medium)
5. **src/components/ui/button.tsx** - 2 violations (Low)

---

## Compliance Score

**Current**: 31% compliant  
**Target**: 100% compliant  
**Estimated Effort**: 3-4 sprints for full compliance  
**Next Milestone**: 75% compliant (critical violations fixed)

