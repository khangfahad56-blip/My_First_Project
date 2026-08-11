# Brand Design System & Identity Dossier

**Target URL**: `{{URL}}`  
**Color Scheme**: `{{COLOR_SCHEME}}`  

---

## 🎨 Color Palette

| Role | Color Name | Hex Code | Preview |
| :--- | :--- | :--- | :--- |
| **Primary** | Primary Brand | `{{COLOR_PRIMARY}}` | `{{COLOR_PRIMARY}}` |
| **Secondary** | Secondary Brand | `{{COLOR_SECONDARY}}` | `{{COLOR_SECONDARY}}` |
| **Accent** | Highlight / CTA | `{{COLOR_ACCENT}}` | `{{COLOR_ACCENT}}` |
| **Background** | Page Background | `{{COLOR_BACKGROUND}}` | `{{COLOR_BACKGROUND}}` |
| **Text Primary** | Main Text | `{{COLOR_TEXT_PRIMARY}}` | `{{COLOR_TEXT_PRIMARY}}` |
| **Text Secondary** | Muted Text | `{{COLOR_TEXT_SECONDARY}}` | `{{COLOR_TEXT_SECONDARY}}` |

---

## 🔤 Typography & Font Stacks

- **Primary Font Family**: `{{FONT_PRIMARY}}`
- **Heading Font Family**: `{{FONT_HEADING}}`
- **Code Font Family**: `{{FONT_CODE}}`

### Font Sizes & Scale
- **H1**: `{{SIZE_H1}}`
- **H2**: `{{SIZE_H2}}`
- **H3**: `{{SIZE_H3}}`
- **Body**: `{{SIZE_BODY}}`

---

## 🖼️ Brand Assets & Media

- **Logo**: `{{LOGO_URL}}`
- **Hero Image / OG Banner**: `{{HERO_IMAGE_URL}}`
- **Favicon**: `{{FAVICON_URL}}`

---

## 🔘 UI Component Styling & Tokens

- **Border Radius**: `{{BORDER_RADIUS}}`
- **Base Spacing Unit**: `{{SPACING_BASE_UNIT}}`
- **Primary Button**:
  - Background: `{{BTN_PRIMARY_BG}}`
  - Text Color: `{{BTN_PRIMARY_COLOR}}`
  - Border Radius: `{{BTN_PRIMARY_RADIUS}}`
- **Secondary Button**:
  - Background: `{{BTN_SECONDARY_BG}}`
  - Text Color: `{{BTN_SECONDARY_COLOR}}`
  - Border: `{{BTN_SECONDARY_BORDER}}`

---

## 💻 Generated CSS Tokens (`brand-tokens.css`)

```css
:root {
  /* Color Tokens */
  --color-primary: {{COLOR_PRIMARY}};
  --color-secondary: {{COLOR_SECONDARY}};
  --color-accent: {{COLOR_ACCENT}};
  --color-bg: {{COLOR_BACKGROUND}};
  --color-text: {{COLOR_TEXT_PRIMARY}};
  --color-text-muted: {{COLOR_TEXT_SECONDARY}};

  /* Typography Tokens */
  --font-primary: {{FONT_PRIMARY}}, sans-serif;
  --font-heading: {{FONT_HEADING}}, serif;

  /* Layout & Spacing */
  --border-radius: {{BORDER_RADIUS}};
  --space-unit: {{SPACING_BASE_UNIT}}px;
}
```
