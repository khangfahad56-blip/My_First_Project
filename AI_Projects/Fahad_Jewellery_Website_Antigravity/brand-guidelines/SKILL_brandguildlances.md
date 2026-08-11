---
name: brand-guidelines
description: Applies official brand colors, typography, design tokens, logo assets, and UI component styles to any artifact, website, or document. Use when brand guidelines, visual identity, design systems, CSS tokens, or company styling standards apply.
license: Complete terms in LICENSE.txt
---

# Brand Guidelines & Visual Identity System (Blue Nile Standard)

## Overview

This skill defines and applies official brand identity, color palettes, typography, UI component styles, and design system tokens extracted from Blue Nile (www.bluenile.com).

**Keywords**: branding, corporate identity, visual identity, styling, brand colors, typography, design tokens, UI components, brand guidelines, visual design

---

## Extracted Brand Guidelines & Design Tokens

### 🎨 Color Palette

**Main & Surface Colors:**
- **Primary Navy**: `#0C1636` - Primary brand elements, main text headers, dark CTAs
- **Secondary Navy**: `#151542` - Hover states, footers, dark subpanels
- **Background / Light**: `#FFFFFF` / `#FAF9F6` - Pure pearl background & soft off-white surfaces
- **Onyx Text**: `#1A1A1A` - Main body text and high-contrast titles
- **Muted Text**: `#595959` - Subtitles, captions, and secondary metadata
- **Border / Divider**: `#E5E5E5` - Subtle silver dividers and input frames

**Accent Colors:**
- **Interactive Accent (Blue)**: `#0066FF` - Primary action links, active filters, highlights
- **Luxury Gold Accent**: `#C5A059` - Diamond ratings, GIA/AGSL trust badges, highlight tags

---

### 🔤 Typography & Font Stacks

- **Heading Font**: `Lora`, `Outfit` (with `Georgia` fallback)
- **Body Font**: `Nunito Sans`, `Gantari` (with `sans-serif` fallback)
- **Script Accent**: `Pinyon Script` (with `cursive` fallback)
- **Code Font**: `Roboto Mono`, `monospace`

#### Font Hierarchy & Scale
- **H1 (Hero Heading)**: `48px` / Bold (`700`) / Line Height `1.15`
- **H2 (Section Header)**: `36px` / Regular-SemiBold (`600`) / Line Height `1.25`
- **H3 (Card Title)**: `24px` / Medium (`500`) / Line Height `1.3`
- **Body Text**: `14px` - `16px` / Regular (`400`) / Line Height `1.5`
- **Caption / Muted**: `12px` / Regular (`400`)

---

## 🖼️ Brand Assets & Media Guidelines

- **Primary Logo**: [Blue Nile Wordmark SVG](https://ecommo--ion.bluenile.com/bn-main/logo.6b793.svg)
- **Hero Image / OG Banner**: [Blue Nile Hero Graphic](https://ecommo--ion.bluenile.com/bn-main/diamond_rings_img.4d73c.png)
- **Favicon**: [Blue Nile Favicon ICO](https://ecommo--ion.bluenile.com/bn-main/favicon.ca59c.ico)

---

## 🔘 UI Component Design Tokens

- **Base Spacing Unit**: `8px` (multiples: `8px`, `16px`, `24px`, `32px`, `48px`)
- **Border Radius**: `4px` (Pill: `9999px`)
- **Primary Button**:
  - Background: `var(--color-primary)` (`#0C1636`)
  - Text Color: `#FFFFFF`
  - Border Radius: `4px`
  - Padding: `14px 28px`
  - Hover Effect: `background: #151542; shadow: 0 4px 12px rgba(12, 22, 54, 0.2);`
- **Secondary Button**:
  - Background: `transparent`
  - Text Color: `var(--color-primary)` (`#0C1636`)
  - Border: `1px solid var(--color-primary)`
  - Border Radius: `4px`
- **Card Components**:
  - Background: `#FFFFFF`
  - Shadow: `0 2px 8px rgba(12, 22, 54, 0.06)`
  - Border: `1px solid #E5E5E5`

---

## 💻 Exported CSS Tokens (`brand-tokens.css`)

```css
:root {
  /* Color Tokens */
  --color-primary: #0c1636;
  --color-secondary: #151542;
  --color-accent: #0066ff;
  --color-accent-gold: #c5a059;
  --color-bg: #ffffff;
  --color-bg-surface: #faf9f6;
  --color-text: #1a1a1a;
  --color-text-muted: #595959;
  --color-border: #e5e5e5;

  /* Typography */
  --font-heading: 'Lora', 'Outfit', Georgia, serif;
  --font-body: 'Nunito Sans', 'Gantari', sans-serif;
  --font-script: 'Pinyon Script', cursive;
  --font-code: 'Roboto Mono', monospace;

  /* Spacing & Borders */
  --border-radius: 4px;
  --border-radius-pill: 9999px;
  --space-unit: 8px;
  --box-shadow: 0 2px 8px rgba(12, 22, 54, 0.06);
}
```

---

## 🚀 Application & Best Practices

1. **Hierarchy First**: Always maintain high contrast between `--color-bg` (`#FFFFFF`) and `--color-text` (`#1A1A1A`).
2. **Elevated Approachability**: Use deep navy `#0C1636` for dominant CTA buttons and headers, paired with warm gold `#C5A059` accents.
3. **Consistent Spacing**: Use increments of the base spacing unit (`8px`, `16px`, `24px`).
4. **Interactive States**: Buttons and product cards feature smooth micro-animations (`all 0.2s cubic-bezier(0.16, 1, 0.3, 1)`).
