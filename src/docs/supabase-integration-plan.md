# Supabase Integration & Host Onboarding Plan

## 1. Environment Setup
- [ ] Confirm Supabase project, anon key, and service role key.
- [ ] Store keys in Vercel/CI secrets (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
- [ ] Install `@supabase/supabase-js` in the frontend and initialise a shared client helper.

## 2. Database Schema
- [ ] Create tables using Supabase SQL editor:
  - `accounts`, `account_memberships`, `properties`, `property_imports`, `property_assets`, `stays`, `guest_access_tokens`, `amenities`, `property_amenities`.
- [ ] Define enums: `provider_type (airbnb|vrbo|booking|manual)`, `account_role (owner|manager|support)`.
- [ ] Add RLS policies so:
  - Hosts see only properties tied to their membership.
  - Guests see data scoped to their `stay_id`.
  - Service role can bypass for background jobs.
- [ ] Seed amenity reference data.

## 3. Edge Functions
- [ ] `import-listing` function:
  - Accept provider + URL.
  - Fetch listing via ScrapingBee/Browserless.
  - Normalise to canonical JSON.
  - Write to `property_imports`, upsert `properties`, queue photo uploads to Storage.
- [ ] `issue-guest-link` function:
  - Accept `stay_id`.
  - Mint signed JWT or magic code tied to stay.
  - Insert hashed token into `guest_access_tokens`.
  - Return link for notification service.
- [ ] Configure `supabase/functions` directory and deploy.

## 4. Frontend Integration
- [ ] Update host onboarding “Property Import” step:
  - Add provider picker + URL input.
  - Call `import-listing`.
  - Poll or subscribe to Supabase channel for status.
  - Display success/failure states and allow manual override.
- [ ] Persist import result in onboarding context; pass into `MainHostApp` and guest `PropertyScreen`.
- [ ] Swap hard-coded property data with Supabase queries guarded by RLS.

## 5. Guest Access Flow
- [ ] Host dashboard action to “Invite guest”:
  - Creates `stays` record (arrival/departure).
  - Calls `issue-guest-link`; send email/SMS via Supabase templates or external provider.
- [ ] Guest magic link exchanges token for session (`supabase.auth.exchangeCodeForSession`) and sets mode to guest.
- [ ] Ensure guest UI renders stay-scoped property data and permissions.

## 6. Operations & QA
- [ ] Add Vitest/Playwright tests for onboarding flow and property import.
- [ ] Instrument Edge Functions with Supabase logs; configure alerts for failures.
- [ ] Document manual import fallback and troubleshooting steps.

## 7. Future Enhancements
- [ ] Replace scraping with official OTA OAuth when budget allows.
- [ ] Introduce background job service if Edge Function limits hit.
- [ ] Add analytics dashboards for host property performance.

