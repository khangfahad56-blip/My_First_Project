---
name: brand-extractor
description: Extract complete brand design systems, visual identity, color palettes, typography, fonts, logos, hero images, and UI component styling (buttons, cards, visual effects) from any target website URL using the Firecrawl API. Make sure to use this skill whenever the user asks to analyze, scrape, extract, copy, or mirror brand aesthetics, design tokens, images, fonts, or styling from a target website to build a new website or design system.
---

# Brand Extractor Skill

Extract comprehensive brand identity, color palettes, font stacks, logo graphics, hero imagery, and UI component styles from target websites using the Firecrawl v2 API, and automatically compile them into a referenceable `BRAND_GUIDELINES.md` file.

## Workflow

### 1. Execute Extraction
Run the Python extraction script specifying the target URL:

```bash
python .agents/skills/brand-extractor/scripts/extract_brand.py --url "<TARGET_URL>" --download-assets
```
*(Or use `execution/extract_brand.py --url "<TARGET_URL>" --download-assets`)*

### 2. Generated Deliverables
The extraction script automatically generates:
1. **[BRAND_GUIDELINES.md](file:///c:/Users/RAHIM%20SONS%20COM/Desktop/Fahad_Jewellery_Website/BRAND_GUIDELINES.md)**: A complete markdown document containing:
   - **Color Palette Table**: Hex codes for Primary, Secondary, Accent, Background, and Text colors.
   - **Typography & Scale**: Body font, Heading font, Code font, and H1-H3 font size hierarchy.
   - **Brand Assets & Media**: Local file links to downloaded logos, og:images, and favicons (`.tmp/brand_assets/`).
   - **UI Components & Styling**: Button backgrounds, border-radius, shadows, base spacing units.
   - **CSS Design Tokens**: Copy-pasteable `:root` CSS variables snippet (`brand-tokens.css`).
2. **`.tmp/brand_extraction.json`**: Raw Firecrawl API response data.
3. **`.tmp/brand_assets/`**: Local downloaded image assets (logos, icons, banners).

## Key Script Options
- `--url <URL>`: Target website URL (required)
- `--download-assets`: Automatically downloads logos and hero graphics into `.tmp/brand_assets/`
- `--output-md <PATH>`: Custom output path for the brand guidelines markdown (default: `BRAND_GUIDELINES.md`)
- `--output <PATH>`: Custom output JSON path (default: `.tmp/brand_extraction.json`)
