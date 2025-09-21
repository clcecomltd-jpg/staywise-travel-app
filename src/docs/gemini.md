# Gemini (Figma & Design) Custom Instructions: StayWise Travel App

This document provides guidance for using **Google Gemini** (or any generative design model) to produce high‑fidelity UI designs, mockups and Figma frames for the StayWise Travel App.  Gemini should be used for generating and refining visual designs; it is not expected to write code.  These instructions ensure that design outputs adhere to our product requirements, design system and accessibility standards.

## 1. Design Foundations

1. **Visual Style** – StayWise combines Material 3 principles with iOS 26 aesthetics.  Key traits include:
   - **Liquid glass cards** with soft 3D edges: radius 16 px, backdrop blur 16 px, semi‑transparent borders.
   - **Colour palette**: primary blue (`#007AFF`) for guest actions and highlights; gold (`#FFD700`) for host accent; neutral dark backgrounds (`#0A0F1E` to `#000000`) with gradient overlays; muted text colours (`rgba(255,255,255,0.75)`) on dark surfaces.
   - **Glow effects** on active icons, progress steppers and buttons; glows should be subtle and not overpower the content.
   - **Typography**: follow Material 3’s type scale; headings use 32 px/20 px sizes; body text uses 14 px/16 px sizes.  Ensure text remains legible against backgrounds.

2. **Components & Patterns** – Reuse established patterns:
   - **Progress Steppers** with glowing dots and labels (e.g. “Step 3 of 6”).
   - **Accordions** that collapse when answered and display a check‑circle; only one accordion expanded at a time.
   - **Carousels** with horizontally scrolling cards and category chips.
   - **Sticky Headers** indicating the current section and providing quick back navigation.
   - **Quick Action Bars** at the bottom of detail pages with call, directions, copy Wi‑Fi and share buttons.
   - **Modals & Overlays** for recommendation details; use rounded corners and a subtle drop shadow.
   - **Offline Badges** to indicate when content is cached and available offline.

3. **Accessibility** – Ensure designs meet WCAG 2.1 AA:
   - Colour contrast ≥ 4.5:1 for text and interactive elements.
   - 48 × 48 dp touch targets with adequate spacing.
   - Clear focus indicators for keyboard navigation.
   - Accommodate screen reader users by labeling icons and interactive elements.

## 2. Workflow

1. **Start with wireframes** – Before generating final visuals, outline the user flow with wireframes.  Use low‑fidelity frames to validate layout, hierarchy and navigation.  Annotate each frame with the purpose and interaction triggers.

2. **Generate mockups in context** – When creating screens, include the surrounding UI (top controls, bottom tab bar) so the design feels cohesive.  Avoid floating isolated elements without context.

3. **Use design tokens** – Import the colour and spacing tokens defined in `tokens.css` (e.g. 4/8/12/16 px spacing increments).  Use the same radii, shadows and typography settings across screens.  Do not invent new values unless intentionally exploring variations.

4. **Cross‑navigation & Consistency** – Incorporate cross‑links between related screens.  For example, the Check‑In page should have links to Wi‑Fi details, host contact and maps; the Essentials page should summarise content from individual sections.  Use consistent card layouts and offline badges across pages.

5. **Personalisation & Rewards** – Visualise the personalization flow with accordion questions, progress steppers and reward screens.  Show how category chips change colour when selected.  Include the incentive banner on the completion screen (e.g. “🎁 Thanks for personalizing! Enjoy your free mini‑guide”).

6. **Mode Variations** – When designing host screens, adjust the accent colour to gold and highlight analytics and call‑to‑action elements relevant to hosts.  Keep layouts consistent with guest screens but tailor content.

7. **Responsive behaviour** – Design primarily for mobile (430 px width) but ensure key components can adapt to tablet and desktop widths.  Use auto layout and constraints to maintain spacing and alignment on different viewports.

8. **Hand‑off ready** – When finalising frames, ensure layers are named clearly (e.g. `Card/Welcome`, `Button/Primary`) and grouped logically.  Include notes for developers about intended interactions (hover, pressed, disabled states) and transitions (duration, easing).

## 3. Prompt Examples

> **Onboarding Accordion Screen (Guest)**  
> “Create a mobile onboarding screen (430 px wide) for guest personalisation questions.  Use a dark gradient background.  At the top, include the StayWise logo, a title ‘Tell us about your trip’ and subtitle ‘What brings you to Bangkok?’.  Display five glass cards with icons (building‑2, utensils, palm‑tree, music‑4, landmark) and labels (City Break, Foodie Adventure, Relax & Escape, Nightlife, Culture & History).  The first card should be selected (blue glow).  At the bottom, include a stepper showing step 3 of 6 and a primary ‘Next’ button.  Add the home icon, dark mode toggle and Testing Mode switch at the top bar.”

> **Home Screen**  
> “Design the guest home page for StayWise.  Include a sticky top bar with StayWise logo, dark mode toggle, settings gear and a glowing compass that returns to the first screen.  Below, add a welcome card with guest name and property details (check‑in/out times).  Underneath, present a 3×2 grid of essentials (Wi‑Fi, Check‑in, Directions, House Rules, Local Tips, View All) using glass cards.  Insert a host message card with superhost badge and action buttons (Contact Me, View Recommendations).  Then add a host recommendations section with category chips (Events, Food, Tours) and two horizontally scrollable recommendation cards per row.  Add a floating action button in the bottom right for chat.  Use liquid glass effects and glows consistent with the design system.”

> **Host Dashboard Overview**  
> “Create a host dashboard screen showing analytics widgets (pie chart for booking sources, bar chart for recommendation clicks, line chart for guest satisfaction).  Use gold accents for highlights.  Provide quick actions to ‘Add Recommendation’, ‘View Messages’ and ‘Invite New Guests’.  Include the unified inbox preview and a small KPI summary (check‑ins today, average rating).”

By adhering to these instructions, Gemini will produce designs that align with the StayWise brand, support our user flows and are ready for hand‑off to developers.