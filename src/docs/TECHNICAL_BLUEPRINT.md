# Technical Blueprint: StayWise Travel App

## Overview

This technical blueprint describes how the StayWise Travel App is designed and built.  It provides a high‑level system architecture, details the front‑end and back‑end layers, outlines the data models and key interfaces and explains how third‑party services are integrated.  The goal of the blueprint is to give developers and architects an end‑to‑end understanding of how the app is constructed so they can contribute effectively and evolve the platform responsibly.

StayWise follows modern web application best practices: a React 18 front‑end written in TypeScript, served by a Node.js/Express API layer and backed by a relational database.  The client is a progressive web app (PWA) that works offline, and the system integrates with external providers for maps, property import, travel eSIM offers and, in future phases, bookings and payments.

## Architecture Overview

At a high level, the StayWise platform consists of the following components:

1. **Client Applications** – Two entry points built with React and Vite:
   - The **Guest App** at `/guest` provides the user interface for travellers.  It contains flows for onboarding, essentials (Wi‑Fi, check‑in, house rules), explore/recommendations, map/favourites, chat and settings.  It caches data locally for offline access using Service Workers and IndexedDB.
   - The **Host Portal** at `/host` serves property owners.  It features an onboarding wizard with property import, goals selection and host benefits; a dashboard with analytics; recommendation management and a unified inbox for guest messaging.

2. **API Layer** – A Node.js/Express server (or serverless functions) exposes RESTful endpoints consumed by the client apps.  The API layer performs authentication, authorisation and validation and orchestrates database reads/writes.  It serves both guest and host functions and acts as the gateway for third‑party integrations.

3. **Database** – A relational database (e.g. PostgreSQL) stores persistent entities such as users, properties, recommendations, messages and analytics events.  The schema is designed with foreign keys to maintain consistency between guests, hosts and their associated guides.

4. **Real‑Time Messaging** – A WebSocket or server‑sent events (SSE) service (e.g. Socket.IO or Firebase Realtime Database) enables real‑time chat between guests and hosts.  Messages are persisted in the database and queued for offline delivery.

5. **Third‑Party Services** – StayWise integrates with several external APIs:
   - **Property Listing Services** (Airbnb, Vrbo, Booking.com) for host property import via OAuth or URL parsing.
   - **Google Maps Platform** for maps, geocoding, directions and place details.
   - **eSIM/Travel Data Provider** for offering travel data packages in the Wi‑Fi & Internet page.
   - **Payment & Booking Provider** (future phase) for booking tours and processing payments.
   - **Email/SMS/WhatsApp Providers** for notifications and messages.

The diagram below (in textual form) summarises the system components and their interactions:

```
Guest Browser  ←→  Service Worker & IndexedDB ←→  React Guest App  ←→  REST API  ←→  Database
Host Browser   ←→  React Host Portal          ←→  REST API  ←→  Database
                                           ↘
                                Third‑Party Services (OAuth, Maps, eSIM, Payments)
```

## Front‑End Architecture

### Framework & Tooling

The front‑end is built with **React 18**, bootstrapped by Vite for fast development and compiled into two separate bundles for guests and hosts.  **TypeScript** is used throughout to provide strong typing and ensure API contracts are honoured.  **Tailwind CSS v4** is the base styling system, and the design system leverages **Radix UI primitives** combined with **shadcn/ui** components to build accessible, composable UI components.  Animations are handled via **Framer Motion** and global styling tokens (spacing, colours, typography) are defined in `src/styles/tokens.css` for consistency.

### Routing & Code Structure

The application uses React Router v6 to define routes for each high‑level screen.  There are separate route definitions for the Guest and Host apps, but they share many underlying components.  The key sections are:

- `/onboarding` – Multi‑step onboarding flows.  The guest version includes benefits, four accordion questions (trip context, travel style, budget, preferences) with completion ticks and a reward screen.  The host version includes benefits, property import, goals selection and a completion screen.
- `/home` – The main dashboard.  For guests this shows the welcome card, essentials grid, host message card and recommendation feed.  For hosts it shows an analytics overview and call‑to‑action to add recommendations or view chats.
- `/essentials` – Screens for Wi‑Fi & Internet, Check‑In, House Rules, Parking, Emergency and a combined Essentials page that summarises all property info.  These pages cross‑link to one another via sticky headers and quick action bars.
- `/explore` – The recommendation browser with category filters, search, sorting and save actions.  Cards open modals with more details; favourites are saved to local storage and the back‑end.
- `/map` – An interactive map showing property and recommendation pins.  Works offline by pre‑caching the top pins; clicking a pin opens its details and offers directions.
- `/chat` – Real‑time messaging with offline queueing.  Chat threads can be accessed from any screen via the host message card or a persistent floating action button.
- `/profile` – The profile/settings page.  Allows users to update their name, language, currency, dark mode and to view saved guides.  The host version includes subscription and property management.

Within the `src/features` folder, each domain feature (e.g. onboarding, recommendations, chat) encapsulates its own state, hooks, services and UI components.  Shared UI elements live in `src/components`.  Global context providers manage app‑wide state such as authentication, theme, language, currency and guide data.

### State Management

Because StayWise is a multi‑page SPA, state flows through React context and custom hooks.  Key contexts include:

1. **AuthContext** – Holds the current user and mode (guest or host).  Provides login/logout functions and persists tokens in localStorage.
2. **GuideContext** – Stores property data, recommendations, messages and personalization answers.  Provides CRUD operations and synchronises with the API.
3. **ThemeContext** – Manages dark/light mode and triggers dynamic CSS variables via Tailwind.
4. **I18nContext** – Supplies translation strings and currency formatting.  Uses `react-i18next` for language switching.

Local caching uses IndexedDB (via idb library) for large data sets such as recommendations and messages, while basic preferences are stored in localStorage.  The service worker intercepts network requests and serves cached assets when offline.

### UI Patterns & Design Tokens

The design system adheres to Material 3 and iOS 26 guidelines but customised with the StayWise brand.  Key patterns include:

- **Liquid glass cards** – All cards use a radius of 16 px, backdrop blur of 16 px and a semi‑transparent border (1 px, rgba(255,255,255,0.10)).  These cards create a frosted glass effect consistent across onboarding screens, the home page, recommendation cards and settings.
- **Glow accents** – Active elements (buttons, icons, category chips) use a subtle glow on hover/press (blue for guests, gold for hosts).  Superhost badges and incentives use more pronounced glows.
- **Progress steppers** – Onboarding uses liquid steppers with pulsing active dots and labels like “Step 3 of 6”.
- **Accordion with ticks** – The guest onboarding questions collapse into header rows showing a check‑circle when answered.  Only one accordion remains open at a time.
- **Sticky Bars & Quick Actions** – Each detail page shows a sticky header with context (e.g. “Check‑In & Check‑Out”) and a bottom bar with quick actions like copying Wi‑Fi, opening maps, calling the host or saving a favourite.
- **Offline badges** – Info sections that are cached offline display a badge indicating offline availability.

These tokens and patterns are defined in the `tokens.css` and `globals.css` files and reused throughout the application.

## Back‑End Architecture

The back‑end is built on **Node.js** and **Express**, exposing a set of RESTful endpoints.  The server can run as a monolith or be deployed as independent serverless functions (e.g. on AWS Lambda or Vercel).  Key characteristics include:

1. **Authentication & Authorization** – JSON Web Tokens (JWTs) issued upon login/registration.  Hosts and guests have different scopes.  Third‑party OAuth tokens (for Airbnb/Vrbo/Booking.com) are stored encrypted and refreshed as needed.

2. **API Endpoints** – A selection of endpoints include:
   - `POST /auth/login`, `POST /auth/register` – Guest/host login and registration.
   - `GET /guides/{propertyId}` – Retrieve a property’s guide for guests, including Wi‑Fi, check‑in info, recommendations and messages.  Supports offline diffing via `If-Modified-Since` headers.
   - `POST /guides/{propertyId}/personalize` – Save guest personalization answers and trigger recommendation sorting.
   - `GET /recommendations/{propertyId}` – List recommendations with optional category, distance and personalization filters.
   - `POST /recommendations` – Host creates a recommendation; `PUT /recommendations/{id}` to update; `DELETE /recommendations/{id}` to remove.
   - `GET /messages/{conversationId}`, `POST /messages/{conversationId}` – Real‑time messaging endpoints (WebSocket recommended for live updates).  Fallback to long polling when WebSockets are unavailable.
   - `GET /analytics/hosts/{hostId}` – Summarised engagement metrics for hosts.
   - `POST /import/airbnb`, `POST /import/vrbo`, `POST /import/booking` – Import property data via OAuth or listing URL.  Parses listing details and images and stores them in the database.
   - Additional endpoints for payments and bookings will be added in future phases.

3. **Database Schema** – A simplified schema includes:
   - `users` (id, role, name, email, phone, locale, currency, created_at).  Role can be `guest` or `host`.
   - `properties` (id, host_id, title, description, address, geo_lat, geo_lng, check_in_time, check_out_time, wifi_ssid, wifi_password, house_rules, parking_info, emergency_info, created_at).
   - `recommendations` (id, property_id, title, description, category, image_url, geo_lat, geo_lng, url, price_range, affiliate, created_at).
   - `messages` (id, conversation_id, sender_id, recipient_id, content, type, sent_at, delivered_at).
   - `conversations` (id, guest_id, host_id, property_id, last_message_at).
   - `personalization_answers` (id, guest_id, property_id, trip_purpose, travel_style, budget, preferences_json, answered_at).
   - `analytics_events` (id, user_id, event_type, metadata_json, created_at).

   These tables can be expanded with indexes and foreign keys to optimise queries and maintain referential integrity.

4. **Services & Workers** – Background jobs sync data with third‑party providers (e.g. refreshing listing details, geocoding addresses, sending analytics to a data warehouse).  Another worker monitors messages and triggers push notifications for offline users.

5. **Caching & Rate Limiting** – API responses that seldom change (e.g. property details, recommendations) are cached in Redis or an in‑memory store to reduce database load.  Rate limiting protects the API against abuse.

## Third‑Party Integrations

StayWise communicates with a variety of external services.  Integration concerns include authentication, error handling and fallback strategies.

1. **Property Import (Airbnb/Vrbo/Booking.com)** – Hosts authenticate via OAuth or provide a listing URL.  The import service fetches property metadata (name, address, description, photos, amenities, check‑in/out times).  StayWise maps these fields to its own schema and stores them in the database.  Tokens are stored securely and refreshed on expiry.  If the import fails, hosts can manually enter the details.

2. **Google Maps Platform** – Used in the Map & Favorites screen, the directions modal and geocoding tasks.  When offline, the app falls back to cached map tiles and stores the top N recommendation pins for offline rendering.  When the network is unavailable, external links gracefully degrade to static directions text.

3. **Travel eSIM Provider** – The Wi‑Fi & Internet screen offers eSIM packages.  The client fetches the latest deals via API and displays them under the Wi‑Fi details.  Guests can scan a QR code to download the eSIM app.  The API is called lazily and cached; when offline, the offers are hidden to avoid stale pricing.

4. **Messaging Provider** – Real‑time chat can be implemented via a managed service like Firebase or a self‑hosted Socket.IO server.  The client first attempts a WebSocket connection; if unavailable, it falls back to polling.

5. **Payment & Booking Provider** – Future phases integrate a payment gateway (e.g. Stripe, Adyen) to handle credit card payments for tours and upsells.  Payment flows are protected by PCI DSS‑compliant practices and 3‑D Secure (SCA).

## Offline Strategy

Offline support is critical for travellers.  The technical strategy includes:

- **Service Worker** – A custom service worker caches static assets (HTML, JS, CSS), fonts and images on install.  It intercepts API requests and serves cached responses when offline.  The `stale‑while‑revalidate` strategy is used for pages like Wi‑Fi and Check‑In so that the UI loads instantly and updates in the background when a connection is available.
- **IndexedDB** – Large dynamic data such as recommendations, messages and personalization answers are stored in IndexedDB.  The GuideContext synchronises the database when the network reconnects, resolving conflicts by preferring server updates for canonical fields (e.g. property details) and local updates for guest preferences and message drafts.
- **Persistent Queues** – Outgoing chat messages and personalization answers are queued and retried until successfully acknowledged by the server.  The UI indicates unsent items gracefully.
- **Mini Offline Map** – The map page pre‑caches a small offline map centred on the property with the top five recommendations.  Directions to those pins are stored in text form (e.g. “Turn left on…”) for offline reference.

## Security & Privacy

Security is baked into the architecture.  Key measures include:

- **Secure Transport** – All traffic is served over HTTPS.  The backend sets HSTS headers and uses secure cookies with `HttpOnly` and `SameSite` attributes.
- **Encrypted Storage** – Sensitive fields (passwords, OAuth tokens) are encrypted at rest using AES‑256.  Passwords are hashed with bcrypt.
- **Access Controls** – API endpoints enforce role‑based access control (RBAC).  Guests can only access their own guides; hosts can only manage their properties.
- **Data Minimisation** – The system only stores necessary guest data (personalization answers, messages) and provides options to delete data upon request.  Complies with GDPR and Thailand’s PDPA.
- **Input Validation** – All incoming data is validated and sanitized to prevent SQL injection and XSS attacks.  Output is escaped when rendering HTML/JSX.
- **Security Testing** – Automated security scanning and manual penetration tests are part of the CI/CD pipeline.

## Deployment & DevOps

StayWise can be deployed as a monolithic Node.js server or as microservices depending on scale.  A typical deployment includes:

- **Source Control** – The codebase is stored on GitHub.  Pull requests trigger continuous integration builds and tests.
- **CI/CD** – GitHub Actions or CircleCI handle linting, type checking, unit/integration tests and build steps.  Successful builds are deployed automatically to staging and then to production after manual approval.
- **Hosting** – The front‑end is deployed as a static PWA (e.g. on Vercel, Netlify or S3 + CloudFront).  The API runs on AWS Lambda, Vercel Serverless Functions or a Node.js server on EC2.  The database is hosted on a managed PostgreSQL service such as RDS or Neon.
- **Monitoring & Logging** – A log aggregation service (Datadog, Sentry) collects server logs and client‑side error reports.  Performance metrics (TTI, FCP, error rates) feed dashboards to maintain SLAs.
- **Infrastructure as Code** – Terraform or CloudFormation templates define infrastructure.  Secrets are managed via AWS Secrets Manager or HashiCorp Vault.

## Developer Guidelines

Developers working on StayWise should follow these guidelines:

1. **Code Style** – Use ESLint and Prettier to enforce consistent formatting and avoid anti‑patterns.  TypeScript strict mode is enabled.
2. **Component Design** – Break UI into reusable, self‑contained components.  Keep presentational components separate from containers that manage state.
3. **Performance** – Avoid unnecessary re‑renders by memoizing components, using `React.lazy()` for code splitting and tuning the service worker cache.
4. **Accessibility** – Always provide semantic HTML, ARIA roles, keyboard navigation, high contrast and proper focus management.  Test with screen readers.
5. **Testing** – Write unit tests with Vitest and React Testing Library; integration tests for flows; end‑to‑end tests with Playwright.  Ensure coverage for critical flows like onboarding, offline caching and chat.
6. **Documentation** – Update PRD, Technical Blueprint, UI Guide and API Spec whenever changes occur.  Use the `CHANGELOG.md` to record updates.  Keep code comments clear and concise.
7. **Secure Coding** – Validate all inputs, avoid exposing secret keys on the client and follow the OWASP Top Ten for web security.

By following this blueprint, developers can maintain a high level of quality, ensure a unified user experience across the app and confidently integrate new features over time.