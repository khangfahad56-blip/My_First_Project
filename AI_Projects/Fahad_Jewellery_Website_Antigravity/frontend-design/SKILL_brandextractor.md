---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Extracted brand design system and guidelines for Blue Nile (www.bluenile.com).
license: Complete terms in LICENSE.txt
---

# Frontend Design & Brand Identity: Blue Nile (www.bluenile.com)

This document contains the complete brand design system, visual identity, color tokens, typography scale, UI component styles, and asset reference extracted directly from **[Blue Nile](https://www.bluenile.com/)** for building high-end luxury jewelry e-commerce experiences.

---

## 🎨 Brand Color Palette

The Blue Nile visual identity balances deep sapphire ocean navy tones with high-contrast text and warm gold accents to highlight diamond brilliance and luxury craftsmanship.

| Role | Token Name | Hex Code | Visual Description |
| :--- | :--- | :--- | :--- |
| **Primary Brand Navy** | `--color-primary` | `#0C1636` | Deep Sapphire Navy – Used for headers, main brand elements, dark buttons |
| **Secondary Brand Blue** | `--color-secondary` | `#151542` | Royal Navy Blue – Used for hover states, footers, and structural panels |
| **Interactive Accent** | `--color-accent-blue` | `#0066FF` | Vivid Sapphire Blue – Used for link highlights, active filters, selected states |
| **Luxury Gold Accent** | `--color-accent-gold` | `#C5A059` | Warm Diamond Gold – Used for star ratings, trust badges, highlight tags |
| **Background Pearl** | `--color-bg` | `#FFFFFF` | Pure Pearl White – Main background surface |
| **Surface Off-White** | `--color-bg-surface` | `#FAF9F6` | Light Soft Gray/Ivory – Card backgrounds, section backgrounds |
| **Text Primary (Onyx)** | `--color-text` | `#1A1A1A` | Deep Charcoal/Onyx – Primary headings and readable body text |
| **Text Muted** | `--color-text-muted` | `#595959` | Medium Neutral Gray – Subtitles, secondary captions, metadata |
| **Border Neutral** | `--color-border` | `#E5E5E5` | Subtle Silver Line – Divider lines, input borders, card outlines |

---

## 🔤 Typography & Hierarchy

Blue Nile pairs a classic, high-contrast serif (`Lora`) for editorial elegance with clean, modern sans-serif fonts (`Nunito Sans` / `Gantari` / `Outfit`) for high readability across e-commerce listings.

- **Heading Display Font**: `'Lora', 'Outfit', Georgia, serif`
- **Primary Body Font**: `'Nunito Sans', 'Gantari', sans-serif`
- **Accent Script Font**: `'Pinyon Script', cursive` (For luxury heritage notes & quotes)
- **Monospace / Code Font**: `'Roboto Mono', monospace`

### Typographic Scale
- **H1 (Hero Heading)**: `48px` (3rem) | Weight: `700` / `500` | Line Height: `1.15` | Tracking: `-0.02em`
- **H2 (Section Heading)**: `36px` (2.25rem) | Weight: `400` / `600` | Line Height: `1.25`
- **H3 (Card Title)**: `24px` (1.5rem) | Weight: `500` | Line Height: `1.3`
- **H4 (Sub-heading)**: `18px` (1.125rem) | Weight: `600`
- **Body Large**: `16px` (1rem) | Weight: `400` | Line Height: `1.5`
- **Body Standard**: `14px` (0.875rem) | Weight: `400` | Line Height: `1.5`
- **Caption / Legal**: `12px` (0.75rem) | Weight: `400`

---

## 🖼️ Brand Assets & Media

- **Primary Logo**: [Blue Nile Wordmark SVG](https://ecommo--ion.bluenile.com/bn-main/logo.6b793.svg) *(Faceted blunted-serif typography in `#0C1636`)*
- **Hero OG Banner**: [Blue Nile Diamond Rings Hero Graphic](https://ecommo--ion.bluenile.com/bn-main/diamond_rings_img.4d73c.png)
- **Favicon**: [Blue Nile Favicon ICO](https://ecommo--ion.bluenile.com/bn-main/favicon.ca59c.ico)

---

## 🔘 UI Components & Styling System

- **Base Spacing Unit**: `8px` (Scale: `8px`, `16px`, `24px`, `32px`, `48px`, `64px`)
- **Border Radius**: `4px` (Clean, refined corners for jewelry boxes and product cards)
- **Pill Radius**: `9999px` (Badges, tag filters)

### Primary Button
- **Background**: `var(--color-primary)` (`#0C1636`)
- **Text Color**: `#FFFFFF`
- **Border Radius**: `4px`
- **Padding**: `14px 28px`
- **Font**: `14px`, SemiBold `600`, Uppercase tracking `0.05em`
- **Hover State**: `background: #151542; transform: translateY(-1px); shadow: 0 4px 12px rgba(12, 22, 54, 0.2);`

### Secondary / Outline Button
- **Background**: `transparent`
- **Text Color**: `var(--color-primary)` (`#0C1636`)
- **Border**: `1px solid var(--color-primary)`
- **Border Radius**: `4px`
- **Padding**: `14px 28px`
- **Hover State**: `background: rgba(12, 22, 54, 0.04);`

### Product Card
- **Background**: `#FFFFFF`
- **Border**: `1px solid #E5E5E5`
- **Border Radius**: `4px`
- **Box Shadow**: `0 2px 8px rgba(12, 22, 54, 0.06)`
- **Hover Effect**: `0 8px 24px rgba(12, 22, 54, 0.12)`, subtle image scale `1.03`

---

## 💻 Exported CSS Design Tokens (`brand-tokens.css`)

```css
:root {
  /* Color Palette */
  --color-primary: #0c1636;
  --color-primary-hover: #151542;
  --color-secondary: #151542;
  --color-accent-blue: #0066ff;
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

  /* Spacing & Layout */
  --space-unit: 8px;
  --border-radius: 4px;
  --border-radius-pill: 9999px;

  /* Shadows & Transitions */
  --shadow-sm: 0 2px 8px rgba(12, 22, 54, 0.06);
  --shadow-md: 0 4px 16px rgba(12, 22, 54, 0.1);
  --shadow-lg: 0 8px 32px rgba(12, 22, 54, 0.15);
  --transition-fast: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 🎯 Design Philosophy & Aesthetic Guidelines

1. **Elevated Approachability**: The design must feel high-end without being overwhelming or exclusionary. Use spacious layouts, crisp white framing, and deep ocean navy contrast.
2. **Facet-Inspired Typography**: Use clean serif headlines for editorial prestige paired with responsive, highly legible sans-serif body copy.
3. **Product-Centric Canvas**: Images of diamonds, gems, and gold pieces take center stage. Backgrounds remain ultra-clean (`#FFFFFF` and `#FAF9F6`).
4. **Subtle Gold Touches**: Gold (`#C5A059`) is used sparingly for star ratings, certifications (GIA/AGSL), and luxury highlights to maximize visual impact.
