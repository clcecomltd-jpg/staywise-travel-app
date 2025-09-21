## StayWise Test Coverage Audit

Date: 2025-09-21
Agent: Testing Agent (React + TypeScript)

### Executive Summary
No first-party tests were found in the repository. There are no unit, integration, or end-to-end test suites configured for the app code. Existing test files only appear inside node_modules. As a result, estimated coverage is 0% across components, hooks, contexts, and pages.

- **Framework**: React + TypeScript (Vite + Next app directory present)
- **Testing tools requested**: Jest + React Testing Library, Playwright/Cypress for e2e, MSW for API mocks
- **Current status**: No Jest/Vitest/RTL/Playwright/Cypress setup; no MSW configuration; no test files present in `src`.

### Inventory Summary (by category)

| Category | Total items | With tests | Est. coverage |
|---|---:|---:|---:|
| Components (`src/components/**`, `src/src/components/**`) | 215 | 0 | 0% |
| Hooks (`src/hooks/**`, `src/src/hooks/**`) | 7 | 0 | 0% |
| Contexts (`src/components/contexts/**`, `src/contexts/**`) | 6 | 0 | 0% |
| Pages (`src/app/**`, `src/src/pages/**`) | 24 | 0 | 0% |

Notes:
- Components count aggregates both UI primitives and feature screens. Contexts are also present under `src/components/contexts/**` and counted separately here.
- Pages include Next app routes in `src/app/**` and page components under `src/src/pages/**`.

### Untested Critical Paths (must reach ≥90% coverage)

- **Guest journey**: Explore → filter → like → details → book
  - Files: `src/components/screens/ExploreScreen.tsx`, `src/components/FilterBar.tsx`, `src/components/FilterModal.tsx`, `src/components/RecommendationCard.tsx`, `src/components/RecommendationGrid.tsx`, `src/components/RecommendationModal.tsx`, `src/components/CardDetailsModal.tsx`
- **Host journey**: Onboard → add property → add recommendation → publish → check analytics
  - Files: `src/components/HostOnboardingFlow.tsx`, `src/components/PropertyImportDialog.tsx`, `src/services/propertyService.ts`, `src/services/recommendationService.ts`, `src/components/screens/HostEarningsScreen.tsx`, `src/src/components/HostDashboard/*`
- **Chat**: Message send/receive, offline states, retries
  - Files: `src/components/screens/ChatScreen.tsx`, `src/src/components/Chat/*`

### Gaps by Area

- **Unit & Integration**
  - No atom tests (e.g., `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/components/ui/card.tsx`).
  - No hook tests (e.g., `src/hooks/useHomeScreenData.ts`, `src/hooks/useStay.ts`, `src/hooks/useProperty.ts`) with MSW.
  - No context tests (`ThemeContext`, `AuthContext`, `PropertyContext`, `SettingsContext`, `DesktopContext`).
  - Missing async and error-state coverage in Explore, Booking, Chat, Host dashboards.

- **End-to-End**
  - No Playwright/Cypress project detected; no scripted guest/host flows.
  - No validation of loading/empty/error states; no cross-device (mobile/tablet/desktop) emulation.
  - Missing negative scenarios: booking failure → retry, network offline → queued send (chat), server 500 → user-facing error.

- **Mocking & Isolation**
  - No MSW setup; tests would hit live endpoints if added today.
  - Recommend central `tests/msw/handlers.ts` to mock: properties, recommendations, bookings, chat, analytics.

### Detailed Items Table (representative, prioritized)

| Item | Type | Existing tests | Missing | Priority |
|---|---|---:|---|---|
| `src/components/ui/button.tsx` | component | 0 | render, click, a11y | Medium |
| `src/components/ui/input.tsx` | component | 0 | render, type, a11y | Medium |
| `src/components/ui/card.tsx` | component | 0 | render, semantics | Low |
| `src/components/FilterBar.tsx` | component | 0 | filter interaction, state sync | High |
| `src/components/FilterModal.tsx` | component | 0 | open/close, apply/reset, a11y | High |
| `src/components/RecommendationCard.tsx` | component | 0 | like/save, nav to details | High |
| `src/components/RecommendationModal.tsx` | component | 0 | load image, CTA flows | High |
| `src/components/CardDetailsModal.tsx` | component | 0 | open/close, tabs, book CTA | High |
| `src/components/screens/ExploreScreen.tsx` | page | 0 | loading/empty/error, filters | High |
| `src/components/screens/HostEarningsScreen.tsx` | page | 0 | metrics load/error, time range | High |
| `src/src/components/HostDashboard/HostAnalyticsCard.tsx` | component | 0 | data states, error UI | High |
| `src/components/screens/ChatScreen.tsx` | page | 0 | send, retry, offline/online | High |
| `src/src/components/Chat/MessageInput.tsx` | component | 0 | typing, submit, disabled | High |
| `src/src/components/Chat/ChatBubble.tsx` | component | 0 | render variants, timestamps | Medium |
| `src/hooks/useHomeScreenData.ts` | hook | 0 | MSW mock, error state | High |
| `src/hooks/useStay.ts` | hook | 0 | MSW mock, retries | Medium |
| `src/hooks/useProperty.ts` | hook | 0 | MSW mock, empty state | Medium |
| `src/components/contexts/ThemeContext.tsx` | context | 0 | default + toggle | Medium |
| `src/components/contexts/AuthContext.tsx` | context | 0 | default + login/logout | High |
| `src/components/contexts/PropertyContext.tsx` | context | 0 | default + update | Medium |
| `src/components/contexts/SettingsContext.tsx` | context | 0 | defaults + update | Low |
| `src/components/contexts/DesktopContext.tsx` | context | 0 | layout state updates | Low |

### Conclusions

- Current effective coverage is 0%; all critical flows are untested.
- To achieve the target (≥90% on critical flows, ≥70% overall), the project needs: Jest + RTL + MSW setup, Playwright/Cypress e2e suite, and prioritized behavior-driven tests across Explore, Booking, Host dashboards, and Chat.

See `reports/test-plan.md` for the prioritized roadmap and `reports/test-gaps.json` for a machine-readable gap list.


