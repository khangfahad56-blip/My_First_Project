# Directive: Extract Brand Identity & Generate Guidelines

Use this directive to scrape visual brand identity (colors, fonts, typography, logos, hero images, buttons) from any target website URL and automatically generate a referenceable `BRAND_GUIDELINES.md` file.

## Goal
Extract full brand assets and design system from a specified website URL using Firecrawl v2 API and output `BRAND_GUIDELINES.md`.

## Inputs
- `TARGET_URL`: The target website URL to extract brand data from (e.g. `https://example.com`)
- `FIRECRAWL_API_KEY`: Stored in `.env` (optional, for higher rate limits and full v2 feature access)

## Execution Tool (Layer 3)
Run the script `execution/extract_brand.py`:

```bash
python execution/extract_brand.py --url "<TARGET_URL>" --download-assets
```

## Outputs & Deliverables
- **Referenceable Guidelines**: `BRAND_GUIDELINES.md`
- **Raw JSON Data**: `.tmp/brand_extraction.json`
- **Downloaded Media**: `.tmp/brand_assets/` (logos, hero graphics, favicons)
