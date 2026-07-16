---
name: Sovereign Intelligence
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fc'
  on-secondary-container: '#57657a'
  tertiary: '#4d556b'
  on-tertiary: '#ffffff'
  tertiary-container: '#656d84'
  on-tertiary-container: '#eef0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485b'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  sidebar-width: 280px
  gutter: 24px
  margin-page: 32px
  space-xs: 4px
  space-sm: 8px
  space-md: 16px
  space-lg: 24px
  space-xl: 48px
---

## Brand & Style
The design system is engineered for high-stakes parliamentary intelligence and legislative analysis. It balances the gravitas of a government institution with the velocity of a modern data platform. The visual language is **Corporate / Modern**, prioritizing information density, clarity, and authority.

The aesthetic avoids decorative flourishes in favor of utility. It employs a "High-Density Professional" style: a rigid adherence to alignment, a crisp white-and-grey foundation, and a single authoritative accent color. The goal is to evoke a sense of reliability and precision, ensuring users can parse complex legislative data and political sentiment without visual fatigue.

## Colors
The palette is rooted in institutional trust. The **Primary Blue** (#2563eb) is used for critical actions, active states, and focus indicators. **Slate** (#475569) serves as the secondary color for icons and sub-headers, providing enough contrast for accessibility without competing with the primary data.

The neutral system is expansive to create subtle hierarchy:
- **Backgrounds:** Pure white (#ffffff) for primary content areas; Slate-50 (#f8fafc) for sidebars and background fills.
- **Borders:** Slate-200 (#e2e8f0) for standard containers; Slate-300 (#cbd5e1) for interactive inputs.
- **Text:** Slate-900 (#0f172a) for headings to ensure maximum legibility; Slate-600 (#475569) for body and metadata.

## Typography
**Inter** is the sole typeface for this design system, chosen for its exceptional legibility in data-heavy environments. 

- **Hierarchy:** Use semi-bold (600) for all semantic headings to establish a clear vertical rhythm.
- **Data Density:** Body-sm (13px) is the workhorse for data tables and sidebar navigation to maximize information per screen.
- **Labels:** Use Label-md for table headers and section titles to differentiate structural elements from user-generated content.
- **Numerical Data:** For legislative tracking and vote counts, ensure the use of tabular lining figures (tnum) to maintain alignment across rows.

## Layout & Spacing
This design system utilizes a **fixed-fluid hybrid grid**. The application is structured around a permanent left-hand sidebar navigation (280px), with the main content area expanding to a maximum of 1440px.

- **Grid:** A 12-column grid is used within the content area. Data dashboards should utilize 4-column or 6-column spans for modular widgets.
- **Spacing Rhythm:** An 8px base unit (linear scale) governs all padding and margins. 
- **Breakpoints:**
  - **Desktop (1280px+):** Full 12-column grid, sidebar expanded.
  - **Tablet (768px - 1279px):** Sidebar collapses to icons only (64px); 8-column grid.
  - **Mobile (<767px):** Single column flow, top navigation bar replaces sidebar.

## Elevation & Depth
Elevation is used sparingly to maintain a clean, flat aesthetic inspired by modern enterprise dashboards. Depth is communicated through tonal layers rather than heavy shadows.

- **Level 0 (Flat):** Background surfaces (#f8fafc).
- **Level 1 (Surface):** Main content cards and white containers (#ffffff) with a 1px border (#e2e8f0).
- **Level 2 (Overlay):** Dropdowns, tooltips, and floating menus. These use a refined shadow: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`.
- **Level 3 (Modal):** Centered dialogs. These use a more aggressive shadow to create focus: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`.
- **No Glassmorphism:** All surfaces are 100% opaque to ensure maximum contrast for legislative text.

## Shapes
The shape language is conservative and geometric. A standard **8px (0.5rem)** radius is applied to all primary UI components including buttons, input fields, and cards. 

- **Inputs & Buttons:** 8px (rounded-md).
- **Large Containers:** 12px (rounded-lg) for main dashboard widgets.
- **Small Elements:** 4px (rounded-sm) for checkboxes, tags, and status indicators.
- **Strictness:** Do not use pill-shaped buttons; maintaining rectangular forms reinforces the professional, systematic nature of the platform.

## Components
- **Buttons:** Primary buttons use the Primary Blue (#2563eb) with white text. Secondary buttons use a white fill with a Slate-200 border. Use 12px horizontal padding and 8px vertical padding for standard buttons.
- **Data Tables:** The core of the platform. Use a 40px row height for high density. Headers must be Slate-50 background with Label-md typography. Row borders are 1px solid Slate-100.
- **Input Fields:** Use 1px Slate-300 borders. On focus, transition to 1px Primary Blue with a 3px soft blue glow (Primary Blue at 10% opacity).
- **Chips/Tags:** Used for "Legislative Status" or "Party Affiliation." These should be flat with a light tinted background (e.g., Status: Passed = Green-100 background, Green-800 text).
- **Cards:** Used to group dashboard metrics. Cards must have a 1px Slate-200 border and no shadow unless they are interactive or hoverable.
- **Sidebar:** Dark theme variant for the navigation is permitted (Slate-900 background) to separate "Management" from "Analysis," or keep it Slate-50 for a unified light-mode look. Active items should be marked with a 3px vertical "Primary Blue" stripe on the left edge.