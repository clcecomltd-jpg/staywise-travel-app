# Claude Code Custom Instructions: StayWise Travel App

This document provides guidance for using **Claude Code** (Anthropic’s large‑language model) effectively when contributing to the StayWise Travel App.  Claude excels at high‑level reasoning, code generation, refactoring and explaining concepts.  To ensure that its output aligns with our architecture, design system and coding standards, follow these instructions when crafting prompts or tasks for Claude.

## 1. Context and Scope

1. **Reference the docs** – Before asking Claude to generate or modify code, ensure it is aware of the relevant product documentation:
   - `PRD.md` for user stories, functional requirements and success criteria.
   - `TECHNICAL_BLUEPRINT.md` for system architecture, data models and API contracts.
   - `FOLDER_STRUCTURE.md` for code organisation and naming conventions.
   - `README.md` for high‑level overview and quick start.
   - `UI‑GUIDE.md` (if present) for design tokens, component patterns and accessibility rules.

2. **Define the task clearly** – Each Claude prompt should specify:
   - The **feature or component** to work on (e.g. guest onboarding accordion, host import modal).
   - The **files or directories** that may be modified or created.
   - The **acceptance criteria** (functional behaviour, UI parity, offline handling, tests to pass).
   - Any **out of scope** actions (e.g. “Do not modify docs” or “Do not change database schema”).

3. **Use incremental PRs** – Break large tasks into smaller iterations.  For example, first generate a component skeleton, then wire up API calls, then implement styling and animations.

## 2. Coding Guidelines

1. **Language & Framework** – Use **TypeScript** and **React 18**.  Prefer functional components and hooks.  Avoid class components.
2. **Styling** – Use **Tailwind CSS v4** classes and design tokens defined in `tokens.css`.  For complex components, you may import `classnames` to conditionally apply classes.  Do not inline styles unless necessary.
3. **Components** – Respect the **presentational vs container** pattern:
   - Presentational components receive data via props and contain no side‑effects.
   - Container components manage state, side‑effects and connect to services.
4. **State Management** – Use context providers (`AuthContext`, `GuideContext`, etc.) or local state within features.  Do not introduce new global state without discussion.  Use `useReducer` when state becomes complex.
5. **Routing** – Use React Router v6 with nested routes.  Only modify route definitions in `src/app/guest` or `src/app/host` when adding new top‑level pages.
6. **Data Fetching** – Create API functions in `src/services` and call them via custom hooks.  Handle loading and error states explicitly.  Cache responses in context or local state where appropriate.
7. **Accessibility** – Follow WCAG 2.1 AA guidelines: semantic HTML, ARIA roles, keyboard navigability, focus indicators and 4.5:1 contrast ratios.  Use accessible variants of shadcn and Radix components.
8. **Performance** – Avoid unnecessary re‑renders.  Use `React.memo`, `useMemo` and `useCallback` when passing stable functions to deeply nested components.  Lazy‑load heavy modules with `React.lazy` and `Suspense`.
9. **Testing** – Include unit tests using **Vitest** and **React Testing Library**.  Write integration tests for complex flows.  Simulate offline scenarios using service worker mocks.
10. **Documentation & Changelog** – When Claude generates code, it should also update or suggest updates to relevant docs and `CHANGELOG.md` under the **Unreleased** section.  Use clear commit messages and code comments explaining non‑obvious logic.

## 3. Interaction Patterns

1. **Ask for clarifications** – If requirements are ambiguous, Claude should ask targeted questions rather than guessing.  E.g. “Should the recommendation cards support pagination?”
2. **Self‑review** – Claude should review its code for obvious bugs, missing imports or typos before delivering the final diff.
3. **Follow the patch format** – When outputting changes, use the unified diff patch format consistent with the repository tools (see `apply_patch` examples).  Each patch should include context lines and specify file additions or updates.
4. **Respect boundaries** – Claude must not create or modify files outside of the allowed directories or tasks.  For example, when working on guest features, avoid touching host code unless explicitly requested.

## 4. Common Prompts

Here are examples of how to structure prompts for Claude:

> **Create a new component**  
> “Implement the `GuestHomeRecommendations.tsx` component in `src/features/home/components/`.  It should accept a list of recommendations via props, display them in a horizontal scrollable card list with category chips, and trigger `onSave` when a user taps the heart icon.  Use the design tokens for card radius and spacing.  Do not implement API calls.”

> **Refactor state management**  
> “Refactor `GuideContext` to move personalization answers out of global state and into a custom hook within the onboarding feature.  Update the providers to accept an optional initial state for testing.”

> **Add offline behaviour**  
> “In `src/features/map/useOfflineMap.ts`, pre‑cache the top 5 recommendation pins and directions.  When offline, display a static map image from IndexedDB with clickable markers that open the recommendation modal.”

Using these guidelines will help Claude produce consistent, high‑quality contributions while respecting the architecture and design of StayWise.