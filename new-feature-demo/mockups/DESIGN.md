---
name: Azure Assurance
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#42474e'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#72777f'
  outline-variant: '#c2c7cf'
  surface-tint: '#346289'
  primary: '#003657'
  on-primary: '#ffffff'
  primary-container: '#1b4d73'
  on-primary-container: '#91beea'
  inverse-primary: '#9ecbf7'
  secondary: '#1b6d24'
  on-secondary: '#ffffff'
  secondary-container: '#a0f399'
  on-secondary-container: '#217128'
  tertiary: '#00316c'
  on-tertiary: '#ffffff'
  tertiary-container: '#004796'
  on-tertiary-container: '#96b9ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cee5ff'
  primary-fixed-dim: '#9ecbf7'
  on-primary-fixed: '#001d33'
  on-primary-fixed-variant: '#174a70'
  secondary-fixed: '#a3f69c'
  secondary-fixed-dim: '#88d982'
  on-secondary-fixed: '#002204'
  on-secondary-fixed-variant: '#005312'
  tertiary-fixed: '#d7e2ff'
  tertiary-fixed-dim: '#acc7ff'
  on-tertiary-fixed: '#001a40'
  on-tertiary-fixed-variant: '#004491'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Manrope
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-md:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
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
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  sidebar-width: 260px
  gutter: 24px
  margin-page: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is built on a foundation of **Corporate / Modern** aesthetics, tailored for the insurance and fintech sectors. It evokes a sense of stability, transparency, and efficiency. The personality is institutional yet accessible, prioritizing clarity of information over decorative flair. 

The visual language utilizes a structured sidebar layout, high-contrast typography, and a "clean-room" approach to data density. It is designed to instill confidence in users managing sensitive financial and health-related information, ensuring that every interaction feels deliberate and secure.

## Colors
The palette is dominated by a professional "Deep Azure" primary color, used for navigation and brand-heavy elements to establish authority. A "Growth Green" serves as the secondary accent, specifically reserved for positive financial indicators and active statuses.

- **Primary:** Deep Azure (#1B4D73) for sidebars, primary headings, and brand identity.
- **Secondary:** Growth Green (#2E7D32) for "Active" states and currency values.
- **Neutrals:** A range of cool grays from off-white (#F8F9FA) for backgrounds to a dark slate for secondary text.
- **Accents:** High-contrast white for text on dark backgrounds and subtle border grays (#DEE2E6) for structural separation.

## Typography
This design system utilizes a dual-font strategy. **Manrope** is used for headlines to provide a modern, slightly rounded, and confident character. **Inter** is used for all functional body text, labels, and data points to ensure maximum legibility at small sizes.

Hierarchy is strictly enforced through weight changes. Primary headers use Bold (700), while UI labels and navigation links use SemiBold (600) or Medium (500). Numerical data in tables and cards should use Inter with tabular lining figures if available.

## Layout & Spacing
The layout follows a **Fixed Sidebar / Fluid Content** model. The navigation remains docked to the left, while the dashboard content expands to fill the viewport.

- **Grid:** A 12-column grid is used within the content area for card layouts.
- **Side Navigation:** Fixed width at 260px, utilizing high-contrast inverted styling.
- **Data Tables:** Horizontal rows are spacious, with 16px of vertical padding to ensure rows are easily scannable.
- **Breakpoints:** On mobile, the sidebar collapses into a hamburger menu and page margins reduce from 32px to 16px.

## Elevation & Depth
Depth is created through **Tonal Layers** rather than heavy shadows. The primary background is a very light neutral, while interactive cards use white surfaces with high-precision, low-opacity ambient shadows.

- **Level 0:** Background surface (Cool Gray-50).
- **Level 1:** Content cards and Data Tables (White).
- **Shadows:** Use a single, soft shadow for cards: `0px 2px 4px rgba(0, 0, 0, 0.05)`.
- **Outlines:** 1px solid borders (#DEE2E6) are preferred for defining table boundaries and input fields to maintain a crisp, professional look.

## Shapes
The shape language is **Soft** and restrained. Large cards and buttons use a 0.5rem (8px) radius to soften the corporate aesthetic, while smaller elements like badges and input fields use a 0.25rem (4px) radius.

- **Containers:** 8px corner radius.
- **Interactive Elements:** 4px to 6px corner radius.
- **Avatars:** Circular (100% radius) for user identification.

## Components
- **Side Navigation:** Inverted color scheme (Azure background). Active items use a semi-transparent white overlay and a high-contrast label.
- **Cards:** White background, 8px radius, subtle 1px border. They contain a header row with an icon and label, a large display value, and a footer with a text-based action link.
- **Data Tables:** Bordered containers with a distinct header background (#F8F9FA). Rows use 14px Inter for high information density.
- **Status Chips:** Small, highly rounded (pill-shaped) containers. Use Green for "Active" and Gray for "Pending" or "Draft."
- **Buttons:** Primary buttons are Azure with white text. Secondary buttons use an outline style. Text-links include a trailing arrow (→) to signify navigation.
- **Input Fields:** Minimalist design with a 1px gray border and 4px radius, emphasizing the focus state with a primary Azure border.