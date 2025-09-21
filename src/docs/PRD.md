# Product Requirements Document (PRD): StayWise Travel App

## Overview

StayWise Travel App is a cross‑platform web application that acts as a digital travel companion for guests and hosts. The product is designed to replace printed or static guest books with an interactive, personalized guide accessible via a URL or QR code. By consolidating property information, local recommendations, booking details, communication and analytics into one unified experience, StayWise provides value for both travellers and property hosts.

## Problem Statement

Travellers often receive incomplete information about their stay—Wi‑Fi codes, check‑in instructions, house rules, local tips—in disparate channels (emails, PDFs, messaging apps). Hosts struggle to maintain up‑to‑date information, provide personalized recommendations and capture guest sentiment. Existing solutions either require installing an app or lack offline access and contextual intelligence.

## Goals & Objectives

1. **Eliminate friction** for guests by delivering an immediately accessible, offline‑friendly guide with all essentials in one place.
2. **Empower hosts** to onboard their properties quickly, manage recommendations and communicate seamlessly with guests.
3. **Drive engagement** through personalized experiences, smart filtering, incentives and messaging.
4. **Provide insights** to hosts with analytics on guest engagement, recommendation usage and booking performance.
5. **Build a scalable platform** that can support multilingual content, additional monetization (affiliate deals, bookings) and future integrations.

## User Personas

### Guest Traveller
- Wants to quickly find Wi‑Fi information, check‑in instructions, address & directions, house rules and local tips.
- Values offline availability, clear navigation, personalized recommendations and quick contact with the host.

### Host/Property Owner
- Wants to onboard a property with minimal effort, import listing data from Airbnb/Vrbo/Booking.com and manage guests.
- Wants to curate recommendations, communicate with guests, see analytics on engagement and upsell add‑ons.

### Admin
- Manages platform settings, monitors data quality and manages partnerships (eSIM, affiliates, payment providers).

## User Stories

### Guest Flow
- As a guest, I want to choose my mode (guest/host) to see only relevant content.
- As a guest, I want a succinct onboarding flow that explains the app benefits (check‑in convenience, local tips, smart maps) and collects a few preferences (trip purpose, travel style, budget, interests) so the guide can be personalized.
- As a guest, I need offline access to Wi‑Fi credentials, check‑in/check‑out times, address and directions, house rules, parking and emergency information.
- As a guest, I want to browse host‑curated recommendations by category and save favourites.
- As a guest, I want an interactive map showing my property and saved places.
- As a guest, I want to chat with my host inside the app and contact them via call/WhatsApp/email if needed.
- As a guest, I want to switch languages and currencies.
- As a guest, I want to receive incentives (mini‑guides, discounts) for completing personalization or engaging with the app.

### Host Flow
- As a host, I need a straightforward onboarding wizard to import my property details (address, description, photos, check‑in/out times, Wi‑Fi, amenities) via Airbnb/Vrbo/Booking.com or manual entry.
- As a host, I want to highlight the benefits of StayWise for hosts (analytics, easy sharing, centralized management, delight guests, grow & optimize).
- As a host, I want to set my business goals (increase revenue, delight guests, save time, gain insights) so the dashboard can surface relevant metrics.
- As a host, I want to manage my recommendations: create, edit, categorize and prioritise them; attach directions and external links; mark deals as affiliate offers.
- As a host, I want to chat with current guests and view past conversations.
- As a host, I want to see an analytics dashboard summarizing guest engagement (views per section, recommendation clicks, chat sentiment).
- As a host, I want to create upsell add‑ons (private tours, airport transfers) and process payments (future).
- As a host, I want to update property information and house rules easily and have it propagate to all current guests instantly.

## Functional Requirements

1. **Onboarding**
   - Mode picker (guest vs host).
   - Guest onboarding screens: benefit explanation, personalization questions (trip purpose, travel style, budget, preferences), incentive reward screen.
   - Host onboarding screens: host benefits, property import (OAuth/URL parsing for Airbnb/Vrbo/Booking.com), host goals selection, completion screen.

2. **Guest Essentials**
   - Off‑line accessible Wi‑Fi details (SSID, password, QR connect, eSIM offers).
   - Check‑in & check‑out information (times, address/directions with map link).
   - House rules, parking information, emergency contacts.
   - Host message card with contact options (call, message, WhatsApp, email) and superhost badge.
   - Persisted across sessions for quick retrieval.
   - **Nearby Essentials** section listing local convenience stores, pharmacies and other services with distance, opening hours and a map link (e.g. “7‑Eleven, 3 min walk, open 24/7”).  This helps guests find necessities without leaving the app.  Items should be filterable by category and saved offline.

3. **Recommendations & Explore**
   - Host can create categories (events, food, tours, entertainment, etc.).
   - Guests can browse recommendations filtered by category or by personalized ranking (using onboarding answers and geolocation).
   - Each recommendation card includes image, title, description, directions button and info modal; favourite icon to save.
   - "View All" leads to full list with search and additional filters (distance, price, rating).
   - Incentive: saving n favourites unlocks a mini‑guide or discount.

4. **Map & Favorites**
   - Google Maps API integration shows property location and pinned recommendations.
   - Guests can save favourites; saved items appear on map and in a separate list.
   - Hosts can add recommendation pins from their dashboard.
   - Provide offline fallback by pre‑caching the property address and top recommendations in a mini offline map view so guests can still navigate when connectivity is limited.

5. **Chat & Contact**
   - Real‑time messaging between host and guest with offline queueing.
   - Attach photos, share location, request assistance.
   - Quick action buttons for call/WhatsApp/email.

6. **Profile & Settings**
   - Guest: view profile, change language, change currency, toggle dark mode, view saved guides, logout.
   - Host: view profile, manage properties, access analytics, change subscription.

7. **Host Dashboard**
   - Overview metrics: number of guests, check‑ins/out, recommendation interactions, chat response rate, overall rating.
   - Manage properties: create/edit property details, import new listings.
   - Manage recommendations: CRUD, categorize, schedule.
   - Inbox: unified chat for all guests.
   - Analytics: interactive charts and exports.

8. **Integrations**
   - OAuth and API integration with Airbnb/Vrbo/Booking.com for property data import.
   - Google Maps Platform for maps and geocoding.
   - eSIM API to offer travel data packages with redemption via QR code.
   - Payment gateway (future) for booking and upsell purchases.

9. **Offline‑First & PWA**
   - Use service worker to cache static assets and dynamic data.
   - Provide offline badge indicator.
   - Pre‑cache essential screens (Wi‑Fi, check‑in/out, house rules) and top recommendations.
   - Gracefully handle API failures (Google Maps, eSIM offers) and surface cached results with an explanatory message.

10. **Cross‑Navigation & Consistency**
   - Each major section (Wi‑Fi, Check‑In, Essentials, Recommendations, etc.) should include context‑aware links back to related content so guests do not have to return to the home screen to discover relevant information.
   - Ensure design consistency across pages: identical card layouts, icons and offline badges for repeat content (e.g. Wi‑Fi details in the grid, check‑in screen and essentials page).
   - Add quick access icons (call, directions, copy Wi‑Fi) at the bottom of detail pages for common actions.

11. **Security & Privacy**
    - Enforce HTTPS and secure cookies.
    - Data encryption at rest and in transit.
    - GDPR/PDPA compliance; allow guests to request deletion of their data.
    - Limit scope of OAuth tokens for property import.

## Non‑Functional Requirements

- **Performance**: Time‑to‑interactive < 2 seconds on mid‑range devices; first contentful paint < 1.5 seconds; offline retrieval < 50 ms.
- **Availability**: 99.9 % uptime for API endpoints; graceful degradation when third‑party integrations are unavailable.
- **Scalability**: Handle thousands of concurrent users with minimal latency.
- **Accessibility**: Conform to WCAG 2.1 AA; support screen readers; provide high‑contrast dark/light themes; ensure 48×48 dp touch targets.
- **Localization**: Support multiple languages (English, Thai, Chinese, etc.); handle RTL layouts.
- **Maintainability**: Modular codebase with clear separations of concerns; thorough documentation and automated tests.
- **Observability**: Instrumentation for monitoring user engagement, performance metrics and errors.

## Roadmap & Release Phases

1. **Phase 1 – MVP (v0.1.x)**  
   • Guest onboarding with benefits and personalization (no incentives yet).  
   • Guest essentials (Wi‑Fi, check‑in/out, house rules, host message).  
   • Host onboarding with property import (manual entry first).  
   • Basic recommendations browse and save; categories (events, food, tours).  
   • Chat messaging; offline caching of essentials.  

2. **Phase 2 – Personalization & Incentives (v0.2.x)**  
   • Additional guest personalization questions (travel style, budget).  
   • Accordion behaviours with tick completion.  
   • Reward mini‑guides unlocked after engagement (e.g. save 3 favourites).  
   • Smart sorting in Explore based on preferences and distance.  

3. **Phase 3 – Host Dashboard & Analytics (v0.3.x)**  
   • Unified host dashboard with KPIs, charts and recommendation analytics.  
   • Property import via Airbnb/Vrbo/Booking.com OAuth; goals selection.  
   • Recommendation CRUD with schedule.  
   • Upsell add‑ons and eSIM integration.  

4. **Phase 4 – Payments & Booking (v0.4.x)**  
   • Integrate booking and payment flows (Stripe or equivalent).  
   • Affiliate marketplace for local tours and experiences.  

Each phase should include user testing, accessibility audits and localization updates.

## Success Metrics

- **Onboarding completion rate** (guest and host) ≥ 90 %.  
- **Average time to find Wi‑Fi** ≤ 15 seconds.  
- **Recommendation engagement**: > 50 % of guests view at least one recommendation; > 25 % save a favourite.  
- **Chat response time**: < 1 hour median host response.  
- **Host adoption**: number of properties onboarded; daily active host users.  
- **Conversion**: upsell purchases, affiliate deal conversions (future metrics).  
- **User satisfaction**: Net Promoter Score (NPS) > 50; app rating ≥ 4.5.  
