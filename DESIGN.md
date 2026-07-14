---
name: Kinetic Ledger
colors:
  surface: '#fcf8ff'
  surface-dim: '#dbd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#efecfa'
  surface-container-high: '#e9e6f4'
  surface-container-highest: '#e3e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#454555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f2effc'
  outline: '#767587'
  outline-variant: '#c6c4d8'
  surface-tint: '#4345e7'
  primary: '#3231d8'
  on-primary: '#ffffff'
  primary-container: '#4d50f0'
  on-primary-container: '#e6e4ff'
  inverse-primary: '#c0c1ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#893500'
  on-tertiary: '#ffffff'
  tertiary-container: '#b04600'
  on-tertiary-container: '#ffe1d4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#05006c'
  on-primary-fixed-variant: '#2724d0'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb694'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e3e1ee'
  success: '#22C55E'
  danger: '#EF4444'
  warning: '#F59E0B'
  surface-bg: '#F8FAFC'
  surface-border: '#E2E8F0'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  code-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 24px
  gutter: 16px
---

## Brand & Style

The design system is engineered for the high-velocity environment of POS (Point of Sale) operations, specifically tailored for UMKM (SME) owners. The brand personality is **reliable, professional, and approachable**, aiming to reduce the cognitive load of busy merchants while maintaining a modern, tech-forward aesthetic.

The design style follows a **Modern Minimalist** approach. It prioritizes clarity and functional speed through a "utility-first" lens. The interface utilizes generous whitespace, a structured 8px grid, and soft organic shapes to transform a complex financial tool into an inviting digital assistant. Visual flair is used sparingly—only to provide feedback or highlight critical information—ensuring the user's focus remains on transaction efficiency and business insights.

## Colors

This design system utilizes a functional color palette rooted in clarity. The **Primary Indigo** is the signature brand color, used for all primary actions and brand identifiers. 

The neutral palette leverages **Slate and Gray scales** to create structural hierarchy. Backgrounds should use low-saturation slates to reduce eye strain during long shifts. 
- **Functional States:** Success, Danger, and Warning colors follow industry standards to ensure immediate recognition of system status (e.g., successful payment vs. low stock).
- **Dark Mode Readiness:** While the default is light, the palette is mapped to ensure that all semantic roles (e.g., `surface-primary`) can be inverted using a standard 900-to-50 scale swap in dark mode environments.

## Typography

The typography system is built exclusively on **Inter**, chosen for its exceptional legibility at small sizes and high x-height, which is critical for reading receipt data and inventory tables.

- **Scale:** The system uses a tight scale to maintain information density without sacrificing clarity.
- **Hierarchy:** Weight is used as the primary driver of hierarchy. Headlines are semi-bold to bold to anchor page sections, while body text remains regular weight for maximum readability.
- **POS Utility:** For numerical data (prices, stock counts), ensure the use of tabular lining figures (if supported) to maintain vertical alignment in lists and tables.

## Layout & Spacing

This design system operates on a strict **8px square grid**. All measurements for height, width, padding, and margins must be multiples of 8 (with 4px used as a "half-step" for tight component internals).

- **Grid Model:** A 12-column fluid grid is used for desktop, shifting to a 4-column grid for mobile.
- **Touch Targets:** In the POS context, interactive elements must maintain a minimum hit area of 44x44px. Use `md` (16px) or `lg` (24px) spacing between buttons to prevent accidental taps during rapid checkout.
- **Breakpoints:**
  - Mobile: up to 767px (Full width cards, stacked forms).
  - Tablet: 768px - 1279px (Sidebar collapses to icons, 2-column grids).
  - Desktop: 1280px+ (Permanent sidebar, multi-column dashboard layouts).

## Elevation & Depth

Depth in the design system is conveyed through **Tonal Layering** and **Ambient Shadows**. This creates a logical stack that guides the user's eye toward the most important interaction layer.

- **Level 0 (Base):** Background surface (`#F8FAFC`). Flat.
- **Level 1 (Cards/Containers):** Raised surface. Uses `shadow-sm` (a soft, low-opacity gray shadow) to indicate interactivity.
- **Level 2 (Modals/Overlays):** Floating surface. Uses `shadow-md` with a larger blur radius and a 15% opacity backdrop blur (glassmorphism Lite) to focus user attention on the task at hand.
- **Outlines:** Use 1px borders in `surface-border` for all Level 1 containers to maintain definition even when shadows are subtle.

## Shapes

The shape language is defined by **consistent, generous rounding**. A base radius of **12px** (Level 2: Rounded) is applied to all primary containers, including buttons, input fields, and cards.

- **Consistency:** All corners within a component must be rounded. For example, an image inside a card should have a nested radius (typically 8px) to visually harmonize with the 12px outer card border.
- **Status Badges:** While primary elements use 12px, small status badges or chips may use a full pill-shape (999px) to distinguish them from actionable buttons.

## Components

- **Buttons:** Primary buttons use the Indigo background with white text and 12px rounding. They must include a `200ms` ease-in-out transition on hover, shifting the background color slightly darker.
- **Inputs:** Text fields should have a 1px border (`#E2E8F0`) and 12px rounding. On focus, the border transitions to Primary Indigo with a soft 2px glow (ring).
- **Cards (`<ReusableCard />`):** The cornerstone of the dashboard. Includes a 1px border, 12px radius, and `shadow-sm`. Content inside should follow the 16px (md) internal padding rule.
- **Chips/Badges:** Small, low-contrast indicators for status. Use the functional colors (Success, Danger, Warning) with a 10% opacity background of the same hue for a soft, modern look.
- **Lists & Tables:** Rows must have a minimum height of 48px for touch friendliness. Use subtle dividers (`1px solid #E2E8F0`) and a hover state background of `#F1F5F9`.
- **Modals:** Centered with a semi-transparent backdrop. Always include a clear "X" close action and primary/secondary button pairings at the bottom right.