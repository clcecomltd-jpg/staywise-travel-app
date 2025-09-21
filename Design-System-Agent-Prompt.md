# Cursor AI – Design System Agent Prompt

**Role**: You are the Design System Agent.  
**Mission**: Audit the StayWise codebase for UI and design system compliance and produce a clear, atomic plan to bring every component into alignment. Build on what exists — do not assume greenfield.

---

## Context

**Design Guide**: `src/docs/DESIGN_SYSTEM.md` + `src/guidelines/Guidelines.md`  
**Tokens**: `src/src/styles/tokens.css`  
**Global Styles & Animations**: `src/styles/globals.css`  
**Coding Guidelines**: `src/guidelines/Guidelines.md`

StayWise uses **Tailwind v4**, **Material 3 tokens**, and a **strict glassmorphism design system** (consistent blur, stroke, shadow, radius). All colours, spacing, radii, typography, and shadows must come from tokens or Tailwind config — **never hard-coded values**.

### Key Design System Rules:
- **Typography**: Never use Tailwind font classes (`text-xl`, `font-bold`) unless explicitly requested
- **Glassmorphism**: Exact specifications (16px blur, white/5 dark mode, black/5 light mode)  
- **Colors**: Only use design tokens (`--ios-blue`, `--brand-orange-start`, `bg-primary`)
- **Spacing**: 8px grid system (`--space-4`, `p-4`) — no arbitrary values
- **Icons**: Lucide React only, `#007AFF` iOS Blue in light mode
- **Animations**: Subtle only (120-240ms, cubic-bezier), no bounce/elastic

---

## Tasks

### 1. Audit Components
- Parse all `.tsx` components under `src/components/` and `src/`.
- Detect violations:
  - **Arbitrary pixel values**: `px`, `pt`, `em`, `rem` (outside design tokens)
  - **Hard-coded hex colours**: Instead of `--ios-blue`, `--brand-orange-start`, `bg-primary`
  - **Hard-coded shadows or blur values**: Not in tokens (`--glass-shadow-light`, `--shadow-lg`)
  - **Inline styles**: Duplicating what tokens already provide
  - **Typography violations**: Using `text-xl`, `font-bold`, etc. when should use defaults
  - **Spacing violations**: Arbitrary spacing instead of `--space-*` or Tailwind spacing tokens
- Map each violation back to UI Guide sections (typography, colour, spacing, glassmorphism, icons, motion).

### 2. Glassmorphism Consistency
- Verify every card, modal, nav bar uses the correct glassmorphism layer:
  - `.glass-card`, `.glass-header`, `.glass-float`, `.glass-button`
- Flag components re-implementing blur, borders, or shadows incorrectly.
- Check adherence to exact specifications:
  - Dark mode: `rgba(255, 255, 255, 0.05)` with 16px blur
  - Light mode: `rgba(0, 0, 0, 0.05)` with 16px blur
  - Border: `1px solid rgba(255, 255, 255, 0.10)`
  - Radius: `16px`

### 3. Atomic Design Layering
- Classify components as atoms, molecules, organisms, pages.
- Ensure tokens are applied consistently at the atomic level (buttons, chips, inputs).
- Suggest refactors to consolidate duplicate atoms (e.g. two different button styles).
- Verify `src/components/ui/` contains proper base atoms.

### 4. Icon & Color Compliance
- Verify all icons use Lucide React exclusively
- Check all interactive icons use `#007AFF` (iOS Blue) in light mode
- Ensure brand colors (`--brand-orange-start`) only used for logo/brand text
- Flag any custom SVGs or non-Lucide icons

### 5. Generate Codemod Plan
For each violation, propose a codemod patch:
- **Replace hard-coded hex** → `bg-primary` or `text-brand-orange`
- **Replace arbitrary spacing** → `space-x-4` or token from `tokens.css`
- **Replace shadow string** → `shadow-lg` or `--glass-shadow-light`
- **Replace manual blur** → `.glass-card`
- **Replace typography overrides** → Remove Tailwind font classes, use defaults
- **Replace arbitrary values** → Design tokens or Tailwind config values

---

## Output

### `/reports/ds-violations.md`
**Per file**: List violations + suggested fixes.
```markdown
## src/components/HomePage.tsx

### Violations Found: 4

#### 1. Hard-coded Color (Line 23)
**Current**: `style={{ color: '#3B82F6' }}`  
**Fix**: Replace with `text-primary` or use `--ios-blue` token  
**Category**: Color System  
**Impact**: High - Brand inconsistency

#### 2. Arbitrary Spacing (Line 45)
**Current**: `className="p-[18px]"`  
**Fix**: Replace with `p-4` (16px) or `p-5` (20px) following 8px grid  
**Category**: Spacing System  
**Impact**: Medium - Grid inconsistency

#### 3. Typography Override (Line 67)
**Current**: `className="text-2xl font-bold"`  
**Fix**: Remove classes, use semantic `<h2>` with default styling  
**Category**: Typography  
**Impact**: Medium - Typography hierarchy violation

#### 4. Manual Glass Effect (Line 89)
**Current**: `backdrop-filter: blur(14px); background: rgba(255,255,255,0.08)`  
**Fix**: Replace with `.glass-card` class  
**Category**: Glassmorphism  
**Impact**: High - Design system violation
```

### `/reports/ds-codemods.json`
**Machine-readable mapping**: `{ file, before, after, reason }`
```json
[
  {
    "file": "src/components/HomePage.tsx",
    "line": 23,
    "before": "style={{ color: '#3B82F6' }}",
    "after": "className=\"text-primary\"",
    "reason": "Replace hard-coded hex with design token",
    "category": "color",
    "impact": "high"
  },
  {
    "file": "src/components/HomePage.tsx", 
    "line": 45,
    "before": "className=\"p-[18px]\"",
    "after": "className=\"p-4\"",
    "reason": "Align to 8px spacing grid",
    "category": "spacing",
    "impact": "medium"
  }
]
```

### `/reports/ds-summary.md`
**Totals**: Violations by type + priorities
```markdown
# Design System Audit Summary

## Violation Breakdown
- **Color Violations**: 15 instances
- **Spacing Violations**: 23 instances  
- **Typography Violations**: 8 instances
- **Glassmorphism Violations**: 12 instances
- **Icon Violations**: 4 instances

## Top 5 High-Impact Fixes
1. **Replace all `#007AFF` → `--ios-blue` token** (8 files)
2. **Convert manual glass effects → `.glass-card`** (6 files) 
3. **Remove typography overrides → semantic HTML** (5 files)
4. **Fix arbitrary spacing → 8px grid** (23 instances)
5. **Replace custom icons → Lucide React** (4 files)

## Files Requiring Most Attention
1. `src/components/HomePage.tsx` - 8 violations
2. `src/components/HostDashboard.tsx` - 6 violations  
3. `src/components/OnboardingFlow.tsx` - 5 violations

## Compliance Score
**Current**: 67% compliant  
**Target**: 100% compliant  
**Priority**: Fix high-impact violations first
```

---

## Constraints

- **Do not refactor or generate code yet** — only analysis + codemod suggestions.
- **Stay 100% aligned** with `DESIGN_SYSTEM.md`, `tokens.css`, and `globals.css`.
- **Every proposed fix** must map back to an existing token or class, never arbitrary.
- **Build on existing system** — don't assume greenfield, work with what's there.
- **Preserve functionality** — ensure codemods don't break existing behavior.

---

## Deliverables

1. **Full audit** of every component
2. **Codemod plan** (safe to run automatically)  
3. **Summary report** with priorities (e.g., "Replace all rogue `#333333` → `text-foreground`")

---

## ⚡️ Next Action for Cursor:
Run the audit, output `ds-violations.md`, `ds-codemods.json`, and `ds-summary.md`.

**Start by examining these key areas**:
- `src/components/` - All component files
- `src/components/ui/` - Base component atoms  
- `src/components/screens/` - Screen-level components
- `src/App.tsx` and main application files

Look for:
- Hard-coded colors, spacing, shadows
- Typography class overrides  
- Manual glass effect implementations
- Non-Lucide icons
- Arbitrary Tailwind values `[...]`
- Inline styles with design token equivalents

Remember: [[memory:7627087]] The user prefers replacing all emojis with consistent icons in the UI instead of using emojis.