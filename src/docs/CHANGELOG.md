# Changelog

All notable changes to this project will be documented in this file.  This project adheres to [Semantic Versioning](https://semver.org/) and follows the format proposed by [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- Implemented a new Top Bar with a 3D Compass Icon, persistent branding, a settings menu, and a global dark mode toggle.
- Global responsive layout with fixed tablet width + themed wallpapers.
- Comprehensive folder structure documentation (`FOLDER_STRUCTURE.md`) describing the feature‑oriented organisation of the codebase.
- Custom instruction templates for AI agents: `claude.md` (Claude Code guidelines) and `gemini.md` (Gemini/Figma guidelines).
- Context summary document (`context.md`) for AI models to understand the app domain.
- Detailed description of the guest home page layout, including the welcome card, essentials grid, host message, recommendations carousel and cross‑navigation patterns.
- Additional personalization questions (travel style and budget) and reward incentive flow in guest onboarding.
- Accordion behaviour in onboarding with collapse/expand and tick completion.
- Offline mini map caching for the map & favourites screen.
- Cross‑navigation links and quick action bars across essentials pages (Wi‑Fi, Check‑In, House Rules, Parking, Emergency).

### Changed
- Updated `README.md` features section to highlight cross‑navigation and offline fallback in explore, map and recommendations.
- Revised `PRD.md` to include cross‑navigation & consistency requirements, additional personalization questions and offline fallback strategies.
- Expanded `TECHNICAL_BLUEPRINT.md` with detailed front‑end architecture, UI patterns (liquid glass, glow accents, progress steppers, accordion ticks), state management contexts, offline strategy and security measures.

### Fixed
- Corrected enumeration in functional requirements section of `PRD.md` and clarified offline caching behaviour.

## [0.2.0] – 2025‑09‑21

### Added
- Host onboarding wizard with property import (manual entry only) and goals selection.
- Guest onboarding flow with benefits explanation and personalization questions (trip purpose, preferences).
- Guest essentials screens: Wi‑Fi & Internet, Check‑In, House Rules, Parking, Emergency and combined Essentials page.
- Recommendation explore page with category filters, search and save favourites.
- Map & favourites screen built on Google Maps API with pinned recommendations.
- Real‑time chat between guests and hosts with offline queueing.
- Profile & settings pages with language and currency selectors.

### Changed
- Initial README and PRD files created with high‑level app description, features list, goals, user stories and roadmap.

## [0.1.0] – 2025‑08‑15

### Added
- Project scaffolding with Vite, React, TypeScript, Tailwind CSS and Radix UI.
- Basic repository structure (`src`, `public`, `docs`, etc.) and initial CI workflow.
- Placeholder documents for PRD and technical blueprint.

---

For older changes prior to v0.1.0, see the project’s initial commit history.