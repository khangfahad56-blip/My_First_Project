# 🎨 Brand Guidelines & Design System

> Extracted from **[https://www.bluenile.com/](https://www.bluenile.com/)**  
> **Color Scheme Mode**: `light`

---

## 🖌️ Color Palette

| Role | Color Token | Hex Code | Preview |
| :--- | :--- | :--- | :--- |
| **Primary** | `--color-primary` | `#0C1636` | `#0C1636` |
| **Secondary** | `--color-secondary` | `#151542` | `#151542` |
| **Accent / CTA** | `--color-accent` | `#FFFBF7` | `#FFFBF7` |
| **Background** | `--color-bg` | `#FFFFFF` | `#FFFFFF` |
| **Text Primary** | `--color-text` | `#111636` | `#111636` |
| **Text Muted** | `--color-text-muted` | `#6B7280` | `#6B7280` |

---

## 🔤 Typography & Font Family

- **Primary Body Font**: `Gantari, sans-serif`
- **Heading Font**: `Outfit, serif`
- **Code Font**: `monospace`

### Font Size Hierarchy
- **H1**: `44px`
- **H2**: `24px`
- **H3**: `24px`
- **Body**: `14px`

---

## 🖼️ Brand Assets & Media

- **Logo**: `.tmp\brand_assets\logo.svg`
- **Hero Graphic / OG Banner**: `.tmp\brand_assets\hero_og.png`
- **Favicon**: `.tmp\brand_assets\favicon.ico`

---

## 🔘 UI Components & Styling

- **Border Radius**: `0px`
- **Base Spacing Unit**: `4px`
- **Primary Button**:
  - Background: `transparent`
  - Text Color: `#0C1636`
  - Border Radius: `0px`
- **Secondary Button**:
  - Background: `#FFFFFF`
  - Text Color: `#0C1636`
  - Border: `#0C1636`

---

## 💻 CSS Variables (`brand-tokens.css`)

```css
:root {
  /* Colors */
  --color-primary: #0C1636;
  --color-secondary: #151542;
  --color-accent: #FFFBF7;
  --color-bg: #FFFFFF;
  --color-text: #111636;
  --color-text-muted: #6B7280;

  /* Typography */
  --font-primary: 'Gantari', sans-serif;
  --font-heading: 'Outfit', serif;

  /* Spacing & Borders */
  --border-radius: 0px;
  --space-unit: 4px;
}
```