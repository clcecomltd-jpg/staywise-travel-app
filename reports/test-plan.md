## StayWise Test Plan (to ≥90% on critical paths, ≥70% overall)

Date: 2025-09-21
Agent: Testing Agent

### Goals
- Production-grade, behavior-focused tests.
- Coverage targets: ≥90% for critical flows; ≥70% overall.
- Strict isolation: all network traffic mocked via MSW in unit/integration; e2e uses test servers + deterministic fixtures.

### Tooling Setup (Week 0)
1) Unit/Integration
   - Install: `jest`, `@types/jest`, `ts-jest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`.
   - Configure: `jest.config.ts` (ts-jest preset, jsx tsx support, jsdom), `setupTests.ts` with RTL + jest-dom.
   - MSW: `msw`, `whatwg-fetch`; create `tests/msw/handlers.ts`, `tests/msw/server.ts` with lifecycle hooks in `setupTests.ts`.

2) E2E
   - Choose Playwright (preferred) or Cypress.
   - Playwright: `npx playwright init` with TypeScript. Add devices for mobile/tablet/desktop, env fixtures, and network mocking for unstable deps as needed.

3) CI
   - Add GitHub Actions (or local CI) to run: lint, unit/integration (Jest), e2e (Playwright) on PRs.

### Scope & Priorities

#### P0: Critical Flows (Guest, Host, Chat)
Target ≥90% coverage across these areas

- Guest Explore → filter → like → details → book
  - Files: `ExploreScreen`, `FilterBar`, `FilterModal`, `RecommendationCard`, `RecommendationGrid`, `RecommendationModal`, `CardDetailsModal`.
  - Unit/Integration (RTL + MSW):
    - Filters change result set; empty state shown; error fallback shown.
    - Liking persists in UI state; details modal open/close; booking CTA appears.
  - E2E (Playwright):
    - Full user path, slow-3G throttle, mobile viewport. Validate skeletons, empty, and error retry.

- Host Onboard → add property → add recommendation → publish → check analytics
  - Files: `HostOnboardingFlow`, `PropertyImportDialog`, `services/propertyService`, `services/recommendationService`, `HostEarningsScreen`, `HostDashboard/*`.
  - Integration (RTL + MSW):
    - Import property (success/error), add recommendation flow, publish confirmation.
    - Earnings/analytics loading, date range change, server error UI.
  - E2E (Playwright):
    - Desktop viewport; verifies analytics widgets render with mocked data; publishing toast shown.

- Chat Send/Receive, Offline/Retry
  - Files: `ChatScreen`, `Chat/*`.
  - Integration:
    - Message send success; failure shows retry; offline queues; reconnect flushes.
  - E2E:
    - Toggle offline mode; ensure queued messages resend on reconnect.

#### P1: Platforms & Foundations

- UI Atoms (Button, Input, Card, Dialog)
  - Minimal but meaningful tests: render, interaction, accessibility roles/labels.

- Hooks (useHomeScreenData, useStay, useProperty)
  - MSW-backed tests for success, error, empty; cancellation/cleanup where applicable.

- Contexts (Theme, Auth, Property, Settings, Desktop)
  - Default values; state updates; provider wrappers; consumer rendering.

#### P2: Pages & Misc

- Next app pages and generic pages: smoke tests for render, key links present, error/not-found fallback.

### Test Structure & Conventions
- Tests colocated next to source or under `tests/` mirroring structure.
- File naming: `*.test.tsx` for unit/integration, `e2e/*.spec.ts` for Playwright.
- Behavior-first: assert visible outcomes, not implementation details; avoid testing internal state.
- Accessibility checks: roles, names, focus management on modals/dialogs.

### Mocking Strategy (MSW)
- Shared handlers: `properties`, `recommendations`, `bookings`, `chat`, `analytics`.
- Error variants included (timeout, 500, empty arrays).
- Strict: no live endpoints in unit/integration; fail tests if network is unmocked.

### Cross-Device & Resilience
- Playwright device matrix: iPhone 14/15 Pro (mobile), iPad (tablet), Desktop Chromium/WebKit.
- Network profiles: slow-3G, offline, normal.
- Negative scenarios: booking failure → retry; chat offline → queued send; analytics 500 → error UI.

### Milestones & Estimates
Week 0: Tooling & scaffolding (Jest/RTL/MSW + Playwright), CI wiring.
Week 1: P0 Guest flow unit/integration + P0 Chat unit/integration + base atoms.
Week 2: P0 Host flow unit/integration + start Playwright flows (Guest + Chat).
Week 3: Host Playwright flows + contexts + hooks.
Week 4: Round out pages, accessibility assertions, coverage hardening to targets.

### Exit Criteria
- Coverage: ≥90% on Explore, Booking, Host analytics, Chat; ≥70% overall.
- All critical negative paths validated in e2e.
- No unit/integration test makes live network calls (verified by MSW).

### Next Steps (Actionable)
1. Add testing dependencies and base configs.
2. Create `tests/msw/{handlers,server}.ts` and `setupTests.ts`.
3. Write first P0 tests: Explore filters (success/empty/error) and Chat send retry.
4. Initialize Playwright and script Guest/Host/Chat journeys with device + network matrix.

